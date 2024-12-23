import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../domain/errors/ValidationError';
import { Logger } from '../../infrastructure/logging/Logger';
import { z } from 'zod';

export class ValidationMiddleware {
  constructor(private readonly logger: Logger) {}

  validate = (schema: z.ZodSchema) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const validatedData = await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params
        });

        req.body = validatedData.body;
        req.query = validatedData.query;
        req.params = validatedData.params;

        next();
      } catch (error) {
        if (error instanceof z.ZodError) {
          const validationErrors = error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }));

          this.logger.warn('Validation error', { errors: validationErrors });
          res.status(400).json({
            error: 'Validation error',
            details: validationErrors
          });
          return;
        }

        next(error);
      }
    };
  };

  validateBody = (schema: z.ZodSchema) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const validatedData = await schema.parseAsync(req.body);
        req.body = validatedData;
        next();
      } catch (error) {
        if (error instanceof z.ZodError) {
          const validationErrors = error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }));

          this.logger.warn('Body validation error', {
            errors: validationErrors
          });
          res.status(400).json({
            error: 'Validation error',
            details: validationErrors
          });
          return;
        }

        next(error);
      }
    };
  };

  validateQuery = (schema: z.ZodSchema) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const validatedData = await schema.parseAsync(req.query);
        req.query = validatedData;
        next();
      } catch (error) {
        if (error instanceof z.ZodError) {
          const validationErrors = error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }));

          this.logger.warn('Query validation error', {
            errors: validationErrors
          });
          res.status(400).json({
            error: 'Validation error',
            details: validationErrors
          });
          return;
        }

        next(error);
      }
    };
  };

  validateParams = (schema: z.ZodSchema) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const validatedData = await schema.parseAsync(req.params);
        req.params = validatedData;
        next();
      } catch (error) {
        if (error instanceof z.ZodError) {
          const validationErrors = error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }));

          this.logger.warn('Params validation error', {
            errors: validationErrors
          });
          res.status(400).json({
            error: 'Validation error',
            details: validationErrors
          });
          return;
        }

        next(error);
      }
    };
  };
} 