import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../infrastructure/logging/Logger';
import { Transform } from 'stream';
import zlib from 'zlib';

interface CompressionConfig {
  level: number;
  threshold: number;
  filter: (req: Request, res: Response) => boolean;
}

export class CompressionMiddleware {
  constructor(
    private readonly config: CompressionConfig,
    private readonly logger: Logger
  ) {}

  handle = (req: Request, res: Response, next: NextFunction): void => {
    // Skip compression if conditions are not met
    if (!this.shouldCompress(req, res)) {
      next();
      return;
    }

    // Get accepted encodings
    const acceptEncoding = req.headers['accept-encoding'] || '';

    // Choose compression method
    let stream: Transform;
    let encoding: string;

    if (acceptEncoding.includes('br')) {
      stream = zlib.createBrotliCompress({
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: this.config.level
        }
      });
      encoding = 'br';
    } else if (acceptEncoding.includes('gzip')) {
      stream = zlib.createGzip({
        level: this.config.level
      });
      encoding = 'gzip';
    } else if (acceptEncoding.includes('deflate')) {
      stream = zlib.createDeflate({
        level: this.config.level
      });
      encoding = 'deflate';
    } else {
      next();
      return;
    }

    this.setupCompression(res, stream, encoding);
    next();
  };

  private shouldCompress(req: Request, res: Response): boolean {
    // Skip if already compressed
    if (res.getHeader('Content-Encoding')) {
      return false;
    }

    // Skip if content length is below threshold
    const length = parseInt(res.getHeader('Content-Length') as string, 10);
    if (!isNaN(length) && length < this.config.threshold) {
      return false;
    }

    // Apply custom filter
    return this.config.filter(req, res);
  }

  private setupCompression(
    res: Response,
    stream: Transform,
    encoding: string
  ): void {
    const oldWrite = res.write;
    const oldEnd = res.end;

    // Compress data on write
    res.write = function (chunk: any, encoding?: any, callback?: any) {
      stream.write(chunk, encoding);
      return true;
    };

    // Compress data on end
    res.end = function (chunk?: any, encoding?: any, callback?: any) {
      if (chunk) {
        stream.write(chunk, encoding);
      }
      stream.end();
      return res;
    };

    // Set appropriate headers
    res.setHeader('Content-Encoding', encoding);
    res.removeHeader('Content-Length');

    // Pipe compressed data to response
    stream.pipe(res);

    // Handle stream errors
    stream.on('error', error => {
      this.logger.error('Compression error', error);
    });
  }
} 