"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import Image from "next/image";
import { useState } from "react";
import { urlFor } from "@/sanity/lib/image";
import Navbar from "@/components/Navbar";

export default function CartPage() {
  const { cart, totalPrice, clearCart, addToCart, removeFromCart } = useCartStore();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  // Helper function to resolve image sources safely
  const getImageUrl = (item: any) => {
    //if (!item?.image && !item?.imageUrl) return null;
    if (typeof item.imageUrl === "string") return item.imageUrl;
    try {
      return urlFor(item.cover || item.imageUrl).url();
    } catch {
      return null;
    }
  };

  

  const handleCheckout = async (
    e: React.FormEvent,
    paymentMethod: "COD" | "ONLINE"
  ) => {
    e.preventDefault();

    if (cart.length === 0) return alert("Your cart is empty!");
    if (!formData.name || !formData.email || !formData.address) {
      return alert("Please fill in all shipping details");
    }

    setIsSubmitting(true);

    const orderPayload = {
      name: formData.name,
      email: formData.email,
      address: formData.address,
      totalPrice: totalPrice,
      items: cart.map((item) => `${item.title} (x${item.quantity})`),
      cartItems: cart,
    };

    try {
      const endpoint = paymentMethod === "ONLINE" ? "/api/checkout" : "/api/order";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Order failed");

      if (paymentMethod === "ONLINE" && data.url) {
        window.location.href = data.url;
      } else {
        clearCart();
        router.push("/checkout-success");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eaeded] font-sans text-[#0f1111] pb-20">
      <Navbar />

      <main className="max-w-[1500px] mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white p-10 rounded-sm border border-gray-300 text-center">
            <h2 className="text-xl font-bold mb-2">Your Shopping Cart is empty.</h2>
            <p className="text-sm text-gray-600 mb-4">Check your saved items or continue shopping.</p>
            <button 
              onClick={() => router.push("/")}
              className="bg-[#ffd814] hover:bg-[#f7ca00] text-black px-6 py-2 rounded-full font-medium text-xs border border-[#fcd200]"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* LEFT COLUMN: Shopping Items List (Takes 3 Columns) */}
            <div className="lg:col-span-3 bg-white p-6 border border-gray-300 rounded-sm shadow-xs">
              <div className="flex justify-between items-end border-b border-gray-200 pb-3 mb-4">
                <h2 className="text-xl font-bold">Review Cart Items</h2>
                <span className="text-xs text-gray-500">Price</span>
              </div>

              <div className="divide-y divide-gray-200">
                {cart.map((item) => {
                  const imgSrc = getImageUrl(item);

                  return (
                    <div key={item._id} className="py-4 flex gap-4 items-start">
                      
                      {/* Product Image */}
                      <div className="relative h-28 w-24 flex-shrink-0 bg-gray-50 border border-gray-200 rounded p-1">
                        {imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt={item.title}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[10px] text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-base hover:text-[#c45500] cursor-pointer">
                          {item.title}
                        </h3>
                        <p className="text-xs text-emerald-700 font-medium my-1">In Stock</p>
                        <p className="text-xs text-gray-500 mb-3">Eligible for FREE Shipping</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-300 rounded-md bg-gray-50 shadow-xs">
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="px-2.5 py-0.5 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded-l"
                            >
                              -
                            </button>
                            <span className="px-3 py-0.5 text-xs font-semibold bg-white border-x border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              disabled={item.quantity >= item.stock}
                              className={`px-2.5 py-0.5 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded-r ${
                                item.quantity >= item.stock ? "opacity-30 cursor-not-allowed" : ""
                              }`}
                            >
                              +
                            </button>
                          </div>

                          <span className="text-gray-300">|</span>

                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-xs text-[#007185] hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Item Subtotal Price */}
                      <div className="text-right">
                        <span className="font-bold text-base">${item.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-right border-t border-gray-200 pt-4 mt-4">
                <span className="text-sm">
                  Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items):{" "}
                  <strong className="text-base">${totalPrice}</strong>
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: Amazon-Style Checkout Card (Takes 1 Column) */}
            <div className="lg:col-span-1">
              <div className="bg-white p-5 border border-gray-300 rounded-sm shadow-xs sticky top-6">
                
                <div className="text-sm mb-4 pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Subtotal: </span>
                  <span className="text-xl font-bold text-black">${totalPrice}</span>
                </div>

                <h3 className="font-bold text-sm mb-3">Shipping Address</h3>
                
                <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
                  />

                  <input
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email Address"
                    className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
                  />

                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Shipping Address"
                    rows={3}
                    className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
                  />

                  <div className="space-y-2 pt-2">
                    {/* Pay Online Button */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={(e) => handleCheckout(e, "ONLINE")}
                      className={`w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-black font-semibold text-xs rounded-full border border-[#fcd200] shadow-xs ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? "Processing..." : "Proceed to Online Checkout"}
                    </button>

                    {/* Cash on Delivery Button */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={(e) => handleCheckout(e, "COD")}
                      className={`w-full py-2 bg-gray-100 hover:bg-gray-200 text-black font-semibold text-xs rounded-full border border-gray-400 shadow-xs ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? "Processing..." : "Place Cash on Delivery Order"}
                    </button>
                  </div>
                </form>

              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
} 