import { CancelReservationUseCase } from '../../../application/use-cases/CancelReservationUseCase';
import { IReservationRepository } from '../../../domain/interfaces/IReservationRepository';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { ReservationDomainService } from '../../../domain/services/ReservationDomainService';
import { Reservation } from '../../../domain/entities/Reservation';
import { User } from '../../../domain/entities/User';
import { ValidationError } from '../../../domain/errors/ValidationError';
import { TimeRange } from '../../../domain/value-objects/TimeRange';
import { Email } from '../../../domain/value-objects/Email';
import { Password } from '../../../domain/value-objects/Password';
import { DomainEventPublisher } from '../../../domain/events/DomainEventPublisher';

jest.mock('../../../domain/events/DomainEventPublisher');

describe('CancelReservationUseCase', () => {
    let useCase: CancelReservationUseCase;
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
            validateCancellation: jest.fn()
        } as any;

        useCase = new CancelReservationUseCase(
            mockReservationRepo,
            mockUserRepo,
            mockDomainService
        );
    });

    it('should cancel a valid reservation', async () => {
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
            userId: 'user-id',
            reason: 'Test cancellation'
        });

        // Assert
        expect(result.status).toBe('CANCELED');
        expect(mockReservationRepo.update).toHaveBeenCalled();
        expect(DomainEventPublisher.publish).toHaveBeenCalled();
    });

    it('should throw error when reservation not found', async () => {
        // Arrange
        mockReservationRepo.findById.mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute({
            reservationId: 'invalid-id',
            userId: 'user-id',
            reason: 'Test'
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
            userId: 'invalid-id',
            reason: 'Test'
        })).rejects.toThrow(ValidationError);
    });

    it('should throw error when cancellation validation fails', async () => {
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
        mockDomainService.validateCancellation.mockImplementation(() => {
            throw new ValidationError('Cannot cancel reservation');
        });

        // Act & Assert
        await expect(useCase.execute({
            reservationId: 'reservation-id',
            userId: 'user-id',
            reason: 'Test'
        })).rejects.toThrow(ValidationError);
    });
}); 