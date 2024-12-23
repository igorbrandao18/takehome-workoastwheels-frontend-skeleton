import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Vehicle routes
app.get('/vehicles/options', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany();
    const makes = [...new Set(vehicles.map(v => v.make))];
    const classifications = [...new Set(vehicles.map(v => v.classification))];
    res.json({ makes, classifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle options' });
  }
});

app.get('/vehicles/search', async (req, res) => {
  try {
    const { classification, make, status, minPassengers, priceRange } = req.query;
    
    let where: any = {};
    
    if (classification) where.classification = classification;
    if (make) where.make = make;
    if (status) where.status = status;
    if (minPassengers) where.passengerCapacity = { gte: Number(minPassengers) };
    if (priceRange) {
      const [min, max] = (priceRange as string).split('-').map(Number);
      where.pricePerHour = { gte: min, lte: max };
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        images: true
      }
    });

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search vehicles' });
  }
});

app.get('/vehicles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        images: true
      }
    });
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// Reservation routes
app.post('/reservations', async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, status } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({ error: 'Start date must be in the future' });
    }

    if (end <= start) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Calculate total price
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    const totalPrice = hours * vehicle.pricePerHour;

    // Check if vehicle is available
    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        vehicleId,
        status: 'ACTIVE',
        OR: [
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gte: start } }
            ]
          },
          {
            AND: [
              { startDate: { lte: end } },
              { endDate: { gte: end } }
            ]
          }
        ]
      }
    });

    if (conflictingReservation) {
      return res.status(400).json({ error: 'Vehicle is not available for these dates' });
    }

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        vehicleId,
        startDate: start,
        endDate: end,
        status,
        totalPrice
      },
      include: {
        vehicle: {
          include: {
            images: true
          }
        }
      }
    });

    res.json(reservation);
  } catch (error) {
    console.error('Reservation error:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

app.get('/reservations', async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        vehicle: {
          include: {
            images: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 