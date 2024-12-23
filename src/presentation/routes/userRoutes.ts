import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { AuthController } from '../controllers/AuthController';
import { AuthenticationMiddleware } from '../middlewares/authentication';
import { ValidationMiddleware } from '../middlewares/validation';
import { z } from 'zod';

export function createUserRoutes(
  userController: UserController,
  authController: AuthController,
  authMiddleware: AuthenticationMiddleware,
  validationMiddleware: ValidationMiddleware
): Router {
  const router = Router();

  // Schemas
  const registerSchema = z.object({
    body: z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(8)
    })
  });

  const loginSchema = z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(1)
    })
  });

  const updateProfileSchema = z.object({
    body: z.object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional()
    })
  });

  const changePasswordSchema = z.object({
    body: z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8)
    })
  });

  const refreshTokenSchema = z.object({
    body: z.object({
      refreshToken: z.string().min(1)
    })
  });

  const forgotPasswordSchema = z.object({
    body: z.object({
      email: z.string().email()
    })
  });

  const resetPasswordSchema = z.object({
    body: z.object({
      token: z.string().min(1),
      password: z.string().min(8)
    })
  });

  // Public routes
  router.post(
    '/register',
    validationMiddleware.validate(registerSchema),
    authController.register
  );

  router.post(
    '/login',
    validationMiddleware.validate(loginSchema),
    authController.login
  );

  router.post(
    '/refresh-token',
    validationMiddleware.validate(refreshTokenSchema),
    authController.refreshToken
  );

  router.post(
    '/forgot-password',
    validationMiddleware.validate(forgotPasswordSchema),
    authController.forgotPassword
  );

  router.post(
    '/reset-password',
    validationMiddleware.validate(resetPasswordSchema),
    authController.resetPassword
  );

  // Protected routes
  router.use(authMiddleware.authenticate);

  router.get('/profile', userController.getProfile);

  router.put(
    '/profile',
    validationMiddleware.validate(updateProfileSchema),
    userController.updateProfile
  );

  router.post(
    '/change-password',
    validationMiddleware.validate(changePasswordSchema),
    userController.changePassword
  );

  router.delete('/profile', userController.delete);

  router.post('/logout', authController.logout);

  return router;
} 