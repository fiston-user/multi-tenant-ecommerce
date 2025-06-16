import { TRPCError, initTRPC } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { type Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { authOptions } from '@/server/auth';
import { db } from '@/server/db';

type CreateContextOptions = {
  session: Session | null;
  tenantId?: string;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
    tenantId: opts.tenantId,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  
  // Handle both API routes and fetch requests
  let session = null;
  try {
    if (req && res) {
      session = await getServerSession(req, res, authOptions);
    }
  } catch (error) {
    console.warn('Failed to get session:', error);
  }
  
  // Extract tenant from subdomain
  let host = '';
  if (req?.headers?.host) {
    host = req.headers.host;
  } else if (req?.headers) {
    const headers = req.headers as { get?: (key: string) => string | null };
    if (typeof headers.get === 'function') {
      host = headers.get('host') || '';
    }
  }
  const subdomain = host.split('.')[0];
  const tenantId = subdomain !== 'localhost' && subdomain !== 'www' ? subdomain : undefined;

  return createInnerTRPCContext({
    session,
    tenantId,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  const result = await next();
  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms`);
  return result;
});

export const publicProcedure = t.procedure.use(timingMiddleware);

export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });

export const tenantProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.tenantId) {
      throw new TRPCError({ 
        code: 'BAD_REQUEST',
        message: 'Tenant ID is required for this operation'
      });
    }
    return next({
      ctx: {
        ...ctx,
        tenantId: ctx.tenantId,
      },
    });
  });