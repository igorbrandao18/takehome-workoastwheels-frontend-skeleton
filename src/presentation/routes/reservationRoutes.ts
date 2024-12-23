import { Router } from 'express';
import { ReservationController } from '../controllers/ReservationController';
import { AuthenticationMiddleware } from '../middlewares/authentication';
import { ValidationMiddleware } from '../middlewares/validation';
import { z } from 'zod';

export function createReservationRoutes(
  controller: ReservationController,
  authMiddleware: AuthenticationMiddleware,
  validationMiddleware: ValidationMiddleware
): Router {
  const router = Router();

  // Schemas
  const createReservationSchema = z.object({
    body: z.object({
      vehicleId: z.string().uuid(),
      startTime: z.string().datetime(),
      endTime: z.string().datetime()
    })
  });

  const updateReservationSchema = z.object({
    body: z.object({
      status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
    })
  });

  // All routes require authentication
  router.use(authMiddleware.authenticate);

  // User routes
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post(
    '/',
    validationMiddleware.validate(createReservationSchema),
    controller.create
  );
  router.put(
    '/:id',
    validationMiddleware.validate(updateReservationSchema),
    controller.update
  );
  router.delete('/:id', controller.delete);

  return router;
} 