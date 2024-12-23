import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { ReservationCard } from '../../components/reservations/ReservationCard';
import { ReservationFilter } from '../../components/reservations/ReservationFilter';

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

export const ReservationListPage: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        try {
            setLoading(true);
            const response = await api.get('/reservations');
            setReservations(response.data);
        } catch (err) {
            setError('Failed to load reservations');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async (id: string) => {
        try {
            await api.post(`/reservations/${id}/cancel`);
            await loadReservations();
        } catch (err) {
            setError('Failed to cancel reservation');
        }
    };

    const handleFilter = async (filters: any) => {
        try {
            setLoading(true);
            const response = await api.get('/reservations', { params: filters });
            setReservations(response.data);
        } catch (err) {
            setError('Failed to filter reservations');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Reservations</h1>
                <Button
                    variant="primary"
                    onClick={() => navigate('/vehicles')}
                >
                    New Reservation
                </Button>
            </div>

            <ReservationFilter onFilter={handleFilter} />

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {reservations.map(reservation => (
                    <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        onCancel={() => handleCancelReservation(reservation.id)}
                    />
                ))}
            </div>

            {reservations.length === 0 && !error && (
                <div className="text-center text-gray-500 mt-8">
                    No reservations found
                </div>
            )}
        </div>
    );
}; 