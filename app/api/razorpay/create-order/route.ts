import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(req: Request) {
    try {
        const keyId = process.env.RAZORPAY_KEY_ID
        const keySecret = process.env.RAZORPAY_KEY_SECRET

        if (!keyId || !keySecret) {
            console.error('SERVER ERROR: Razorpay keys are missing')
            return NextResponse.json({ error: 'Razorpay keys are not configured on the server.' }, { status: 500 })
        }

        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        })

        const { amount, userId, currency = 'INR' } = await req.json()

        const options = {
            amount: amount * 100,
            currency,
            receipt: `receipt_${Math.random().toString(36).substring(7)}`,
            notes: {
                user_id: userId
            }
        }

        const order = await razorpay.orders.create(options)

        return NextResponse.json(order)
    } catch (error: any) {
        console.error('Razorpay Order Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
