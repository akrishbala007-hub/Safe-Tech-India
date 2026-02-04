import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            user_id
        } = await req.json()

        // 1. Verify Signature
        const text = razorpay_order_id + '|' + razorpay_payment_id
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(text)
            .digest('hex')

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
        }

        // 2. Update Database via Supabase Server Client
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { error } = await supabase
            .from('profiles')
            .update({
                subscription_status: 'active',
                is_verified: true,
                status: 'verified',
                subscription_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
            })
            .eq('id', user.id)

        if (error) {
            console.error('DB Update Error:', error)
            return NextResponse.json({ error: 'Payment verified but database update failed' }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'Payment verified and profile updated' })
    } catch (error: any) {
        console.error('Verification Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
