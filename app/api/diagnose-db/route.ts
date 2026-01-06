
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ status: 'error', message: 'Missing env vars' })
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // 1. List all tables
        // Since we don't have direct SQL, we'll try to guess or use a common trick
        const tables = ['profiles', 'requirements', 'products', 'leads', 'service_requests', 'requirement_dealers']
        const results: any = {}

        for (const t of tables) {
            const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true })
            results[t] = error ? { error: error.message } : { count: count }
        }

        return NextResponse.json({
            status: 'success',
            diagnostics: {
                table_counts: results,
                timestamp: new Date().toISOString()
            }
        })

    } catch (error: any) {
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
    }
}
