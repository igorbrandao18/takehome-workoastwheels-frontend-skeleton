import { IReservationRepository } from '../../domain/interfaces/IReservationRepository';
import { IVehicleRepository } from '../../domain/interfaces/IVehicleRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { ReservationDomainService } from '../../domain/services/ReservationDomainService';
import { IPaymentGateway } from '../interfaces/IPaymentGateway';
import { IEmailService } from '../interfaces/IEmailService';
import { INotificationService } from '../interfaces/INotificationService';
import { TimeRange } from '../../domain/value-objects/TimeRange';
import { Money } from '../../domain/value-objects/Money';
import { ValidationError } from '../../domain/errors/ValidationError';
import { CreateReservationDTO, UpdateReservationDTO, ReservationResponseDTO } from '../dtos/ReservationDTO';
import { ReservationAggregate } from '../../domain/aggregates/ReservationAggregate';
import { Logger } from '../../infrastructure/logging/Logger';

export class ReservationApplicationService {
    constructor(
        private readonly reservationRepository: IReservationRepository,
        private readonly vehicleRepository: IVehicleRepository,
        private readonly userRepository: IUserRepository,
        private readonly reservationDomainService: ReservationDomainService,
        private readonly paymentGateway: IPaymentGateway,
        private readonly emailService: IEmailService,
        private readonly notificationService: INotificationService,
        private readonly logger: Logger
    ) {}

    async createReservation(dto: CreateReservationDTO): Promise<ReservationResponseDTO> {
        try {
            // Buscar entidades
            const vehicle = await this.vehicleRepository.findById(dto.vehicleId);
            if (!vehicle) {
                throw new ValidationError('Vehicle not found');
            }

            const user = await this.userRepository.findById(dto.userId);
            if (!user) {
                throw new ValidationError('User not found');
            }

            // Criar TimeRange
            const timeRange = new TimeRange(dto.startTime, dto.endTime);

            // Verificar disponibilidade
            const existingReservations = await this.reservationRepository.findOverlapping(
                dto.vehicleId,
                timeRange
            );

            // Validar regras de domínio
            await this.reservationDomainService.validateReservation(
                vehicle,
                user,
                timeRange,
                existingReservations
            );

            // Calcular valor
            const baseRate = new Money(50, 'USD'); // Valor base por hora
            const amount = this.reservationDomainService.calculateReservationAmount(
                vehicle,
                timeRange,
                baseRate
            );

            // Processar pagamento
            const paymentResult = await this.paymentGateway.processPayment(
                user.id,
                amount,
                dto.paymentMethodId
            );

            if (!paymentResult.success) {
                throw new ValidationError(paymentResult.error || 'Payment failed');
            }

            // Criar reserva através do agregado
            const reservationAggregate = await ReservationAggregate.create(
                vehicle,
                user,
                timeRange,
                amount
            );

            await this.reservationRepository.save(reservationAggregate.reservation);

            // Enviar confirmações
            await Promise.all([
                this.emailService.sendReservationConfirmation(
                    user.email.value,
                    reservationAggregate.reservation.id,
                    {
                        subject: 'Reservation Confirmed',
                        body: `Your reservation has been confirmed. Reservation ID: ${reservationAggregate.reservation.id}`
                    }
                ),
                this.notificationService.sendPushNotification(
                    user.id,
                    {
                        title: 'Reservation Confirmed',
                        body: 'Your vehicle reservation has been confirmed'
                    }
                )
            ]);

            this.logger.info('Reservation created successfully', {
                reservationId: reservationAggregate.reservation.id,
                userId: user.id,
                vehicleId: vehicle.id
            });

            return this.toDTO(reservationAggregate.reservation);
        } catch (error) {
            this.logger.error('Error creating reservation', error);
            throw error;
        }
    }

    private toDTO(reservation: any): ReservationResponseDTO {
        return {
            id: reservation.id,
            vehicleId: reservation.vehicleId,
            userId: reservation.userId,
            startTime: reservation.timeRange.startTime,
            endTime: reservation.timeRange.endTime,
            status: reservation.status,
            totalAmount: {
                amount: reservation.totalAmount.amount,
                currency: reservation.totalAmount.currency
            },
            cancellationReason: reservation.cancellationReason,
            createdAt: reservation.createdAt,
            updatedAt: reservation.updatedAt
        };
    }
} 