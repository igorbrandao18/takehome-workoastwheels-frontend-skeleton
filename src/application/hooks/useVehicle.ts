import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Vehicle } from './useVehicles';

export const useVehicle = (id: string | undefined) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const fetchVehicle = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/vehicles/${id}`);
      setVehicle(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vehicle details');
      console.error('Error fetching vehicle:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    vehicle,
    isLoading,
    error,
    refetch: fetchVehicle
  };
}; 