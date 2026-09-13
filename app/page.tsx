import { writeClient } from "@/sanity/lib/client";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import Link from "next/link";
import { Search, ShoppingCart, MapPin, ChevronDown } from "lucide-react";

// async function getBooks(page: number) {
//   const itemsPerPage = 8;
//   const start = (page - 1) * itemsPerPage;
//   const end = start + itemsPerPage;

//   const query = `{
//     "books": *[_type == "book"] | order(_createdAt desc) [${start}...${end}],
//     "total": count(*[_type == "book"])
//   }`;
  
//   return await client.fetch(query);
// }

// export default async function Home({
//   searchParams,
// }: {
//   searchParams: Promise<{ page?: string }>;
// }) {
//   const params = await searchParams;
//   const currentPage = Number(params.page) || 1;
  
//   const { books, total } = await getBooks(currentPage);
//   const totalPages = Math.ceil(total / 8);
//   const hasNextPage = total > currentPage * 8;
//   const hasPrevPage = currentPage > 1;

//   return (
//     <main className="min-h-screen bg-[#eaeded] pb-20 font-sans text-[#0f1111]">
      
      

//       {/* 2. Main Page Content */}
//       <div className="max-w-[1500px] mx-auto px-4 pt-4">
        
//         {/* Results Metadata Bar */}
//         <div className="bg-white px-4 py-2 border border-gray-300 rounded-sm mb-4 flex justify-between items-center text-xs text-gray-600 shadow-xs">
//           <span>
//             1-{Math.min(currentPage * 8, total)} of over {total} results for <strong className="text-[#c45500]">"Books"</strong>
//           </span>
//           <div className="flex items-center gap-2">
//             <span>Sort by:</span>
//             <select className="border border-gray-300 bg-gray-50 rounded px-2 py-1 text-xs outline-none cursor-pointer">
//               <option>Featured</option>
//               <option>Price: Low to High</option>
//               <option>Price: High to Low</option>
//               <option>Avg. Customer Review</option>
//             </select>
//           </div>
//         </div>

//         {/* 3. Product Cards Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {books.map((book: any) => (
//             <BookCard key={book._id} book={book} />
//           ))}
//         </div>

//         {/* 4. Amazon Pagination Footer */}
//         <div className="border-t border-gray-300 mt-12 pt-6 flex flex-col items-center gap-2">
//           <div className="flex items-center gap-1 text-sm font-medium">
//             {hasPrevPage && (
//               <Link 
//                 href={`?page=${currentPage - 1}`}
//                 className="px-3 py-1.5 bg-white border border-gray-400 rounded-md shadow-xs hover:bg-gray-100 text-xs"
//               >
//                 ← Previous
//               </Link>
//             )}
            
//             <div className="px-4 py-1.5 text-xs text-gray-700">
//               Page <strong className="text-black">{currentPage}</strong> of <strong>{totalPages}</strong>
//             </div>

//             {hasNextPage && (
//               <Link 
//                 href={`?page=${currentPage + 1}`}
//                 className="px-3 py-1.5 bg-white border border-gray-400 rounded-md shadow-xs hover:bg-gray-100 text-xs"
//               >
//                 Next →
//               </Link>
//             )}
//           </div>
//         </div>

//       </div>
//     </main>
//   );
// }

async function getBooks(page: number, queryTerm: string) {
  const itemsPerPage = 8;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  // Search filter for GROQ
  const filter = queryTerm 
    ? `&& title match "${queryTerm}*"` 
    : "";

  const query = `{
    "books": *[_type == "book" ${filter}] | order(_createdAt desc) [${start}...${end}],
    "total": count(*[_type == "book" ${filter}])
  }`;
  
  return await client.fetch(query);
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) 
{
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const queryTerm = params.query || "";
  
  const { books, total } = await getBooks(currentPage, queryTerm);
  const totalPages = Math.max(1, Math.ceil(total / 8));
  const hasNextPage = total > currentPage * 8;
  const hasPrevPage = currentPage > 1;

  return (
    <main className="min-h-screen bg-[#eaeded] pb-20 font-sans text-[#0f1111]">
      <Navbar />

      <div className="max-w-[1500px] mx-auto px-4 pt-4">
        {/* Results Metadata Bar */}
        <div className="bg-white px-4 py-2 border border-gray-300 rounded-sm mb-4 flex justify-between items-center text-xs text-gray-600 shadow-xs">
          <span>
            Showing results for <strong className="text-[#c45500]">"{queryTerm || "All Books"}"</strong> ({total} items)
          </span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book: any) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-300 mt-12 pt-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1 text-sm font-medium">
            {hasPrevPage && (
              <Link 
                href={`?page=${currentPage - 1}${queryTerm ? `&query=${queryTerm}` : ""}`}
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
                href={`?page=${currentPage + 1}${queryTerm ? `&query=${queryTerm}` : ""}`}
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