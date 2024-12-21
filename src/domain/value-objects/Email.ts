import { ValueObject } from '../shared/ValueObject';
import { ValidationError } from '../errors/ValidationError';

export class Email extends ValueObject {
    private readonly _value: string;

    constructor(value: string) {
        super();
        this.validate(value);
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    protected validate(value: unknown): void {
        if (typeof value !== 'string') {
            throw new ValidationError('Email must be a string');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            throw new ValidationError('Invalid email format');
        }
    }

    toString(): string {
        return this._value;
    }
} 