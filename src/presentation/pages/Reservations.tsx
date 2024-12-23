import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface Reservation {
  id: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}

export const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const message = location.state?.message;

  useEffect(() => {
    // Load reservations from localStorage
    const loadReservations = () => {
      const savedReservations = localStorage.getItem('reservations');
      if (savedReservations) {
        setReservations(JSON.parse(savedReservations));
      }
      setLoading(false);
    };

    loadReservations();
  }, []);

  const handleCancelReservation = (reservationId: string) => {
    // Get current reservations
    const currentReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    
    // Update the status of the reservation to CANCELLED
    const updatedReservations = currentReservations.map((res: Reservation) =>
      res.id === reservationId ? { ...res, status: 'CANCELLED' } : res
    );
    
    // Save back to localStorage
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    
    // Update state
    setReservations(updatedReservations);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Reservations</h1>

      {message && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
          {message}
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">
            You don't have any reservations yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reservations.map(reservation => (
            <div
              key={reservation.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      Reservation #{reservation.id.slice(0, 8)}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        reservation.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : reservation.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    <p>From: {formatDate(reservation.startDate)}</p>
                    <p>To: {formatDate(reservation.endDate)}</p>
                  </div>
                  <p className="font-semibold text-blue-600">
                    Total: ${reservation.totalPrice.toFixed(2)}
                  </p>
                </div>

                {reservation.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancelReservation(reservation.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel Reservation
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 