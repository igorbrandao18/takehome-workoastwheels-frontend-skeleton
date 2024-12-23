import { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
  classifications: string[];
  minPrice: number;
  maxPrice: number;
}

export interface FilterValues {
  priceRange: [number, number];
  classification: string;
  year: number | null;
  status: string;
  search: string;
}

export function VehicleFilter({ onFilterChange, classifications, minPrice, maxPrice }: FilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    priceRange: [minPrice, maxPrice],
    classification: '',
    year: null,
    status: '',
    search: ''
  });

  const handleFilterChange = (newFilters: Partial<FilterValues>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterValues = {
      priceRange: [minPrice, maxPrice],
      classification: '',
      year: null,
      status: '',
      search: ''
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange({ search: e.target.value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange({ year: e.target.value ? Number(e.target.value) : null });
  };

  const handleClassificationChange = (value: string) => {
    handleFilterChange({ classification: value === '_all' ? '' : value });
  };

  const handleStatusChange = (value: string) => {
    handleFilterChange({ status: value === '_all' ? '' : value });
  };

  const handlePriceRangeChange = (value: number[]) => {
    handleFilterChange({ priceRange: value as [number, number] });
  };

  return (
    <motion.div
      initial={false}
      animate={{ height: isExpanded ? 'auto' : '64px' }}
      className="bg-card rounded-lg p-4 mb-6 overflow-hidden"
    >
      {/* Barra de pesquisa sempre visível */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Buscar por modelo, marca..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-10"
          />
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Filtros expandidos */}
      <motion.div
        initial={false}
        animate={{ opacity: isExpanded ? 1 : 0 }}
        className="space-y-4"
      >
        {/* Faixa de Preço */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Faixa de Preço: R$ {filters.priceRange[0]} - R$ {filters.priceRange[1]}
          </label>
          <Slider
            min={minPrice}
            max={maxPrice}
            step={100}
            value={filters.priceRange}
            onValueChange={handlePriceRangeChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Classificação */}
          <div>
            <Select
              value={filters.classification}
              onValueChange={handleClassificationChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Classificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">Todas</SelectItem>
                {classifications.map((classification) => (
                  <SelectItem key={classification} value={classification}>
                    {classification.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ano */}
          <div>
            <Input
              type="number"
              placeholder="Ano"
              value={filters.year || ''}
              onChange={handleYearChange}
            />
          </div>

          {/* Status */}
          <div>
            <Select
              value={filters.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">Todos</SelectItem>
                <SelectItem value="AVAILABLE">Disponível</SelectItem>
                <SelectItem value="RESERVED">Reservado</SelectItem>
                <SelectItem value="MAINTENANCE">Em Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botão de Reset */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Limpar Filtros
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
} 