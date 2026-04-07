import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";


// This is the home page
// async because it fetches data
export default async function Home() {

  // here we're fetching data from sanity
  const books = await client.fetch(groq`
    *[_type == "book"]{
      _id,
      title,
      price,
      cover
    }
  `);

  return (
    <main className="min-h-screen bg-gray-100">

      {/* This displays the created navbar */}
      <Navbar />

      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/*Here we loop through each book and reander a book card */}
        {books.map((book: any) => (

          // The key is a special prop React uses
          // internally to track each item in a list.
          <BookCard key={book._id} book={book} />
        ))}
      </div>

    </main>
  );
}