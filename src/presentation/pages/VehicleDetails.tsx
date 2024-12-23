import { useParams } from 'react-router-dom';
import { useVehicle } from '../../application/hooks/useVehicle';
import { ReservationForm } from '../components/ReservationForm';
import { ImageGallery } from '../components/ImageGallery';

export const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { vehicle, isLoading } = useVehicle(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div>
          <ImageGallery images={vehicle.images} />
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{vehicle.model}</h1>
            <p className="text-gray-600">{vehicle.classification}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Year</p>
                <p className="font-semibold">{vehicle.year}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-semibold">{vehicle.status}</p>
              </div>
              <div>
                <p className="text-gray-600">Price per Day</p>
                <p className="font-semibold">${vehicle.pricePerDay}</p>
              </div>
            </div>
          </div>

          {vehicle.specs && (
            <div>
              <h2 className="text-xl font-bold mb-2">Technical Specs</h2>
              <p className="text-gray-600">{vehicle.specs}</p>
            </div>
          )}

          {vehicle.features && (
            <div>
              <h2 className="text-xl font-bold mb-2">Features</h2>
              <p className="text-gray-600">{vehicle.features}</p>
            </div>
          )}

          {vehicle.status === 'AVAILABLE' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Make a Reservation</h2>
              <ReservationForm vehicleId={vehicle.id} pricePerDay={vehicle.pricePerDay} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 