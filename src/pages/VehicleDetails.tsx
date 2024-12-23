import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import { Button } from '../components/ui/button';
import { formatCurrency, formatDateTime } from '../lib/utils';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  description: string;
  pricePerDay: number;
  imageUrl: string;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'RESERVED';
  features: string[];
  specifications: {
    [key: string]: string;
  };
}

export function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const { data: vehicle, isLoading } = useQuery<Vehicle>({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const response = await api.get(`/vehicles/${id}`);
      return response.data;
    }
  });

  const createReservation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/reservations', {
        vehicleId: id,
        startDate,
        endDate
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Reservation created successfully');
      navigate('/reservations');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const handleReserve = () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    createReservation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Vehicle not found</h1>
        <Button onClick={() => navigate('/vehicles')} className="mt-4">
          Back to Vehicles
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg">
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {vehicle.features.map((feature, index) => (
              <div key={index} className="rounded-lg border p-4">
                <p className="text-sm font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{vehicle.name}</h1>
            <p className="text-lg text-muted-foreground">{vehicle.type}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground">{vehicle.description}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Specifications</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(vehicle.specifications).map(([key, value]) => (
                <div key={key} className="rounded-lg border p-4">
                  <p className="text-sm font-medium capitalize">{key}</p>
                  <p className="text-muted-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-2xl font-bold">
                {formatCurrency(vehicle.pricePerDay)}
              </span>
              <span className="text-muted-foreground">per day</span>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    min={startDate || new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleReserve}
                disabled={vehicle.status !== 'AVAILABLE' || createReservation.isPending}
              >
                {createReservation.isPending ? 'Creating Reservation...' : 'Reserve Now'}
              </Button>

              {vehicle.status !== 'AVAILABLE' && (
                <p className="text-center text-sm text-destructive">
                  This vehicle is currently not available for reservation
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 