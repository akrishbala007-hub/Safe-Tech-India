import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    try {
        const body = await req.text()
        const signature = req.headers.get('x-razorpay-signature')

        if (!signature) {
            return NextResponse.json({ error: 'No signature provided' }, { status: 400 })
        }

        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET!

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex')

        if (expectedSignature !== signature) {
            console.error('Webhook signature mismatch')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
        }

        const event = JSON.parse(body)
        console.log('Razorpay Webhook Event:', event.event)

        if (event.event === 'payment.captured' || event.event === 'order.paid') {
            const order = event.payload.order?.entity || event.payload.payment?.entity
            const userId = order.notes?.user_id

            if (userId) {
                const supabase = await createClient()
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        subscription_status: 'active',
                        is_verified: true,
                        status: 'verified',
                        subscription_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
                    })
                    .eq('id', userId)

                if (error) {
                    console.error('Webhook DB Update Error:', error)
                } else {
                    console.log(`Successfully verified user ${userId} via webhook`)
                }
            }
        }

        return NextResponse.json({ status: 'ok' })
    } catch (error: any) {
        console.error('Webhook Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
