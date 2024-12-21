import { PrismaClient } from '@prisma/client';
import { IVehicleRepository } from '../../domain/interfaces/IVehicleRepository';
import { Vehicle } from '../../domain/entities/Vehicle';
import { VehicleClassification } from '../../domain/value-objects/VehicleClassification';

export class VehicleRepository implements IVehicleRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id }
    });

    if (!vehicle) return null;

    return this.mapToDomain(vehicle);
  }

  async findByPlate(plate: string): Promise<Vehicle | null> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { plate }
    });

    if (!vehicle) return null;

    return this.mapToDomain(vehicle);
  }

  async findAvailable(): Promise<Vehicle[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { status: 'AVAILABLE' }
    });

    return vehicles.map(this.mapToDomain);
  }

  async save(vehicle: Vehicle): Promise<void> {
    await this.prisma.vehicle.create({
      data: this.mapToPrisma(vehicle)
    });
  }

  async update(vehicle: Vehicle): Promise<void> {
    await this.prisma.vehicle.update({
      where: { id: vehicle.id },
      data: this.mapToPrisma(vehicle)
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vehicle.delete({
      where: { id }
    });
  }

  private mapToDomain(prismaVehicle: any): Vehicle {
    return new Vehicle({
      id: prismaVehicle.id,
      model: prismaVehicle.model,
      plate: prismaVehicle.plate,
      year: prismaVehicle.year,
      status: prismaVehicle.status,
      classification: new VehicleClassification(prismaVehicle.classification),
      createdAt: prismaVehicle.createdAt,
      updatedAt: prismaVehicle.updatedAt
    });
  }

  private mapToPrisma(vehicle: Vehicle): any {
    return {
      id: vehicle.id,
      model: vehicle.model,
      plate: vehicle.plate,
      year: vehicle.year,
      status: vehicle.status,
      classification: vehicle.classification.value,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt
    };
  }
} 