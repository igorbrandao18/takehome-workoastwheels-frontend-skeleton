import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';

interface VehicleFilterProps {
  filters: {
    classification: string;
    priceRange: string;
    status: string;
  };
  onFilterChange: (filters: {
    classification: string;
    priceRange: string;
    status: string;
  }) => void;
}

const CLASSIFICATIONS = [
  { value: '', label: 'All Classifications' },
  { value: 'LUXURY', label: 'Luxury' },
  { value: 'SPORTS', label: 'Sports' },
  { value: 'SUPER_SPORTS', label: 'Super Sports' },
  { value: 'ELECTRIC_PERFORMANCE', label: 'Electric Performance' },
  { value: 'LUXURY_SUV', label: 'Luxury SUV' },
  { value: 'ULTRA_LUXURY_SUV', label: 'Ultra Luxury SUV' },
  { value: 'SUPER_SUV', label: 'Super SUV' },
  { value: 'ELECTRIC_LUXURY', label: 'Electric Luxury' },
  { value: 'CLASSIC_EXOTIC', label: 'Classic Exotic' },
  { value: 'HYPER_SPORTS', label: 'Hyper Sports' }
];

const PRICE_RANGES = [
  { value: '', label: 'All Prices' },
  { value: '0-500', label: 'Up to $500/day' },
  { value: '501-1000', label: '$501 - $1,000/day' },
  { value: '1001-2000', label: '$1,001 - $2,000/day' },
  { value: '2001-5000', label: '$2,001 - $5,000/day' },
  { value: '5001-999999', label: 'Above $5,000/day' }
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'MAINTENANCE', label: 'In Maintenance' },
  { value: 'RESERVED', label: 'Reserved' }
];

export const VehicleFilter = ({ filters, onFilterChange }: VehicleFilterProps) => {
  const handleChange = (field: keyof typeof filters) => (value: string) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Classification Filter */}
        <div className="space-y-2">
          <Label htmlFor="classification">Classification</Label>
          <Select
            value={filters.classification}
            onValueChange={handleChange('classification')}
          >
            <SelectTrigger id="classification">
              <SelectValue placeholder="Select classification" />
            </SelectTrigger>
            <SelectContent>
              {CLASSIFICATIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-2">
          <Label htmlFor="priceRange">Price Range</Label>
          <Select
            value={filters.priceRange}
            onValueChange={handleChange('priceRange')}
          >
            <SelectTrigger id="priceRange">
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={handleChange('status')}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}; 