import { TimeRange } from '../value-objects/TimeRange';

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

interface ReservationProps {
  id?: string;
  userId: string;
  vehicleId: string;
  timeRange: TimeRange;
  status: ReservationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Reservation {
  private _id: string;
  private _userId: string;
  private _vehicleId: string;
  private _timeRange: TimeRange;
  private _status: ReservationStatus;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ReservationProps) {
    this._id = props.id || crypto.randomUUID();
    this._userId = props.userId;
    this._vehicleId = props.vehicleId;
    this._timeRange = props.timeRange;
    this._status = props.status;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get vehicleId(): string {
    return this._vehicleId;
  }

  get timeRange(): TimeRange {
    return this._timeRange;
  }

  get status(): ReservationStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  changeStatus(newStatus: ReservationStatus): void {
    this._status = newStatus;
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return this._status === 'CONFIRMED';
  }

  overlaps(other: TimeRange): boolean {
    return this._timeRange.overlaps(other);
  }
} 