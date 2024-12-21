import { ValueObject } from '../shared/ValueObject';
import { ValidationError } from '../errors/ValidationError';

export type VehicleClassificationType = 'ECONOMY' | 'INTERMEDIATE' | 'LUXURY';

export class VehicleClassification extends ValueObject {
    private readonly _value: VehicleClassificationType;

    constructor(value: VehicleClassificationType) {
        super();
        this._value = value;
    }

    get value(): VehicleClassificationType {
        return this._value;
    }

    equals(other: VehicleClassification): boolean {
        return this._value === other.value;
    }
} 