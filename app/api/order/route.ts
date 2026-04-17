import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // This allows writing to Sanity
});

// app/api/order/route.ts
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("RECEIVED BODY:", body); // This shows up in your VS Code terminal

    if (!body.cartItems) {
       console.error("CRITICAL: No cartItems found in request body!");
    }
    const { cartItems } = body; // Make sure to send the actual cart array from frontend

    // 1. Create the Order Document (as we did before)
    // This creates a new document of type 'order' in Sanity
    const newOrder = await client.create({
      _type: "order",
      customerName: body.name,
      email: body.email,
      location: body.address,
      paymentMethod: body.paymentMethod || "Cash on Delivery",
      totalPrice: body.totalPrice,
      items: body.items,
      status: "pending",
    });

    // 2. Update Stock for each book
    // We use a "transaction" to ensure all updates happen or none do
    const transaction = client.transaction();

    cartItems.forEach((item: any) => {
  transaction.patch(
    item._id,
    (p) => p.dec({ stock: item.quantity }), 
  );
});

    await transaction.commit();

    return NextResponse.json({ message: "Order placed and stock updated" });
  } catch (err: any) {
    console.error("SANITY ERROR:", err.message); // This tells you WHY Sanity said no
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
