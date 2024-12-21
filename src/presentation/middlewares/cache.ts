import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../infrastructure/logging/Logger';

interface CacheConfig {
  maxAge: number;
  private: boolean;
  noCache: boolean;
  noStore: boolean;
  mustRevalidate: boolean;
  proxyRevalidate: boolean;
  sMaxAge: number;
  staleWhileRevalidate: number;
  staleIfError: number;
  vary: string[];
}

export class CacheMiddleware {
  constructor(
    private readonly config: CacheConfig,
    private readonly logger: Logger
  ) {}

  handle = (req: Request, res: Response, next: NextFunction): void => {
    // Set Cache-Control header
    const directives: string[] = [];

    if (this.config.private) {
      directives.push('private');
    } else {
      directives.push('public');
    }

    if (this.config.noCache) {
      directives.push('no-cache');
    }

    if (this.config.noStore) {
      directives.push('no-store');
    }

    if (this.config.mustRevalidate) {
      directives.push('must-revalidate');
    }

    if (this.config.proxyRevalidate) {
      directives.push('proxy-revalidate');
    }

    if (this.config.maxAge > 0) {
      directives.push(`max-age=${this.config.maxAge}`);
    }

    if (this.config.sMaxAge > 0) {
      directives.push(`s-maxage=${this.config.sMaxAge}`);
    }

    if (this.config.staleWhileRevalidate > 0) {
      directives.push(
        `stale-while-revalidate=${this.config.staleWhileRevalidate}`
      );
    }

    if (this.config.staleIfError > 0) {
      directives.push(`stale-if-error=${this.config.staleIfError}`);
    }

    res.setHeader('Cache-Control', directives.join(', '));

    // Set Vary header
    if (this.config.vary.length > 0) {
      res.setHeader('Vary', this.config.vary.join(', '));
    }

    // Set Last-Modified header
    res.setHeader('Last-Modified', new Date().toUTCString());

    // Set ETag header
    const etag = this.generateETag(req);
    res.setHeader('ETag', etag);

    // Check If-None-Match header
    const ifNoneMatch = req.headers['if-none-match'];
    if (ifNoneMatch === etag) {
      res.status(304).end();
      return;
    }

    // Check If-Modified-Since header
    const ifModifiedSince = req.headers['if-modified-since'];
    if (ifModifiedSince) {
      const lastModified = new Date(ifModifiedSince);
      if (lastModified >= new Date()) {
        res.status(304).end();
        return;
      }
    }

    next();
  };

  private generateETag(req: Request): string {
    const timestamp = Date.now().toString(36);
    const path = req.path;
    const query = JSON.stringify(req.query);
    return `W/"${this.hash(`${path}-${query}-${timestamp}`)}"`;
  }

  private hash(str: string): string {
    let hash = 5381;
    let i = str.length;

    while (i) {
      hash = (hash * 33) ^ str.charCodeAt(--i);
    }

    return (hash >>> 0).toString(36);
  }
} 