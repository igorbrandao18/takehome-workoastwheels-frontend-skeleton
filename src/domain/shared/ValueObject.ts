export abstract class ValueObject {
    protected abstract validate(value: unknown): void;

    equals(other: ValueObject): boolean {
        if (other === null || other === undefined) {
            return false;
        }
        if (other.constructor !== this.constructor) {
            return false;
        }
        return this.toString() === other.toString();
    }
} 