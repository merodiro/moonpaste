/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter } from '../create-router'

export const pasteRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      content: z.string().min(1),
    }),
    async resolve({ ctx, input }) {
      console.log('add', input)
      const paste = await ctx.prisma.paste.create({
        data: input,
      })
      return paste
    },
  })
  // read
  .query('all', {
    async resolve({ ctx }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return ctx.prisma.paste.findMany({
        select: {
          id: true,
          content: true,
        },
      })
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input
      const paste = await ctx.prisma.paste.findUnique({
        where: { id },
        select: {
          id: true,
          content: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!paste) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No paste with id '${id}'`,
        })
      }
      return paste
    },
  })
