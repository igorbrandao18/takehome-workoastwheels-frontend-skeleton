import { IVehicleRepository } from '../../domain/interfaces/IVehicleRepository';
import { IReservationRepository } from '../../domain/interfaces/IReservationRepository';
import { VehicleDomainService } from '../../domain/services/VehicleDomainService';
import { Vehicle } from '../../domain/entities/Vehicle';
import { VehicleClassification } from '../../domain/value-objects/VehicleClassification';
import { ValidationError } from '../../domain/errors/ValidationError';
import { INotificationService } from '../interfaces/INotificationService';
import { Logger } from '../../infrastructure/logging/Logger';

interface CreateVehicleDTO {
  model: string;
  plate: string;
  year: number;
  classification: string;
}

interface UpdateVehicleDTO {
  model?: string;
  plate?: string;
  year?: number;
  classification?: string;
  status?: string;
}

export class VehicleApplicationService {
  constructor(
    private readonly vehicleRepository: IVehicleRepository,
    private readonly reservationRepository: IReservationRepository,
    private readonly vehicleDomainService: VehicleDomainService,
    private readonly notificationService: INotificationService,
    private readonly logger: Logger
  ) {}

  async findById(id: string): Promise<Vehicle | null> {
    return this.vehicleRepository.findById(id);
  }

  async getAvailableVehicles(
    startTime: Date,
    endTime: Date,
    classification?: string
  ): Promise<Vehicle[]> {
    const vehicles = await this.vehicleRepository.findAvailable();
    const filteredVehicles = vehicles.filter(vehicle => {
      if (classification && vehicle.classification.value !== classification) {
        return false;
      }
      return true;
    });

    const availableVehicles = [];
    for (const vehicle of filteredVehicles) {
      const reservations = await this.reservationRepository.findByVehicle(vehicle.id);
      const hasOverlap = reservations.some(reservation =>
        reservation.overlaps({ startTime, endTime })
      );
      if (!hasOverlap) {
        availableVehicles.push(vehicle);
      }
    }

    return availableVehicles;
  }

  async createVehicle(dto: CreateVehicleDTO): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepository.findByPlate(dto.plate);
    if (existingVehicle) {
      throw new ValidationError('Vehicle plate already exists');
    }

    const vehicle = new Vehicle({
      model: dto.model,
      plate: dto.plate,
      year: dto.year,
      status: 'AVAILABLE',
      classification: new VehicleClassification(dto.classification as any)
    });

    this.vehicleDomainService.validateVehicleCreation(vehicle);
    await this.vehicleRepository.save(vehicle);

    this.logger.info('Vehicle created', { vehicleId: vehicle.id });
    return vehicle;
  }

  async updateVehicle(id: string, dto: UpdateVehicleDTO): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new ValidationError('Vehicle not found');
    }

    if (dto.status) {
      this.vehicleDomainService.validateStatusChange(vehicle, dto.status as any);
      vehicle.changeStatus(dto.status as any);

      if (dto.status === 'MAINTENANCE') {
        const activeReservations = await this.reservationRepository.findActiveByVehicle(id);
        await Promise.all(
          activeReservations.map(reservation =>
            this.notificationService.sendPushNotification(reservation.userId, {
              title: 'Vehicle Maintenance',
              body: `Vehicle ${vehicle.model} is going into maintenance`
            })
          )
        );
      }
    }

    if (dto.classification) {
      await this.vehicleDomainService.changeClassification(
        vehicle,
        new VehicleClassification(dto.classification as any)
      );
    }

    await this.vehicleRepository.update(vehicle);
    this.logger.info('Vehicle updated', { vehicleId: vehicle.id });
    return vehicle;
  }

  async deleteVehicle(id: string): Promise<void> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new ValidationError('Vehicle not found');
    }

    const activeReservations = await this.reservationRepository.findActiveByVehicle(id);
    if (activeReservations.length > 0) {
      throw new ValidationError('Cannot delete vehicle with active reservations');
    }

    await this.vehicleRepository.delete(id);
    this.logger.info('Vehicle deleted', { vehicleId: id });
  }

  async setMaintenance(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new ValidationError('Vehicle not found');
    }

    this.vehicleDomainService.validateMaintenance(vehicle);
    vehicle.changeStatus('MAINTENANCE');

    await this.vehicleRepository.update(vehicle);
    this.logger.info('Vehicle set to maintenance', { vehicleId: id });
    return vehicle;
  }
} 