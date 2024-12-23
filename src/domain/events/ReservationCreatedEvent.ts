import { DomainEvent } from './DomainEvent';
import { TimeRange } from '../value-objects/TimeRange';
import { Money } from '../value-objects/Money';

interface ReservationCreatedEventData {
    reservationId: string;
    vehicleId: string;
    userId: string;
    timeRange: TimeRange;
    amount: Money;
}

export class ReservationCreatedEvent implements DomainEvent {
    readonly eventType = 'ReservationCreated';
    readonly occurredOn: Date;
    readonly aggregateId: string;

    constructor(
        private readonly data: ReservationCreatedEventData
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

    get timeRange(): TimeRange {
        return this.data.timeRange;
    }

    get amount(): Money {
        return this.data.amount;
    }
} 