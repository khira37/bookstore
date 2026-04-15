import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import Link from "next/link";

async function getBooks(page: number) {
  const itemsPerPage = 8;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  // We fetch the books AND the total count to know if there's a next page
  const query = `{
    "books": *[_type == "book"] | order(_createdAt desc) [${start}...${end}],
    "total": count(*[_type == "book"])
  }`;
  
  return await client.fetch(query);
}

// This is the home page
// async because it fetches data
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Get current page from URL, default to 1
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  
  const { books, total } = await getBooks(currentPage);
  const hasNextPage = total > currentPage * 8;
  const hasPrevPage = currentPage > 1;

  return (
    <main className="min-h-screen bg-gray-100 pb-20">
      <Navbar />

      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book: any) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        {hasPrevPage && (
          <Link 
            href={`?page=${currentPage - 1}`}
            className="px-4 py-2 bg-white border rounded shadow hover:bg-gray-50"
          >
            Previous
          </Link>
        )}
        
        <span className="font-medium">Page {currentPage}</span>

        {hasNextPage && (
          <Link 
            href={`?page=${currentPage + 1}`}
            className="px-4 py-2 bg-white border rounded shadow hover:bg-gray-50"
          >
            Next
          </Link>
        )}
      </div>
    </main>
  );
}