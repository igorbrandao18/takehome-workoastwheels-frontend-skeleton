import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Calendar, Shield, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                  Premium Car Rental
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Experience luxury and performance with our exclusive collection of premium vehicles
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/vehicles"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Browse Vehicles
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-4 border border-gray-600 hover:border-gray-400 rounded-lg font-semibold transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </motion.div>

            {/* Featured Cars */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCars.map((car, index) => (
                <motion.div
                  key={car.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-800 rounded-lg overflow-hidden group hover:bg-gray-750 transition-colors"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{car.name}</h3>
                    <p className="text-gray-400 mb-4">{car.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400 font-semibold">${car.price}/day</span>
                      <Link
                        to={`/vehicles/${car.id}`}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
              <p className="text-gray-400">Experience the best in luxury car rentals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800 p-6 rounded-lg text-center"
                >
                  <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-gray-100">
            Join our exclusive membership and experience luxury driving today
          </p>
          <Link
            to="/register"
            className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}

const featuredCars = [
  {
    id: 1,
    name: 'Porsche 911 GT3',
    description: 'High-performance sports car with racing DNA',
    price: '899',
    image: '/cars/porsche.jpg'
  },
  {
    id: 2,
    name: 'Mercedes-AMG GT',
    description: 'Luxury grand tourer with stunning performance',
    price: '799',
    image: '/cars/mercedes.jpg'
  },
  {
    id: 3,
    name: 'BMW M4 Competition',
    description: 'Perfect blend of luxury and sportiness',
    price: '699',
    image: '/cars/bmw.jpg'
  }
];

const features = [
  {
    title: 'Premium Fleet',
    description: 'Access to luxury and exotic cars',
    icon: <Car className="w-6 h-6 text-blue-400" />
  },
  {
    title: 'Flexible Rentals',
    description: 'Daily, weekly, or monthly options',
    icon: <Calendar className="w-6 h-6 text-blue-400" />
  },
  {
    title: 'Full Insurance',
    description: 'Comprehensive coverage included',
    icon: <Shield className="w-6 h-6 text-blue-400" />
  },
  {
    title: '24/7 Support',
    description: 'Always here when you need us',
    icon: <Star className="w-6 h-6 text-blue-400" />
  }
]; 