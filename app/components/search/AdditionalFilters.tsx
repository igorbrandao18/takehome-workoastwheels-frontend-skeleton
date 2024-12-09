import { useFormContext } from "react-hook-form";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FormValues } from "./form";
import { Label } from "../ui/label";
import { trpc } from "@/lib/trpc";

export function AdditionalFilters() {
  const { setValue, watch } = useFormContext<FormValues>();
  const formValues = watch();
  const { data: options } = trpc.vehicles.options.useQuery();

  // Lista estática de anos como fallback
  const years = [2020, 2021, 2022, 2023, 2024];
  const passengerCounts = [1, 2, 4, 6, 8];
  const doorCounts = [2, 4, 5];

  return (
    <div className="space-y-6">
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
            {passengerCounts.map((count) => (
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

      {/* Vehicle Year Filter */}
      <div className="space-y-2">
        <Label>Vehicle Year</Label>
        <Select
          value={String(formValues.year?.[0] || '')}
          onValueChange={(value) => setValue('year', value ? [Number(value)] : [])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Doors Filter */}
      <div className="space-y-2">
        <Label>Number of Doors</Label>
        <Select
          value={String(formValues.doors || '')}
          onValueChange={(value) => setValue('doors', Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select number of doors" />
          </SelectTrigger>
          <SelectContent>
            {doorCounts.map((doors) => (
              <SelectItem key={doors} value={String(doors)}>
                {doors} {doors === 1 ? 'door' : 'doors'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
