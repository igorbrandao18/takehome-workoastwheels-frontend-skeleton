import React from 'react';
import { useFormContext } from "react-hook-form";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FormValues } from "./form";
import { Label } from "../ui/label";
import { useVehicleStore } from "../../store/vehicleStore";
import { useVehicleOptions } from '../../hooks/useVehicles';

export function AdditionalFilters() {
  const { setValue, watch } = useFormContext<FormValues>(); 
  const formValues = watch();
  const { data: optionsData, isLoading, error } = useVehicleOptions();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erro ao carregar opções: {error.message}</div>;
  }

  const vehicleYears = optionsData?.years || [];

  // Dados estáticos para os outros filtros
  const passengerCounts = [1, 2, 4, 6, 8];
  const doorCounts = [2, 4, 5];
  const classifications = ["SUV", "Sedan", "Compact", "Luxury", "Electric"];
  const makes = ["Toyota", "Honda", "Ford", "BMW", "Tesla", "Nissan"];

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
            {classifications.map((classification) => (
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
            {makes.map((make) => (
              <SelectItem key={make} value={make}>
                {make}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Filter */}
      <div className="space-y-2">
        <Label>Vehicle Year</Label>
        <Select
          value={String(formValues.maxYear || '')}
          onValueChange={(value) => {
            const yearValue = value ? Number(value) : undefined;
            setValue('maxYear', yearValue);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {vehicleYears.length > 0 ? (
              vehicleYears.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year} and older
                </SelectItem>
              ))
            ) : (
              <SelectItem value="Nenhum ano disponível">Nenhum ano disponível</SelectItem>
            )}
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
