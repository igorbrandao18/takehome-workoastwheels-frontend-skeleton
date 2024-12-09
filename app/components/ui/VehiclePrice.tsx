import { cn } from "@/lib/utils";

interface VehiclePriceProps {
  price: string;
  size?: 'sm' | 'md' | 'lg';
  highlighted?: boolean;
}

export function VehiclePrice({ price, size = 'md', highlighted = false }: VehiclePriceProps) {
  return (
    <div className={`
      inline-flex items-center rounded-full px-3 py-1
      ${highlighted ? 'bg-primary text-white' : 'bg-white text-primary'}
      ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}
      font-semibold shadow-sm
    `}>
      {price}/hr
    </div>
  );
} 