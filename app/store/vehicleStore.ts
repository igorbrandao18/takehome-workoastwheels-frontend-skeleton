import { create } from 'zustand';

interface VehicleState {
  vehicleYears: number[];
  vehicleModels: string[];
  vehicleDoors: number[];
  vehicleMaxPassengers: number[];
  setVehicleYears: (years: number[]) => void;
  setVehicleModels: (models: string[]) => void;
  setVehicleDoors: (doors: number[]) => void;
  setVehicleMaxPassengers: (passengers: number[]) => void;
}

export const useVehicleStore = create<VehicleState>((set) => ({
  vehicleYears: [],
  vehicleModels: [],
  vehicleDoors: [],
  vehicleMaxPassengers: [],
  setVehicleYears: (years) => set({ vehicleYears: years }),
  setVehicleModels: (models) => set({ vehicleModels: models }),
  setVehicleDoors: (doors) => set({ vehicleDoors: doors }),
  setVehicleMaxPassengers: (passengers) => set({ vehicleMaxPassengers: passengers }),
})); 