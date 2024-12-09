import React, { memo } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

interface VehicleCardProps {
  thumbnail: string;
  make: string;
  model: string;
  year: number;
  classification: string;
  doors: number;
  price: string;
  passengers: number;
  features: string[];
  onReserve: () => void;
}

export default function VehicleCard({
  thumbnail,
  make,
  model,
  year,
  classification,
  doors,
  price,
  passengers,
  features,
  onReserve,
}: VehicleCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img
          src={thumbnail}
          alt={`${make} ${model}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          {price}/hr
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {year} {make} {model}
          </h3>
          <p className="text-sm text-gray-500">{classification}</p>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onReserve}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Reserve Now
        </button>
      </div>
    </div>
  );
} 