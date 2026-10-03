import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/session';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: '2024-12-18.acacia', 
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cartItems, email, name, totalPrice } = body;

    // 1. Get the authenticated user's session
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    // 2. Format items for Stripe
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // 3. Create Stripe Checkout Session with userId in metadata
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        userId: session.userId, // <--- Attach user ID here
      },
    });

    // 2. Send Email Notification
    await resend.emails.send({
      from: 'Bookstore <onboarding@resend.dev>',
      to: 'khira.official1@gmail.com', // Replace with your email
      subject: '💳 Online Payment Initiated',
      html: `
        <h2>Customer at Checkout</h2>
        <p><strong>Customer:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Attempted Total:</strong> $${totalPrice}</p>
        <p>Stripe Session ID: ${stripeSession.id}</p>
      `,
    });



console.log("Email function executed.");

    return NextResponse.json({ url: stripeSession.url });
  } catch (err: any) {
    console.error("Stripe Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}