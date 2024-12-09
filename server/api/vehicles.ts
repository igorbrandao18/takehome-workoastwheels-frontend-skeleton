import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const vehiclesRouter = router({
  options: publicProcedure.query(async ({ ctx }) => {
    // Get unique classifications and makes from the database
    const classifications = await ctx.db.vehicle.findMany({
      select: { classification: true },
      distinct: ['classification'],
    });
    
    const makes = await ctx.db.vehicle.findMany({
      select: { make: true },
      distinct: ['make'],
    });

    return {
      classifications: classifications.map(c => c.classification),
      makes: makes.map(m => m.make),
    };
  }),
}); 