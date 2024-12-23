import { ValueObject } from '../shared/ValueObject';
import { ValidationError } from '../errors/ValidationError';
import * as bcrypt from 'bcrypt';

export class Password extends ValueObject {
    private readonly _hash: string;

    constructor(value: string, isHashed: boolean = false) {
        super();
        this.validate(value);
        this._hash = isHashed ? value : this.hashPassword(value);
    }

    get value(): string {
        return this._hash;
    }

    protected validate(value: unknown): void {
        if (typeof value !== 'string') {
            throw new ValidationError('Password must be a string');
        }

        if (!value) {
            throw new ValidationError('Password is required');
        }

        if (!this.isHashed(value) && value.length < 8) {
            throw new ValidationError('Password must be at least 8 characters long');
        }
    }

    private hashPassword(password: string): string {
        return bcrypt.hashSync(password, 10);
    }

    verifyPassword(plainPassword: string): boolean {
        return bcrypt.compareSync(plainPassword, this._hash);
    }

    private isHashed(value: string): boolean {
        return value.startsWith('$2b$') || value.startsWith('$2a$');
    }

    toString(): string {
        return '[PROTECTED]';
    }
} 