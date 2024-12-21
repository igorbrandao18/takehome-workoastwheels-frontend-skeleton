import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

export function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pb-16 pt-[8rem] md:pb-20 lg:pb-24 xl:pb-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/10" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-7xl px-6 lg:px-8"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
              WorkoastWheels
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Your premium vehicle rental service. Experience luxury, comfort, and reliability with our diverse fleet of well-maintained vehicles.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/vehicles">
                <Button size="lg" className="group relative overflow-hidden">
                  <span className="relative z-10">Browse Vehicles</span>
                  <div className="absolute inset-0 transform bg-primary transition-transform duration-300 group-hover:scale-x-110" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="group">
                  Create Account
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose WorkoastWheels?
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Experience the perfect blend of luxury, convenience, and reliability with our premium vehicle rental service.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24"
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="relative overflow-hidden rounded-2xl border bg-card p-8 shadow-lg transition-shadow hover:shadow-xl"
              >
                <div className="absolute right-4 top-4 text-4xl text-primary opacity-10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-4 text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="relative isolate mt-32 px-6 py-32 sm:mt-40 sm:py-40 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Join thousands of satisfied customers who trust WorkoastWheels for their vehicle rental needs.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/register">
              <Button size="lg">Create your account</Button>
            </Link>
            <Link to="/vehicles">
              <Button variant="outline" size="lg">
                View vehicles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    title: 'Wide Selection',
    description: 'Choose from our diverse fleet of well-maintained vehicles, from luxury cars to practical SUVs.',
    icon: '🚗'
  },
  {
    title: 'Easy Booking',
    description: 'Simple and fast online reservation process. Book your vehicle in minutes.',
    icon: '📱'
  },
  {
    title: '24/7 Support',
    description: 'Round-the-clock customer service for your peace of mind.',
    icon: '🛟'
  },
  {
    title: 'Flexible Rentals',
    description: 'Daily, weekly, or monthly rentals available to suit your needs.',
    icon: '📅'
  },
  {
    title: 'Premium Service',
    description: 'Enjoy a premium experience with our professional and friendly service.',
    icon: '⭐'
  },
  {
    title: 'Best Rates',
    description: 'Competitive pricing with no hidden fees. Get the best value for your money.',
    icon: '💰'
  }
]; 