"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useCartStore } from '@/lib/cartStore';
import { useCart } from "@/context/cartContext";

// where did the passed book below come from?
export default function BookCard({ book }: any) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = () => {
  // Add a simple check here
  if (!book.imageUrl) {
    console.warn("Adding a book without an image!");
  }
  addToCart(book);
  alert(`${book.title} added to cart!`); // Simple alert for now

  };
  const isOutOfStock = book.stock <= 0;
  return (
      <div className="flex flex-col h-full border rounded-xl overflow-hidden shadow-lg">
        <div className="relative h-64 w-full">
        <Image
        src={urlFor(book.cover).url()}
        alt={book.title}
        fill 
        className="object-contain"
      />
      
      </div>

      <p className="text-sm mb-2">
      {isOutOfStock ? (
        <span className="text-red-500 font-bold italic">Out of Stock</span>
      ) : (
        <span className="text-green-600 font-medium">{book.stock} in stock</span>
      )}
    </p>

      <div className="p-4 flex flex-col flex-grow bg-white">
          {/* flex-grow here pushes the price and button to the bottom */}
          <h2 className="text-xl font-semibold line-clamp-2 mb-1">{book.title}</h2>
          <p className="text-gray-500 mb-4">{book.author}</p>
          
          <div className="mt-auto"> {/* mt-auto acts as a spacer */}
            <span className="text-2xl font-bold text-blue-600 block mb-4">${book.price}</span>
            <button
      disabled={isOutOfStock}
      onClick={handleAdd}
      className={`w-full py-2 rounded-lg font-bold ${
        isOutOfStock 
        ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
        : "bg-black text-white"
      }`}
    >
      {isOutOfStock ? "Sold Out" : "Add to Cart"}
    </button>
          </div>
        </div>
    </div>
  );
}