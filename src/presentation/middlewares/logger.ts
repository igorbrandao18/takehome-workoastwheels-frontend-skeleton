import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../infrastructure/logging/Logger';

export class LoggerMiddleware {
  constructor(private readonly logger: Logger) {}

  logRequest = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      const method = req.method;
      const path = req.path;
      const query = req.query;
      const userId = req.user?.userId;

      this.logger.info('Request completed', {
        method,
        path,
        query,
        userId,
        statusCode,
        duration
      });
    });

    next();
  };

  logError = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    this.logger.error('Request error', {
      error: error.message,
      stack: error.stack,
      method: req.method,
      path: req.path,
      query: req.query,
      userId: req.user?.userId
    });

    next(error);
  };
} 