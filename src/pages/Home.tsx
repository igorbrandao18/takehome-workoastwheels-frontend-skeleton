import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleFilter, FilterValues } from '../components/VehicleFilter';
import { motion } from 'framer-motion';

interface Vehicle {
  id: string;
  model: string;
  plate: string;
  year: number;
  status: string;
  classification: string;
  pricePerDay: number;
  specs: string | null;
  features: string | null;
  images: {
    id: string;
    url: string;
    type: string;
    order: number;
  }[];
}

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [classifications, setClassifications] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [vehiclesResponse, optionsResponse] = await Promise.all([
          api.get('/vehicles'),
          api.get('/vehicles/options')
        ]);
        
        setVehicles(vehiclesResponse.data);
        setFilteredVehicles(vehiclesResponse.data);
        setClassifications(optionsResponse.data.classifications);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleFilterChange = (filters: FilterValues) => {
    const filtered = vehicles.filter(vehicle => {
      const matchesSearch = filters.search
        ? vehicle.model.toLowerCase().includes(filters.search.toLowerCase()) ||
          vehicle.classification.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      const matchesPrice = vehicle.pricePerDay >= filters.priceRange[0] &&
                          vehicle.pricePerDay <= filters.priceRange[1];

      const matchesClassification = filters.classification
        ? vehicle.classification === filters.classification
        : true;

      const matchesYear = filters.year
        ? vehicle.year === filters.year
        : true;

      const matchesStatus = filters.status
        ? vehicle.status === filters.status
        : true;

      return matchesSearch && matchesPrice && matchesClassification && 
             matchesYear && matchesStatus;
    });

    setFilteredVehicles(filtered);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const minPrice = Math.min(...vehicles.map(v => v.pricePerDay));
  const maxPrice = Math.max(...vehicles.map(v => v.pricePerDay));

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        Nossa Frota Premium
      </motion.h1>

      <VehicleFilter
        onFilterChange={handleFilterChange}
        classifications={classifications}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <VehicleCard vehicle={vehicle} />
          </motion.div>
        ))}
      </div>
    </div>
  );
} 