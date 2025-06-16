import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().positive(),
        images: z.array(z.string()).optional(),
        categoryId: z.string().optional(),
        inventory: z.number().int().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userTenant = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { tenantId: true },
      });

      if (!userTenant?.tenantId) {
        throw new Error('You must have a shop to create products');
      }

      // Generate slug from name
      const slug = generateSlug(input.name);
      
      // Check if slug already exists for this tenant
      const existingProduct = await ctx.db.product.findFirst({
        where: {
          slug,
          tenantId: userTenant.tenantId,
        },
      });

      let finalSlug = slug;
      if (existingProduct) {
        // Append a number to make it unique
        const timestamp = Date.now().toString().slice(-4);
        finalSlug = `${slug}-${timestamp}`;
      }

      const product = await ctx.db.product.create({
        data: {
          ...input,
          slug: finalSlug,
          tenantId: userTenant.tenantId,
        },
      });

      return product;
    }),

  getAll: publicProcedure
    .input(
      z.object({
        tenantId: z.string(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        categoryId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          tenantId: input.tenantId,
          isActive: true,
          ...(input.categoryId && { categoryId: input.categoryId }),
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (products.length > input.limit) {
        const nextItem = products.pop();
        nextCursor = nextItem!.id;
      }

      return {
        products,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        include: {
          category: true,
          tenant: {
            select: { name: true, subdomain: true },
          },
        },
      });

      return product;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        images: z.array(z.string()).optional(),
        categoryId: z.string().optional(),
        inventory: z.number().int().min(0).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const product = await ctx.db.product.findFirst({
        where: {
          id,
          tenant: { ownerId: ctx.session.user.id },
        },
      });

      if (!product) {
        throw new Error('Product not found or you do not have permission to edit it');
      }

      const updatedProduct = await ctx.db.product.update({
        where: { id },
        data,
      });

      return updatedProduct;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.findFirst({
        where: {
          id: input.id,
          tenant: { ownerId: ctx.session.user.id },
        },
      });

      if (!product) {
        throw new Error('Product not found or you do not have permission to delete it');
      }

      await ctx.db.product.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});