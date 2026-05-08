import Stripe from 'stripe';
import { NextResponse } from 'next/server';
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

    // 1. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: { 
            name: item.title,
            images: item.imageUrl ? [item.imageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100), 
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      customer_email: email,
      success_url: `${req.headers.get('origin')}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cart`,
    });

        console.log("Sanity updated! Attempting to send email now...");

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
        <p>Stripe Session ID: ${session.id}</p>
      `,
    });



console.log("Email function executed.");

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}