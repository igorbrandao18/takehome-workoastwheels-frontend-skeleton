import { DomainEvent } from '../../domain/events/DomainEvent';
import { ReservationCanceledEvent } from '../../domain/events/ReservationCanceledEvent';
import { IEmailService } from '../interfaces/IEmailService';
import { INotificationService } from '../interfaces/INotificationService';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IVehicleRepository } from '../../domain/interfaces/IVehicleRepository';
import { Logger } from '../../infrastructure/logging/Logger';

export class ReservationCanceledHandler {
    constructor(
        private readonly emailService: IEmailService,
        private readonly notificationService: INotificationService,
        private readonly userRepository: IUserRepository,
        private readonly vehicleRepository: IVehicleRepository,
        private readonly logger: Logger
    ) {}

    async handle(event: ReservationCanceledEvent): Promise<void> {
        try {
            const [user, vehicle] = await Promise.all([
                this.userRepository.findById(event.userId),
                this.vehicleRepository.findById(event.vehicleId)
            ]);

            if (!user || !vehicle) {
                throw new Error('User or Vehicle not found');
            }

            // Enviar email de cancelamento
            await this.emailService.sendReservationCancellation(
                user.email.value,
                event.reservationId,
                {
                    subject: 'Reservation Canceled',
                    body: `Your reservation has been canceled. Reason: ${event.reason}`
                }
            );

            // Enviar notificação push
            await this.notificationService.sendPushNotification(
                user.id,
                {
                    title: 'Reservation Canceled',
                    body: `Your reservation for ${vehicle.model} has been canceled`,
                    data: {
                        reservationId: event.reservationId,
                        reason: event.reason
                    }
                }
            );

            // Notificar administradores sobre o cancelamento
            await this.notifyAdmins(event, vehicle.model);

            this.logger.info('Reservation canceled event handled', {
                eventId: event.reservationId,
                userId: user.id,
                reason: event.reason
            });
        } catch (error) {
            this.logger.error('Error handling reservation canceled event', error);
            throw error;
        }
    }

    private async notifyAdmins(event: ReservationCanceledEvent, vehicleModel: string): Promise<void> {
        const admins = await this.userRepository.findByRole('ADMIN');
        
        await Promise.all(
            admins.map(admin =>
                this.notificationService.sendPushNotification(
                    admin.id,
                    {
                        title: 'Reservation Canceled',
                        body: `Reservation for ${vehicleModel} was canceled. Reason: ${event.reason}`,
                        data: {
                            reservationId: event.reservationId,
                            vehicleId: event.vehicleId,
                            userId: event.userId
                        }
                    }
                )
            )
        );
    }
} 