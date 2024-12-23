import { ReservationStatus } from '../../domain/entities/Reservation';

export interface CreateReservationDTO {
    vehicleId: string;
    userId: string;
    startTime: Date;
    endTime: Date;
    paymentMethodId: string;
}

export interface UpdateReservationDTO {
    status?: ReservationStatus;
    cancellationReason?: string;
}

export interface ReservationResponseDTO {
    id: string;
    vehicleId: string;
    userId: string;
    startTime: Date;
    endTime: Date;
    status: ReservationStatus;
    totalAmount: {
        amount: number;
        currency: string;
    };
    cancellationReason?: string;
    createdAt: Date;
    updatedAt: Date;
} 