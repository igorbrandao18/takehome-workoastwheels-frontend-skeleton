import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { DateTimePicker } from '../../components/ui/DateTimePicker';
import { Alert } from '../../components/ui/Alert';

interface Vehicle {
    id: string;
    model: string;
    plate: string;
    classification: string;
    baseRate: number;
}

export const CreateReservationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const vehicleId = searchParams.get('vehicleId');
    const navigate = useNavigate();
    const { user } = useAuth();

    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (vehicleId) {
            loadVehicle(vehicleId);
        }
    }, [vehicleId]);

    const loadVehicle = async (id: string) => {
        try {
            const response = await api.get(`/vehicles/${id}`);
            setVehicle(response.data);
        } catch (err) {
            setError('Failed to load vehicle details');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicle || !user) return;

        try {
            setLoading(true);
            setError('');

            await api.post('/reservations', {
                vehicleId: vehicle.id,
                userId: user.id,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString()
            });

            navigate('/reservations');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create reservation');
        } finally {
            setLoading(false);
        }
    };

    if (!vehicle) {
        return <div>Loading vehicle details...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Create Reservation</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Vehicle Details</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-gray-600">Model</p>
                        <p className="font-medium">{vehicle.model}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Plate</p>
                        <p className="font-medium">{vehicle.plate}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Classification</p>
                        <p className="font-medium">{vehicle.classification}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Base Rate</p>
                        <p className="font-medium">${vehicle.baseRate}/hour</p>
                    </div>
                </div>

                {error && <Alert type="error" message={error} className="mb-4" />}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time
                        </label>
                        <DateTimePicker
                            value={startTime}
                            onChange={setStartTime}
                            minDate={new Date()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Time
                        </label>
                        <DateTimePicker
                            value={endTime}
                            onChange={setEndTime}
                            minDate={startTime}
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                        >
                            Create Reservation
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 