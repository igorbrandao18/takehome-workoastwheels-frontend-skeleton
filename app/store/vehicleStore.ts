import { create } from 'zustand';

interface VehicleState {
  vehicleYears: number[];
  setVehicleYears: (years: number[]) => void;
}

export const useVehicleStore = create<VehicleState>((set) => ({
  vehicleYears: [],
  setVehicleYears: (years) => set({ vehicleYears: years }),
})); 