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

  console.log('Price Range:', formValues.price); // Deve mostrar um array [min, max]

  const { data, isLoading, isError } = trpc.vehicles.search.useQuery({
    startTime: formValues.startTime ? combineDateAndTime(formValues.startDate, formValues.startTime) : '',
    endTime: formValues.endTime ? combineDateAndTime(formValues.endDate, formValues.endTime) : '',
    minPassengers: formValues.minPassengers,
    classification: formValues.classification,
    make: formValues.make,
    price: formValues.price,
    year: formValues.year,
    doors: formValues.doors,
    page: currentPage,
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

  if (!data?.vehicles.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No vehicles found matching your criteria.</p>
      </div>
    );
  }

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="space-y-6">
      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.vehicles.map((vehicle, index) => (
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
