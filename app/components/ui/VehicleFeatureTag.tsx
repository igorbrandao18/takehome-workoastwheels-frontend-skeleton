interface VehicleFeatureTagProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function VehicleFeatureTag({ children, icon }: VehicleFeatureTagProps) {
  return (
    <span className="
      inline-flex items-center gap-1.5 
      rounded-full bg-gray-100 px-2.5 py-0.5 
      text-xs font-medium text-gray-800
      transition-colors duration-200
      hover:bg-gray-200
    ">
      {icon && <span className="text-gray-500">{icon}</span>}
      {children}
    </span>
  );
} 