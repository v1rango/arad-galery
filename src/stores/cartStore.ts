import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalDiscount: () => number;
  getOriginalTotal: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          const maxQty = product.stockCount ?? 99;

          if (existingItem) {
            const newQty = Math.min(existingItem.quantity + quantity, maxQty);
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: newQty }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { product, quantity: Math.min(quantity, maxQty) },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) => item.product.id !== productId
              ),
            };
          }

          return {
            items: state.items.map((item) => {
              if (item.product.id === productId) {
                const maxQty = item.product.stockCount ?? 99;
                return { ...item, quantity: Math.min(quantity, maxQty) };
              }
              return item;
            }),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.discountPrice ?? item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      getOriginalTotal: () => {
        return get().items.reduce((total, item) => {
          return total + item.product.price * item.quantity;
        }, 0);
      },

      getTotalDiscount: () => {
        const original = get().getOriginalTotal();
        const final = get().getTotalPrice();
        return original - final;
      },
    }),
    {
      name: "arad-cart-storage",
    }
  )
);