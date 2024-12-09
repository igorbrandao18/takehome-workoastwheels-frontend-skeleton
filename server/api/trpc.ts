import { initTRPC } from '@trpc/server';
import { vehiclesRouter } from './vehicles';

const t = initTRPC.create();

export const appRouter = t.router({
  vehicles: vehiclesRouter,
});

export type AppRouter = typeof appRouter; 