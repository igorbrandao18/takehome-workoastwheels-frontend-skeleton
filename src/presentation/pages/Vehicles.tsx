import { useState, useEffect } from 'react';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleFilter } from '../components/VehicleFilter';
import { Vehicle, getVehicles } from '../../lib/api';

export const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    classification: '',
    priceRange: '',
    status: '',
    make: '',
    minPassengers: 0
  });

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles(filters);
      setVehicles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Vehicles</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <VehicleFilter
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Vehicle Grid */}
        <div className="lg:col-span-3">
          {vehicles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                No vehicles found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {vehicles.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 