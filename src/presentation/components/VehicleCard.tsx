import { Link } from 'react-router-dom';
import { Vehicle } from '../../lib/api';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const mainImage = vehicle.images.find(img => img.type === 'exterior') || vehicle.images[0];

  return (
    <Link
      to={`/vehicles/${vehicle.id}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="relative h-48">
        <img
          src={mainImage?.url}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-sm font-medium ${
          vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
          vehicle.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {vehicle.status}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">
          {vehicle.make} {vehicle.model}
        </h3>
        <p className="text-gray-600 mb-4">
          {vehicle.year} • {vehicle.classification.replace(/_/g, ' ')}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-bold">
            ${vehicle.pricePerHour}/hour
          </span>
          <span className="text-blue-600 group-hover:translate-x-2 transition-transform">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}; 