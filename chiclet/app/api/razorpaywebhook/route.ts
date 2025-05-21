import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const signature = req.headers.get('x-razorpay-signature');

  const rawBody = await req.text();

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    console.error('❌ Invalid signature');
    return new NextResponse('Invalid signature', { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === 'payment.captured') {
    const paymentData = event.payload.payment.entity;
    console.log('✅ Payment captured:', paymentData.id);

    const { error: paymentError } = await supabase
      .from('payments')
      .insert([
        {
          razorpay_payment_id: paymentData.id,
          amount: paymentData.amount / 100, 
          currency: paymentData.currency,
          payment_status: "success", 
          paid_at: new Date(paymentData.created_at * 1000).toISOString(),
        },
      ]);
    if (paymentError) {
      console.error('❌ Failed to update order in Supabase:', paymentError.message);
      return new NextResponse('DB error', { status: 500 });
    }

    console.log('✅ Order marked as paid:', paymentData.order_id);
  }

  return NextResponse.json({ received: true });
}
