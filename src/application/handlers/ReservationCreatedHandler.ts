import { DomainEvent } from '../../domain/events/DomainEvent';
import { ReservationCreatedEvent } from '../../domain/events/ReservationCreatedEvent';
import { IEmailService } from '../interfaces/IEmailService';
import { INotificationService } from '../interfaces/INotificationService';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { Logger } from '../../infrastructure/logging/Logger';

export class ReservationCreatedHandler {
    constructor(
        private readonly emailService: IEmailService,
        private readonly notificationService: INotificationService,
        private readonly userRepository: IUserRepository,
        private readonly logger: Logger
    ) {}

    async handle(event: ReservationCreatedEvent): Promise<void> {
        try {
            const user = await this.userRepository.findById(event.userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Enviar email de confirmação
            await this.emailService.sendReservationConfirmation(
                user.email.value,
                event.reservationId,
                {
                    subject: 'Reservation Confirmed',
                    body: `Your reservation has been confirmed. Total amount: ${event.amount.toString()}`
                }
            );

            // Enviar notificação push
            await this.notificationService.sendPushNotification(
                user.id,
                {
                    title: 'Reservation Confirmed',
                    body: 'Your vehicle reservation has been confirmed',
                    data: {
                        reservationId: event.reservationId,
                        vehicleId: event.vehicleId
                    }
                }
            );

            this.logger.info('Reservation created event handled', {
                eventId: event.reservationId,
                userId: user.id
            });
        } catch (error) {
            this.logger.error('Error handling reservation created event', error);
            throw error;
        }
    }
} 