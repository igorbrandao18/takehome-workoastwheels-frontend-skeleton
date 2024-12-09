import React, { memo } from 'react';
import { VehicleImage } from "./ui/VehicleImage";
import { VehicleFeatureTag } from "./ui/VehicleFeatureTag";
import { VehiclePrice } from "./ui/VehiclePrice";
import { Button } from "./ui/button";
import { Users, DoorOpen, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative">
        <VehicleImage
          src={thumbnail}
          alt={`${year} ${make} ${model}`}
        />
        <div className="absolute top-3 right-3">
          <VehiclePrice 
            price={price} 
            size="lg"
            highlighted={true}
          />
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {year} {make} {model}
          </h3>
          <p className="text-sm text-gray-500 capitalize flex items-center gap-1">
            <Tag size={14} />
            {classification}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto mb-4">
          {features.includes(`${year} model`) && (
            <VehicleFeatureTag icon={<Calendar size={12} />}>
              {year} model
            </VehicleFeatureTag>
          )}
          {features.some(f => f.includes('doors')) && (
            <VehicleFeatureTag icon={<DoorOpen size={12} />}>
              {features.find(f => f.includes('doors'))}
            </VehicleFeatureTag>
          )}
          {features.some(f => f.includes('passengers')) && (
            <VehicleFeatureTag icon={<Users size={12} />}>
              {features.find(f => f.includes('passengers'))}
            </VehicleFeatureTag>
          )}
        </div>

        <Button
          onClick={onReserve}
          className="w-full mt-auto group-hover:bg-primary/90 transition-colors"
          variant="default"
        >
          <span className="mr-2">Reserve Now</span>
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </Button>
      </div>
    </motion.div>
  );
}

export default VehicleCard; 