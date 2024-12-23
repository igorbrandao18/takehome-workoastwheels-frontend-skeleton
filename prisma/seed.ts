import { PrismaClient } from '@prisma/client';
import { Password } from '../src/domain/value-objects/Password';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin
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

  // Criar alguns veículos
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        model: 'Toyota Corolla',
        plate: 'ABC1234',
        year: 2023,
        status: 'AVAILABLE',
        classification: 'INTERMEDIATE'
      }
    }),
    prisma.vehicle.create({
      data: {
        model: 'Honda Civic',
        plate: 'DEF5678',
        year: 2023,
        status: 'AVAILABLE',
        classification: 'INTERMEDIATE'
      }
    }),
    prisma.vehicle.create({
      data: {
        model: 'BMW X5',
        plate: 'GHI9012',
        year: 2023,
        status: 'AVAILABLE',
        classification: 'LUXURY'
      }
    })
  ]);

  console.log('Seed completed:', {
    admin: { id: admin.id, email: admin.email },
    vehicles: vehicles.map(v => ({ id: v.id, plate: v.plate }))
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