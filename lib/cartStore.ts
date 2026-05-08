import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define what a Cart Item looks like
export interface CartItem {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
}

interface CartState {
  // Note: thinking of adding an image here for the order (the image could be any of the books covers)
  cart: CartItem[];
  totalPrice: number; // 1. Add this to the interface
  addToCart: (book: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

/*Here we create cartState and within it set of functions/rules its allowed to do
    like: addToCart, RemoveFromCart, clearCart */
export const useCartStore = create<CartState>()(
  /* The persistence: It automatically saves your cart to the browser's Local Storage. 
   meaning if someone accidnelty closes their borwser and reopen it they'll find the
   items in the cart.
*/
  persist(
    (set) => ({
      cart: [],
      totalPrice: 0,

      addToCart: (book) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item._id === book._id);
          const currentQuantity = existingItem ? existingItem.quantity : 0;

          // CHECK STOCK LIMIT
          if (currentQuantity >= book.stock) {
            // Note: i want to disable the buttom as well.
            alert(
              `Sorry, only ${book.stock} copies of "${book.title}" are available.`,
            );
            return state; // Return current state without changing anything
          }

          let newCart;
          if (existingItem) {
            newCart = state.cart.map((item) =>
              item._id === book._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          } else {
            newCart = [...state.cart, { ...book, quantity: 1 }];
          }

          return {
            cart: newCart,
            totalPrice: newCart.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0,
            ),
          };
        }),

      /*This function uses .filter() to create a new list 
        that contains everything except the ID you want to delete. */
      removeFromCart: (id) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item._id === id);
          let newCart;

          if (existingItem && existingItem.quantity > 1) {
            newCart = state.cart.map((item) =>
              item._id === id ? { ...item, quantity: item.quantity - 1 } : item,
            );
          } else {
            newCart = state.cart.filter((item) => item._id !== id);
          }

          // 4. Update BOTH cart and total price here too
          return {
            cart: newCart,
            totalPrice: newCart.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0,
            ),
          };
        }),

      clearCart: () => set({ cart: [], totalPrice: 0 }),
    }),
    { name: "cart-storage" },
  ),
);
