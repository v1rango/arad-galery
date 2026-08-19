import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type AppliedCoupon = {
  code: string;
  couponId: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  discountAmount: number;
  description?: string | null;
};

type CartStore = {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalDiscount: () => number;
  getOriginalTotal: () => number;
  getCouponDiscount: () => number;
  getFinalPrice: (shippingCost: number) => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,

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
              appliedCoupon: null,
            };
          }

          return {
            items: [
              ...state.items,
              { product, quantity: Math.min(quantity, maxQty) },
            ],
            appliedCoupon: null,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
          appliedCoupon: null,
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) => item.product.id !== productId
              ),
              appliedCoupon: null,
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
            appliedCoupon: null,
          };
        });
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
      },

      applyCoupon: (coupon) => {
        set({ appliedCoupon: coupon });
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
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

      getCouponDiscount: () => {
        const coupon = get().appliedCoupon;
        return coupon ? coupon.discountAmount : 0;
      },

      getFinalPrice: (shippingCost: number) => {
        const subtotal = get().getTotalPrice();
        const couponDiscount = get().getCouponDiscount();
        return Math.max(0, subtotal - couponDiscount + shippingCost);
      },
    }),
    {
      name: "arad-cart-storage",
    }
  )
);