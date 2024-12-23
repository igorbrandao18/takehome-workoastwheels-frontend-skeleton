import { Vehicle } from '../../../domain/entities/Vehicle';
import { VehicleClassification } from '../../../domain/value-objects/VehicleClassification';
import { ValidationError } from '../../../domain/errors/ValidationError';

describe('Vehicle Entity', () => {
    it('should create a valid vehicle', () => {
        const vehicle = new Vehicle({
            model: 'Toyota Corolla',
            plate: 'ABC1234',
            year: 2022,
            status: 'AVAILABLE',
            classification: new VehicleClassification('STANDARD')
        });

        expect(vehicle).toBeDefined();
        expect(vehicle.model).toBe('Toyota Corolla');
        expect(vehicle.plate).toBe('ABC1234');
        expect(vehicle.year).toBe(2022);
        expect(vehicle.status).toBe('AVAILABLE');
        expect(vehicle.classification.value).toBe('STANDARD');
    });

    it('should throw error for invalid plate format', () => {
        expect(() => {
            new Vehicle({
                model: 'Toyota Corolla',
                plate: 'INVALID',
                year: 2022,
                status: 'AVAILABLE',
                classification: new VehicleClassification('STANDARD')
            });
        }).toThrow(ValidationError);
    });

    it('should throw error for future year', () => {
        const futureYear = new Date().getFullYear() + 2;
        expect(() => {
            new Vehicle({
                model: 'Toyota Corolla',
                plate: 'ABC1234',
                year: futureYear,
                status: 'AVAILABLE',
                classification: new VehicleClassification('STANDARD')
            });
        }).toThrow(ValidationError);
    });

    it('should change status correctly', () => {
        const vehicle = new Vehicle({
            model: 'Toyota Corolla',
            plate: 'ABC1234',
            year: 2022,
            status: 'AVAILABLE',
            classification: new VehicleClassification('STANDARD')
        });

        vehicle.changeStatus('MAINTENANCE');
        expect(vehicle.status).toBe('MAINTENANCE');
    });

    it('should throw error for invalid status change', () => {
        const vehicle = new Vehicle({
            model: 'Toyota Corolla',
            plate: 'ABC1234',
            year: 2022,
            status: 'AVAILABLE',
            classification: new VehicleClassification('STANDARD')
        });

        expect(() => {
            vehicle.changeStatus('INVALID_STATUS' as any);
        }).toThrow(ValidationError);
    });
}); 