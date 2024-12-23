import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';

const router = Router();
const vehicleController = new VehicleController();

// Get all vehicles
router.get('/', vehicleController.findAll);

// Get vehicle by id
router.get('/:id', vehicleController.findById);

// Update vehicle status
router.patch('/:id/status', vehicleController.updateStatus);

export default router; 