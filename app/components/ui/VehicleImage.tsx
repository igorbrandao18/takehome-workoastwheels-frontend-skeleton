import { cn } from "@/lib/utils";

interface VehicleImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function VehicleImage({ src, alt, className = '' }: VehicleImageProps) {
  return (
    <div className={`relative aspect-[16/9] overflow-hidden rounded-t-lg ${className}`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
} 