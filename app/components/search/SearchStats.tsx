import { useFormContext } from "react-hook-form";
import { FormValues } from "./form";

export function SearchStats() {
  const { watch } = useFormContext<FormValues>();
  const formValues = watch();

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-white rounded-lg shadow-sm mb-6">
      <div className="text-sm text-muted-foreground">
        Searching available vehicles...
      </div>
      <div className="flex items-center gap-4">
        <select className="text-sm border rounded-md px-2 py-1">
          <option>Sort by: Recommended</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Passenger Capacity</option>
        </select>
      </div>
    </div>
  );
} 