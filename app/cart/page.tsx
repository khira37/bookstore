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

  const handleCheckout = async (
    e: React.FormEvent,
    paymentMethod: "COD" | "ONLINE",
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
      const endpoint =
        paymentMethod === "ONLINE" ? "/api/checkout" : "/api/order";

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
            {/* Note: the images arent dispalyed fix it */}
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
              <form onSubmit={(e) => e.preventDefault()}>
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
                  <div className="flex flex-col gap-3 mt-6">
                    {/* Online Payment Button */}
                    <button
                      type="button" // Use type="button" to prevent default form submission until clicked
                      disabled={isSubmitting}
                      onClick={(e) => handleCheckout(e, "ONLINE")}
                      className={`w-full py-4 rounded-xl font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? "Processing..." : "Pay Online with Card"}
                    </button>

                    {/* Cash on Delivery Button */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={(e) => handleCheckout(e, "COD")}
                      className={`w-full py-4 rounded-xl font-bold text-black border-2 border-black transition-all hover:bg-gray-50 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? "Processing..." : "Cash on Delivery"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
