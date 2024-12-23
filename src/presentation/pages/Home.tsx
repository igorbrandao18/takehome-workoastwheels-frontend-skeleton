import { Link } from 'react-router-dom';
import { useVehicles } from '../../application/hooks/useVehicles';

export const Home = () => {
  const { vehicles, isLoading } = useVehicles();
  const featuredVehicles = vehicles?.slice(0, 3) || [];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gray-50 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">
          Premium Car Rental Experience
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Choose from our exclusive collection of luxury vehicles
        </p>
        <Link
          to="/vehicles"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
        >
          Browse Vehicles
        </Link>
      </section>

      {/* Featured Vehicles */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Vehicles</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={vehicle.images[0]?.url}
                  alt={vehicle.model}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{vehicle.model}</h3>
                  <p className="text-gray-600 mb-4">{vehicle.classification}</p>
                  <Link
                    to={`/vehicles/${vehicle.id}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}; 