'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  const { isSignedIn, isLoaded, user } = useUser();

  if (!isLoaded) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#eaeded] font-sans text-[#0f1111]">
      <Navbar />

      <main className="max-w-[1000px] mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

        {!isSignedIn ? (
          <div className="bg-white p-8 border border-gray-300 rounded text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold mb-2">Sign in to view your orders</h2>
            <p className="text-sm text-gray-600 mb-4">Track shipments, request returns, or buy items again.</p>
            <Link
              href="/sign-in"
              className="inline-block bg-[#ffd814] hover:bg-[#f7ca00] text-black px-6 py-2 rounded-full font-medium text-xs border border-[#fcd200]"
            >
              Sign In to Your Account
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sample Order Card (Replace with your database/Sanity query) */}
            <div className="bg-white border border-gray-300 rounded overflow-hidden">
              <div className="bg-gray-100 p-4 border-b border-gray-200 text-xs text-gray-600 flex justify-between flex-wrap gap-4">
                <div>
                  <p className="uppercase font-bold">Order Placed</p>
                  <p className="text-black font-medium">September 4, 2026</p>
                </div>
                <div>
                  <p className="uppercase font-bold">Ship To</p>
                  <p className="text-[#007185] font-medium">{user.fullName || 'Customer'}</p>
                </div>
                <div>
                  <p className="uppercase font-bold">Order #</p>
                  <p className="text-black font-medium">114-8392018-49201</p>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded font-bold mb-2">
                    Delivered
                  </span>
                  <p className="text-sm font-semibold">The Challenger Sale</p>
                  <p className="text-xs text-gray-500">Quantity: 1</p>
                </div>

                <Link
                  href="/"
                  className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-md font-medium text-xs border border-gray-300"
                >
                  Buy It Again
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}