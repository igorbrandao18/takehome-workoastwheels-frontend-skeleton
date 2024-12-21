import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ValidationError } from '../../domain/errors/ValidationError';
import { Logger } from '../../infrastructure/logging/Logger';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export class AuthenticationMiddleware {
  constructor(
    private readonly jwtSecret: string,
    private readonly logger: Logger
  ) {}

  authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = this.extractToken(req);
      if (!token) {
        throw new ValidationError('No token provided');
      }

      const decoded = jwt.verify(token, this.jwtSecret) as {
        userId: string;
        role: string;
      };

      req.user = {
        userId: decoded.userId,
        role: decoded.role
      };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        this.logger.warn('Invalid token', { error: error.message });
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      if (error instanceof ValidationError) {
        res.status(401).json({ error: error.message });
        return;
      }

      this.logger.error('Authentication error', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  requireRole = (roles: string[]) => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        if (!req.user) {
          throw new ValidationError('User not authenticated');
        }

        if (!roles.includes(req.user.role)) {
          throw new ValidationError('Insufficient permissions');
        }

        next();
      } catch (error) {
        if (error instanceof ValidationError) {
          res.status(403).json({ error: error.message });
          return;
        }

        this.logger.error('Role verification error', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
  };

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
} 