import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  Users, 
  DoorOpen, 
  Car, 
  Calendar, 
  Tag, 
  Fuel, 
  Star, 
  Shield, 
  Sparkles,
  BatteryCharging,
  MapPin
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  thumbnail: string;
  make: string;
  model: string;
  year: number;
  classification: string;
  price: string;
  passengers: number;
  doors: number;
  features: string[];
  onReserve: () => void;
}

export function VehicleCard({
  thumbnail,
  make,
  model,
  year,
  classification,
  price,
  passengers,
  doors,
  features,
  onReserve,
}: VehicleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getClassificationIcon = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'electric':
        return <BatteryCharging className="w-4 h-4" />;
      case 'luxury':
        return <Sparkles className="w-4 h-4" />;
      case 'suv':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Car className="w-4 h-4" />;
    }
  };

  return (
    <Card 
      className={cn(
        "h-full flex flex-col transition-all duration-300",
        isHovered ? "shadow-xl transform -translate-y-1" : "shadow-md"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
          <motion.img
            src={thumbnail}
            alt={`${make} ${model}`}
            className="object-cover w-full h-full"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          <motion.div 
            className="absolute top-2 right-2"
            animate={{ scale: isHovered ? 1.05 : 1 }}
          >
            <Badge variant="secondary" className="text-lg font-semibold bg-white/90 backdrop-blur-sm shadow-lg">
              {price}/hr
            </Badge>
          </motion.div>

          <motion.div 
            className="absolute bottom-2 left-2 right-2 flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          >
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              {getClassificationIcon(classification)}
              <span className="ml-1">{classification}</span>
            </Badge>
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              4.8 (120)
            </Badge>
          </motion.div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold flex items-center justify-between">
            <span>{year} {make} {model}</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <motion.div 
              className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm">{passengers} passengers</span>
            </motion.div>

            <motion.div 
              className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <DoorOpen className="w-4 h-4 text-gray-600" />
              <span className="text-sm">{doors} doors</span>
            </motion.div>

            <motion.div 
              className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <Shield className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Insurance included</span>
            </motion.div>

            <motion.div 
              className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <Fuel className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Full tank</span>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
            >
              <Badge 
                variant="outline" 
                className="text-xs bg-gray-50 hover:bg-gray-100 transition-colors cursor-default"
              >
                <Tag className="w-3 h-3 mr-1" />
                {feature}
              </Badge>
            </motion.div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <motion.div 
          className="w-full"
          whileHover={{ scale: 1.02 }}
        >
          <Button 
            onClick={onReserve} 
            className="w-full font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          >
            Reserve Now
            <motion.span
              className="ml-2"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
} 