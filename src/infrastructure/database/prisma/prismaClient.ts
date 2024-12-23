import { PrismaClient } from '@prisma/client';
import { Logger } from '../../logging/Logger';

export class PrismaDatabase {
    private static instance: PrismaClient;
    private static logger: Logger;

    private constructor() {}

    static initialize(logger: Logger): void {
        if (!PrismaDatabase.instance) {
            PrismaDatabase.logger = logger;
            PrismaDatabase.instance = new PrismaClient({
                log: [
                    {
                        emit: 'event',
                        level: 'query',
                    },
                    {
                        emit: 'event',
                        level: 'error',
                    },
                    {
                        emit: 'event',
                        level: 'info',
                    },
                    {
                        emit: 'event',
                        level: 'warn',
                    },
                ],
            });

            // Log queries in development
            if (process.env.NODE_ENV === 'development') {
                PrismaDatabase.instance.$on('query', (e: any) => {
                    logger.debug('Prisma Query', {
                        query: e.query,
                        params: e.params,
                        duration: e.duration
                    });
                });
            }

            // Log errors
            PrismaDatabase.instance.$on('error', (e: any) => {
                logger.error('Prisma Error', {
                    message: e.message,
                    target: e.target
                });
            });
        }
    }

    static getInstance(): PrismaClient {
        if (!PrismaDatabase.instance) {
            throw new Error('Prisma client not initialized. Call initialize() first.');
        }
        return PrismaDatabase.instance;
    }

    static async connect(): Promise<void> {
        try {
            await PrismaDatabase.instance.$connect();
            PrismaDatabase.logger.info('Database connected successfully');
        } catch (error) {
            PrismaDatabase.logger.error('Failed to connect to database', error);
            throw error;
        }
    }

    static async disconnect(): Promise<void> {
        try {
            await PrismaDatabase.instance.$disconnect();
            PrismaDatabase.logger.info('Database disconnected successfully');
        } catch (error) {
            PrismaDatabase.logger.error('Failed to disconnect from database', error);
            throw error;
        }
    }
} 