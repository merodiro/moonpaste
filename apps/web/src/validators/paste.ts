import { z } from 'zod'

export const addPasteSchema = z.object({
  content: z.string().min(1),
  language: z.string().optional(),
})

export const updatePasteViewsSchema = z.object({
  id: z.string().cuid(),
})
