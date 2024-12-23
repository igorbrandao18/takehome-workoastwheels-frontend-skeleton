import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface VehicleImageData {
  url: string;
  type: string;
  order: number;
}

interface VehicleData {
  make: string;
  model: string;
  plate: string;
  year: number;
  status: string;
  classification: string;
  pricePerHour: number;
  passengerCapacity: number;
  specs: string | null;
  features: string | null;
  images: VehicleImageData[];
}

const vehicles: VehicleData[] = [
  {
    make: "Mercedes-Benz",
    model: "S-Class",
    plate: "LUX0001",
    year: 2024,
    status: "AVAILABLE",
    classification: "LUXURY",
    pricePerHour: 89,
    passengerCapacity: 5,
    specs: "523 hp, 4.4s 0-60mph, Luxury Interior",
    features: "Massage Seats, Night Vision, Executive Package",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8",
        type: "exterior",
        order: 1
      }
    ]
  },
  {
    make: "BMW",
    model: "7 Series",
    plate: "LUX0002",
    year: 2024,
    status: "AVAILABLE",
    classification: "LUXURY",
    pricePerHour: 85,
    passengerCapacity: 5,
    specs: "536 hp, 4.1s 0-60mph, Executive Comfort",
    features: "Theater Screen, Sky Lounge, Executive Lounge",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555215695-3004980ad54e",
        type: "exterior",
        order: 1
      }
    ]
  },
  {
    make: "Tesla",
    model: "Model S Plaid",
    plate: "EV0001",
    year: 2024,
    status: "AVAILABLE",
    classification: "ELECTRIC_PERFORMANCE",
    pricePerHour: 75,
    passengerCapacity: 5,
    specs: "1,020 hp, 1.99s 0-60mph, 396mi Range",
    features: "Autopilot, Gaming Computer, Premium Connectivity",
    images: [
      {
        url: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
        type: "exterior",
        order: 1
      }
    ]
  },
  {
    make: "Porsche",
    model: "911 GT3",
    plate: "SPT0001",
    year: 2024,
    status: "AVAILABLE",
    classification: "SPORTS",
    pricePerHour: 120,
    passengerCapacity: 2,
    specs: "502 hp, 3.2s 0-60mph, Track-Ready",
    features: "PDK Transmission, Carbon Ceramic Brakes, Sport Chrono",
    images: [
      {
        url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
        type: "exterior",
        order: 1
      }
    ]
  }
];

async function main() {
  try {
    // Create vehicles with images
    for (const vehicle of vehicles) {
      const { images, ...vehicleData } = vehicle;
      
      // Create vehicle with nested create
      const createdVehicle = await prisma.vehicle.create({
        data: {
          ...vehicleData,
          images: {
            create: images
          }
        },
        include: {
          images: true
        }
      });

      console.log(`Created vehicle: ${createdVehicle.make} ${createdVehicle.model}`);
    }

    // Get all vehicles with their images
    const createdVehicles = await prisma.vehicle.findMany({
      include: {
        images: true
      }
    });

    console.log('Seed completed:', {
      vehicles: createdVehicles.map(v => ({
        id: v.id,
        make: v.make,
        model: v.model,
        plate: v.plate,
        imageCount: v.images.length
      }))
    });
  } catch (error) {
    console.error('Error in seed:', error);
    throw error;
  }
}

main()
  .catch(e => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 