import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../infrastructure/logging/Logger';
import { ValidationError } from '../../domain/errors/ValidationError';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export class RateLimitMiddleware {
  private store: RateLimitStore = {};

  constructor(
    private readonly config: RateLimitConfig,
    private readonly logger: Logger
  ) {}

  limit = (req: Request, res: Response, next: NextFunction): void => {
    const key = this.getKey(req);
    const now = Date.now();

    // Clean up expired entries
    this.cleanup(now);

    // Get or create rate limit info
    const info = this.store[key] || {
      count: 0,
      resetTime: now + this.config.windowMs
    };

    // Reset if window has expired
    if (now > info.resetTime) {
      info.count = 0;
      info.resetTime = now + this.config.windowMs;
    }

    // Increment request count
    info.count++;

    // Update store
    this.store[key] = info;

    // Check if limit exceeded
    if (info.count > this.config.maxRequests) {
      const retryAfter = Math.ceil((info.resetTime - now) / 1000);

      this.logger.warn('Rate limit exceeded', {
        key,
        count: info.count,
        limit: this.config.maxRequests,
        retryAfter
      });

      res.set('Retry-After', String(retryAfter));
      res.status(429).json({
        error: 'Too many requests',
        retryAfter
      });
      return;
    }

    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': String(this.config.maxRequests),
      'X-RateLimit-Remaining': String(
        Math.max(0, this.config.maxRequests - info.count)
      ),
      'X-RateLimit-Reset': String(Math.ceil(info.resetTime / 1000))
    });

    next();
  };

  private getKey(req: Request): string {
    return req.ip || req.headers['x-forwarded-for'] || 'unknown';
  }

  private cleanup(now: number): void {
    for (const key in this.store) {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    }
  }
} 