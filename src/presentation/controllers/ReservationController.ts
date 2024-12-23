import { Request, Response, NextFunction } from 'express';
import { ReservationApplicationService } from '../../application/services/ReservationApplicationService';
import { IReservationRepository } from '../../domain/interfaces/IReservationRepository';
import { IVehicleRepository } from '../../domain/interfaces/IVehicleRepository';
import { ReservationDomainService } from '../../domain/services/ReservationDomainService';
import { INotificationService } from '../../application/interfaces/INotificationService';
import { Logger } from '../../infrastructure/logging/Logger';
import { TimeRange } from '../../domain/value-objects/TimeRange';

export class ReservationController {
  private service: ReservationApplicationService;

  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly vehicleRepository: IVehicleRepository,
    private readonly reservationDomainService: ReservationDomainService,
    private readonly notificationService: INotificationService,
    private readonly logger: Logger
  ) {
    this.service = new ReservationApplicationService(
      reservationRepository,
      vehicleRepository,
      reservationDomainService,
      notificationService,
      logger
    );
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user!;
      const reservations = await this.service.listUserReservations(userId);
      res.json(reservations);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const reservation = await this.service.findById(id);
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      res.json(reservation);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user!;
      const { vehicleId, startTime, endTime } = req.body;

      const timeRange = new TimeRange(new Date(startTime), new Date(endTime));
      const reservation = await this.service.createReservation({
        userId,
        vehicleId,
        timeRange
      });

      res.status(201).json(reservation);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { userId } = req.user!;
      const { status } = req.body;

      const reservation = await this.service.updateReservation(id, userId, {
        status
      });

      res.json(reservation);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { userId } = req.user!;

      await this.service.cancelReservation(id, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
} 