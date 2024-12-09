import { useFormContext } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { FormValues } from "./form";
import { VehicleCard } from "../VehicleCard";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { combineDateAndTime } from "@/lib/utils";

export function VehicleList() {
  const { watch, setValue } = useFormContext<FormValues>();
  const formValues = watch();
  const currentPage = formValues.page || 1;

  const priceInCents = formValues.price 
    ? [formValues.price[0] * 100, formValues.price[1] * 100]
    : [2000, 5500]; // valores padrão em centavos ($20 - $55)

  const { data, isLoading, isError } = trpc.vehicles.search.useQuery({
    startTime: formValues.startDate ? formValues.startDate.toISOString() : '',
    endTime: formValues.endDate ? formValues.endDate.toISOString() : '',
    minPassengers: formValues.minPassengers || 1,
    classification: formValues.classification || [],
    make: formValues.make || [],
    price: priceInCents, // Enviando preços em centavos
    year: formValues.year ? { lte: Number(formValues.year) } : undefined,
    page: currentPage,
  }, {
    retry: false,
    onSuccess: (data) => {
      console.log('Vehicles Details:', data?.vehicles?.map(vehicle => ({
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        hourly_rate_cents: vehicle.hourly_rate_cents,
        hourly_rate_dollars: (vehicle.hourly_rate_cents / 100).toFixed(2),
        classification: vehicle.classification,
        max_passengers: vehicle.max_passengers,
        within_price_range: vehicle.hourly_rate_cents >= priceInCents[0] && 
                          vehicle.hourly_rate_cents <= priceInCents[1]
      })));
    },
    onError: (error) => {
      console.error('Query Error:', error);
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading vehicles. Please try again.</p>
      </div>
    );
  }

  const filteredVehicles = data?.vehicles.filter(vehicle => {
    const yearMatch = !formValues.year || vehicle.year <= formValues.year;
    
    const priceMatch = vehicle.hourly_rate_cents >= priceInCents[0] && 
                      vehicle.hourly_rate_cents <= priceInCents[1];
    
    return yearMatch && priceMatch;
  });

  if (!filteredVehicles?.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No vehicles found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <VehicleCard
                thumbnail={vehicle.thumbnail_url}
                make={vehicle.make}
                model={vehicle.model}
                year={vehicle.year}
                classification={vehicle.classification}
                doors={vehicle.doors}
                price={`$${(vehicle.hourly_rate_cents / 100).toFixed(2)}`}
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
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Pagination */}
      {data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setValue('page', currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setValue('page', currentPage + 1)}
            disabled={currentPage === data.pagination.totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
