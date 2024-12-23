import { ValueObject } from '../shared/ValueObject';
import { ValidationError } from '../errors/ValidationError';

export class Money extends ValueObject {
    private readonly _amount: number;
    private readonly _currency: string;

    constructor(amount: number, currency: string = 'USD') {
        super();
        this.validate({ amount, currency });
        this._amount = this.roundToTwoDecimals(amount);
        this._currency = currency.toUpperCase();
    }

    protected validate(value: { amount: number; currency: string }): void {
        if (typeof value.amount !== 'number') {
            throw new ValidationError('Amount must be a number');
        }
        if (value.amount < 0) {
            throw new ValidationError('Amount cannot be negative');
        }
        if (!value.currency || value.currency.length !== 3) {
            throw new ValidationError('Currency must be a 3-letter code');
        }
    }

    private roundToTwoDecimals(value: number): number {
        return Math.round(value * 100) / 100;
    }

    get amount(): number {
        return this._amount;
    }

    get currency(): string {
        return this._currency;
    }

    toCents(): number {
        return Math.round(this._amount * 100);
    }

    add(other: Money): Money {
        if (this._currency !== other.currency) {
            throw new ValidationError('Cannot add money with different currencies');
        }
        return new Money(this._amount + other.amount, this._currency);
    }

    subtract(other: Money): Money {
        if (this._currency !== other.currency) {
            throw new ValidationError('Cannot subtract money with different currencies');
        }
        return new Money(this._amount - other.amount, this._currency);
    }

    multiply(factor: number): Money {
        return new Money(this._amount * factor, this._currency);
    }

    equals(other: Money): boolean {
        return this._amount === other.amount && 
               this._currency === other.currency;
    }

    toString(): string {
        return `${this._currency} ${this._amount.toFixed(2)}`;
    }
} 