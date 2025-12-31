import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (typeof window !== 'undefined') {
    // console.log('Supabase URL Config:', supabaseUrl)
}

export const supabase = createBrowserClient(supabaseUrl, supabaseKey)
