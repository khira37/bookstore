import { client } from "@/sanity/lib/client";
import BookCard from "@/components/BookCard";
import Link from "next/link";
import { Search, ShoppingCart, MapPin, ChevronDown } from "lucide-react";

async function getBooks(page: number) {
  const itemsPerPage = 8;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const query = `{
    "books": *[_type == "book"] | order(_createdAt desc) [${start}...${end}],
    "total": count(*[_type == "book"])
  }`;
  
  return await client.fetch(query);
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  
  const { books, total } = await getBooks(currentPage);
  const totalPages = Math.ceil(total / 8);
  const hasNextPage = total > currentPage * 8;
  const hasPrevPage = currentPage > 1;

  return (
    <main className="min-h-screen bg-[#eaeded] pb-20 font-sans text-[#0f1111]">
      
      {/* 1. Amazon-Style Header Navigation */}
      <header className="bg-[#131921] text-white">
        {/* Top Header Row */}
        <div className="flex items-center justify-between px-4 py-2 gap-4 max-w-[1500px] mx-auto text-sm">
          
          {/* Logo */}
          <Link href="/" className="flex items-center text-xl font-bold tracking-tight text-white border border-transparent hover:border-white p-1 rounded">
            Bookstore<span className="text-[#febd69]">.com</span>
          </Link>

          {/* Deliver To Section */}
          <div className="hidden md:flex items-center gap-1 border border-transparent hover:border-white p-1 rounded cursor-pointer text-xs text-gray-300">
            <MapPin className="w-4 h-4 text-white" />
            <div>
              <p className="text-[11px] text-gray-400 leading-tight">Deliver to</p>
              <p className="font-bold text-white leading-tight">Select Location</p>
            </div>
          </div>

          {/* Amazon Search Bar */}
          <div className="flex-1 flex items-center h-10 max-w-2xl">
            <button className="bg-gray-200 text-gray-700 text-xs px-3 h-full rounded-l border-r border-gray-300 hover:bg-gray-300 flex items-center gap-1">
              All <ChevronDown className="w-3 h-3" />
            </button>
            <input 
              type="text" 
              placeholder="Search books, authors, genres..." 
              className="w-full h-full px-3 text-black text-sm outline-none focus:ring-2 ring-[#f3a847] bg-white text-black"
            />
            <button className="bg-[#febd69] hover:bg-[#f3a847] text-black px-5 h-full rounded-r flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Account & Cart */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden lg:block border border-transparent hover:border-white p-1 rounded cursor-pointer">
              <p className="text-[11px] text-gray-300 leading-tight">Hello, Sign in</p>
              <p className="font-bold text-white leading-tight">Account & Lists</p>
            </div>
            
            <div className="border border-transparent hover:border-white p-1 rounded cursor-pointer">
              <p className="text-[11px] text-gray-300 leading-tight">Returns</p>
              <p className="font-bold text-white leading-tight">& Orders</p>
            </div>

            <Link href="/cart" className="flex items-center border border-transparent hover:border-white p-1 rounded gap-1">
              <div className="relative">
                <ShoppingCart className="w-7 h-7 text-white" />
                <span className="absolute -top-1 left-3 text-[#f3a847] font-bold text-sm">0</span>
              </div>
              <span className="font-bold text-sm hidden sm:inline">Cart</span>
            </Link>
          </div>
        </div>

        {/* Sub-Header Categories Bar */}
        <div className="bg-[#232f3e] text-white text-xs px-4 py-1.5 flex items-center gap-4 overflow-x-auto">
          <span className="font-bold cursor-pointer hover:text-[#febd69]">All Books</span>
          <span className="cursor-pointer hover:text-[#febd69]">Best Sellers</span>
          <span className="cursor-pointer hover:text-[#febd69]">New Releases</span>
          <span className="cursor-pointer hover:text-[#febd69]">Fiction</span>
          <span className="cursor-pointer hover:text-[#febd69]">Non-Fiction</span>
          <span className="cursor-pointer hover:text-[#febd69]">Children's Books</span>
        </div>
      </header>

      {/* 2. Main Page Content */}
      <div className="max-w-[1500px] mx-auto px-4 pt-4">
        
        {/* Results Metadata Bar */}
        <div className="bg-white px-4 py-2 border border-gray-300 rounded-sm mb-4 flex justify-between items-center text-xs text-gray-600 shadow-xs">
          <span>
            1-{Math.min(currentPage * 8, total)} of over {total} results for <strong className="text-[#c45500]">"Books"</strong>
          </span>
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select className="border border-gray-300 bg-gray-50 rounded px-2 py-1 text-xs outline-none cursor-pointer">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Avg. Customer Review</option>
            </select>
          </div>
        </div>

        {/* 3. Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book: any) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>

        {/* 4. Amazon Pagination Footer */}
        <div className="border-t border-gray-300 mt-12 pt-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1 text-sm font-medium">
            {hasPrevPage && (
              <Link 
                href={`?page=${currentPage - 1}`}
                className="px-3 py-1.5 bg-white border border-gray-400 rounded-md shadow-xs hover:bg-gray-100 text-xs"
              >
                ← Previous
              </Link>
            )}
            
            <div className="px-4 py-1.5 text-xs text-gray-700">
              Page <strong className="text-black">{currentPage}</strong> of <strong>{totalPages}</strong>
            </div>

            {hasNextPage && (
              <Link 
                href={`?page=${currentPage + 1}`}
                className="px-3 py-1.5 bg-white border border-gray-400 rounded-md shadow-xs hover:bg-gray-100 text-xs"
              >
                Next →
              </Link>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}