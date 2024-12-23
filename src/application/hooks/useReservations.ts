import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Vehicle } from './useVehicles';

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  totalPrice: number;
  durationInDays: number;
  vehicle: Vehicle;
}

interface CreateReservationData {
  vehicleId: string;
  startDate: string;
  endDate: string;
}

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/reservations');
      setReservations(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch reservations');
      console.error('Error fetching reservations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createReservation = async (data: CreateReservationData) => {
    try {
      const response = await api.post('/reservations', data);
      setReservations(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      throw new Error('Failed to create reservation');
    }
  };

  const cancelReservation = async (id: string) => {
    try {
      await api.post(`/reservations/${id}/cancel`);
      setReservations(prev =>
        prev.map(reservation =>
          reservation.id === id
            ? { ...reservation, status: 'CANCELLED' as const }
            : reservation
        )
      );
    } catch (err) {
      throw new Error('Failed to cancel reservation');
    }
  };

  return {
    reservations,
    isLoading,
    error,
    createReservation,
    cancelReservation,
    refetch: fetchReservations
  }; 
}; 