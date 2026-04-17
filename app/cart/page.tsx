"use client";
import { useRouter } from "next/navigation"; // Add this import at the top
import { useCartStore } from "@/lib/cartStore"; // Use the path where you saved it
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, totalPrice, clearCart, addToCart, removeFromCart } =
    useCartStore();
  const router = useRouter();

  // State for form and loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the page from refreshing

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
      // 1. This is for your readable list in Sanity
      items: cart.map((item) => `${item.title} (x${item.quantity})`),
      // 2. This is the "raw" data the API needs to find and update stock
      cartItems: cart,
    };


    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) throw new Error("Order failed");

      // Success!
      clearCart();
      router.push("/checkout-success");
    } catch (error) {
      console.error(error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-10">
      <h1 className="text-3xl font-bold mb-10">Checkout</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">Your cart is empty.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT COLUMN: Item Management (Takes 2/3 space) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold border-b pb-4">
              Review Items
            </h2>
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border"
              >
                <div className="relative h-24 w-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
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

                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-blue-600 font-semibold">${item.price}</p>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => removeFromCart(item._id)} // We'll tweak this logic below
                      className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="font-medium text-lg">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={item.quantity >= item.stock} // Disable if limit reached
                      className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                        item.quantity >= item.stock
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)} // Add a 'delete' specific button if preferred
                  className="text-gray-400 hover:text-red-500 p-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: Sticky Checkout Form (Takes 1/3 space) */}
          <div className="lg:col-start-3">
            <div className="bg-white p-6 rounded-2xl shadow-lg border sticky top-10">
              <h2 className="text-xl font-bold mb-6">Customer Details</h2>
              <form onSubmit={handleCheckout} className="space-y-4">
                {" "}
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Full Name"
                  className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 ring-black outline-non"
                />
                <input
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email"
                  className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 ring-black outline-none"
                />
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Shipping Address"
                  rows={3}
                  className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 ring-black outline-none"
                />
                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-900"
                    }`}
                  >
                    {isSubmitting
                      ? "Processing..."
                      : `Place Order ($${totalPrice})`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
