import { PrismaClient } from '@prisma/client';
import { Password } from '../src/domain/value-objects/Password';

const prisma = new PrismaClient();

const vehicles = [
  // Luxury Sedans
  {
    model: "Mercedes-Benz S-Class",
    plate: "LUX0001",
    year: 2024,
    classification: "LUXURY",
    pricePerDay: 899,
    specs: "523 hp, 4.4s 0-60mph, Luxury Interior",
    features: "Massage Seats, Night Vision, Executive Package",
    images: [
      {
        url: "https://images.mercedes-benz.com/is/image/mb/S-Class_Exterior_Front_2024",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://images.mercedes-benz.com/is/image/mb/S-Class_Exterior_Rear_2024",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://images.mercedes-benz.com/is/image/mb/S-Class_Interior_Dashboard_2024",
        type: "interior",
        order: 3
      },
      {
        url: "https://images.mercedes-benz.com/is/image/mb/S-Class_Interior_Rear_2024",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  {
    model: "BMW 7 Series",
    plate: "LUX0002",
    year: 2024,
    classification: "LUXURY",
    pricePerDay: 859,
    specs: "536 hp, 4.1s 0-60mph, Executive Comfort",
    features: "Theater Screen, Sky Lounge, Executive Lounge",
    images: [
      {
        url: "https://www.bmw.com/content/dam/bmw/marketBMWCOM/bmw_com/categories/new-vehicles/7-series/2024/exterior-front.jpg",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://www.bmw.com/content/dam/bmw/marketBMWCOM/bmw_com/categories/new-vehicles/7-series/2024/exterior-rear.jpg",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://www.bmw.com/content/dam/bmw/marketBMWCOM/bmw_com/categories/new-vehicles/7-series/2024/interior-dashboard.jpg",
        type: "interior",
        order: 3
      },
      {
        url: "https://www.bmw.com/content/dam/bmw/marketBMWCOM/bmw_com/categories/new-vehicles/7-series/2024/interior-rear.jpg",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  {
    model: "Porsche 911 GT3",
    plate: "SPT0001",
    year: 2024,
    classification: "SPORTS",
    pricePerDay: 1299,
    specs: "502 hp, 3.2s 0-60mph, Track-Ready",
    features: "PDK Transmission, Carbon Ceramic Brakes, Sport Chrono",
    images: [
      {
        url: "https://files.porsche.com/filestore/image/multimedia/none/911-gt3-modelimage-sideshot/model/765dfc51-51bc-11eb-80d1-005056bbdc38/porsche-model.png",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://files.porsche.com/filestore/image/multimedia/none/911-gt3-modelimage-rear/model/765dfc52-51bc-11eb-80d1-005056bbdc38/porsche-model.png",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://files.porsche.com/filestore/image/multimedia/none/911-gt3-modelimage-interior/model/765dfc53-51bc-11eb-80d1-005056bbdc38/porsche-model.png",
        type: "interior",
        order: 3
      },
      {
        url: "https://files.porsche.com/filestore/image/multimedia/none/911-gt3-modelimage-cockpit/model/765dfc54-51bc-11eb-80d1-005056bbdc38/porsche-model.png",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  {
    model: "Ferrari SF90 Stradale",
    plate: "SPT0002",
    year: 2024,
    classification: "SUPER_SPORTS",
    pricePerDay: 2499,
    specs: "986 hp, 2.5s 0-60mph, Hybrid Powertrain",
    features: "eManettino, RAC-e, All-Wheel Drive",
    images: [
      {
        url: "https://cdn.ferrari.com/cms/network/media/img/resize/649c4a590eeef6002a538480-sf90-stradale-share?width=1080",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://cdn.ferrari.com/cms/network/media/img/resize/649c4a590eeef6002a538481-sf90-stradale-rear?width=1080",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://cdn.ferrari.com/cms/network/media/img/resize/649c4a590eeef6002a538482-sf90-stradale-interior?width=1080",
        type: "interior",
        order: 3
      },
      {
        url: "https://cdn.ferrari.com/cms/network/media/img/resize/649c4a590eeef6002a538483-sf90-stradale-cockpit?width=1080",
        type: "interior-rear",
        order: 4
      }
    ]
  },
  {
    model: "Lamborghini Revuelto",
    plate: "SPT0003",
    year: 2024,
    classification: "SUPER_SPORTS",
    pricePerDay: 2699,
    specs: "1001 hp, 2.5s 0-60mph, Hybrid V12",
    features: "Forged Carbon, Active Aero, Hybrid Technology",
    images: [
      {
        url: "https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_detail/revuelto/2023/revuelto_m.jpg",
        type: "exterior-front",
        order: 1
      },
      {
        url: "https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_detail/revuelto/2023/revuelto_r.jpg",
        type: "exterior-rear",
        order: 2
      },
      {
        url: "https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_detail/revuelto/2023/revuelto_i.jpg",
        type: "interior",
        order: 3
      },
      {
        url: "https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_detail/revuelto/2023/revuelto_c.jpg",
        type: "interior-rear",
        order: 4
      }
    ]
  }
];

async function main() {
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
  const createdVehicles = await Promise.all(
    vehicles.map(async (vehicle) => {
      const createdVehicle = await prisma.vehicle.create({
        data: {
          model: vehicle.model,
          plate: vehicle.plate,
          year: vehicle.year,
          status: 'AVAILABLE',
          classification: vehicle.classification,
          pricePerDay: vehicle.pricePerDay,
          specs: vehicle.specs,
          features: vehicle.features,
          images: {
            create: vehicle.images
          }
        },
        include: {
          images: true
        }
      });
      return createdVehicle;
    })
  );

  console.log('Seed completed:', {
    admin: { id: admin.id, email: admin.email },
    vehicles: createdVehicles.map(v => ({
      id: v.id,
      model: v.model,
      plate: v.plate,
      imageCount: v.images.length
    }))
  });
}

main()
  .catch(e => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 