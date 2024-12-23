import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Vehicle, vehicleApi } from '../../lib/api';

export const Home = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        const data = await vehicleApi.search({ featured: true });
        setFeaturedVehicles(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured vehicles:', error);
        setLoading(false);
      }
    };

    fetchFeaturedVehicles();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1617788138017-80ad40651399"
          alt="Luxury car"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              Experience Luxury on Wheels
            </h1>
            <p className="text-xl mb-8">
              Choose from our exclusive collection of premium vehicles for an unforgettable journey.
            </p>
            <Link
              to="/vehicles"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors inline-block"
            >
              Browse Vehicles
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Vehicles</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map(vehicle => {
              const mainImage = vehicle.images.find(img => img.type === 'exterior') || vehicle.images[0];
              
              return (
                <Link
                  key={vehicle.id}
                  to={`/vehicles/${vehicle.id}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={mainImage?.url}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
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
            })}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">���</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Vehicles</h3>
              <p className="text-gray-600">
                Choose from our carefully curated selection of luxury vehicles
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Simple and fast online reservation process
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Full Insurance</h3>
              <p className="text-gray-600">
                Comprehensive coverage for peace of mind
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 text-center py-16">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Experience Luxury?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Browse our collection and find your perfect vehicle today.
        </p>
        <Link
          to="/vehicles"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors inline-block"
        >
          View All Vehicles
        </Link>
      </section>
    </div>
  );
}; 