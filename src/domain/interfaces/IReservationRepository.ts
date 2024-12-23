import { Reservation } from '../entities/Reservation';

export interface IReservationRepository {
  findById(id: string): Promise<Reservation | null>;
  findByVehicle(vehicleId: string): Promise<Reservation[]>;
  findActiveByVehicle(vehicleId: string): Promise<Reservation[]>;
  save(reservation: Reservation): Promise<void>;
  update(reservation: Reservation): Promise<void>;
  delete(id: string): Promise<void>;
} 