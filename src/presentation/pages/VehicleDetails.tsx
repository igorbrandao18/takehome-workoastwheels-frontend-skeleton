import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ImageGallery } from '../components/ImageGallery';
import { ReservationForm } from '../components/ReservationForm';
import { Vehicle, getVehicle } from '../../lib/api';

export const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        if (!id) throw new Error('Vehicle ID is required');
        const data = await getVehicle(id);
        setVehicle(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicle');
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
          {error || 'Vehicle not found'}
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'MAINTENANCE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div>
          <ImageGallery images={vehicle.images} />
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold">
                {vehicle.make} {vehicle.model}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vehicle.status)}`}>
                {vehicle.status}
              </span>
            </div>
            <p className="text-xl text-gray-600">
              {vehicle.year} • {vehicle.classification.replace(/_/g, ' ')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Price per Hour</p>
              <p className="text-2xl font-bold text-blue-600">
                ${vehicle.pricePerHour}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Passenger Capacity</p>
              <p className="text-2xl font-bold">
                {vehicle.passengerCapacity}
              </p>
            </div>
          </div>

          {vehicle.specs && (
            <div>
              <h2 className="text-xl font-bold mb-2">Specifications</h2>
              <p className="text-gray-600">
                {vehicle.specs}
              </p>
            </div>
          )}

          {vehicle.features && (
            <div>
              <h2 className="text-xl font-bold mb-2">Features</h2>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.split(',').map((feature, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {feature.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {vehicle.status === 'AVAILABLE' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Make a Reservation</h2>
              <ReservationForm
                vehicleId={vehicle.id}
                pricePerHour={vehicle.pricePerHour}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 