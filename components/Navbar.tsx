'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/cartStore';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ShoppingCart, MapPin, ChevronDown, X } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, user } = useUser();


  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
  const [location, setLocation] = useState('Select Location');
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?query=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <header className="bg-[#131921] text-white">
        <div className="flex items-center justify-between px-4 py-2 gap-4 max-w-[1500px] mx-auto text-sm">
          
          {/* Logo */}
          <Link href="/" className="flex items-center text-xl font-bold tracking-tight text-white border border-transparent hover:border-white p-1 rounded">
            BookStore<span className="text-[#febd69]">.com</span>
          </Link>

          {/* Location Selector */}
          <button 
            onClick={() => setIsLocationOpen(true)}
            className="hidden md:flex items-center gap-1 border border-transparent hover:border-white p-1 rounded text-left text-xs text-gray-300"
          >
            <MapPin className="w-4 h-4 text-white" />
            <div>
              <p className="text-[11px] text-gray-400 leading-tight">Deliver to</p>
              <p className="font-bold text-white leading-tight truncate max-w-[100px]">{location}</p>
            </div>
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 flex items-center h-10 max-w-2xl">
            <button type="button" className="bg-gray-200 text-gray-700 text-xs px-3 h-full rounded-l border-r border-gray-300 hover:bg-gray-300 flex items-center gap-1">
              All <ChevronDown className="w-3 h-3" />
            </button>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books, authors, genres..." 
              className="w-full h-full px-3 bg-white text-black text-sm outline-none focus:ring-2 ring-[#f3a847]"
            />
            <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] text-black px-5 h-full rounded-r flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* User Account & Cart */}
          <div className="flex items-center gap-4 text-xs">
  
  <div>
    {!isSignedIn ? (
      <Link href="/sign-in" className="border border-transparent hover:border-white p-1 rounded block">
        <p className="text-[11px] text-gray-300 leading-tight">Hello, Sign in</p>
        <p className="font-bold text-white leading-tight">Account & Lists</p>
      </Link>
    ) : (
      <div className="flex items-center gap-2 border border-transparent hover:border-white p-1 rounded">
        <UserButton fallbackRedirectUrl="/" />
        <div className="hidden sm:block">
          <p className="text-[11px] text-gray-300 leading-tight">
            Hello, {user?.firstName || 'Customer'}
          </p>
          <p className="font-bold text-white leading-tight">Account</p>
        </div>
      </div>
    )}
  </div>

  {/* Orders Link */}
  <Link href="/orders" className="border border-transparent hover:border-white p-1 rounded">
    <p className="text-[11px] text-gray-300 leading-tight">Returns</p>
    <p className="font-bold text-white leading-tight">& Orders</p>
  </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="flex items-center border border-transparent hover:border-white p-1 rounded gap-1">
              <div className="relative">
                <ShoppingCart className="w-7 h-7 text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 left-3 bg-[#febd69] text-black font-extrabold text-xs rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="font-bold text-sm hidden sm:inline">Cart</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      {isLocationOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-black relative">
            <button 
              onClick={() => setIsLocationOpen(false)} 
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-lg mb-4">Choose your location</h3>
            <div className="space-y-2">
              {['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'].map((country) => (
                <button
                  key={country}
                  onClick={() => {
                    setLocation(country);
                    setIsLocationOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 border rounded hover:bg-gray-100 text-sm font-medium"
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}