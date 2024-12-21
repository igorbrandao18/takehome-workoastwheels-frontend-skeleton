import { Vehicle } from '../entities/Vehicle';

export interface IVehicleRepository {
  findById(id: string): Promise<Vehicle | null>;
  findByPlate(plate: string): Promise<Vehicle | null>;
  findAvailable(): Promise<Vehicle[]>;
  save(vehicle: Vehicle): Promise<void>;
  update(vehicle: Vehicle): Promise<void>;
  delete(id: string): Promise<void>;
} 