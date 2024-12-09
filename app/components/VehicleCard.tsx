import React, { memo } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

interface VehicleCardProps {
  thumbnail: string;
  make: string;
  model: string;
  price: number;
  passengers: number;
  onReserve: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = memo(({ 
  thumbnail, 
  make, 
  model, 
  price, 
  passengers, 
  onReserve 
}) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={thumbnail} 
            alt={`${make} ${model}`} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
            loading="lazy" 
          />
          <Badge 
            className="absolute top-2 right-2 bg-black/75 hover:bg-black/75"
          >
            ${price}/hr
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold tracking-tight">
          {make} {model}
        </h2>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {passengers} passengers
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          onClick={onReserve}
          aria-label={`Reserve ${make} ${model}`}
        >
          Reserve now
        </Button>
      </CardFooter>
    </Card>
  );
});

VehicleCard.displayName = 'VehicleCard';

export default VehicleCard; 