import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createVehicleRoutes } from './routes/vehicleRoutes';
import { createReservationRoutes } from './routes/reservationRoutes';
import { createUserRoutes } from './routes/userRoutes';
import { VehicleController } from './controllers/VehicleController';
import { ReservationController } from './controllers/ReservationController';
import { UserController } from './controllers/UserController';
import { AuthController } from './controllers/AuthController';
import { VehicleRepository } from '../infrastructure/repositories/VehicleRepository';
import { ReservationRepository } from '../infrastructure/repositories/ReservationRepository';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { VehicleDomainService } from '../domain/services/VehicleDomainService';
import { ReservationDomainService } from '../domain/services/ReservationDomainService';
import { UserDomainService } from '../domain/services/UserDomainService';
import { NotificationService } from '../infrastructure/external-services/NotificationService';
import { Logger } from '../infrastructure/logging/Logger';
import { AuthenticationMiddleware } from './middlewares/authentication';
import { ValidationMiddleware } from './middlewares/validation';
import { ErrorHandlerMiddleware } from './middlewares/errorHandler';
import { LoggerMiddleware } from './middlewares/logger';
import { RateLimitMiddleware } from './middlewares/rateLimit';
import { CorsMiddleware } from './middlewares/cors';
import { CompressionMiddleware } from './middlewares/compression';
import { SecurityMiddleware } from './middlewares/security';
import { CacheMiddleware } from './middlewares/cache';

async function bootstrap() {
  const app = express();
  const prisma = new PrismaClient();
  const logger = new Logger();

  try {
    // Middleware configuration
    const corsConfig = {
      allowedOrigins: ['http://localhost:5173'],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['X-Total-Count'],
      maxAge: 86400,
      credentials: true
    };

    const securityConfig = {
      frameguard: true,
      xssFilter: true,
      noSniff: true,
      ieNoOpen: true,
      hsts: {
        enabled: true,
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      },
      referrerPolicy: 'same-origin',
      contentSecurityPolicy: {
        enabled: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"]
        }
      }
    };

    const rateLimitConfig = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100 // limit each IP to 100 requests per windowMs
    };

    const cacheConfig = {
      maxAge: 60,
      private: false,
      noCache: false,
      noStore: false,
      mustRevalidate: true,
      proxyRevalidate: false,
      sMaxAge: 60,
      staleWhileRevalidate: 30,
      staleIfError: 60,
      vary: ['Accept', 'Accept-Encoding']
    };

    const compressionConfig = {
      level: 6,
      threshold: 1024,
      filter: (req: express.Request, res: express.Response) => {
        const contentType = res.getHeader('Content-Type') as string;
        return contentType?.includes('text') || contentType?.includes('json');
      }
    };

    // Middleware instances
    const corsMiddleware = new CorsMiddleware(corsConfig, logger);
    const securityMiddleware = new SecurityMiddleware(securityConfig, logger);
    const rateLimitMiddleware = new RateLimitMiddleware(rateLimitConfig, logger);
    const cacheMiddleware = new CacheMiddleware(cacheConfig, logger);
    const compressionMiddleware = new CompressionMiddleware(compressionConfig, logger);
    const loggerMiddleware = new LoggerMiddleware(logger);
    const errorHandler = new ErrorHandlerMiddleware(logger);
    const validationMiddleware = new ValidationMiddleware(logger);
    const authMiddleware = new AuthenticationMiddleware(
      process.env.JWT_SECRET || 'your-secret-key',
      logger
    );

    // Services
    const notificationService = new NotificationService();

    // Repositories
    const vehicleRepository = new VehicleRepository(prisma);
    const reservationRepository = new ReservationRepository(prisma);
    const userRepository = new UserRepository(prisma);

    // Domain services
    const vehicleDomainService = new VehicleDomainService();
    const reservationDomainService = new ReservationDomainService();
    const userDomainService = new UserDomainService();

    // Controllers
    const vehicleController = new VehicleController(
      vehicleRepository,
      reservationRepository,
      vehicleDomainService,
      notificationService,
      logger
    );

    const reservationController = new ReservationController(
      reservationRepository,
      vehicleRepository,
      reservationDomainService,
      notificationService,
      logger
    );

    const userController = new UserController(
      userRepository,
      userDomainService,
      notificationService,
      logger
    );

    const authController = new AuthController(
      userRepository,
      userDomainService,
      notificationService,
      logger
    );

    // Middleware setup
    app.use(express.json());
    app.use(corsMiddleware.handle);
    app.use(securityMiddleware.handle);
    app.use(rateLimitMiddleware.limit);
    app.use(compressionMiddleware.handle);
    app.use(loggerMiddleware.logRequest);

    // Routes
    app.use(
      '/api/vehicles',
      createVehicleRoutes(vehicleController, authMiddleware, validationMiddleware)
    );
    app.use(
      '/api/reservations',
      createReservationRoutes(reservationController, authMiddleware, validationMiddleware)
    );
    app.use(
      '/api/users',
      createUserRoutes(userController, authController, authMiddleware, validationMiddleware)
    );

    // Error handling
    app.use(loggerMiddleware.logError);
    app.use(errorHandler.handle);

    // Start server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

bootstrap(); 