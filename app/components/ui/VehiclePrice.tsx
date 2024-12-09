import { cn } from "@/lib/utils";

interface VehiclePriceProps {
  price: string;
  size?: 'sm' | 'lg';
  highlighted?: boolean;
}

export function VehiclePrice({ price, size = 'lg', highlighted = false }: VehiclePriceProps) {
  return (
    <div className={`
      flex items-baseline 
      ${size === 'lg' ? 'text-2xl' : 'text-lg'}
      ${highlighted ? 'text-primary animate-pulse' : ''}
    `}>
      <span className="font-bold">{price}</span>
      <span className="text-gray-500 text-sm ml-1">/hr</span>
    </div>
  );
} 