import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const vehiclesRouter = router({
  options: publicProcedure.query(async ({ ctx }) => {
    const [classifications, makes, years] = await Promise.all([
      ctx.db.vehicle.findMany({
        select: { classification: true },
        distinct: ['classification'],
      }),
      ctx.db.vehicle.findMany({
        select: { make: true },
        distinct: ['make'],
      }),
      ctx.db.vehicle.findMany({
        select: { year: true },
        distinct: ['year'],
        orderBy: { year: 'desc' }
      })
    ]);

    return {
      classifications: classifications.map(c => c.classification),
      makes: makes.map(m => m.make),
      years: years.map(y => y.year)
    };
  }),
  
  search: publicProcedure
    .input(z.object({
      startTime: z.string(),
      endTime: z.string(),
      minPassengers: z.number().optional(),
      classification: z.array(z.string()).optional(),
      make: z.array(z.string()).optional(),
      price: z.array(z.number()).optional(),
      year: z.number().optional(),
      doors: z.number().optional(),
      page: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const where = {
        AND: [
          input.minPassengers ? { max_passengers: { gte: input.minPassengers } } : {},
          input.classification?.length ? { classification: { in: input.classification } } : {},
          input.make?.length ? { make: { in: input.make } } : {},
          input.price ? { hourly_rate_cents: { gte: input.price[0] * 100, lte: input.price[1] * 100 } } : {},
          input.year ? { year: input.year } : {},
          input.doors ? { doors: input.doors } : {},
        ].filter(Boolean)
      };

      const vehicles = await ctx.db.vehicle.findMany({
        where,
        take: 10,
        skip: (input.page - 1) * 10,
        orderBy: { hourly_rate_cents: 'asc' }
      });

      const total = await ctx.db.vehicle.count({ where });

      return {
        vehicles,
        pagination: {
          currentPage: input.page,
          totalPages: Math.ceil(total / 10),
          totalItems: total,
          itemsPerPage: 10
        }
      };
    }),
}); 