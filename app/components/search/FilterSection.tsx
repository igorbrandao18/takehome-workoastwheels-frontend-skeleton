import { useFormContext } from "react-hook-form";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { trpc } from "@/lib/trpc";
import { FormValues } from "./form";
import { Label } from "../ui/label";
import { RotateCcw } from "lucide-react";

export function FilterSection() {
  const { register, setValue, watch, reset } = useFormContext<FormValues>();
  const formValues = watch();

  const { data: options } = trpc.vehicles.options.useQuery();

  const defaultValues = {
    minPassengers: 1,
    classification: [],
    make: [],
    price: [10, 100],
    page: 1
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="text-sm"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2">
        <Label>Hourly Price Range (${formValues.price?.[0]} - ${formValues.price?.[1]})</Label>
        <Slider
          defaultValue={[10, 100]}
          min={10}
          max={100}
          step={5}
          value={formValues.price}
          onValueChange={(value) => setValue('price', value)}
        />
      </div>

      {/* Passenger Count Filter */}
      <div className="space-y-2">
        <Label>Minimum Passengers</Label>
        <Select
          value={String(formValues.minPassengers)}
          onValueChange={(value) => setValue('minPassengers', Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select minimum passengers" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 4, 6, 8].map((count) => (
              <SelectItem key={count} value={String(count)}>
                {count} {count === 1 ? 'passenger' : 'passengers'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vehicle Classification Filter */}
      <div className="space-y-2">
        <Label>Vehicle Classification</Label>
        <Select
          value={formValues.classification?.[0] || ''}
          onValueChange={(value) => setValue('classification', value ? [value] : [])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select classification" />
          </SelectTrigger>
          <SelectContent>
            {options?.classifications.map((classification) => (
              <SelectItem key={classification} value={classification}>
                {classification}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vehicle Make Filter */}
      <div className="space-y-2">
        <Label>Vehicle Make</Label>
        <Select
          value={formValues.make?.[0] || ''}
          onValueChange={(value) => setValue('make', value ? [value] : [])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent>
            {options?.makes.map((make) => (
              <SelectItem key={make} value={make}>
                {make}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 