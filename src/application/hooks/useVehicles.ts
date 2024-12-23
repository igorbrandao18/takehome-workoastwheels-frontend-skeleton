import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface VehicleImage {
  id: string;
  url: string;
  type: string;
  order: number;
}

export interface Vehicle {
  id: string;
  model: string;
  plate: string;
  year: number;
  status: string;
  classification: string;
  pricePerDay: number;
  specs: string | null;
  features: string | null;
  images: VehicleImage[];
}

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/vehicles');
      setVehicles(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vehicles');
      console.error('Error fetching vehicles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    vehicles,
    isLoading,
    error,
    refetch: fetchVehicles
  };
}; 