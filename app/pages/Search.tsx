import { FilterSection } from "../components/search/FilterSection";
import { VehicleList } from "../components/search/VehicleList";

export function Search() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filtros */}
        <div className="md:col-span-1">
          <FilterSection />
        </div>
        
        {/* Lista de veículos */}
        <div className="md:col-span-3">
          <VehicleList />
        </div>
      </div>
    </div>
  );
}