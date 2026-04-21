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
const isLowStock = book.stock > 0 && book.stock < 10;
  return (
    
      <div className="relative border p-4 rounded-xl">
    {/* BADGE: Shows "Back in Stock" or "Limited" if stock is newly added but low */}
    {isLowStock && (
<span className="absolute top-2 right-2 z-10 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase shadow-sm">        Back in Stock!
      </span>
    )}
        
        
        <div className="relative h-64 w-full">
        <Image
        src={urlFor(book.cover).url()}
        alt={book.title}
        fill 
        className="object-contain"
      />
      </div>

      <div className="mt-4">
      {isOutOfStock ? (
        <p className="text-red-500 font-bold italic text-sm">Sold Out</p>
      ) : (
        <p className="text-green-600 text-sm font-medium">{book.stock} available</p>
      )}

     

      <div className="p-4 flex flex-col flex-grow bg-white">
          {/* flex-grow here pushes the price and button to the bottom */}
          <h2 className="text-xl font-semibold line-clamp-2 mb-1">{book.title}</h2>
          <p className="text-gray-500 mb-4">{book.author}</p>
          
          <div className="mt-auto"> {/* mt-auto acts as a spacer */}
            <span className="text-2xl font-bold text-blue-600 block mb-4">${book.price}</span>
            <button
        disabled={isOutOfStock}
        onClick={handleAdd}
        className={`w-full mt-2 py-2 rounded-lg font-bold transition-all ${
          isOutOfStock 
          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
          : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </button>
          </div>
        </div>
    </div>
    </div>
  );
}