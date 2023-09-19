/**
 * This file contains the root router of your tRPC-backend
 */
import { pasteRouter } from './paste'
import { publicProcedure, router } from '../trpc'

export const appRouter = router({
  greeting: publicProcedure.query(() => 'hello from tRPC v10!'),
  paste: pasteRouter,
})

export type AppRouter = typeof appRouter
