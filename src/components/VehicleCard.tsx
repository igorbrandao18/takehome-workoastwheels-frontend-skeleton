import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Share2, Info, ChevronLeft, ChevronRight } from 'lucide-react';

interface VehicleCardProps {
  vehicle: {
    id: string;
    model: string;
    year: number;
    status: string;
    classification: string;
    pricePerDay: number;
    specs: string | null;
    images: { url: string; type: string }[];
  };
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <Card className="overflow-hidden bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="relative h-48 overflow-hidden group">
          <AnimatePresence initial={false} custom={currentImageIndex}>
            <motion.img
              key={currentImageIndex}
              src={vehicle.images[currentImageIndex]?.url}
              alt={`${vehicle.model} - ${vehicle.images[currentImageIndex]?.type}`}
              className="h-full w-full object-cover"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          {/* Controles do carrossel */}
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
              className="p-1 rounded-full bg-black/50 text-white backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="p-1 rounded-full bg-black/50 text-white backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Overlay com informações da imagem */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent"
          >
            <p className="text-xs text-white">
              {vehicle.images[currentImageIndex]?.type.replace(/-/g, ' ').toUpperCase()}
            </p>
          </motion.div>

          {/* Indicadores de imagem */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {vehicle.images.map((_, index) => (
              <motion.button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  currentImageIndex === index 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          <Badge
            className="absolute right-2 top-2 z-10"
            variant={vehicle.status === 'AVAILABLE' ? 'success' : 'destructive'}
          >
            {vehicle.status}
          </Badge>
        </div>

        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">{vehicle.model}</CardTitle>
            <Badge variant="outline">{vehicle.year}</Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{vehicle.classification}</span>
              <span className="text-2xl font-bold">
                R$ {vehicle.pricePerDay}/dia
              </span>
            </div>

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {vehicle.specs && (
                <p className="text-sm text-muted-foreground">{vehicle.specs}</p>
              )}
            </motion.div>

            <div className="flex gap-2">
              <Button 
                className="flex-1"
                onClick={() => navigate(`/vehicles/${vehicle.id}`)}
              >
                Reservar
              </Button>
              <Button 
                variant="outline"
                size="icon"
                onClick={() => navigate(`/vehicles/${vehicle.id}`)}
              >
                <Info className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 