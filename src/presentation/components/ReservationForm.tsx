import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

interface ReservationFormProps {
  vehicleId: string;
  pricePerHour: number;
}

export const ReservationForm = ({ vehicleId, pricePerHour }: ReservationFormProps) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return hours * pricePerHour;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/reservations', {
        vehicleId,
        startDate,
        endDate,
        status: 'ACTIVE'
      });
      navigate('/reservations');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create reservation. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const totalPrice = calculateTotalPrice();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <input
          type="datetime-local"
          id="startDate"
          value={startDate}
          min={today}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full p-2 border rounded-md"
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
          min={startDate || today}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="w-full p-2 border rounded-md"
        />
      </div>

      {startDate && endDate && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Price:</span>
            <span className="text-xl font-bold text-blue-600">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          loading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Creating Reservation...' : 'Reserve Now'}
      </button>
    </form>
  );
}; 