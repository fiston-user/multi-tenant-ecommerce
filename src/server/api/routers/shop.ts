import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, tenantProcedure, publicProcedure } from '@/server/api/trpc';

export const shopRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        subdomain: z.string().min(1).regex(/^[a-z0-9-]+$/),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingShop = await ctx.db.tenant.findUnique({
        where: { subdomain: input.subdomain },
      });

      if (existingShop) {
        throw new Error('Subdomain already taken');
      }

      const shop = await ctx.db.tenant.create({
        data: {
          name: input.name,
          subdomain: input.subdomain,
          description: input.description,
          ownerId: ctx.session.user.id,
        },
      });

      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { tenantId: shop.id },
      });

      return shop;
    }),

  getBySubdomain: publicProcedure
    .input(z.object({ subdomain: z.string() }))
    .query(async ({ ctx, input }) => {
      const shop = await ctx.db.tenant.findUnique({
        where: { subdomain: input.subdomain },
        include: {
          owner: {
            select: { name: true, email: true },
          },
          products: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      return shop;
    }),

  getMyShop: protectedProcedure.query(async ({ ctx }) => {
    const shop = await ctx.db.tenant.findFirst({
      where: { ownerId: ctx.session.user.id },
      include: {
        products: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            products: true,
            orders: true,
          },
        },
      },
    });

    return shop;
  }),

  update: tenantProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        customDomain: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const shop = await ctx.db.tenant.update({
        where: { subdomain: ctx.tenantId },
        data: input,
      });

      return shop;
    }),
});