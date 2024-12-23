import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Vehicle } from '../../lib/api';

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  vehicle: Vehicle;
}

export const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get('/reservations');
        setReservations(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch reservations');
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Reservations</h1>
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600 text-lg">You don't have any reservations yet.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Reservations</h1>
      
      <div className="grid gap-6">
        {reservations.map(reservation => {
          const mainImage = reservation.vehicle.images.find(img => img.type === 'exterior') || reservation.vehicle.images[0];
          
          return (
            <div key={reservation.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={mainImage?.url}
                    alt={`${reservation.vehicle.make} ${reservation.vehicle.model}`}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold mb-2">
                        {reservation.vehicle.make} {reservation.vehicle.model}
                      </h2>
                      <p className="text-gray-600">
                        {reservation.vehicle.year} • {reservation.vehicle.classification.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <span className="font-medium">Start:</span> {formatDate(reservation.startDate)}
                    </p>
                    <p>
                      <span className="font-medium">End:</span> {formatDate(reservation.endDate)}
                    </p>
                    <p>
                      <span className="font-medium">Price per Hour:</span> ${reservation.vehicle.pricePerHour}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 