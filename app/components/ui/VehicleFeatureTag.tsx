import { ReactNode } from 'react';

interface VehicleFeatureTagProps {
  icon?: ReactNode;
  children: ReactNode;
}

export function VehicleFeatureTag({ icon, children }: VehicleFeatureTagProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
      {icon}
      {children}
    </span>
  );
} 