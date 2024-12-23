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

const WORKING_IMAGES = {
  exterior: [
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e",
    "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7"
  ],
  interior: [
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
    "https://images.unsplash.com/photo-1542362567-b07e54358753"
  ],
  detail: [
    "https://images.unsplash.com/photo-1544829728-e5ca3e8dd4c9",
    "https://images.unsplash.com/photo-1556189250-72ba954cfc2b",
    "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd",
    "https://images.unsplash.com/photo-1562911791-c7a97b729ec5"
  ]
};

const getRandomImages = () => ({
  exterior1: WORKING_IMAGES.exterior[Math.floor(Math.random() * WORKING_IMAGES.exterior.length)],
  exterior2: WORKING_IMAGES.exterior[Math.floor(Math.random() * WORKING_IMAGES.exterior.length)],
  interior: WORKING_IMAGES.interior[Math.floor(Math.random() * WORKING_IMAGES.interior.length)],
  detail: WORKING_IMAGES.detail[Math.floor(Math.random() * WORKING_IMAGES.detail.length)]
});

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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
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
    images: (() => {
      const imgs = getRandomImages();
      return [
        { url: imgs.exterior1, type: "exterior", order: 1 },
        { url: imgs.interior, type: "interior", order: 2 },
        { url: imgs.detail, type: "detail", order: 3 },
        { url: imgs.exterior2, type: "exterior", order: 4 }
      ];
    })()
  }
];

// Update all vehicles to use random working images
vehicles.forEach(vehicle => {
  const imgs = getRandomImages();
  vehicle.images = [
    { url: imgs.exterior1, type: "exterior", order: 1 },
    { url: imgs.interior, type: "interior", order: 2 },
    { url: imgs.detail, type: "detail", order: 3 },
    { url: imgs.exterior2, type: "exterior", order: 4 }
  ];
});

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