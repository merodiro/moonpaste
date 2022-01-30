/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { getSession } from 'next-auth/react'
import { v4 as uuidv4 } from 'uuid'

import { createRouter } from '../create-router'
import { buildSupabasePublicUrl, contentSizeInBytes } from '@/utils/helpers'
import supabase from '@/utils/supabase'
import prisma from '@/utils/prisma'
import { addPasteSchema } from '@/validators/paste'

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

    if (error || !data?.Key) {
      throw error ?? new Error('unable to create paste')
    }

    return {
      content: contentChunk,
      url: buildSupabasePublicUrl(data.Key),
    }
  } else {
    return { content }
  }
}

export const pasteRouter = createRouter()
  // create
  .mutation('add', {
    input: addPasteSchema,
    async resolve({ ctx, input }) {
      const session = await getSession({ ctx })
      const fullContent = input.content
      let { content, url } = await getPasteContentAndUrl(fullContent)

      const dbPaste = await prisma.paste.create({
        data: {
          content,
          url,
          userId: session?.id as string | undefined,
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
