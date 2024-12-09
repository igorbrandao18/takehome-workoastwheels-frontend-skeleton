import { useState } from 'react';
import { cn } from "@/lib/utils";

interface VehicleImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function VehicleImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
      />
    </div>
  );
} 