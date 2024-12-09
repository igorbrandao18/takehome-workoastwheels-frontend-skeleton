import { create } from 'zustand';
import type { VehicleFilters } from '../lib/api';

interface VehicleState {
  filters: VehicleFilters;
  setFilters: (filters: Partial<VehicleFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: VehicleFilters = {
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  page: 1,
  perPage: 10,
  sortBy: 'price_asc'
};

export const useVehicleStore = create<VehicleState>((set) => ({
  filters: defaultFilters,
  
  setFilters: (newFilters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
        page: 'page' in newFilters ? newFilters.page : 1
      }
    }));
  },
  
  resetFilters: () => {
    set({ filters: defaultFilters });
  },
})); 