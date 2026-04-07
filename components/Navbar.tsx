"use client";

import { useCart } from "@/context/cartContext";

export default function Navbar() {
  const { cart } = useCart();

  return (
    <nav className="flex justify-between items-center p-6 bg-black text-white">
      <h1 className="text-xl font-bold">BookStore</h1>

      <div className="relative">
        🛒
        <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 py-1 rounded-full">
          {cart.length}
        </span>
      </div>
    </nav>
  );
}