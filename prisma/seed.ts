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
  // Luxury Cars
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
    images: [{ url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8", type: "exterior", order: 1 }]
  },
  {
    make: "BMW",
    model: "7 Series",
    plate: "LUX0002",
    year: 2023,
    status: "AVAILABLE",
    classification: "LUXURY",
    pricePerHour: 85,
    passengerCapacity: 5,
    specs: "536 hp, 4.1s 0-60mph, Executive Comfort",
    features: "Theater Screen, Sky Lounge, Executive Lounge",
    images: [{ url: "https://images.unsplash.com/photo-1555215695-3004980ad54e", type: "exterior", order: 1 }]
  },
  {
    make: "Rolls-Royce",
    model: "Ghost",
    plate: "LUX0003",
    year: 2023,
    status: "AVAILABLE",
    classification: "ULTRA_LUXURY",
    pricePerHour: 150,
    passengerCapacity: 5,
    specs: "563 hp, 4.6s 0-60mph, Ultimate Luxury",
    features: "Starlight Headliner, Champagne Cooler, Bespoke Audio",
    images: [{ url: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4", type: "exterior", order: 1 }]
  },

  // Electric Vehicles
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
    images: [{ url: "https://images.unsplash.com/photo-1617788138017-80ad40651399", type: "exterior", order: 1 }]
  },
  {
    make: "Porsche",
    model: "Taycan Turbo S",
    plate: "EV0002",
    year: 2023,
    status: "AVAILABLE",
    classification: "ELECTRIC_PERFORMANCE",
    pricePerHour: 85,
    passengerCapacity: 4,
    specs: "750 hp, 2.6s 0-60mph, 201mi Range",
    features: "Performance Battery Plus, Sport Chrono, Ceramic Brakes",
    images: [{ url: "https://images.unsplash.com/photo-1619767886558-efdc259b6e09", type: "exterior", order: 1 }]
  },

  // Sports Cars
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
    images: [{ url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e", type: "exterior", order: 1 }]
  },
  {
    make: "Ferrari",
    model: "F8 Tributo",
    plate: "SPT0002",
    year: 2023,
    status: "AVAILABLE",
    classification: "SPORTS",
    pricePerHour: 150,
    passengerCapacity: 2,
    specs: "710 hp, 2.9s 0-60mph, Twin-Turbo V8",
    features: "Carbon Fiber Racing Seats, Launch Control, Ferrari Dynamic Enhancer",
    images: [{ url: "https://images.unsplash.com/photo-1592198084033-aade902d1aae", type: "exterior", order: 1 }]
  },

  // SUVs
  {
    make: "Range Rover",
    model: "Sport",
    plate: "SUV0001",
    year: 2024,
    status: "AVAILABLE",
    classification: "LUXURY_SUV",
    pricePerHour: 95,
    passengerCapacity: 7,
    specs: "523 hp, 4.3s 0-60mph, All-Terrain Capability",
    features: "Dynamic Air Suspension, Terrain Response 2, Meridian Sound",
    images: [{ url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6", type: "exterior", order: 1 }]
  },
  {
    make: "Lamborghini",
    model: "Urus",
    plate: "SUV0002",
    year: 2023,
    status: "AVAILABLE",
    classification: "PERFORMANCE_SUV",
    pricePerHour: 140,
    passengerCapacity: 5,
    specs: "641 hp, 3.5s 0-60mph, Super SUV",
    features: "ANIMA Selector, Carbon Ceramic Brakes, B&O Sound System",
    images: [{ url: "https://images.unsplash.com/photo-1621136824023-49cb067dd9f4", type: "exterior", order: 1 }]
  },

  // Classic Cars
  {
    make: "Ford",
    model: "Mustang GT",
    plate: "CLS0001",
    year: 1967,
    status: "AVAILABLE",
    classification: "CLASSIC",
    pricePerHour: 100,
    passengerCapacity: 4,
    specs: "320 hp, V8 Engine, Restored Condition",
    features: "Manual Transmission, Original Interior, Modern Sound System",
    images: [{ url: "https://images.unsplash.com/photo-1567784177951-6fa58317e16b", type: "exterior", order: 1 }]
  },
  {
    make: "Chevrolet",
    model: "Corvette Stingray",
    plate: "CLS0002",
    year: 1963,
    status: "AVAILABLE",
    classification: "CLASSIC",
    pricePerHour: 120,
    passengerCapacity: 2,
    specs: "360 hp, Split Window, Collector's Item",
    features: "4-Speed Manual, Original Paint, Show Car Quality",
    images: [{ url: "https://images.unsplash.com/photo-1603553329474-99f95f35394f", type: "exterior", order: 1 }]
  },

  // Modern Classics
  {
    make: "BMW",
    model: "M3 E46",
    plate: "MDC0001",
    year: 2005,
    status: "AVAILABLE",
    classification: "MODERN_CLASSIC",
    pricePerHour: 85,
    passengerCapacity: 4,
    specs: "333 hp, 6-Speed Manual, Track-Ready",
    features: "Competition Package, Harman Kardon Sound, Sport Seats",
    images: [{ url: "https://images.unsplash.com/photo-1619362280286-f1f8fd5032ed", type: "exterior", order: 1 }]
  },
  {
    make: "Porsche",
    model: "911 (997) GT3 RS",
    plate: "MDC0002",
    year: 2007,
    status: "AVAILABLE",
    classification: "MODERN_CLASSIC",
    pricePerHour: 110,
    passengerCapacity: 2,
    specs: "415 hp, Mezger Engine, Racing Heritage",
    features: "Clubsport Package, Carbon Fiber Parts, Limited Edition",
    images: [{ url: "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b", type: "exterior", order: 1 }]
  },

  // Exotic Cars
  {
    make: "McLaren",
    model: "720S",
    plate: "EXO0001",
    year: 2023,
    status: "AVAILABLE",
    classification: "EXOTIC",
    pricePerHour: 180,
    passengerCapacity: 2,
    specs: "710 hp, 2.8s 0-60mph, Carbon Fiber Monocage",
    features: "Variable Drift Control, Track Telemetry, Bowers & Wilkins Audio",
    images: [{ url: "https://images.unsplash.com/photo-1621135802920-133df287f89c", type: "exterior", order: 1 }]
  },
  {
    make: "Bugatti",
    model: "Chiron",
    plate: "EXO0002",
    year: 2022,
    status: "AVAILABLE",
    classification: "EXOTIC",
    pricePerHour: 250,
    passengerCapacity: 2,
    specs: "1,500 hp, 2.4s 0-60mph, Quad-Turbo W16",
    features: "Top Speed Mode, Telemetry Recording, Custom Interior",
    images: [{ url: "https://images.unsplash.com/photo-1617654112368-307921291f42", type: "exterior", order: 1 }]
  },

  // Vintage Cars
  {
    make: "Jaguar",
    model: "E-Type",
    plate: "VNT0001",
    year: 1961,
    status: "AVAILABLE",
    classification: "VINTAGE",
    pricePerHour: 150,
    passengerCapacity: 2,
    specs: "265 hp, Inline-6, Concours Condition",
    features: "Original Toolkit, Heritage Certificate, Show Winner",
    images: [{ url: "https://images.unsplash.com/photo-1621952906493-5e351ca0d0a1", type: "exterior", order: 1 }]
  },
  {
    make: "Mercedes-Benz",
    model: "300SL Gullwing",
    plate: "VNT0002",
    year: 1955,
    status: "AVAILABLE",
    classification: "VINTAGE",
    pricePerHour: 200,
    passengerCapacity: 2,
    specs: "215 hp, Fuel-Injected, Iconic Design",
    features: "Gullwing Doors, Original Interior, Museum Quality",
    images: [{ url: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f", type: "exterior", order: 1 }]
  },

  // Add more vehicles here...
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