import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { VehicleImage } from "./ui/VehicleImage";
import { VehicleFeatureTag } from "./ui/VehicleFeatureTag";
import { VehiclePrice } from "./ui/VehiclePrice";
import { Button } from "./ui/button";
import { Users, DoorOpen, Calendar, Tag } from 'lucide-react';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <VehicleImage
              src={vehicle.thumbnail}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{vehicle.passengers} passengers</span>
                </div>
                <div className="flex items-center gap-2">
                  <DoorOpen className="w-4 h-4" />
                  <span>{vehicle.doors} doors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{vehicle.year} model</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>{vehicle.classification}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((feature, index) => (
                  <VehicleFeatureTag key={index}>{feature}</VehicleFeatureTag>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <VehiclePrice price={vehicle.price} size="lg" highlighted={true} />
              <Button onClick={onReserve} size="lg">
                Reserve Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 