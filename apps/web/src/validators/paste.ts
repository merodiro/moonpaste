import { z } from 'zod'

export const addPasteSchema = z.object({
  content: z.string().min(1),
})
