import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface Vehicle {
  id: string;
  model: string;
  plate: string;
  year: number;
  status: string;
  classification: string;
  pricePerDay: number;
  specs: string | null;
  features: string | null;
  images: {
    id: string;
    url: string;
    type: string;
    order: number;
  }[];
}

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadVehicles() {
      try {
        const response = await api.get('/vehicles');
        setVehicles(response.data);
      } catch (error) {
        console.error('Error loading vehicles:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadVehicles();
  }, []);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nossos Veículos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {vehicle.images.length > 0 && (
              <img 
                src={vehicle.images[0].url} 
                alt={vehicle.model}
                className="w-full h-48 object-cover"
              />
            )}
            
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{vehicle.model}</h2>
              <p className="text-gray-600 mb-2">Ano: {vehicle.year}</p>
              <p className="text-gray-600 mb-4">Classificação: {vehicle.classification}</p>
              <p className="text-2xl font-bold text-blue-600">
                R$ {vehicle.pricePerDay}/dia
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 