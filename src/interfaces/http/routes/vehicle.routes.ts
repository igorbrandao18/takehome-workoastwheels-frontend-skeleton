import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const vehicleRouter = Router();
const vehicleController = new VehicleController();

vehicleRouter.get('/', vehicleController.findAll);
vehicleRouter.get('/options', vehicleController.getOptions);
vehicleRouter.get('/:id', vehicleController.findById);

vehicleRouter.use(authMiddleware);
vehicleRouter.post('/', vehicleController.create);
vehicleRouter.put('/:id', vehicleController.update);
vehicleRouter.delete('/:id', vehicleController.delete);

export { vehicleRouter }; 