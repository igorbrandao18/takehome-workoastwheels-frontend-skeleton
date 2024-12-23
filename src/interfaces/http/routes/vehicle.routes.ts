import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const vehicleRouter = Router();
const vehicleController = new VehicleController();

// Public routes
vehicleRouter.get('/', vehicleController.getAllVehicles);
vehicleRouter.get('/:id', vehicleController.getVehicleById);

// Protected routes
vehicleRouter.post('/', authMiddleware, adminMiddleware, vehicleController.createVehicle);
vehicleRouter.put('/:id', authMiddleware, adminMiddleware, vehicleController.updateVehicle);
vehicleRouter.delete('/:id', authMiddleware, adminMiddleware, vehicleController.deleteVehicle);

export { vehicleRouter }; 