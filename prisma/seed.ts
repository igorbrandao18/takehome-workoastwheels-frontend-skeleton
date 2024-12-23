import { PrismaClient } from '@prisma/client';
import { Password } from '../src/domain/value-objects/Password';

const prisma = new PrismaClient();

interface VehicleImageData {
  url: string;
  type: string;
  order: number;
}

interface VehicleData {
  model: string;
  plate: string;
  year: number;
  status: string;
  classification: string;
  pricePerDay: number;
  specs: string | null;
  features: string | null;
  images: VehicleImageData[];
}

const vehicles: VehicleData[] = [
  // Luxury Sedans
  {
    model: "Mercedes-Benz S-Class",
    plate: "LUX0001",
    year: 2024,
    status: "AVAILABLE",
    classification: "LUXURY",
    pricePerDay: 899,
    specs: "523 hp, 4.4s 0-60mph, Luxury Interior",
    features: "Massage Seats, Night Vision, Executive Package",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  {
    model: "BMW 7 Series",
    plate: "LUX0002",
    year: 2024,
    status: "AVAILABLE",
    classification: "LUXURY",
    pricePerDay: 859,
    specs: "536 hp, 4.1s 0-60mph, Executive Comfort",
    features: "Theater Screen, Sky Lounge, Executive Lounge",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555215695-3004980ad54e",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  {
    model: "Porsche 911 GT3",
    plate: "SPT0001",
    year: 2024,
    status: "AVAILABLE",
    classification: "SPORTS",
    pricePerDay: 1299,
    specs: "502 hp, 3.2s 0-60mph, Track-Ready",
    features: "PDK Transmission, Carbon Ceramic Brakes, Sport Chrono",
    images: [
      {
        url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  {
    model: "Ferrari SF90 Stradale",
    plate: "SPT0002",
    year: 2024,
    status: "AVAILABLE",
    classification: "SUPER_SPORTS",
    pricePerDay: 2499,
    specs: "986 hp, 2.5s 0-60mph, Hybrid Powertrain",
    features: "eManettino, RAC-e, All-Wheel Drive",
    images: [
      {
        url: "https://images.unsplash.com/photo-1592198084033-aade902d1aae",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1592198084033-aade902d1aae",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1592198084033-aade902d1aae",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1592198084033-aade902d1aae",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  {
    model: "Lamborghini Revuelto",
    plate: "SPT0003",
    year: 2024,
    status: "AVAILABLE",
    classification: "SUPER_SPORTS",
    pricePerDay: 2699,
    specs: "1001 hp, 2.5s 0-60mph, Hybrid V12",
    features: "Forged Carbon, Active Aero, Hybrid Technology",
    images: [
      {
        url: "https://images.unsplash.com/photo-1621135802920-133df287f89c",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1621135802920-133df287f89c",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1621135802920-133df287f89c",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1621135802920-133df287f89c",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  // Electric Vehicles
  {
    model: "Tesla Model S Plaid",
    plate: "EV0001",
    year: 2024,
    status: "AVAILABLE",
    classification: "ELECTRIC_PERFORMANCE",
    pricePerDay: 899,
    specs: "1,020 hp, 1.99s 0-60mph, 396mi Range",
    features: "Autopilot, Gaming Computer, Premium Connectivity",
    images: [
      {
        url: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  // SUVs de Luxo
  {
    model: "Range Rover SV",
    plate: "SUV0001",
    year: 2024,
    status: "AVAILABLE",
    classification: "LUXURY_SUV",
    pricePerDay: 1099,
    specs: "523 hp, 4.6s 0-60mph, All-Terrain Luxury",
    features: "Executive Class Seating, Hot Stone Massage, All-Terrain Progress Control",
    images: [
      {
        url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  {
    model: "Bentley Bentayga EWB",
    plate: "SUV0002",
    year: 2024,
    status: "AVAILABLE",
    classification: "ULTRA_LUXURY_SUV",
    pricePerDay: 1599,
    specs: "542 hp, 4.5s 0-60mph, Ultimate Luxury SUV",
    features: "Airline Seat Specification, Naim Audio, Bentley Rotating Display",
    images: [
      {
        url: "https://images.unsplash.com/photo-1580274455191-1c62238fa333",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1580274455191-1c62238fa333",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1580274455191-1c62238fa333",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1580274455191-1c62238fa333",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  {
    model: "Rolls-Royce Cullinan Black Badge",
    plate: "SUV0003",
    year: 2024,
    status: "AVAILABLE",
    classification: "ULTRA_LUXURY_SUV",
    pricePerDay: 1999,
    specs: "592 hp, 4.1s 0-60mph, Ultimate Luxury",
    features: "Starlight Headliner, Champagne Cooler, Viewing Suite",
    images: [
      {
        url: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  {
    model: "Lamborghini Urus Performante",
    plate: "SUV0004",
    year: 2024,
    status: "AVAILABLE",
    classification: "SUPER_SUV",
    pricePerDay: 1499,
    specs: "657 hp, 3.3s 0-60mph, Super SUV",
    features: "Torque Vectoring, Carbon Fiber Package, Akrapovič Exhaust",
    images: [
      {
        url: "https://images.unsplash.com/photo-1671845752561-40650ad937d8",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1671845752561-40650ad937d8",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1671845752561-40650ad937d8",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1671845752561-40650ad937d8",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  // Carros Elétricos
  {
    model: "Porsche Taycan Turbo S",
    plate: "EV0002",
    year: 2024,
    status: "AVAILABLE",
    classification: "ELECTRIC_PERFORMANCE",
    pricePerDay: 1099,
    specs: "750 hp, 2.6s 0-60mph, 278mi Range",
    features: "800V Architecture, Porsche Active Suspension, Performance Battery Plus",
    images: [
      {
        url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  {
    model: "Lucid Air Dream Edition",
    plate: "EV0003",
    year: 2024,
    status: "AVAILABLE",
    classification: "ELECTRIC_LUXURY",
    pricePerDay: 1299,
    specs: "1,111 hp, 2.5s 0-60mph, 520mi Range",
    features: "Glass Canopy Roof, DreamDrive Pro, 34-inch Curved Display",
    images: [
      {
        url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  // Carros Clássicos
  {
    model: "Ferrari F40",
    plate: "CLS0001",
    year: 1992,
    status: "AVAILABLE",
    classification: "CLASSIC_EXOTIC",
    pricePerDay: 4999,
    specs: "471 hp, 3.8s 0-60mph, Twin-Turbo V8",
    features: "Carbon Fiber Body, Racing Heritage, Collector's Item",
    images: [
      {
        url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  {
    model: "McLaren F1",
    plate: "CLS0002",
    year: 1995,
    status: "AVAILABLE",
    classification: "CLASSIC_EXOTIC",
    pricePerDay: 5999,
    specs: "627 hp, 3.2s 0-60mph, Naturally Aspirated V12",
    features: "Center Driver's Seat, Gold Engine Bay, Limited Production",
    images: [
      {
        url: "https://images.unsplash.com/photo-1621135802920-133df287f89c",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1621135802920-133df287f89c",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1621135802920-133df287f89c",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1621135802920-133df287f89c",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  {
    model: "Porsche 959",
    plate: "CLS0003",
    year: 1987,
    status: "AVAILABLE",
    classification: "CLASSIC_EXOTIC",
    pricePerDay: 4599,
    specs: "444 hp, 3.6s 0-60mph, Twin-Turbo Flat-6",
    features: "All-Wheel Drive, Adjustable Suspension, Technological Pioneer",
    images: [
      {
        url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  // Supercars
  {
    model: "Bugatti Chiron Super Sport",
    plate: "SPT0004",
    year: 2024,
    status: "AVAILABLE",
    classification: "HYPER_SPORTS",
    pricePerDay: 3999,
    specs: "1,578 hp, 2.4s 0-60mph, 304mph Top Speed",
    features: "Quad-Turbo W16, Carbon Fiber Monocoque, Active Aero",
    images: [
      {
        url: "https://images.unsplash.com/photo-1627454819213-f77e85916b9c",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1627454819213-f77e85916b9c",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1627454819213-f77e85916b9c",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1627454819213-f77e85916b9c",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  {
    model: "Koenigsegg Jesko Absolut",
    plate: "SPT0005",
    year: 2024,
    status: "AVAILABLE",
    classification: "HYPER_SPORTS",
    pricePerDay: 3799,
    specs: "1,600 hp, 2.5s 0-60mph, 330mph Top Speed",
    features: "Twin-Turbo V8, 9-Speed LST, Active Triplex Suspension",
    images: [
      {
        url: "https://images.unsplash.com/photo-1627454819213-f77e85916b9c",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1627454819213-f77e85916b9c",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.unsplash.com/photo-1627454819213-f77e85916b9c",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.unsplash.com/photo-1627454819213-f77e85916b9c",
        type: "interior-rear",
        order: 4
      }
    ]
  }
];

async function main() {
  try {
    // Create admin user
    const adminPassword = new Password('admin123');
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: adminPassword.value,
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });

    // Create vehicles with images
    for (const vehicle of vehicles) {
      const { images, ...vehicleData } = vehicle;
      
      // Create vehicle
      const createdVehicle = await prisma.vehicle.create({
        data: vehicleData
      });

      // Create images for the vehicle
      await prisma.$transaction(
        images.map(image => 
          prisma.vehicle_images.create({
            data: {
              ...image,
              vehicleId: createdVehicle.id
            }
          })
        )
      );
    }

    // Get all vehicles with their images
    const createdVehicles = await prisma.vehicle.findMany({
      include: {
        vehicle_images: true
      }
    });

    console.log('Seed completed:', {
      admin: { id: admin.id, email: admin.email },
      vehicles: createdVehicles.map(v => ({
        id: v.id,
        model: v.model,
        plate: v.plate,
        imageCount: v.vehicle_images.length
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