import { Request, Response, NextFunction } from 'express';
import { VehicleApplicationService } from '../../application/services/VehicleApplicationService';
import { IVehicleRepository } from '../../domain/interfaces/IVehicleRepository';
import { IReservationRepository } from '../../domain/interfaces/IReservationRepository';
import { VehicleDomainService } from '../../domain/services/VehicleDomainService';
import { INotificationService } from '../../application/interfaces/INotificationService';
import { Logger } from '../../infrastructure/logging/Logger';

export class VehicleController {
  private service: VehicleApplicationService;

  constructor(
    private readonly vehicleRepository: IVehicleRepository,
    private readonly reservationRepository: IReservationRepository,
    private readonly vehicleDomainService: VehicleDomainService,
    private readonly notificationService: INotificationService,
    private readonly logger: Logger
  ) {
    this.service = new VehicleApplicationService(
      vehicleRepository,
      reservationRepository,
      vehicleDomainService,
      notificationService,
      logger
    );
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startTime, endTime, classification } = req.query;
      const vehicles = await this.service.getAvailableVehicles(
        startTime ? new Date(startTime as string) : new Date(),
        endTime ? new Date(endTime as string) : new Date(),
        classification as string
      );
      res.json(vehicles);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const vehicle = await this.service.findById(id);
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      res.json(vehicle);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vehicle = await this.service.createVehicle(req.body);
      res.status(201).json(vehicle);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const vehicle = await this.service.updateVehicle(id, req.body);
      res.json(vehicle);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.service.deleteVehicle(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  setMaintenance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const vehicle = await this.service.setMaintenance(id);
      res.json(vehicle);
    } catch (error) {
      next(error);
    }
  };
} 