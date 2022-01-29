import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient

declare global {
  var supabase: SupabaseClient
}

if (process.env.NODE_ENV === 'production') {
  supabase = createClient(
    process.env.SUPABASE_ORG_URL as string,
    process.env.SUPABASE_KEY as string
  )
} else {
  if (!global.supabase) {
    global.supabase = createClient(
      process.env.SUPABASE_ORG_URL as string,
      process.env.SUPABASE_KEY as string
    )
  }
  supabase = global.supabase
}

export default supabase
