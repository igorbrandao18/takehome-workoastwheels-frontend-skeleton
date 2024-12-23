import { ValueObject } from '../shared/ValueObject';
import { ValidationError } from '../errors/ValidationError';

export class TimeRange extends ValueObject {
    private readonly _startTime: Date;
    private readonly _endTime: Date;

    constructor(startTime: Date, endTime: Date) {
        super();
        if (endTime <= startTime) {
            throw new Error('End time must be after start time');
        }
        this._startTime = startTime;
        this._endTime = endTime;
    }

    get startTime(): Date {
        return this._startTime;
    }

    get endTime(): Date {
        return this._endTime;
    }

    overlaps(other: TimeRange): boolean {
        return this._startTime < other.endTime && other.startTime < this._endTime;
    }

    hasStarted(): boolean {
        return new Date() >= this._startTime;
    }

    hasEnded(): boolean {
        return new Date() > this._endTime;
    }

    equals(other: TimeRange): boolean {
        return (
            this._startTime.getTime() === other.startTime.getTime() &&
            this._endTime.getTime() === other.endTime.getTime()
        );
    }
} 