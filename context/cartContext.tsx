// tells next this file runs in the browser
"use client";

// usestate --> memory box inside one component.
// createContext --> create something like a global container
// useContext --> reads global container
import { createContext, useContext, useState } from "react";

type Book = {
  _id: string;
  title: string;
  price: number;
};

type CartContextType = {
  cart: Book[];
  addToCart: (book: Book) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Book[]>([]);

  const addToCart = (book: Book) => {
    setCart((prev) => [...prev, book]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}