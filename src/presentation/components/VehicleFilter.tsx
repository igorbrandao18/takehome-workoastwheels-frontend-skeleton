import { useState, useEffect } from 'react';
import { Slider } from '@mui/material';
import { getVehicleOptions } from '../../lib/api';

interface FilterProps {
  filters: {
    classification: string;
    priceRange: string;
    status: string;
    make: string;
    minPassengers: number;
  };
  onFilterChange: (filters: any) => void;
}

export const VehicleFilter = ({ filters, onFilterChange }: FilterProps) => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [makes, setMakes] = useState<string[]>([]);
  const [classifications, setClassifications] = useState<string[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await getVehicleOptions();
        setMakes(data.makes);
        setClassifications(data.classifications);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange(newValue);
      onFilterChange({
        ...filters,
        priceRange: `${newValue[0]}-${newValue[1]}`
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      
      {/* Make Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Make
        </label>
        <select
          value={filters.make}
          onChange={(e) => onFilterChange({ ...filters, make: e.target.value })}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All Makes</option>
          {makes.map(make => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>
      </div>

      {/* Classification Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vehicle Class
        </label>
        <select
          value={filters.classification}
          onChange={(e) => onFilterChange({ ...filters, classification: e.target.value })}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All Classes</option>
          {classifications.map(classification => (
            <option key={classification} value={classification}>
              {classification.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price per Hour (${priceRange[0]} - ${priceRange[1]})
        </label>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={500}
          step={10}
        />
      </div>

      {/* Minimum Passengers Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Minimum Passengers
        </label>
        <select
          value={filters.minPassengers}
          onChange={(e) => onFilterChange({ ...filters, minPassengers: Number(e.target.value) })}
          className="w-full p-2 border rounded-md"
        >
          <option value={0}>Any</option>
          <option value={2}>2+</option>
          <option value={4}>4+</option>
          <option value={5}>5+</option>
          <option value={7}>7+</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All</option>
          <option value="AVAILABLE">Available</option>
          <option value="RESERVED">Reserved</option>
          <option value="MAINTENANCE">In Maintenance</option>
        </select>
      </div>
    </div>
  );
}; 