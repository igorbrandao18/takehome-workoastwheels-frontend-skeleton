import { Logger } from './Logger';

export class LoggerFactory {
    private static loggers: Map<string, Logger> = new Map();

    static getLogger(service: string): Logger {
        if (!this.loggers.has(service)) {
            this.loggers.set(service, new Logger(service));
        }
        return this.loggers.get(service)!;
    }

    static clearLoggers(): void {
        this.loggers.clear();
    }
} 