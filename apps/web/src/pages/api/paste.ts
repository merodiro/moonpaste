import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'

import { Paste } from '@prisma/client'
import prisma from '@/utils/prisma'
import supabase from '@/utils/supabase'
import { contentSizeInBytes, buildSupabasePublicUrl } from '@/utils/helpers'

const CONTENT_BYTESIZE_THRESHOLD = 100 * 1000

interface ICreatePasteRequest extends NextApiRequest {
  body: {
    content: string
  }
}

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

export default async function handler(req: ICreatePasteRequest, res: NextApiResponse<Paste>) {
  if (req.method === 'POST') {
    //@todo: validate content

    const fullContent = req.body.content
    let { content, url } = await getPasteContentAndUrl(fullContent)

    const dbPaste = await prisma.paste.create({
      data: {
        content,
        url,
      },
    })

    return res.status(201).json(dbPaste)
  }
}
