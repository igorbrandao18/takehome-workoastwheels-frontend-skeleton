import { DomainEvent } from './DomainEvent';

interface ReservationCanceledEventData {
    reservationId: string;
    vehicleId: string;
    userId: string;
    reason: string;
}

export class ReservationCanceledEvent implements DomainEvent {
    readonly eventType = 'ReservationCanceled';
    readonly occurredOn: Date;
    readonly aggregateId: string;

    constructor(
        private readonly data: ReservationCanceledEventData
    ) {
        this.occurredOn = new Date();
        this.aggregateId = data.reservationId;
    }

    get reservationId(): string {
        return this.data.reservationId;
    }

    get vehicleId(): string {
        return this.data.vehicleId;
    }

    get userId(): string {
        return this.data.userId;
    }

    get reason(): string {
        return this.data.reason;
    }
} 