export abstract class Entity {
    protected readonly _id: string;
    protected _createdAt: Date;
    protected _updatedAt: Date;

    constructor(id?: string) {
        this._id = id || crypto.randomUUID();
        this._createdAt = new Date();
        this._updatedAt = new Date();
    }

    get id(): string {
        return this._id;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    equals(other: Entity): boolean {
        if (other === null || other === undefined) {
            return false;
        }
        if (other.constructor !== this.constructor) {
            return false;
        }
        return this._id === other.id;
    }
} 