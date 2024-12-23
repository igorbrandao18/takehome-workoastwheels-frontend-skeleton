import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservations } from '../../application/hooks/useReservations';

interface ReservationFormProps {
  vehicleId: string;
  pricePerDay: number;
}

export const ReservationForm = ({ vehicleId, pricePerDay }: ReservationFormProps) => {
  const navigate = useNavigate();
  const { createReservation } = useReservations();
  const [dates, setDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotalDays = () => {
    if (!dates.startDate || !dates.endDate) return 0;
    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalDays = calculateTotalDays();
  const totalPrice = totalDays * pricePerDay;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!dates.startDate || !dates.endDate) {
        throw new Error('Please select both start and end dates');
      }

      const startDate = new Date(dates.startDate);
      const endDate = new Date(dates.endDate);
      const today = new Date();

      if (startDate < today) {
        throw new Error('Start date cannot be in the past');
      }

      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }

      await createReservation({
        vehicleId,
        startDate: dates.startDate,
        endDate: dates.endDate
      });

      navigate('/reservations');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create reservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDates(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={dates.startDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={dates.endDate}
            onChange={handleDateChange}
            min={dates.startDate || new Date().toISOString().split('T')[0]}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {totalDays > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Price per day:</span>
            <span>${pricePerDay}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Number of days:</span>
            <span>{totalDays}</span>
          </div>
          <div className="flex justify-between font-bold mt-2 text-lg">
            <span>Total price:</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating Reservation...' : 'Reserve Now'}
      </button>
    </form>
  );
}; 