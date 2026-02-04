import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
    try {
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
