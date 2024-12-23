import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Get vehicle options (makes, classifications, etc.)
app.get('/vehicles/options', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany();
    
    const makes = [...new Set(vehicles.map(v => v.make))];
    const classifications = [...new Set(vehicles.map(v => v.classification))];
    const features = [...new Set(vehicles.filter(v => v.features).map(v => v.features!.split(',').map(f => f.trim())).flat())];
    
    res.json({
      makes,
      classifications,
      features
    });
  } catch (error) {
    console.error('Error fetching vehicle options:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle options' });
  }
});

// Search vehicles with filters
app.get('/vehicles/search', async (req, res) => {
  try {
    const {
      classification,
      make,
      status,
      minPassengers,
      priceRange,
      featured
    } = req.query;

    let whereClause: any = {};

    if (classification) {
      whereClause.classification = classification;
    }

    if (make) {
      whereClause.make = make;
    }

    if (status) {
      whereClause.status = status;
    }

    if (minPassengers) {
      whereClause.passengerCapacity = {
        gte: parseInt(minPassengers as string)
      };
    }

    if (priceRange) {
      const [min, max] = (priceRange as string).split('-').map(Number);
      whereClause.pricePerHour = {
        gte: min,
        lte: max
      };
    }

    const vehicles = await prisma.vehicle.findMany({
      where: whereClause,
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (featured === 'true') {
      res.json(vehicles.slice(0, 3));
    } else {
      res.json(vehicles);
    }
  } catch (error) {
    console.error('Error searching vehicles:', error);
    res.status(500).json({ error: 'Failed to search vehicles' });
  }
});

// Get vehicle by ID
app.get('/vehicles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
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
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 