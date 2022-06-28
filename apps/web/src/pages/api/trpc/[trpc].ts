/**
 * This file contains the tRPC http response handler and context creation for Next.js
 */
import * as trpcNext from '@trpc/server/adapters/next'
import { AppRouter, appRouter } from '@/server/routers/_app'
import { createContext } from '@/server/context'

export default trpcNext.createNextApiHandler<AppRouter>({
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext,
  /**
   * Data transformer
   * @link https://trpc.io/docs/data-transformers
   */

  /**
   * @link https://trpc.io/docs/error-handling
   */
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error)
    }
  },
  /**
   * Enable query batching
   */
  batching: {
    enabled: true,
  },
})

export const config = {
  runtime: 'experimental-edge',
}
