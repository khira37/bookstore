import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cartItems, name, email, address, totalPrice, items } = body;

    // 1. Create Order in Sanity
    const newOrder = await client.create({
      _type: "order",
      customerName: name,
      email: email,
      location: address,
      totalPrice: totalPrice,
      items: items, 
      status: "pending",
    });

    // 2. Update Stock in Sanity
    const transaction = client.transaction();
    cartItems.forEach((item: any) => {
      transaction.patch(item._id, (p) => p.dec({ stock: item.quantity }));
    });
    await transaction.commit();

    // 3. Send Email Notification
    await resend.emails.send({
      from: 'Bookstore <onboarding@resend.dev>',
      to: 'khira.official1@gmail.com', // Replace with your email
      subject: `📦 New COD Order: ${newOrder._id}`,
      html: `
        <h2>New COD Order Received</h2>
        <p><strong>Customer:</strong> ${name}</p>
        <p><strong>Items:</strong> ${items.join(", ")}</p>
        <p><strong>Total:</strong> $${totalPrice}</p>
        <p><strong>Address:</strong> ${address}</p>
      `,
    });

    return NextResponse.json({ message: "Order processed successfully" });
  } catch (err: any) {
    console.error("COD Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}