import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { VehicleImage } from "./ui/VehicleImage";
import { VehicleFeatureTag } from "./ui/VehicleFeatureTag";
import { VehiclePrice } from "./ui/VehiclePrice";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  DoorOpen, 
  Calendar, 
  Tag, 
  Car,
  Fuel,
  Shield,
  Star,
  BatteryCharging,
  MapPin,
  Sparkles,
  Check,
  Info,
  ArrowRight,
  Clock,
  Banknote,
  ThumbsUp
} from 'lucide-react';
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface VehicleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
    thumbnail: string;
    make: string;
    model: string;
    year: number;
    classification: string;
    doors: number;
    price: string;
    passengers: number;
    features: string[];
  };
  onReserve: () => void;
}

export function VehicleDetailsModal({ isOpen, onClose, vehicle, onReserve }: VehicleDetailsModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Simular múltiplas imagens (em produção, viria da API)
  const images = [
    vehicle.thumbnail,
    vehicle.thumbnail, // Substituir por imagens reais
    vehicle.thumbnail
  ];

  const getClassificationIcon = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'electric': return <BatteryCharging className="w-5 h-5" />;
      case 'luxury': return <Sparkles className="w-5 h-5" />;
      case 'suv': return <MapPin className="w-5 h-5" />;
      default: return <Car className="w-5 h-5" />;
    }
  };

  const handleReserve = async () => {
    setIsLoading(true);
    await onReserve();
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Badge 
                  variant="outline" 
                  className="mb-2 bg-primary/10 text-primary border-primary/20"
                >
                  {getClassificationIcon(vehicle.classification)}
                  <span className="ml-1">{vehicle.classification}</span>
                </Badge>
                <DialogTitle className="text-3xl font-bold">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </DialogTitle>
              </div>
              <div className="text-right">
                <VehiclePrice price={vehicle.price} size="lg" highlighted={true} />
                <div className="flex items-center gap-1 text-sm text-yellow-500 mt-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>4.8</span>
                  <span className="text-gray-400">(120 reviews)</span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6">
            <Tabs defaultValue="gallery" className="space-y-6">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="gallery" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <motion.div 
                      className="relative aspect-video rounded-lg overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={images[selectedImage]}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="object-cover w-full h-full"
                      />
                    </motion.div>
                    <div className="flex gap-2">
                      {images.map((img, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setSelectedImage(idx)}
                          className={cn(
                            "relative aspect-video w-20 rounded-md overflow-hidden",
                            selectedImage === idx ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"
                          )}
                        >
                          <img src={img} alt="" className="object-cover w-full h-full" />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: <Users />, label: "Passengers", value: vehicle.passengers },
                        { icon: <DoorOpen />, label: "Doors", value: vehicle.doors },
                        { icon: <Calendar />, label: "Year", value: vehicle.year },
                        { icon: <Shield />, label: "Insurance", value: "Included" }
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-2 text-gray-500 mb-1">
                            {item.icon}
                            <span className="text-sm">{item.label}</span>
                          </div>
                          <div className="text-lg font-semibold">{item.value}</div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        Popular Features
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {vehicle.features.slice(0, 4).map((feature, idx) => (
                          <motion.div
                            key={idx}
                            className="flex items-center gap-2 text-sm"
                            whileHover={{ x: 2 }}
                          >
                            <Check className="w-4 h-4 text-green-500" />
                            <span>{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {vehicle.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Vehicle Specifications</h4>
                    <div className="space-y-2">
                      {[
                        { label: "Make", value: vehicle.make },
                        { label: "Model", value: vehicle.model },
                        { label: "Year", value: vehicle.year },
                        { label: "Classification", value: vehicle.classification },
                        { label: "Passenger Capacity", value: vehicle.passengers },
                        { label: "Door Count", value: vehicle.doors }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between py-2 border-b">
                          <span className="text-gray-500">{item.label}</span>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Rental Includes</h4>
                    <div className="grid gap-3">
                      {[
                        { icon: <Shield />, text: "Insurance coverage included" },
                        { icon: <Fuel />, text: "Full tank of fuel" },
                        { icon: <Clock />, text: "24/7 roadside assistance" },
                        { icon: <Banknote />, text: "No hidden fees" }
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="text-primary">{item.icon}</div>
                          <span>{item.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleReserve} 
                disabled={isLoading}
                className="min-w-[150px]"
              >
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </motion.div>
                ) : (
                  <span className="flex items-center gap-2">
                    Reserve Now
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
} 