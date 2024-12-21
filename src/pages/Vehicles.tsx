import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import { motion } from 'framer-motion';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'RESERVED';
  pricePerDay: number;
  imageUrl: string;
}

export function Vehicles() {
  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await api.get('/vehicles');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto mt-8 grid gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-2 h-4 w-1/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Our Vehicles</h1>
        <p className="mt-2 text-muted-foreground">
          Choose from our selection of premium vehicles
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles?.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                  className="h-48 w-full object-cover"
                />
                <Badge
                  className="absolute right-2 top-2"
                  variant={
                    vehicle.status === 'AVAILABLE'
                      ? 'success'
                      : vehicle.status === 'MAINTENANCE'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {vehicle.status}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle>{vehicle.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{vehicle.type}</p>
                <p className="mt-2 text-lg font-semibold">
                  ${vehicle.pricePerDay}/day
                </p>
              </CardContent>
              <CardFooter>
                <Link to={`/vehicles/${vehicle.id}`} className="w-full">
                  <Button
                    className="w-full"
                    variant={vehicle.status === 'AVAILABLE' ? 'default' : 'secondary'}
                    disabled={vehicle.status !== 'AVAILABLE'}
                  >
                    {vehicle.status === 'AVAILABLE' ? 'Reserve Now' : 'Not Available'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 