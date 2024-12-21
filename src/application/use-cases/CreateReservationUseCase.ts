import { IReservationRepository } from '../../domain/interfaces/IReservationRepository';
import { IVehicleRepository } from '../../domain/interfaces/IVehicleRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { ReservationDomainService } from '../../domain/services/ReservationDomainService';
import { TimeRange } from '../../domain/value-objects/TimeRange';
import { Money } from '../../domain/value-objects/Money';
import { ValidationError } from '../../domain/errors/ValidationError';
import { ReservationAggregate } from '../../domain/aggregates/ReservationAggregate';

interface CreateReservationInput {
    userId: string;
    vehicleId: string;
    startTime: Date;
    endTime: Date;
}

export class CreateReservationUseCase {
    constructor(
        private readonly reservationRepository: IReservationRepository,
        private readonly vehicleRepository: IVehicleRepository,
        private readonly userRepository: IUserRepository,
        private readonly reservationDomainService: ReservationDomainService
    ) {}

    async execute(input: CreateReservationInput) {
        const vehicle = await this.vehicleRepository.findById(input.vehicleId);
        if (!vehicle) {
            throw new ValidationError('Vehicle not found');
        }

        const user = await this.userRepository.findById(input.userId);
        if (!user) {
            throw new ValidationError('User not found');
        }

        const timeRange = new TimeRange(input.startTime, input.endTime);

        const existingReservations = await this.reservationRepository.findOverlapping(
            input.vehicleId,
            timeRange
        );

        await this.reservationDomainService.validateReservation(
            vehicle,
            user,
            timeRange,
            existingReservations
        );

        const baseRate = new Money(50, 'USD');
        const amount = this.reservationDomainService.calculateReservationAmount(
            vehicle,
            timeRange,
            baseRate
        );

        const reservationAggregate = await ReservationAggregate.create(
            vehicle,
            user,
            timeRange,
            amount
        );

        await this.reservationRepository.save(reservationAggregate.reservation);

        return reservationAggregate.reservation;
    }
} 