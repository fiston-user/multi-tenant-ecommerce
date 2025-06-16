import { Prisma } from '@prisma/client';

export function createTenantMiddleware(tenantId?: string) {
  return Prisma.defineExtension({
    name: 'tenant-isolation',
    query: {
      // Automatically filter tenant-specific models
      product: {
        async $allOperations({ model, operation, args, query }) {
          if (tenantId && ['findFirst', 'findMany', 'count', 'aggregate'].includes(operation)) {
            args.where = { ...args.where, tenantId };
          }
          if (tenantId && ['create', 'createMany'].includes(operation)) {
            if (operation === 'create') {
              args.data = { ...args.data, tenantId };
            } else if (operation === 'createMany') {
              args.data = args.data.map((item: any) => ({ ...item, tenantId }));
            }
          }
          return query(args);
        },
      },
      category: {
        async $allOperations({ model, operation, args, query }) {
          if (tenantId && ['findFirst', 'findMany', 'count', 'aggregate'].includes(operation)) {
            args.where = { ...args.where, tenantId };
          }
          if (tenantId && ['create', 'createMany'].includes(operation)) {
            if (operation === 'create') {
              args.data = { ...args.data, tenantId };
            } else if (operation === 'createMany') {
              args.data = args.data.map((item: any) => ({ ...item, tenantId }));
            }
          }
          return query(args);
        },
      },
      order: {
        async $allOperations({ model, operation, args, query }) {
          if (tenantId && ['findFirst', 'findMany', 'count', 'aggregate'].includes(operation)) {
            args.where = { ...args.where, tenantId };
          }
          if (tenantId && ['create', 'createMany'].includes(operation)) {
            if (operation === 'create') {
              args.data = { ...args.data, tenantId };
            } else if (operation === 'createMany') {
              args.data = args.data.map((item: any) => ({ ...item, tenantId }));
            }
          }
          return query(args);
        },
      },
    },
  });
}