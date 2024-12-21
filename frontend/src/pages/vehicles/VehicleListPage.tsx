import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { VehicleCard } from '../../components/vehicles/VehicleCard';
import { VehicleFilter } from '../../components/vehicles/VehicleFilter';

interface Vehicle {
    id: string;
    model: string;
    plate: string;
    year: number;
    status: string;
    classification: string;
}

export const VehicleListPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            setLoading(true);
            const response = await api.get('/vehicles');
            setVehicles(response.data);
        } catch (err) {
            setError('Failed to load vehicles');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateVehicle = () => {
        navigate('/vehicles/new');
    };

    const handleFilter = async (filters: any) => {
        try {
            setLoading(true);
            const response = await api.get('/vehicles', { params: filters });
            setVehicles(response.data);
        } catch (err) {
            setError('Failed to filter vehicles');
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
                <h1 className="text-2xl font-bold">Vehicles</h1>
                {user?.role === 'ADMIN' && (
                    <Button
                        variant="primary"
                        onClick={handleCreateVehicle}
                    >
                        Add Vehicle
                    </Button>
                )}
            </div>

            <VehicleFilter onFilter={handleFilter} />

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map(vehicle => (
                    <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        onUpdate={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                        onReserve={() => navigate(`/reservations/new?vehicleId=${vehicle.id}`)}
                    />
                ))}
            </div>

            {vehicles.length === 0 && !error && (
                <div className="text-center text-gray-500 mt-8">
                    No vehicles found
                </div>
            )}
        </div>
    );
}; 