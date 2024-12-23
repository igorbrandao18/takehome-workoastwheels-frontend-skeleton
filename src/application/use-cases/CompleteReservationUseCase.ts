import { IReservationRepository } from '../../domain/interfaces/IReservationRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { ReservationDomainService } from '../../domain/services/ReservationDomainService';
import { ValidationError } from '../../domain/errors/ValidationError';

interface CompleteReservationInput {
    reservationId: string;
    userId: string;
}

export class CompleteReservationUseCase {
    constructor(
        private readonly reservationRepository: IReservationRepository,
        private readonly userRepository: IUserRepository,
        private readonly reservationDomainService: ReservationDomainService
    ) {}

    async execute(input: CompleteReservationInput) {
        const reservation = await this.reservationRepository.findById(input.reservationId);
        if (!reservation) {
            throw new ValidationError('Reservation not found');
        }

        const user = await this.userRepository.findById(input.userId);
        if (!user) {
            throw new ValidationError('User not found');
        }

        // Validar se a reserva pode ser completada
        this.reservationDomainService.validateCompletion(reservation);

        // Completar a reserva
        reservation.complete();

        // Salvar alterações
        await this.reservationRepository.update(reservation);

        return reservation;
    }
} 