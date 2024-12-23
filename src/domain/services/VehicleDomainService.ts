import { Vehicle, VehicleStatus } from '../entities/Vehicle';
import { VehicleClassification } from '../value-objects/VehicleClassification';
import { ValidationError } from '../errors/ValidationError';

export class VehicleDomainService {
  validateVehicleCreation(vehicle: Vehicle): void {
    if (!vehicle.model || vehicle.model.trim().length < 2) {
      throw new ValidationError('Vehicle model must have at least 2 characters');
    }

    if (!vehicle.plate || !/^[A-Z0-9]{7}$/.test(vehicle.plate)) {
      throw new ValidationError('Invalid vehicle plate format');
    }

    if (vehicle.year < 1900 || vehicle.year > new Date().getFullYear() + 1) {
      throw new ValidationError('Invalid vehicle year');
    }
  }

  validateStatusChange(vehicle: Vehicle, newStatus: VehicleStatus): void {
    if (vehicle.status === newStatus) {
      return;
    }

    if (newStatus === 'MAINTENANCE' && vehicle.status === 'RESERVED') {
      throw new ValidationError('Cannot put reserved vehicle in maintenance');
    }

    if (newStatus === 'RETIRED' && vehicle.status === 'RESERVED') {
      throw new ValidationError('Cannot retire a vehicle with active reservations');
    }
  }

  validateMaintenance(vehicle: Vehicle): void {
    if (vehicle.status === 'MAINTENANCE') {
      throw new ValidationError('Vehicle is already in maintenance');
    }

    if (vehicle.status === 'RETIRED') {
      throw new ValidationError('Cannot put retired vehicle in maintenance');
    }
  }

  async changeClassification(
    vehicle: Vehicle,
    newClassification: VehicleClassification
  ): Promise<void> {
    if (vehicle.status === 'RETIRED') {
      throw new ValidationError('Cannot change classification of retired vehicle');
    }

    if (vehicle.classification.equals(newClassification)) {
      return;
    }

    vehicle.changeClassification(newClassification);
  }
} 