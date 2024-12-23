import { useState } from 'react';
import { useReservations } from '../../application/hooks/useReservations';

type ReservationStatus = 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export const Reservations = () => {
  const { reservations, cancelReservation } = useReservations();
  const [statusFilter, setStatusFilter] = useState<ReservationStatus>('ALL');

  const filteredReservations = reservations?.filter(reservation => 
    statusFilter === 'ALL' ? true : reservation.status === statusFilter
  );

  const handleCancel = async (reservationId: string) => {
    try {
      await cancelReservation(reservationId);
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Reservations</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ReservationStatus)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Reservations</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {filteredReservations?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No reservations found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredReservations?.map(reservation => (
            <div
              key={reservation.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">{reservation.vehicle.model}</h2>
                  <p className="text-gray-600">
                    {new Date(reservation.startDate).toLocaleDateString()} -{' '}
                    {new Date(reservation.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Duration: {reservation.durationInDays} days
                  </p>
                  <p className="font-semibold">
                    Total: ${reservation.totalPrice}
                  </p>
                </div>

                <div className="text-right space-y-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      reservation.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : reservation.status === 'COMPLETED'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {reservation.status}
                  </span>

                  {reservation.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="block w-full text-red-600 hover:text-red-700 text-sm"
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              </div>

              {reservation.vehicle.images?.[0] && (
                <div className="mt-4">
                  <img
                    src={reservation.vehicle.images[0].url}
                    alt={reservation.vehicle.model}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 