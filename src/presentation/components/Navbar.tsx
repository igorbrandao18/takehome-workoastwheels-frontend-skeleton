import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            WorkoastWheels
          </Link>

          <div className="flex space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${isActive('/')}`}
            >
              Home
            </Link>
            <Link
              to="/vehicles"
              className={`font-medium transition-colors ${isActive('/vehicles')}`}
            >
              Vehicles
            </Link>
            <Link
              to="/reservations"
              className={`font-medium transition-colors ${isActive('/reservations')}`}
            >
              My Reservations
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}; 