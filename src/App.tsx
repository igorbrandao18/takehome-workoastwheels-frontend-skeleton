import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './presentation/layouts/Layout';
import { Home } from './presentation/pages/Home';
import { Vehicles } from './presentation/pages/Vehicles';
import { VehicleDetails } from './presentation/pages/VehicleDetails';
import { Reservations } from './presentation/pages/Reservations';
import { NotFound } from './presentation/pages/NotFound';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './presentation/components/ErrorFallback';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="vehicles/:id" element={<VehicleDetails />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 