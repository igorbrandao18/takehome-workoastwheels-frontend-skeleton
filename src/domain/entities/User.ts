import { Entity } from '../shared/Entity';
import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';
import { ValidationError } from '../errors/ValidationError';

export type UserRole = 'USER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

interface UserProps {
    id?: string;
    name: string;
    email: Email;
    password: Password;
    role: UserRole;
    status: UserStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User extends Entity {
    private readonly _name: string;
    private readonly _email: Email;
    private _password: Password;
    private _role: UserRole;
    private _status: UserStatus;

    constructor(props: UserProps) {
        super(props.id);
        this._name = props.name;
        this._email = props.email;
        this._password = props.password;
        this._role = props.role;
        this._status = props.status;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();
    }

    get name(): string {
        return this._name;
    }

    get email(): Email {
        return this._email;
    }

    get password(): Password {
        return this._password;
    }

    get role(): UserRole {
        return this._role;
    }

    get status(): UserStatus {
        return this._status;
    }

    changeStatus(newStatus: UserStatus): void {
        this._status = newStatus;
        this._updatedAt = new Date();
    }

    changeRole(newRole: UserRole): void {
        this._role = newRole;
        this._updatedAt = new Date();
    }

    changePassword(newPassword: Password): void {
        this._password = newPassword;
        this._updatedAt = new Date();
    }

    isActive(): boolean {
        return this._status === 'ACTIVE';
    }

    isAdmin(): boolean {
        return this._role === 'ADMIN';
    }

    verifyPassword(plainPassword: string): boolean {
        return this._password.verifyPassword(plainPassword);
    }
} 