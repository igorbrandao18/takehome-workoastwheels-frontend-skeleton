import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

export interface VehicleImage {
  id: string;
  url: string;
  type: string;
  order: number;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  status: string;
  classification: string;
  pricePerHour: number;
  passengerCapacity: number;
  specs: string | null;
  features: string | null;
  images: VehicleImage[];
}

export interface VehicleOptions {
  makes: string[];
  classifications: string[];
  features: string[];
}

export const getVehicleOptions = async () => {
  const response = await api.get<VehicleOptions>('/vehicles/options');
  return response.data;
};

export const getVehicles = async (params: {
  classification?: string;
  make?: string;
  status?: string;
  minPassengers?: number;
  priceRange?: string;
  featured?: boolean;
}) => {
  const response = await api.get<Vehicle[]>('/vehicles/search', { params });
  return response.data;
};

export const getVehicle = async (id: string) => {
  const response = await api.get<Vehicle>(`/vehicles/${id}`);
  return response.data;
};

export { api };
export default api;