import { Request, Response } from 'express';
import { VehicleService } from '../../../application/vehicle/services/vehicle.service';

const vehicleService = new VehicleService();

export class VehicleController {
  async findAll(req: Request, res: Response) {
    try {
      const vehicles = await vehicleService.findAll();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.findById(id);

      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      return res.json(vehicle);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const vehicle = await vehicleService.create(req.body);
      return res.status(201).json(vehicle);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.update(id, req.body);
      return res.json(vehicle);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await vehicleService.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getOptions(req: Request, res: Response) {
    try {
      const vehicles = await vehicleService.findAll();
      const classifications = [...new Set(vehicles.map(v => v.classification))];
      
      res.json({
        classifications,
        statuses: ['AVAILABLE', 'RESERVED', 'MAINTENANCE'],
        years: [...new Set(vehicles.map(v => v.year))].sort((a, b) => b - a)
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 