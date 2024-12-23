import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ReservationFormProps {
  vehicleId: string;
  pricePerHour: number;
}

interface Reservation {
  id: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}

export const ReservationForm = ({ vehicleId, pricePerHour }: ReservationFormProps) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInHours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return diffInHours * pricePerHour;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      const now = new Date();

      if (start < now) {
        throw new Error('Start date must be in the future');
      }

      if (end <= start) {
        throw new Error('End date must be after start date');
      }

      const totalPrice = calculateTotalPrice();

      // Create reservation object
      const reservation: Omit<Reservation, 'id'> = {
        vehicleId,
        startDate,
        endDate,
        totalPrice,
        status: 'PENDING'
      };

      // Get existing reservations from localStorage
      const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      
      // Add new reservation with a generated ID
      const newReservation = {
        ...reservation,
        id: crypto.randomUUID()
      };
      
      // Save to localStorage
      localStorage.setItem(
        'reservations',
        JSON.stringify([...existingReservations, newReservation])
      );

      // Navigate to reservations page
      navigate('/reservations', {
        state: { message: 'Reservation created successfully!' }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = calculateTotalPrice();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="datetime-local"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="datetime-local"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || new Date().toISOString().slice(0, 16)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {totalPrice > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Price:</span>
            <span className="text-xl font-bold text-blue-600">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60))} hours
            at ${pricePerHour}/hour
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Creating Reservation...' : 'Reserve Now'}
      </button>
    </form>
  );
}; 