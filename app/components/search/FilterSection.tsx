import { useFormContext } from "react-hook-form";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { trpc } from "@/lib/trpc";
import { FormValues } from "./form";
import { Label } from "../ui/label";
import { RotateCcw, Users, Car, DollarSign, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVehicleStore } from "../../store/vehicleStore";

export function FilterSection() {
  const { setValue, watch, reset } = useFormContext<FormValues>();
  const formValues = watch();
  const vehicleYears = useVehicleStore((state) => state.vehicleYears);

  const defaultValues = {
    minPassengers: 1,
    classification: [],
    make: [],
    price: [20, 47],
    year: [],
    doors: undefined,
    page: 1,
    startTime: "",
    endTime: "",
    startDate: new Date(),
    endDate: new Date()
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  const FilterLabel = ({ icon: Icon, children }: { icon: any, children: React.ReactNode }) => (
    <div className="flex items-center gap-2 text-sm font-medium">
      <Icon className="w-4 h-4 text-muted-foreground" />
      {children}
    </div>
  );

  const classifications = [
    "Compact",
    "SUV",
    "Luxury",
    "Sports",
    "Off-Road SUV",
    "Luxury SUV",
    "Subcompact"
  ];

  const makes = [
    "Toyota",
    "Honda",
    "Ford",
    "Chevrolet",
    "Nissan",
    "Hyundai",
    "Mercedes-Benz",
    "BMW",
    "Jeep"
  ];

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="text-sm hover:bg-gray-100 transition-colors"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <FilterLabel icon={DollarSign}>
          Hourly Price Range (${formValues.price?.[0]} - ${formValues.price?.[1]})
        </FilterLabel>
        <Slider
          defaultValue={[20, 47]}
          min={20}
          max={47}
          step={1}
          value={formValues.price}
          onValueChange={(value) => setValue('price', value)}
          className="mt-2"
        />
      </div>

      {/* Passenger Count Filter */}
      <div className="space-y-3">
        <FilterLabel icon={Users}>Minimum Passengers</FilterLabel>
        <Select
          value={String(formValues.minPassengers)}
          onValueChange={(value) => setValue('minPassengers', Number(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select minimum passengers" />
          </SelectTrigger>
          <SelectContent>
            {[2, 4, 5, 7].map((count) => (
              <SelectItem 
                key={count} 
                value={String(count)}
                className={cn(
                  "cursor-pointer transition-colors",
                  formValues.minPassengers === count && "bg-primary/5"
                )}
              >
                {count} passengers
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vehicle Classification Filter */}
      <div className="space-y-3">
        <FilterLabel icon={Car}>Vehicle Classification</FilterLabel>
        <Select
          value={formValues.classification?.[0] || ''}
          onValueChange={(value) => setValue('classification', value ? [value] : [])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select classification" />
          </SelectTrigger>
          <SelectContent>
            {classifications.map((classification) => (
              <SelectItem 
                key={classification} 
                value={classification}
                className={cn(
                  "cursor-pointer transition-colors",
                  formValues.classification?.[0] === classification && "bg-primary/5"
                )}
              >
                {classification}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vehicle Make Filter */}
      <div className="space-y-3">
        <FilterLabel icon={Car}>Vehicle Make</FilterLabel>
        <Select
          value={formValues.make?.[0] || ''}
          onValueChange={(value) => setValue('make', value ? [value] : [])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent>
            {makes.map((make) => (
              <SelectItem 
                key={make} 
                value={make}
                className={cn(
                  "cursor-pointer transition-colors",
                  formValues.make?.[0] === make && "bg-primary/5"
                )}
              >
                {make}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vehicle Year Filter */}
      <div className="space-y-3">
        <FilterLabel icon={Calendar}>Vehicle Year</FilterLabel>
        <Select
          value={String(formValues.maxYear || '')}
          onValueChange={(value) => setValue('maxYear', value ? Number(value) : undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {vehicleYears.map((year) => (
              <SelectItem 
                key={year} 
                value={String(year)}
                className={cn(
                  "cursor-pointer transition-colors",
                  formValues.maxYear === year && "bg-primary/5"
                )}
              >
                {year} and older
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 