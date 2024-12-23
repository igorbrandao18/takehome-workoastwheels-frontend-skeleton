import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../infrastructure/logging/Logger';

interface SecurityConfig {
  frameguard: boolean;
  xssFilter: boolean;
  noSniff: boolean;
  ieNoOpen: boolean;
  hsts: {
    enabled: boolean;
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
  };
  referrerPolicy: string;
  contentSecurityPolicy: {
    enabled: boolean;
    directives: {
      [key: string]: string[];
    };
  };
}

export class SecurityMiddleware {
  constructor(
    private readonly config: SecurityConfig,
    private readonly logger: Logger
  ) {}

  handle = (req: Request, res: Response, next: NextFunction): void => {
    // X-Frame-Options to prevent clickjacking
    if (this.config.frameguard) {
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    }

    // X-XSS-Protection to enable browser's XSS filter
    if (this.config.xssFilter) {
      res.setHeader('X-XSS-Protection', '1; mode=block');
    }

    // X-Content-Type-Options to prevent MIME-sniffing
    if (this.config.noSniff) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }

    // X-Download-Options for IE8+
    if (this.config.ieNoOpen) {
      res.setHeader('X-Download-Options', 'noopen');
    }

    // Strict-Transport-Security
    if (this.config.hsts.enabled) {
      let header = `max-age=${this.config.hsts.maxAge}`;
      if (this.config.hsts.includeSubDomains) {
        header += '; includeSubDomains';
      }
      if (this.config.hsts.preload) {
        header += '; preload';
      }
      res.setHeader('Strict-Transport-Security', header);
    }

    // Referrer-Policy
    if (this.config.referrerPolicy) {
      res.setHeader('Referrer-Policy', this.config.referrerPolicy);
    }

    // Content-Security-Policy
    if (this.config.contentSecurityPolicy.enabled) {
      const directives = this.config.contentSecurityPolicy.directives;
      const policy = Object.entries(directives)
        .map(([key, values]) => `${key} ${values.join(' ')}`)
        .join('; ');
      res.setHeader('Content-Security-Policy', policy);
    }

    // Remove X-Powered-By header
    res.removeHeader('X-Powered-By');

    next();
  };

  private sanitizeHeaderValue(value: string): string {
    return value.replace(/[;\n\r]/g, '');
  }
} 