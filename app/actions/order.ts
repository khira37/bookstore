'use server';

import { verifySession } from '@/lib/session';
import { writeClient } from '@/sanity/lib/client';
import { redirect } from 'next/navigation';

export async function createPayOnDeliveryOrder(cartItems: any[], totalPrice: number) {
  // 1. Get logged-in user session
  const session = await verifySession();

  if (!session) {
    return { error: 'You must be signed in to place an order.' };
  }

  try {
    // 2. Create the order document in Sanity
    await writeClient.create({
      _type: 'order',
      userId: session.userId,
      items: cartItems.map((item) => `${item.title} (x${item.quantity})`),
      totalPrice,
      paymentMethod: 'Pay on Delivery',
      status: 'Pending Delivery',
      _createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return { error: 'Failed to place order. Please try again.' };
  }

  // 3. Redirect to the orders page after success
  redirect('/orders');
}