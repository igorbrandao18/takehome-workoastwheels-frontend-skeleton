import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

interface Vehicle {
    id: string;
    model: string;
    plate: string;
    year: number;
    status: string;
    classification: string;
}

interface VehicleContextData {
    vehicles: Vehicle[];
    loading: boolean;
    error: string | null;
    loadVehicles: () => Promise<void>;
    createVehicle: (data: Omit<Vehicle, 'id'>) => Promise<Vehicle>;
    updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<Vehicle>;
    deleteVehicle: (id: string) => Promise<void>;
}

const VehicleContext = createContext<VehicleContextData>({} as VehicleContextData);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadVehicles = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/vehicles');
            setVehicles(response.data);
        } catch (err) {
            setError('Failed to load vehicles');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createVehicle = useCallback(async (data: Omit<Vehicle, 'id'>) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/vehicles', data);
            const newVehicle = response.data;
            setVehicles(prev => [...prev, newVehicle]);
            return newVehicle;
        } catch (err) {
            setError('Failed to create vehicle');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateVehicle = useCallback(async (id: string, data: Partial<Vehicle>) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.put(`/vehicles/${id}`, data);
            const updatedVehicle = response.data;
            setVehicles(prev => 
                prev.map(vehicle => 
                    vehicle.id === id ? updatedVehicle : vehicle
                )
            );
            return updatedVehicle;
        } catch (err) {
            setError('Failed to update vehicle');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteVehicle = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await api.delete(`/vehicles/${id}`);
            setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
        } catch (err) {
            setError('Failed to delete vehicle');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <VehicleContext.Provider value={{
            vehicles,
            loading,
            error,
            loadVehicles,
            createVehicle,
            updateVehicle,
            deleteVehicle
        }}>
            {children}
        </VehicleContext.Provider>
    );
};

export const useVehicle = () => {
    const context = useContext(VehicleContext);
    if (!context) {
        throw new Error('useVehicle must be used within a VehicleProvider');
    }
    return context;
}; 