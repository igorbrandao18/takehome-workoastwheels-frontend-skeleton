import { IReservationRepository } from '../../domain/interfaces/IReservationRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { ReservationDomainService } from '../../domain/services/ReservationDomainService';
import { ValidationError } from '../../domain/errors/ValidationError';
import { DomainEventPublisher } from '../../domain/events/DomainEventPublisher';
import { ReservationCanceledEvent } from '../../domain/events/ReservationCanceledEvent';

interface CancelReservationInput {
    reservationId: string;
    userId: string;
    reason: string;
}

export class CancelReservationUseCase {
    constructor(
        private readonly reservationRepository: IReservationRepository,
        private readonly userRepository: IUserRepository,
        private readonly reservationDomainService: ReservationDomainService
    ) {}

    async execute(input: CancelReservationInput) {
        const reservation = await this.reservationRepository.findById(input.reservationId);
        if (!reservation) {
            throw new ValidationError('Reservation not found');
        }

        const user = await this.userRepository.findById(input.userId);
        if (!user) {
            throw new ValidationError('User not found');
        }

        // Validar se o usuário pode cancelar a reserva
        this.reservationDomainService.validateCancellation(reservation, user);

        // Cancelar a reserva
        reservation.cancel(input.reason);

        // Salvar alterações
        await this.reservationRepository.update(reservation);

        // Publicar evento de cancelamento
        DomainEventPublisher.publish(new ReservationCanceledEvent({
            reservationId: reservation.id,
            vehicleId: reservation.vehicleId,
            userId: reservation.userId,
            reason: input.reason
        }));

        return reservation;
    }
} 