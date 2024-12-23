import { Request, Response } from 'express';
import { VehicleService } from '../../../application/vehicle/services/vehicle.service';

const vehicleService = new VehicleService();

export class VehicleController {
  async findAll(_req: Request, res: Response) {
    try {
      const vehicles = await vehicleService.findAll();
      return res.json(vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.findById(id);
      return res.json(vehicle);
    } catch (error) {
      if (error instanceof Error && error.message === 'Vehicle not found') {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      console.error('Error fetching vehicle:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const vehicle = await vehicleService.updateStatus(id, status);
      return res.json(vehicle);
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
} 