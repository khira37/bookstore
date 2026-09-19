import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Package } from 'lucide-react';
import { verifySession } from '@/lib/session';
import { writeClient } from '@/sanity/lib/client';

export default async function OrdersPage() {
  // 1. Verify custom JWT session from HTTP-only cookie
  const session = await verifySession();

  // 2. Fetch orders matching the authenticated user's ID
  let orders = [];
  if (session?.userId) {
    orders = await writeClient.fetch(
      `*[_type == "order" && userId == $userId] | order(_createdAt desc)`,
      { userId: session.userId }
    );
  }

  return (
    <div className="min-h-screen bg-[#eaeded] font-sans text-[#0f1111]">
      <Navbar />

      <main className="max-w-[1000px] mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

        {!session ? (
          /* Shown when user is not logged in via your custom auth */
          <div className="bg-white p-8 border border-gray-300 rounded text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold mb-2">Sign in to view your orders</h2>
            <p className="text-sm text-gray-600 mb-4">
              Track shipments, request returns, or buy items again.
            </p>
            <Link
              href="/sign-in"
              className="inline-block bg-[#ffd814] hover:bg-[#f7ca00] text-black px-6 py-2 rounded-full font-medium text-xs border border-[#fcd200]"
            >
              Sign In to Your Account
            </Link>
          </div>
        ) : orders.length === 0 ? (
          /* Shown when logged-in user has 0 orders */
          <div className="bg-white p-8 border border-gray-300 rounded text-center">
            <h2 className="text-lg font-bold mb-1">No orders found</h2>
            <p className="text-sm text-gray-600 mb-4">
              Looks like you haven't placed any orders yet.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#ffd814] hover:bg-[#f7ca00] text-black px-6 py-2 rounded-full font-medium text-xs border border-[#fcd200]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Display actual user orders */
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div
                key={order._id}
                className="bg-white border border-gray-300 rounded overflow-hidden shadow-xs"
              >
                <div className="bg-gray-100 p-4 border-b border-gray-200 text-xs text-gray-600 flex justify-between flex-wrap gap-4">
                  <div>
                    <p className="uppercase font-bold">Order Placed</p>
                    <p className="text-black font-medium">
                      {new Date(order._createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase font-bold">Total</p>
                    <p className="text-black font-medium">${order.totalPrice}</p>
                  </div>
                  <div>
                    <p className="uppercase font-bold">Order ID</p>
                    <p className="text-black font-medium">{order._id}</p>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded font-bold mb-2">
                      {order.status || 'Confirmed'}
                    </span>
                    <p className="text-sm font-semibold">
                      {order.items?.join(', ')}
                    </p>
                  </div>

                  <Link
                    href="/"
                    className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-md font-medium text-xs border border-gray-300"
                  >
                    Buy It Again
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}