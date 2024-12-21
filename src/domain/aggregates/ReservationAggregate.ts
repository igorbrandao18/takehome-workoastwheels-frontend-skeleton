import { Entity } from '../shared/Entity';
import { Reservation, ReservationStatus } from '../entities/Reservation';
import { Vehicle } from '../entities/Vehicle';
import { User } from '../entities/User';
import { TimeRange } from '../value-objects/TimeRange';
import { Money } from '../value-objects/Money';
import { ValidationError } from '../errors/ValidationError';
import { ReservationCreatedEvent } from '../events/ReservationCreatedEvent';
import { ReservationCanceledEvent } from '../events/ReservationCanceledEvent';
import { DomainEventPublisher } from '../events/DomainEventPublisher';

export class ReservationAggregate extends Entity {
    private _reservation: Reservation;
    private _vehicle: Vehicle;
    private _user: User;

    private constructor(reservation: Reservation, vehicle: Vehicle, user: User) {
        super(reservation.id);
        this._reservation = reservation;
        this._vehicle = vehicle;
        this._user = user;
    }

    static async create(
        vehicle: Vehicle,
        user: User,
        timeRange: TimeRange,
        baseRate: Money
    ): Promise<ReservationAggregate> {
        // Validações
        if (!vehicle.isAvailable()) {
            throw new ValidationError('Vehicle is not available');
        }

        if (!user.isActive()) {
            throw new ValidationError('User is not active');
        }

        if (!user.canMakeReservation()) {
            throw new ValidationError('User has reached reservation limit');
        }

        // Criar reserva
        const reservation = new Reservation({
            vehicleId: vehicle.id,
            userId: user.id,
            timeRange,
            status: 'PENDING',
            totalAmount: baseRate
        });

        const aggregate = new ReservationAggregate(reservation, vehicle, user);

        // Publicar evento
        DomainEventPublisher.publish(new ReservationCreatedEvent({
            reservationId: reservation.id,
            vehicleId: vehicle.id,
            userId: user.id,
            timeRange,
            amount: baseRate
        }));

        return aggregate;
    }

    confirm(amount: Money): void {
        if (!this._reservation.isPending()) {
            throw new ValidationError('Only pending reservations can be confirmed');
        }

        this._reservation.confirm(amount);
        this._vehicle.incrementReservations();
        this._user.decrementReservationLimit();
    }

    async cancel(reason: string): Promise<void> {
        if (!this._reservation.isActive()) {
            throw new ValidationError('Only active reservations can be canceled');
        }

        this._reservation.cancel(reason);
        this._vehicle.decrementReservations();
        this._user.incrementReservationLimit();

        // Publicar evento
        DomainEventPublisher.publish(new ReservationCanceledEvent({
            reservationId: this._reservation.id,
            vehicleId: this._vehicle.id,
            userId: this._user.id,
            reason
        }));
    }

    complete(): void {
        if (!this._reservation.isConfirmed()) {
            throw new ValidationError('Only confirmed reservations can be completed');
        }

        if (!this._reservation.timeRange.hasEnded()) {
            throw new ValidationError('Cannot complete a reservation before its end time');
        }

        this._reservation.complete();
        this._vehicle.decrementReservations();
    }

    get reservation(): Reservation {
        return this._reservation;
    }

    get vehicle(): Vehicle {
        return this._vehicle;
    }

    get user(): User {
        return this._user;
    }
} 