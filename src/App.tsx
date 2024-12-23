import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './presentation/pages/Home';
import { Vehicles } from './presentation/pages/Vehicles';
import { VehicleDetails } from './presentation/pages/VehicleDetails';
import { Reservations } from './presentation/pages/Reservations';
import { Navbar } from './presentation/components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicles/:id" element={<VehicleDetails />} />
            <Route path="/reservations" element={<Reservations />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 