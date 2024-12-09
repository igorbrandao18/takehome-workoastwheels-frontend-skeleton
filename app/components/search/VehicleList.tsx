import { useEffect } from 'react';
import { useVehicleStore } from '../../store/vehicleStore';
import { useVehicleOptions, useVehicleSearch } from '../../hooks/useVehicles';
import VehicleCard from '../VehicleCard';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function VehicleList() {
  const { filters, setFilters } = useVehicleStore();
  
  const { 
    data: searchData, 
    isLoading: searchLoading,
    error: searchError 
  } = useVehicleSearch();

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage });
  };

  if (searchError) {
    return (
      <div className="text-center text-red-500">
        {searchError.message}
      </div>
    );
  }

  if (searchLoading) {
    return (
      <div className="text-center">
        Carregando...
      </div>
    );
  }

  // Garantir que searchData existe antes de renderizar
  if (!searchData?.data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchData.data.map((vehicle, index) => (
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
                price={`$${(vehicle.hourly_rate_cents / 100).toFixed(2)}/hr`}
                passengers={vehicle.max_passengers}
                features={[
                  `${vehicle.doors} doors`,
                  `${vehicle.max_passengers} passengers`,
                  vehicle.classification,
                  `${vehicle.year} model`
                ]}
                onReserve={() => {
                  console.log('Reserve vehicle:', vehicle.id);
                }}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {searchData.pagination && (
        <motion.div 
          className="flex justify-center gap-2 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(filters.page! - 1)}
            disabled={!searchData.pagination.hasPreviousPage}
            className="transition-all hover:scale-105"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(filters.page! + 1)}
            disabled={!searchData.pagination.hasNextPage}
            className="transition-all hover:scale-105"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}