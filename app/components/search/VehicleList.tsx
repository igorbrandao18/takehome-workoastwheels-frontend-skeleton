import { trpc } from "@/lib/trpc";
import { useFormContext } from "react-hook-form";
import { FormValues } from "./form";
import VehicleCard from "../VehicleCard";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  doors: number;
  max_passengers: number;
  classification: string;
  thumbnail_url: string;
  hourly_rate_cents: number;
}

export function VehicleList() {
  const { watch, setValue } = useFormContext<FormValues>();
  const formValues = watch();
  const [currentPage, setCurrentPage] = useState(formValues.page);

  const { data, isLoading, isError } = trpc.vehicles.search.useQuery({
    page: currentPage,
    limit: 10,
    startTime: formValues.startDate.toISOString(),
    endTime: formValues.endDate.toISOString(),
    passengerCount: formValues.minPassengers,
    classification: formValues.classification,
    make: formValues.make,
    priceMin: formValues.price[0],
    priceMax: formValues.price[1],
  }, {
    retry: false,
    onError: (error) => {
      console.error('Search error:', error);
    },
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setValue('page', newPage);
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-full h-[320px] rounded-xl shadow-md animate-pulse bg-gray-200" />
        ))}
      </div>
    );
  }

  if (isError || !data || data.vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700">No vehicles found</h2>
        <p className="text-gray-500 mt-2">Try adjusting your filters to see more results</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.vehicles.map((vehicle: Vehicle) => (
          <VehicleCard
            key={vehicle.id}
            thumbnail={vehicle.thumbnail_url}
            make={vehicle.make}
            model={vehicle.model}
            year={vehicle.year}
            classification={vehicle.classification}
            doors={vehicle.doors}
            price={formatPrice(vehicle.hourly_rate_cents)}
            passengers={vehicle.max_passengers}
            onReserve={() => {
              console.log('Reserve vehicle:', vehicle.id);
            }}
            features={[
              `${vehicle.doors} doors`,
              `${vehicle.max_passengers} passengers`,
              vehicle.classification,
              `${vehicle.year} model`
            ]}
          />
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!data.hasNextPage}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
