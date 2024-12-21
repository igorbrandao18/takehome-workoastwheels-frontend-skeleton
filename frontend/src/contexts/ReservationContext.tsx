import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

interface Reservation {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    totalAmount: {
        amount: number;
        currency: string;
    };
    vehicle: {
        id: string;
        model: string;
        plate: string;
    };
}

interface ReservationContextData {
    reservations: Reservation[];
    loading: boolean;
    error: string | null;
    loadReservations: () => Promise<void>;
    createReservation: (data: any) => Promise<Reservation>;
    cancelReservation: (id: string) => Promise<void>;
    completeReservation: (id: string) => Promise<void>;
}

const ReservationContext = createContext<ReservationContextData>({} as ReservationContextData);

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadReservations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/reservations');
            setReservations(response.data);
        } catch (err) {
            setError('Failed to load reservations');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createReservation = useCallback(async (data: any) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/reservations', data);
            const newReservation = response.data;
            setReservations(prev => [...prev, newReservation]);
            return newReservation;
        } catch (err) {
            setError('Failed to create reservation');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const cancelReservation = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await api.post(`/reservations/${id}/cancel`);
            setReservations(prev =>
                prev.map(reservation =>
                    reservation.id === id
                        ? { ...reservation, status: 'CANCELED' }
                        : reservation
                )
            );
        } catch (err) {
            setError('Failed to cancel reservation');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const completeReservation = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await api.post(`/reservations/${id}/complete`);
            setReservations(prev =>
                prev.map(reservation =>
                    reservation.id === id
                        ? { ...reservation, status: 'COMPLETED' }
                        : reservation
                )
            );
        } catch (err) {
            setError('Failed to complete reservation');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <ReservationContext.Provider value={{
            reservations,
            loading,
            error,
            loadReservations,
            createReservation,
            cancelReservation,
            completeReservation
        }}>
            {children}
        </ReservationContext.Provider>
    );
};

export const useReservation = () => {
    const context = useContext(ReservationContext);
    if (!context) {
        throw new Error('useReservation must be used within a ReservationProvider');
    }
    return context;
}; 