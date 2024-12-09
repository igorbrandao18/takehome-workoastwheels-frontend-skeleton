import { trpc } from "@/lib/trpc";
import { useFormContext } from "react-hook-form";
import { FormValues } from "./form";
import VehicleCard from "../VehicleCard";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';

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

  // Função para combinar data e hora em formato ISO
  const combineDateAndTime = (date: Date, timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours, 10));
    newDate.setMinutes(parseInt(minutes, 10));
    return newDate.toISOString();
  };

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
  }, {
    retry: false,
    onError: (error) => {
      console.error('Search error:', error);
    },
    onSuccess: (data) => {
      console.log('Search results:', {
        filters: formValues,
        results: data
      });
    }
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
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: i * 0.1 }}
            className="w-full h-[420px] rounded-xl shadow-md animate-pulse bg-gray-200"
          />
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
      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {data.vehicles.map((vehicle: Vehicle, index: number) => (
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

      <motion.div 
        className="flex justify-center gap-2 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="transition-all hover:scale-105"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!data.hasNextPage}
          className="transition-all hover:scale-105"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
