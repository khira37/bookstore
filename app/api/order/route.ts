import { createClient } from 'next-sanity';
import { NextResponse } from 'next/server';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // This allows writing to Sanity
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // This creates a new document of type 'order' in Sanity
  const newOrder = await client.create({
  _type: 'order',
  customerName: body.name,
  email: body.email,
  location: body.address,
  paymentMethod: body.paymentMethod || 'Cash on Delivery',
  totalPrice: body.totalPrice,
  items: body.items,
  status: 'pending',
});

    return NextResponse.json({ message: "Order created", orderId: newOrder._id });
  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}