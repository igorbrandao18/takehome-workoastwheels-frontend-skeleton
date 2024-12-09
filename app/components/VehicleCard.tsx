import React, { memo } from 'react';
import { VehicleImage } from "./ui/VehicleImage";
import { VehicleFeatureTag } from "./ui/VehicleFeatureTag";
import { VehiclePrice } from "./ui/VehiclePrice";
import { Button } from "./ui/button";

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

export function VehicleCard({
  thumbnail,
  make,
  model,
  year,
  classification,
  price,
  features,
  onReserve,
}: VehicleCardProps) {
  return (
    <div className="group flex flex-col h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <VehicleImage
        src={thumbnail}
        alt={`${year} ${make} ${model}`}
      />
      
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {year} {make} {model}
          </h3>
          <p className="text-sm text-gray-500 capitalize">{classification}</p>
        </div>

        <div className="mt-2 mb-4">
          <VehiclePrice price={price} />
        </div>

        <div className="flex flex-wrap gap-2 mt-auto mb-4">
          {features.map((feature, index) => (
            <VehicleFeatureTag key={index}>
              {feature}
            </VehicleFeatureTag>
          ))}
        </div>

        <Button
          onClick={onReserve}
          className="w-full mt-auto"
          variant="default"
        >
          Reserve Now
        </Button>
      </div>
    </div>
  );
}

export default VehicleCard; 