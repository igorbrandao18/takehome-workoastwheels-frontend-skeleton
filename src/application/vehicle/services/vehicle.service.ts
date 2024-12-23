import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VehicleService {
  async findAll() {
    return prisma.vehicle.findMany({
      include: {
        images: true
      }
    });
  }

  async findById(id: string) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: {
        images: true
      }
    });
  }

  async create(data: {
    model: string;
    plate: string;
    year: number;
    pricePerDay: number;
    classification: string;
    specifications: any;
    features: string[];
    images: { url: string; type: string; order: number }[];
  }) {
    const invalidImages = data.images.filter(img => !isValidImageUrl(img.url));
    if (invalidImages.length > 0) {
      throw new Error('Invalid image URLs provided');
    }

    const existingVehicle = await prisma.vehicle.findUnique({
      where: { plate: data.plate }
    });

    if (existingVehicle) {
      throw new Error('Plate already exists');
    }

    return prisma.vehicle.create({
      data: {
        model: data.model,
        plate: data.plate,
        year: data.year,
        pricePerDay: data.pricePerDay,
        classification: data.classification,
        specifications: data.specifications,
        features: data.features,
        images: {
          create: data.images
        }
      },
      include: {
        images: true
      }
    });
  }

  async update(id: string, data: {
    model?: string;
    plate?: string;
    year?: number;
    pricePerDay?: number;
    classification?: string;
    specifications?: any;
    features?: string[];
    images?: { url: string; type: string; order: number }[];
  }) {
    if (data.plate) {
      const existingVehicle = await prisma.vehicle.findFirst({
        where: {
          plate: data.plate,
          NOT: {
            id
          }
        }
      });

      if (existingVehicle) {
        throw new Error('Plate already exists');
      }
    }

    if (data.images) {
      await prisma.vehicleImage.deleteMany({
        where: { vehicleId: id }
      });
    }

    return prisma.vehicle.update({
      where: { id },
      data: {
        ...(data.model && { model: data.model }),
        ...(data.plate && { plate: data.plate }),
        ...(data.year && { year: data.year }),
        ...(data.pricePerDay && { pricePerDay: data.pricePerDay }),
        ...(data.classification && { classification: data.classification }),
        ...(data.specifications && { specifications: data.specifications }),
        ...(data.features && { features: data.features }),
        ...(data.images && {
          images: {
            create: data.images
          }
        })
      },
      include: {
        images: true
      }
    });
  }

  async delete(id: string) {
    await prisma.vehicleImage.deleteMany({
      where: { vehicleId: id }
    });

    return prisma.vehicle.delete({
      where: { id }
    });
  }
}

function isValidImageUrl(url: string): boolean {
  try {
    new URL(url);
    return url.match(/\.(jpg|jpeg|png|webp)$/i) !== null;
  } catch {
    return false;
  }
} 