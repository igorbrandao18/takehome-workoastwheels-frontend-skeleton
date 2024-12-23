import { useState } from 'react';
import { useVehicles } from '../../application/hooks/useVehicles';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleFilter } from '../components/VehicleFilter';

export const Vehicles = () => {
  const { vehicles, isLoading } = useVehicles();
  const [filters, setFilters] = useState({
    classification: '',
    priceRange: '',
    status: ''
  });

  const filteredVehicles = vehicles?.filter(vehicle => {
    if (filters.classification && vehicle.classification !== filters.classification) {
      return false;
    }
    if (filters.status && vehicle.status !== filters.status) {
      return false;
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (vehicle.pricePerDay < min || vehicle.pricePerDay > max) {
        return false;
      }
    }
    return true;
  }) || [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Our Vehicles</h1>
      
      <VehicleFilter filters={filters} onFilterChange={setFilters} />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}; 