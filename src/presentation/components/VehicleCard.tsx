import { Link } from 'react-router-dom';

interface VehicleImage {
  id: string;
  url: string;
  type: string;
  order: number;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  status: string;
  classification: string;
  pricePerHour: number;
  passengerCapacity: number;
  specs: string | null;
  features: string | null;
  images: VehicleImage[];
}

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const mainImage = vehicle.images.find(img => img.type === 'exterior') || vehicle.images[0];

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
    <Link
      to={`/vehicles/${vehicle.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-48">
        <img
          src={mainImage?.url || '/placeholder-vehicle.jpg'}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vehicle.status)}`}>
            {vehicle.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-gray-900">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm text-gray-600">{vehicle.year}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Price per Hour</span>
            <span className="text-lg font-bold text-blue-600">
              ${vehicle.pricePerHour}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Classification</span>
            <span className="text-sm font-medium text-gray-900">
              {vehicle.classification.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Passengers</span>
            <span className="text-sm font-medium text-gray-900">
              {vehicle.passengerCapacity}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}; 