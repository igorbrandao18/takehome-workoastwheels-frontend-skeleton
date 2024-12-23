import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VehicleService {
  async findAll() {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    return vehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.model,
      type: vehicle.classification,
      status: vehicle.status,
      pricePerDay: vehicle.pricePerDay,
      specs: vehicle.specs,
      features: vehicle.features,
      year: vehicle.year,
      imageUrl: vehicle.images[0]?.url || '',
      images: vehicle.images.map(image => ({
        url: image.url,
        type: image.type
      }))
    }));
  }

  async findById(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    return {
      id: vehicle.id,
      name: vehicle.model,
      type: vehicle.classification,
      status: vehicle.status,
      pricePerDay: vehicle.pricePerDay,
      specs: vehicle.specs,
      features: vehicle.features,
      year: vehicle.year,
      imageUrl: vehicle.images[0]?.url || '',
      images: vehicle.images.map(image => ({
        url: image.url,
        type: image.type
      }))
    };
  }

  async updateStatus(id: string, status: string) {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: { status }
    });

    return vehicle;
  }
} 