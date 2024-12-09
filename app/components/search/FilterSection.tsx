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

  const availableYears = [2020, 2021, 2022, 2023, 2024];

  const defaultValues = {
    minPassengers: 1,
    classification: [],
    make: [],
    price: [20, 55],
    year: undefined,
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

  if (isLoading) {
    return <p>Loading filters...</p>;
  }

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="text-sm hover:bg-gray-100"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Hourly Price Range (${formValues.price?.[0]} - ${formValues.price?.[1]})
        </Label>
        <Slider
          defaultValue={[20, 55]}
          min={20}
          max={55}
          step={5}
          value={formValues.price || [20, 55]}
          onValueChange={(value) => {
            setValue('price', value);
          }}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Minimum Passengers
        </Label>
        <Select
          value={String(formValues.minPassengers)}
          onValueChange={(value) => setValue('minPassengers', Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select minimum passengers" />
          </SelectTrigger>
          <SelectContent>
            {[4, 5, 8].map((count) => (
              <SelectItem 
                key={count} 
                value={String(count)}
                className={cn(
                  "cursor-pointer",
                  formValues.minPassengers === count && "bg-primary/5"
                )}
              >
                {count} passengers
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Car className="w-4 h-4" />
          Vehicle Classification
        </Label>
        <Select
          value={formValues.classification?.[0] || ''}
          onValueChange={(value) => setValue('classification', value ? [value] : [])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select classification" />
          </SelectTrigger>
          <SelectContent>
            {options?.classifications.map((classification) => (
              <SelectItem 
                key={classification} 
                value={classification}
                className={cn(
                  "cursor-pointer",
                  formValues.classification?.[0] === classification && "bg-primary/5"
                )}
              >
                {classification}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Car className="w-4 h-4" />
          Vehicle Make
        </Label>
        <Select
          value={formValues.make?.[0] || ''}
          onValueChange={(value) => setValue('make', value ? [value] : [])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent>
            {options?.makes.map((make) => (
              <SelectItem 
                key={make} 
                value={make}
                className={cn(
                  "cursor-pointer",
                  formValues.make?.[0] === make && "bg-primary/5"
                )}
              >
                {make}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Vehicle Year
        </Label>
        <Select
          value={String(formValues.year || '')}
          onValueChange={(value) => setValue('year', Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem 
                key={year} 
                value={String(year)}
                className={cn(
                  "cursor-pointer",
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