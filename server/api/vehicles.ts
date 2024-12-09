import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const vehiclesRouter = router({
  options: publicProcedure.query(async ({ ctx }) => {
    const [classifications, makes, years, doors, passengers] = await Promise.all([
      ctx.db.vehicle.findMany({
        select: { classification: true },
        distinct: ['classification'],
        orderBy: { classification: 'asc' }
      }),
      ctx.db.vehicle.findMany({
        select: { make: true },
        distinct: ['make'],
        orderBy: { make: 'asc' }
      }),
      ctx.db.vehicle.findMany({
        select: { year: true },
        distinct: ['year'],
        orderBy: { year: 'desc' }
      }),
      ctx.db.vehicle.findMany({
        select: { doors: true },
        distinct: ['doors'],
        orderBy: { doors: 'asc' }
      }),
      ctx.db.vehicle.findMany({
        select: { max_passengers: true },
        distinct: ['max_passengers'],
        orderBy: { max_passengers: 'asc' }
      })
    ]);

    return {
      classifications: classifications.map(c => c.classification),
      makes: makes.map(m => m.make),
      years: years.map(y => y.year),
      doors: doors.map(d => d.doors),
      maxPassengers: passengers.map(p => p.max_passengers)
    };
  }),
  
  search: publicProcedure
    .input(z.object({
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      minPassengers: z.number().optional(),
      classification: z.array(z.string()).optional(),
      make: z.array(z.string()).optional(),
      price: z.array(z.number()).optional(),
      maxYear: z.number().optional(),
      doors: z.number().optional(),
      page: z.number().optional().default(1),
      perPage: z.number().optional().default(10),
      sortBy: z.enum(['price_asc', 'price_desc', 'year_desc', 'year_asc']).optional().default('price_asc'),
    }))
    .query(async ({ ctx, input }) => {
      const { page = 1, perPage = 10 } = input;
      
      const where: any = {};
      
      if (input.minPassengers) {
        where.max_passengers = { gte: input.minPassengers };
      }
      
      if (input.classification?.length) {
        where.classification = { in: input.classification };
      }
      
      if (input.make?.length) {
        where.make = { in: input.make };
      }
      
      if (input.price) {
        where.hourly_rate_cents = {
          gte: input.price[0] * 100,
          lte: input.price[1] * 100
        };
      }
      
      if (input.maxYear) {
        where.year = { lte: input.maxYear };
      }
      
      if (input.doors) {
        where.doors = input.doors;
      }

      if (input.startTime && input.endTime) {
        where.NOT = {
          reservations: {
            some: {
              OR: [
                {
                  start_time: { lte: input.endTime },
                  end_time: { gte: input.startTime }
                }
              ]
            }
          }
        };
      }

      const orderBy = {
        price_asc: { hourly_rate_cents: 'asc' as const },
        price_desc: { hourly_rate_cents: 'desc' as const },
        year_desc: { year: 'desc' as const },
        year_asc: { year: 'asc' as const }
      }[input.sortBy || 'price_asc'];

      const [total, vehicles] = await Promise.all([
        ctx.db.vehicle.count({ where }),
        ctx.db.vehicle.findMany({
          where,
          take: perPage,
          skip: (page - 1) * perPage,
          orderBy,
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            doors: true,
            max_passengers: true,
            classification: true,
            thumbnail_url: true,
            hourly_rate_cents: true,
            _count: {
              select: {
                reservations: true
              }
            }
          }
        })
      ]);

      return {
        vehicles,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / perPage),
          totalItems: total,
          itemsPerPage: perPage,
          hasNextPage: total > page * perPage,
          hasPreviousPage: page > 1
        }
      };
    }),
}); 