import { Router } from 'express';
import { VehicleController } from '../controllers/VehicleController';
import { AuthenticationMiddleware } from '../middlewares/authentication';
import { ValidationMiddleware } from '../middlewares/validation';
import { z } from 'zod';

export function createVehicleRoutes(
  controller: VehicleController,
  authMiddleware: AuthenticationMiddleware,
  validationMiddleware: ValidationMiddleware
): Router {
  const router = Router();

  // Schemas
  const createVehicleSchema = z.object({
    body: z.object({
      model: z.string().min(1),
      plate: z.string().regex(/^[A-Z]{3}\d{4}$/),
      year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
      classification: z.enum(['BASIC', 'INTERMEDIATE', 'LUXURY'])
    })
  });

  const updateVehicleSchema = z.object({
    body: z.object({
      model: z.string().min(1).optional(),
      plate: z.string().regex(/^[A-Z]{3}\d{4}$/).optional(),
      year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
      classification: z.enum(['BASIC', 'INTERMEDIATE', 'LUXURY']).optional(),
      status: z.enum(['AVAILABLE', 'MAINTENANCE', 'RESERVED']).optional()
    })
  });

  const listVehiclesSchema = z.object({
    query: z.object({
      startTime: z.string().datetime().optional(),
      endTime: z.string().datetime().optional(),
      classification: z.enum(['BASIC', 'INTERMEDIATE', 'LUXURY']).optional()
    })
  });

  // Public routes
  router.get(
    '/',
    validationMiddleware.validate(listVehiclesSchema),
    controller.list
  );

  router.get('/:id', controller.getById);

  // Protected routes
  router.use(authMiddleware.authenticate);
  router.use(authMiddleware.requireRole(['ADMIN']));

  router.post(
    '/',
    validationMiddleware.validate(createVehicleSchema),
    controller.create
  );

  router.put(
    '/:id',
    validationMiddleware.validate(updateVehicleSchema),
    controller.update
  );

  router.delete('/:id', controller.delete);

  router.post('/:id/maintenance', controller.setMaintenance);

  return router;
} 