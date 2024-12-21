import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ThemeToggle';
import { UserNav } from './UserNav';

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">WorkoastWheels</span>
        </Link>

        <nav className="flex flex-1 items-center space-x-6">
          <Link to="/vehicles" className="text-sm font-medium transition-colors hover:text-primary">
            Vehicles
          </Link>
          {user && (
            <Link to="/reservations" className="text-sm font-medium transition-colors hover:text-primary">
              Reservations
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {user ? (
            <UserNav user={user} />
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 