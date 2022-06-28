/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { getSession } from 'next-auth/react'

import { createRouter } from '../create-router'

import prisma from '@/utils/prisma'
import { addPasteSchema, updatePasteViewsSchema } from '@/validators/paste'

export const pasteRouter = createRouter()
  // create
  .mutation('add', {
    input: addPasteSchema,
    async resolve({ ctx, input }) {
      const session = await getSession({ req: ctx.req })
      const { content, language } = input

      const dbPaste = await prisma.paste.create({
        data: {
          content,
          language,
          userId: session?.id as string | undefined,
        },
      })
      return dbPaste
    },
  })
  .mutation('updateViews', {
    input: updatePasteViewsSchema,
    async resolve({ ctx, input }) {
      const pasteId = input.id
      const dbPaste = await prisma.paste.update({
        where: {
          id: pasteId,
        },
        data: {
          views: {
            increment: 1,
          },
          lastViewedAt: new Date(),
        },
      })
      return dbPaste
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
          language: true,
        },
      })
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input
      const paste = await ctx.prisma.paste.findUnique({
        where: { id },
        select: {
          id: true,
          content: true,
          language: true,
          views: true,
          lastViewedAt: true,
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
