import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Button } from '../components/ui/button';
import { formatDateTime, formatCurrency } from '../lib/utils';

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  totalPrice: number;
  vehicle: {
    id: string;
    name: string;
    type: string;
    imageUrl: string;
  };
}

export function Reservations() {
  const queryClient = useQueryClient();

  const { data: reservations, isLoading } = useQuery<Reservation[]>({
    queryKey: ['reservations'],
    queryFn: async () => {
      const response = await api.get('/reservations');
      return response.data;
    }
  });

  const cancelReservation = useMutation({
    mutationFn: async (reservationId: string) => {
      const response = await api.patch(`/reservations/${reservationId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Reservation cancelled successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!reservations?.length) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">No reservations found</h1>
        <p className="mt-2 text-muted-foreground">
          You haven't made any reservations yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Reservations</h1>

      <div className="grid gap-6">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="flex flex-col overflow-hidden rounded-lg border sm:flex-row"
          >
            <div className="aspect-video w-full sm:w-48">
              <img
                src={reservation.vehicle.imageUrl}
                alt={reservation.vehicle.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {reservation.vehicle.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {reservation.vehicle.type}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      reservation.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : reservation.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                        : reservation.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                    }`}
                  >
                    {reservation.status.charAt(0) +
                      reservation.status.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Start:</span>{' '}
                    {formatDateTime(reservation.startDate)}
                  </p>
                  <p>
                    <span className="font-medium">End:</span>{' '}
                    {formatDateTime(reservation.endDate)}
                  </p>
                  <p>
                    <span className="font-medium">Total Price:</span>{' '}
                    {formatCurrency(reservation.totalPrice)}
                  </p>
                </div>
              </div>
              {reservation.status === 'PENDING' && (
                <div className="mt-4">
                  <Button
                    variant="destructive"
                    onClick={() => cancelReservation.mutate(reservation.id)}
                    disabled={cancelReservation.isPending}
                  >
                    {cancelReservation.isPending ? 'Cancelling...' : 'Cancel Reservation'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 