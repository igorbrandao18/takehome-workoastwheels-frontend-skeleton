export class Logger {
  info(message: string, meta?: Record<string, any>): void {
    console.log(this.formatLog('INFO', message, meta));
  }

  warn(message: string, meta?: Record<string, any>): void {
    console.warn(this.formatLog('WARN', message, meta));
  }

  error(message: string, error?: any): void {
    console.error(this.formatLog('ERROR', message, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    }));
  }

  debug(message: string, meta?: Record<string, any>): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatLog('DEBUG', message, meta));
    }
  }

  private formatLog(level: string, message: string, meta?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaString}`;
  }
} 