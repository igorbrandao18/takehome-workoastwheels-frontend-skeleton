import { Reservation, ReservationStatus } from '../entities/Reservation';
import { ValidationError } from '../errors/ValidationError';

export class ReservationDomainService {
  validateReservationCreation(reservation: Reservation): void {
    if (!reservation.userId) {
      throw new ValidationError('User ID is required');
    }

    if (!reservation.vehicleId) {
      throw new ValidationError('Vehicle ID is required');
    }

    if (!reservation.timeRange) {
      throw new ValidationError('Time range is required');
    }

    if (reservation.timeRange.startTime < new Date()) {
      throw new ValidationError('Cannot create reservation in the past');
    }
  }

  validateStatusChange(reservation: Reservation, newStatus: ReservationStatus): void {
    if (reservation.status === newStatus) {
      return;
    }

    if (newStatus === 'CANCELLED' && !reservation.isActive()) {
      throw new ValidationError('Only active reservations can be cancelled');
    }

    if (newStatus === 'COMPLETED' && reservation.status !== 'CONFIRMED') {
      throw new ValidationError('Only confirmed reservations can be completed');
    }

    if (newStatus === 'COMPLETED' && !reservation.timeRange.hasEnded()) {
      throw new ValidationError('Cannot complete a reservation before its end time');
    }
  }

  validateOverlap(newReservation: Reservation, existingReservations: Reservation[]): void {
    const hasOverlap = existingReservations.some(existingReservation =>
      existingReservation.isActive() &&
      existingReservation.id !== newReservation.id &&
      existingReservation.overlaps(newReservation.timeRange)
    );

    if (hasOverlap) {
      throw new ValidationError('Reservation time range overlaps with an existing reservation');
    }
  }
} 