import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../infrastructure/logging/Logger';

interface CorsConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge: number;
  credentials: boolean;
}

export class CorsMiddleware {
  constructor(
    private readonly config: CorsConfig,
    private readonly logger: Logger
  ) {}

  handle = (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin;

    // Check if origin is allowed
    if (origin && this.isOriginAllowed(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Allow credentials if enabled
    if (this.config.credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // Set exposed headers
    if (this.config.exposedHeaders.length > 0) {
      res.setHeader(
        'Access-Control-Expose-Headers',
        this.config.exposedHeaders.join(', ')
      );
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      // Set allowed methods
      res.setHeader(
        'Access-Control-Allow-Methods',
        this.config.allowedMethods.join(', ')
      );

      // Set allowed headers
      res.setHeader(
        'Access-Control-Allow-Headers',
        this.config.allowedHeaders.join(', ')
      );

      // Set max age
      res.setHeader('Access-Control-Max-Age', String(this.config.maxAge));

      // End preflight request
      res.status(204).end();
      return;
    }

    next();
  };

  private isOriginAllowed(origin: string): boolean {
    return this.config.allowedOrigins.some(allowed => {
      if (allowed === '*') {
        return true;
      }

      if (allowed.startsWith('*.')) {
        const domain = allowed.substring(2);
        return origin.endsWith(domain);
      }

      return origin === allowed;
    });
  }
} 