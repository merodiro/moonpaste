/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { getSession } from 'next-auth/react'
import { v4 as uuidv4 } from 'uuid'

import { publicProcedure, router } from '../trpc'
import { buildSupabasePublicUrl, contentSizeInBytes } from '@/utils/helpers'
import supabase from '@/utils/supabase'
import prisma from '@/utils/prisma'
import { addPasteSchema, updatePasteViewsSchema } from '@/validators/paste'

const CONTENT_BYTESIZE_THRESHOLD = 100 * 1000

async function getPasteContentAndUrl(content: string): Promise<{ content: string; url?: string }> {
  if (contentSizeInBytes(content) > CONTENT_BYTESIZE_THRESHOLD) {
    const contentChunk = Buffer.from(content, 'utf8').toString(
      'utf-8',
      0,
      CONTENT_BYTESIZE_THRESHOLD
    )

    const { data, error } = await supabase.storage
      .from('pastes')
      .upload(`pastes/${uuidv4()}`, content, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error || !data?.path) {
      throw error ?? new Error('unable to create paste')
    }

    return {
      content: contentChunk,
      url: buildSupabasePublicUrl(data.path),
    }
  } else {
    return { content }
  }
}

export const pasteRouter = router({
  add: publicProcedure.input(addPasteSchema).mutation(async ({ input, ctx }) => {
    const session = await getSession({ req: ctx.req })
    const { content: fullContent, language } = input
    const { content, url } = await getPasteContentAndUrl(fullContent)

    const dbPaste = await prisma.paste.create({
      data: {
        content,
        language,
        url,
        userId: session?.user.id,
      },
    })
    return dbPaste
  }),
  updateViews: publicProcedure.input(updatePasteViewsSchema).mutation(async ({ input, ctx }) => {
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
  }),
  all: publicProcedure.query(({ ctx }) => {
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
  }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ input, ctx }) => {
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
    }),
})
