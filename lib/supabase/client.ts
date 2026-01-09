import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const createClient = () => createBrowserClient(supabaseUrl, supabaseKey)

// Export a singleton for client-side usage to avoid multiple instances
export const supabase = createClient()
