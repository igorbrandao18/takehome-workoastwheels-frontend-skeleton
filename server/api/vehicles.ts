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

  search: publicProcedure
    .input(z.object({
      startTime: z.string(),
      endTime: z.string(),
      minPassengers: z.number().optional(),
      classification: z.array(z.string()).optional(),
      make: z.array(z.string()).optional(),
      price: z.array(z.number()).optional(),
      year: z.object({
        lte: z.number()
      }).optional(),
      page: z.number().default(1),
    }))
    .query(async ({ ctx, input }) => {
      // Converter preços para centavos
      const minPrice = input.price ? input.price[0] * 100 : undefined;
      const maxPrice = input.price ? input.price[1] * 100 : undefined;

      const vehicles = await ctx.db.vehicle.findMany({
        where: {
          max_passengers: input.minPassengers 
            ? { gte: input.minPassengers }
            : undefined,
          classification: input.classification?.length 
            ? { in: input.classification }
            : undefined,
          make: input.make?.length 
            ? { in: input.make }
            : undefined,
          year: input.year 
            ? { lte: input.year.lte }
            : undefined,
          hourly_rate_cents: {
            gte: minPrice,
            lte: maxPrice
          },
        },
        take: 10,
        skip: (input.page - 1) * 10,
      });

      // Aplicar o mesmo filtro na contagem total
      const total = await ctx.db.vehicle.count({
        where: {
          max_passengers: input.minPassengers 
            ? { gte: input.minPassengers }
            : undefined,
          classification: input.classification?.length 
            ? { in: input.classification }
            : undefined,
          make: input.make?.length 
            ? { in: input.make }
            : undefined,
          hourly_rate_cents: {
            gte: minPrice,
            lte: maxPrice
          },
        },
      });

      return {
        vehicles,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / 10),
          currentPage: input.page,
        },
      };
    }),
});