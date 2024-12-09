import { useFormContext } from "react-hook-form";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { trpc } from "@/lib/trpc";
import { FormValues } from "./form";
import { Label } from "../ui/label";
import { RotateCcw, Users, Car, DollarSign, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export function FilterSection() {
  const { setValue, watch, reset } = useFormContext<FormValues>();
  const formValues = watch();
  const { data: options, isLoading } = trpc.vehicles.options.useQuery();

  const defaultValues = {
    minPassengers: 1,
    classification: [],
    make: [],
    price: [10, 100],
    year: undefined,
    doors: undefined,
    page: 1
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
          defaultValue={[10, 100]}
          min={10}
          max={100}
          step={5}
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
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select minimum passengers" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 4, 6, 8].map((count) => (
              <SelectItem 
                key={count} 
                value={String(count)}
                className={cn(
                  "cursor-pointer transition-colors",
                  formValues.minPassengers === count && "bg-primary/5"
                )}
              >
                {count} {count === 1 ? 'passenger' : 'passengers'}
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
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select classification" />
          </SelectTrigger>
          <SelectContent>
            {options?.classifications.map((classification: string) => (
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
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent>
            {options?.makes.map((make: string) => (
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
          value={String(formValues.year || '')}
          onValueChange={(value) => {
            setValue('year', Number(value));
            setValue('page', 1);
          }}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {options?.years?.map((year: number) => (
              <SelectItem 
                key={year} 
                value={String(year)}
                className={cn(
                  "cursor-pointer transition-colors",
                  formValues.year === year && "bg-primary/5"
                )}
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 