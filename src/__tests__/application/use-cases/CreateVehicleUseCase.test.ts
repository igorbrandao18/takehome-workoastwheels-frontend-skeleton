import { CreateVehicleUseCase } from '../../../application/use-cases/CreateVehicleUseCase';
import { IVehicleRepository } from '../../../domain/interfaces/IVehicleRepository';
import { VehicleDomainService } from '../../../domain/services/VehicleDomainService';
import { Vehicle } from '../../../domain/entities/Vehicle';
import { VehicleClassification } from '../../../domain/value-objects/VehicleClassification';
import { ValidationError } from '../../../domain/errors/ValidationError';

describe('CreateVehicleUseCase', () => {
    let useCase: CreateVehicleUseCase;
    let mockVehicleRepo: jest.Mocked<IVehicleRepository>;
    let mockDomainService: jest.Mocked<VehicleDomainService>;

    beforeEach(() => {
        mockVehicleRepo = {
            findById: jest.fn(),
            findByPlate: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        mockDomainService = {
            validateVehicleCreation: jest.fn()
        } as any;

        useCase = new CreateVehicleUseCase(
            mockVehicleRepo,
            mockDomainService
        );
    });

    it('should create a valid vehicle', async () => {
        // Arrange
        const input = {
            model: 'Toyota Corolla',
            plate: 'ABC1234',
            year: 2022,
            classification: 'STANDARD'
        };

        mockVehicleRepo.findByPlate.mockResolvedValue(null);
        mockVehicleRepo.save.mockImplementation(vehicle => Promise.resolve(vehicle));

        // Act
        const result = await useCase.execute(input);

        // Assert
        expect(result).toBeDefined();
        expect(result.model).toBe(input.model);
        expect(result.plate).toBe(input.plate);
        expect(result.year).toBe(input.year);
        expect(result.status).toBe('AVAILABLE');
        expect(mockVehicleRepo.save).toHaveBeenCalled();
    });

    it('should throw error when plate already exists', async () => {
        // Arrange
        const existingVehicle = new Vehicle({
            model: 'Existing Car',
            plate: 'ABC1234',
            year: 2022,
            status: 'AVAILABLE',
            classification: new VehicleClassification('STANDARD')
        });

        mockVehicleRepo.findByPlate.mockResolvedValue(existingVehicle);

        // Act & Assert
        await expect(useCase.execute({
            model: 'Toyota Corolla',
            plate: 'ABC1234',
            year: 2022,
            classification: 'STANDARD'
        })).rejects.toThrow(ValidationError);
    });

    it('should throw error when validation fails', async () => {
        // Arrange
        mockVehicleRepo.findByPlate.mockResolvedValue(null);
        mockDomainService.validateVehicleCreation.mockImplementation(() => {
            throw new ValidationError('Invalid vehicle data');
        });

        // Act & Assert
        await expect(useCase.execute({
            model: 'Toyota Corolla',
            plate: 'ABC1234',
            year: 2022,
            classification: 'STANDARD'
        })).rejects.toThrow(ValidationError);
    });

    it('should throw error for future year', async () => {
        // Arrange
        const futureYear = new Date().getFullYear() + 2;
        mockVehicleRepo.findByPlate.mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute({
            model: 'Toyota Corolla',
            plate: 'ABC1234',
            year: futureYear,
            classification: 'STANDARD'
        })).rejects.toThrow(ValidationError);
    });
}); 