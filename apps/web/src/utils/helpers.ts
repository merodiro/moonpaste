export const contentSizeInBytes = (content: string): number => {
  return Buffer.byteLength(content, 'utf8')
}

export const buildSupabasePublicUrl = (key: string) => {
  return `${process.env.SUPABASE_ORG_URL}/storage/v1/object/public/${key}`
}
