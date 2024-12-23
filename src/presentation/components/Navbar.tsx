import { Link } from 'react-router-dom';
import { useAuth } from '../../application/hooks/useAuth';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            WorkoastWheels
          </Link>
          
          <div className="flex space-x-4">
            <Link to="/vehicles" className="text-gray-700 hover:text-gray-900">
              Vehicles
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/reservations" className="text-gray-700 hover:text-gray-900">
                  Reservations
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-gray-900">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-gray-900">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}; 