import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const authRouter = Router();
const authController = new AuthController();

// Public routes
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

// Protected routes
authRouter.get('/profile', authMiddleware, authController.getProfile);

export { authRouter }; 