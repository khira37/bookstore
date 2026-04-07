"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useCart } from "@/context/cartContext";

// where did the passed book below come from?
export default function BookCard({ book }: any) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4">
      <Image
        src={urlFor(book.cover).url()}
        alt={book.title}
        width={300}
        height={400}
        className="rounded-lg object-cover h-48 w-full"
      />

      <h2 className="text-lg font-semibold mt-4">
        {book.title}
      </h2>

      <p className="text-gray-600 mb-4">
        ${book.price}
      </p>

      <button
        onClick={() => addToCart(book)}
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}