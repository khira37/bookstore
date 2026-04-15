'use client';
import { useCartStore } from '@/lib/cartStore';
import Link from 'next/link';

export default function Navbar() {
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="flex justify-between p-6 bg-white shadow-sm">
      <Link href="/" className="text-xl font-bold">BookStore</Link>
      <Link href="/cart" className="relative">
        🛒 Cart
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Link>
    </nav>
  );
}