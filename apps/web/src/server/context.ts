import { PrismaClient } from '@prisma/client/edge'
import * as trpcNext from '@trpc/server/adapters/next'
import * as trpc from '@trpc/server'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({ req, res }: trpcNext.CreateNextContextOptions) => {
  const session = await getSession({ req })

  return {
    req,
    res,
    prisma,
    session,
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
