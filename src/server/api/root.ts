import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { shopRouter } from './routers/shop';
import { productRouter } from './routers/product';
import { userRouter } from './routers/user';

export const appRouter = createTRPCRouter({
  shop: shopRouter,
  product: productRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);