import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, ProductVariant } from "@/types/product";

export type CartItem = {
  id?: string;
  product: Product;
  variant?: ProductVariant | null;
  quantity: number;
};

export function getCartItemKey(item: {
  id?: string;
  product: { id: string };
  variant?: { id: string } | null;
}): string {
  if (item.id) return item.id;
  if (item.variant?.id) return `${item.product.id}-${item.variant.id}`;
  return item.product.id;
}

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
  addItem: (
    product: Product,
    quantity?: number,
    variant?: ProductVariant | null
  ) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
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

      addItem: (product, quantity = 1, variant = null) => {
        set((state) => {
          const targetKey = variant?.id
            ? `${product.id}-${variant.id}`
            : product.id;

          const existingItem = state.items.find(
            (item) => getCartItemKey(item) === targetKey
          );

          const maxQty =
            (variant ? variant.stockCount : product.stockCount) ?? 99;

          if (existingItem) {
            const newQty = Math.min(existingItem.quantity + quantity, maxQty);
            return {
              items: state.items.map((item) =>
                getCartItemKey(item) === targetKey
                  ? { ...item, quantity: newQty }
                  : item
              ),
              appliedCoupon: null,
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: targetKey,
                product,
                variant: variant || null,
                quantity: Math.min(quantity, maxQty),
              },
            ],
            appliedCoupon: null,
          };
        });
      },

      removeItem: (key) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              getCartItemKey(item) !== key && item.product.id !== key
          ),
          appliedCoupon: null,
        }));
      },

      updateQuantity: (key, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) =>
                  getCartItemKey(item) !== key && item.product.id !== key
              ),
              appliedCoupon: null,
            };
          }

          return {
            items: state.items.map((item) => {
              if (
                getCartItemKey(item) === key ||
                (!item.variant && item.product.id === key)
              ) {
                const maxQty =
                  (item.variant
                    ? item.variant.stockCount
                    : item.product.stockCount) ?? 99;
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
          const unitPrice =
            item.variant?.discountPrice ??
            item.variant?.price ??
            item.product.discountPrice ??
            item.product.price;
          return total + unitPrice * item.quantity;
        }, 0);
      },

      getOriginalTotal: () => {
        return get().items.reduce((total, item) => {
          const originalPrice =
            item.variant?.price ?? item.product.price;
          return total + originalPrice * item.quantity;
        }, 0);
      },

      getTotalDiscount: () => {
        const original = get().getOriginalTotal();
        const final = get().getTotalPrice();
        return Math.max(0, original - final);
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