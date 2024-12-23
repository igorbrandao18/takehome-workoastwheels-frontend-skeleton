import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Layout } from './presentation/layouts/Layout';
import { Home } from './presentation/pages/Home';
import { Vehicles } from './presentation/pages/Vehicles';
import { VehicleDetails } from './presentation/pages/VehicleDetails';
import { Reservations } from './presentation/pages/Reservations';
import { Profile } from './presentation/pages/Profile';
import { Login } from './presentation/pages/Login';
import { Register } from './presentation/pages/Register';
import { NotFound } from './presentation/pages/NotFound';
import { ErrorFallback } from './presentation/components/ErrorFallback';
import { PrivateRoute } from './presentation/components/PrivateRoute';

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="vehicles/:id" element={<VehicleDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="reservations"
            element={
              <PrivateRoute>
                <Reservations />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
} 