import { PrismaClient } from '@prisma/client';
import { IReservationRepository } from '../../domain/interfaces/IReservationRepository';
import { Reservation } from '../../domain/entities/Reservation';
import { TimeRange } from '../../domain/value-objects/TimeRange';

export class ReservationRepository implements IReservationRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: string): Promise<Reservation | null> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id }
    });

    if (!reservation) return null;

    return this.mapToDomain(reservation);
  }

  async findByVehicle(vehicleId: string): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: { vehicleId }
    });

    return reservations.map(this.mapToDomain);
  }

  async findActiveByVehicle(vehicleId: string): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        vehicleId,
        status: 'CONFIRMED',
        endTime: {
          gt: new Date()
        }
      }
    });

    return reservations.map(this.mapToDomain);
  }

  async save(reservation: Reservation): Promise<void> {
    await this.prisma.reservation.create({
      data: this.mapToPrisma(reservation)
    });
  }

  async update(reservation: Reservation): Promise<void> {
    await this.prisma.reservation.update({
      where: { id: reservation.id },
      data: this.mapToPrisma(reservation)
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.reservation.delete({
      where: { id }
    });
  }

  private mapToDomain(prismaReservation: any): Reservation {
    return new Reservation({
      id: prismaReservation.id,
      userId: prismaReservation.userId,
      vehicleId: prismaReservation.vehicleId,
      timeRange: new TimeRange(
        prismaReservation.startTime,
        prismaReservation.endTime
      ),
      status: prismaReservation.status,
      createdAt: prismaReservation.createdAt,
      updatedAt: prismaReservation.updatedAt
    });
  }

  private mapToPrisma(reservation: Reservation): any {
    return {
      id: reservation.id,
      userId: reservation.userId,
      vehicleId: reservation.vehicleId,
      startTime: reservation.timeRange.startTime,
      endTime: reservation.timeRange.endTime,
      status: reservation.status,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt
    };
  }
} 