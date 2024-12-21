import React, { useEffect, useState } from 'react';
import { useVehicle } from '../../contexts/VehicleContext';
import { useReservation } from '../../contexts/ReservationContext';
import { Card } from '../../components/ui/Card';
import { Chart } from '../../components/ui/Chart';
import { Alert } from '../../components/ui/Alert';

interface Stats {
    totalVehicles: number;
    availableVehicles: number;
    activeReservations: number;
    totalRevenue: number;
    reservationsByStatus: {
        PENDING: number;
        CONFIRMED: number;
        COMPLETED: number;
        CANCELED: number;
    };
}

export const DashboardPage: React.FC = () => {
    const { vehicles, loadVehicles } = useVehicle();
    const { reservations, loadReservations } = useReservation();
    const [stats, setStats] = useState<Stats>({
        totalVehicles: 0,
        availableVehicles: 0,
        activeReservations: 0,
        totalRevenue: 0,
        reservationsByStatus: {
            PENDING: 0,
            CONFIRMED: 0,
            COMPLETED: 0,
            CANCELED: 0
        }
    });

    useEffect(() => {
        loadVehicles();
        loadReservations();
    }, []);

    useEffect(() => {
        calculateStats();
    }, [vehicles, reservations]);

    const calculateStats = () => {
        const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE').length;
        const activeReservations = reservations.filter(
            r => ['PENDING', 'CONFIRMED'].includes(r.status)
        ).length;

        const totalRevenue = reservations
            .filter(r => r.status === 'COMPLETED')
            .reduce((sum, r) => sum + r.totalAmount.amount, 0);

        const reservationsByStatus = reservations.reduce(
            (acc, r) => ({
                ...acc,
                [r.status]: (acc[r.status as keyof typeof acc] || 0) + 1
            }),
            { PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELED: 0 }
        );

        setStats({
            totalVehicles: vehicles.length,
            availableVehicles,
            activeReservations,
            totalRevenue,
            reservationsByStatus
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card title="Total Vehicles" value={stats.totalVehicles} />
                <Card title="Available Vehicles" value={stats.availableVehicles} />
                <Card title="Active Reservations" value={stats.activeReservations} />
                <Card 
                    title="Total Revenue" 
                    value={`$${stats.totalRevenue.toFixed(2)}`}
                    type="currency"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Reservations by Status</h2>
                    <Chart
                        type="pie"
                        data={{
                            labels: Object.keys(stats.reservationsByStatus),
                            datasets: [{
                                data: Object.values(stats.reservationsByStatus),
                                backgroundColor: [
                                    '#FCD34D', // yellow
                                    '#60A5FA', // blue
                                    '#34D399', // green
                                    '#F87171'  // red
                                ]
                            }]
                        }}
                    />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {reservations.slice(0, 5).map(reservation => (
                            <div key={reservation.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{reservation.vehicle.model}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(reservation.startTime).toLocaleDateString()}
                                    </p>
                                </div>
                                <Alert
                                    type={reservation.status.toLowerCase()}
                                    message={reservation.status}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}; 