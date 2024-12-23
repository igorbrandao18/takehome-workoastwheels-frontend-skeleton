import { Request, Response } from 'express';
import { VehicleService } from '../../../application/vehicle/services/vehicle.service';

const vehicleService = new VehicleService();

export class VehicleController {
  async getAllVehicles(req: Request, res: Response) {
    try {
      const vehicles = await vehicleService.findAll();
      return res.json(vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getVehicleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.findById(id);

      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      return res.json(vehicle);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createVehicle(req: Request, res: Response) {
    try {
      const vehicle = await vehicleService.create(req.body);
      return res.status(201).json(vehicle);
    } catch (error) {
      if (error instanceof Error && error.message === 'Plate already exists') {
        return res.status(409).json({ error: 'Plate already exists' });
      }
      console.error('Error creating vehicle:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.update(id, req.body);

      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      return res.json(vehicle);
    } catch (error) {
      if (error instanceof Error && error.message === 'Plate already exists') {
        return res.status(409).json({ error: 'Plate already exists' });
      }
      console.error('Error updating vehicle:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await vehicleService.delete(id);
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
} 