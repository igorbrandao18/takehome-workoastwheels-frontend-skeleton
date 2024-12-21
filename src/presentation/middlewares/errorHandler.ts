import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../domain/errors/ValidationError';
import { Logger } from '../../infrastructure/logging/Logger';

export class ErrorHandlerMiddleware {
  constructor(private readonly logger: Logger) {}

  handle = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (error instanceof ValidationError) {
      res.status(400).json({
        error: error.message
      });
      return;
    }

    this.logger.error('Unhandled error', {
      error: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method
    });

    res.status(500).json({
      error: 'Internal server error'
    });
  };
} 