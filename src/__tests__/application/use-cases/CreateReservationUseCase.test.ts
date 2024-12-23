import { CreateReservationUseCase } from '../../../application/use-cases/CreateReservationUseCase';
import { IReservationRepository } from '../../../domain/interfaces/IReservationRepository';
import { IVehicleRepository } from '../../../domain/interfaces/IVehicleRepository';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { ReservationDomainService } from '../../../domain/services/ReservationDomainService';
import { Vehicle } from '../../../domain/entities/Vehicle';
import { User } from '../../../domain/entities/User';
import { ValidationError } from '../../../domain/errors/ValidationError';
import { VehicleClassification } from '../../../domain/value-objects/VehicleClassification';
import { Email } from '../../../domain/value-objects/Email';
import { Password } from '../../../domain/value-objects/Password';

describe('CreateReservationUseCase', () => {
    let useCase: CreateReservationUseCase;
    let mockReservationRepo: jest.Mocked<IReservationRepository>;
    let mockVehicleRepo: jest.Mocked<IVehicleRepository>;
    let mockUserRepo: jest.Mocked<IUserRepository>;
    let mockDomainService: jest.Mocked<ReservationDomainService>;

    beforeEach(() => {
        mockReservationRepo = {
            save: jest.fn(),
            findById: jest.fn(),
            findOverlapping: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        mockVehicleRepo = {
            findById: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        mockUserRepo = {
            findById: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        mockDomainService = {
            validateReservation: jest.fn(),
            calculateReservationAmount: jest.fn()
        } as any;

        useCase = new CreateReservationUseCase(
            mockReservationRepo,
            mockVehicleRepo,
            mockUserRepo,
            mockDomainService
        );
    });

    it('should create a valid reservation', async () => {
        // Arrange
        const vehicle = new Vehicle({
            model: 'Test Car',
            plate: 'ABC1234',
            year: 2022,
            status: 'AVAILABLE',
            classification: new VehicleClassification('STANDARD')
        });

        const user = new User({
            email: new Email('test@test.com'),
            password: new Password('Test123!'),
            name: 'Test User',
            role: 'USER'
        });

        const input = {
            userId: 'user-id',
            vehicleId: 'vehicle-id',
            startTime: new Date(),
            endTime: new Date(Date.now() + 3600000)
        };

        mockVehicleRepo.findById.mockResolvedValue(vehicle);
        mockUserRepo.findById.mockResolvedValue(user);
        mockReservationRepo.findOverlapping.mockResolvedValue([]);
        mockDomainService.calculateReservationAmount.mockReturnValue({ amount: 100, currency: 'USD' });
        mockReservationRepo.save.mockImplementation(reservation => Promise.resolve(reservation));

        // Act
        const result = await useCase.execute(input);

        // Assert
        expect(result).toBeDefined();
        expect(result.vehicleId).toBe(input.vehicleId);
        expect(result.userId).toBe(input.userId);
        expect(mockReservationRepo.save).toHaveBeenCalled();
    });

    it('should throw error when vehicle not found', async () => {
        // Arrange
        mockVehicleRepo.findById.mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute({
            userId: 'user-id',
            vehicleId: 'invalid-id',
            startTime: new Date(),
            endTime: new Date()
        })).rejects.toThrow(ValidationError);
    });

    it('should throw error when user not found', async () => {
        // Arrange
        const vehicle = new Vehicle({
            model: 'Test Car',
            plate: 'ABC1234',
            year: 2022,
            status: 'AVAILABLE',
            classification: new VehicleClassification('STANDARD')
        });

        mockVehicleRepo.findById.mockResolvedValue(vehicle);
        mockUserRepo.findById.mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute({
            userId: 'invalid-id',
            vehicleId: 'vehicle-id',
            startTime: new Date(),
            endTime: new Date()
        })).rejects.toThrow(ValidationError);
    });
}); 