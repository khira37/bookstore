// app/checkout-success/page.tsx
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Order Confirmed! 🎉</h1>
      <p className="text-gray-600 mb-8">Thank you for your purchase. Your books are on the way.</p>
      <Link href="/" className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
        Continue Shopping
      </Link>
    </div>
  );
}