import { Link } from 'react-router-dom';
import { Vehicle } from '../../application/hooks/useVehicles';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-[16/9]">
        <img
          src={vehicle.images[0]?.url}
          alt={vehicle.model}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            vehicle.status === 'AVAILABLE'
              ? 'bg-green-100 text-green-800'
              : vehicle.status === 'MAINTENANCE'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {vehicle.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-bold">{vehicle.model}</h3>
          <p className="text-sm text-gray-600">{vehicle.classification}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-600">Year</p>
            <p className="font-medium">{vehicle.year}</p>
          </div>
          <div>
            <p className="text-gray-600">Price per Day</p>
            <p className="font-medium">${vehicle.pricePerDay}</p>
          </div>
        </div>

        {/* Features Preview */}
        {vehicle.features && (
          <div className="text-sm">
            <p className="text-gray-600 mb-1">Features</p>
            <p className="line-clamp-2 text-gray-800">
              {vehicle.features}
            </p>
          </div>
        )}

        {/* Action Button */}
        <Link
          to={`/vehicles/${vehicle.id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}; 