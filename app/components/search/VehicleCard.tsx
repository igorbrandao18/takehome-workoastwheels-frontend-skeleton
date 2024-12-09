import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";

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
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
          <img
            src={thumbnail}
            alt={`${make} ${model}`}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-lg font-semibold">
              {price}/hr
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {year} {make} {model}
          </h3>
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <Badge key={index} variant="outline">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={onReserve} className="w-full">
          Reserve Now
        </Button>
      </CardFooter>
    </Card>
  );
} 