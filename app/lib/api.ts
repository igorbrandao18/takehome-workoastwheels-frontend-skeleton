import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  doors: number;
  max_passengers: number;
  classification: string;
  thumbnail_url: string;
  hourly_rate_cents: number;
}

export interface VehicleFilters {
  startTime: string;
  endTime: string;
  minPassengers?: number;
  classification?: string[];
  make?: string[];
  price?: [number, number];
  maxYear?: number;
  doors?: number;
  page?: number;
  perPage?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'year_desc' | 'year_asc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const vehicleApi = {
  async getOptions() {
    const { data } = await api.get('/vehicles/options');
    return data;
  },

  async searchVehicles(filters: VehicleFilters): Promise<PaginatedResponse<Vehicle>> {
    const { data } = await api.get('/vehicles/search', { params: filters });
    return data;
  },
};

export default api; 