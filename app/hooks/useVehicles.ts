import { useQuery } from '@tanstack/react-query';
import { vehicleApi } from '../lib/api';
import { useVehicleStore } from '../store/vehicleStore';

export function useVehicleOptions() {
  return useQuery({
    queryKey: ['vehicleOptions'],
    queryFn: vehicleApi.getOptions,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    initialData: {
      years: [],
      makes: [],
      models: [],
      doors: [],
      maxPassengers: [],
      classifications: []
    }
  });
}

export function useVehicleSearch() {
  const filters = useVehicleStore((state) => state.filters);
  
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => vehicleApi.searchVehicles(filters),
    keepPreviousData: true,
    staleTime: 30 * 1000, // 30 segundos
  });
} 