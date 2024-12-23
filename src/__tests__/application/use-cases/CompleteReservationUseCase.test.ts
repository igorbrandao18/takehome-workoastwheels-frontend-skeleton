import { CompleteReservationUseCase } from '../../../application/use-cases/CompleteReservationUseCase';
import { IReservationRepository } from '../../../domain/interfaces/IReservationRepository';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { ReservationDomainService } from '../../../domain/services/ReservationDomainService';
import { Reservation } from '../../../domain/entities/Reservation';
import { User } from '../../../domain/entities/User';
import { ValidationError } from '../../../domain/errors/ValidationError';
import { TimeRange } from '../../../domain/value-objects/TimeRange';
import { Email } from '../../../domain/value-objects/Email';
import { Password } from '../../../domain/value-objects/Password';

describe('CompleteReservationUseCase', () => {
    let useCase: CompleteReservationUseCase;
    let mockReservationRepo: jest.Mocked<IReservationRepository>;
    let mockUserRepo: jest.Mocked<IUserRepository>;
    let mockDomainService: jest.Mocked<ReservationDomainService>;

    beforeEach(() => {
        mockReservationRepo = {
            findById: jest.fn(),
            update: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
        };

        mockUserRepo = {
            findById: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        mockDomainService = {
            validateCompletion: jest.fn()
        } as any;

        useCase = new CompleteReservationUseCase(
            mockReservationRepo,
            mockUserRepo,
            mockDomainService
        );
    });

    it('should complete a valid reservation', async () => {
        // Arrange
        const user = new User({
            email: new Email('test@test.com'),
            password: new Password('Test123!'),
            name: 'Test User',
            role: 'USER'
        });

        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 3600000);
        const reservation = new Reservation({
            userId: 'user-id',
            vehicleId: 'vehicle-id',
            timeRange: new TimeRange(startTime, endTime),
            totalAmount: { amount: 100, currency: 'USD' }
        });

        mockReservationRepo.findById.mockResolvedValue(reservation);
        mockUserRepo.findById.mockResolvedValue(user);
        mockReservationRepo.update.mockImplementation(r => Promise.resolve(r));

        // Act
        const result = await useCase.execute({
            reservationId: 'reservation-id',
            userId: 'user-id'
        });

        // Assert
        expect(result.status).toBe('COMPLETED');
        expect(mockReservationRepo.update).toHaveBeenCalled();
    });

    it('should throw error when reservation not found', async () => {
        // Arrange
        mockReservationRepo.findById.mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute({
            reservationId: 'invalid-id',
            userId: 'user-id'
        })).rejects.toThrow(ValidationError);
    });

    it('should throw error when user not found', async () => {
        // Arrange
        const reservation = new Reservation({
            userId: 'user-id',
            vehicleId: 'vehicle-id',
            timeRange: new TimeRange(new Date(), new Date()),
            totalAmount: { amount: 100, currency: 'USD' }
        });

        mockReservationRepo.findById.mockResolvedValue(reservation);
        mockUserRepo.findById.mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute({
            reservationId: 'reservation-id',
            userId: 'invalid-id'
        })).rejects.toThrow(ValidationError);
    });

    it('should throw error when completion validation fails', async () => {
        // Arrange
        const user = new User({
            email: new Email('test@test.com'),
            password: new Password('Test123!'),
            name: 'Test User',
            role: 'USER'
        });

        const reservation = new Reservation({
            userId: 'user-id',
            vehicleId: 'vehicle-id',
            timeRange: new TimeRange(new Date(), new Date()),
            totalAmount: { amount: 100, currency: 'USD' }
        });

        mockReservationRepo.findById.mockResolvedValue(reservation);
        mockUserRepo.findById.mockResolvedValue(user);
        mockDomainService.validateCompletion.mockImplementation(() => {
            throw new ValidationError('Cannot complete reservation');
        });

        // Act & Assert
        await expect(useCase.execute({
            reservationId: 'reservation-id',
            userId: 'user-id'
        })).rejects.toThrow(ValidationError);
    });
}); 