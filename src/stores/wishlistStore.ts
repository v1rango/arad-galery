import { create } from "zustand";

type WishlistStore = {
  ids: Set<string>;
  isLoaded: boolean;

  loadWishlist: () => Promise<void>;
  toggle: (productId: string) => Promise<{ success: boolean; action: "added" | "removed" | null; error?: string }>;
  isInWishlist: (productId: string) => boolean;
  clear: () => void;
};

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  ids: new Set(),
  isLoaded: false,

  loadWishlist: async () => {
    try {
      const res = await fetch("/api/wishlist/ids");
      const data = await res.json();
      if (data.success) {
        set({ ids: new Set(data.data), isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  toggle: async (productId) => {
    try {
      const res = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (data.success) {
        set((state) => {
          const newIds = new Set(state.ids);
          if (data.action === "added") {
            newIds.add(productId);
          } else {
            newIds.delete(productId);
          }
          return { ids: newIds };
        });

        return { success: true, action: data.action };
      }

      return { success: false, action: null, error: data.error };
    } catch {
      return { success: false, action: null, error: "خطا در ارتباط با سرور" };
    }
  },

  isInWishlist: (productId) => {
    return get().ids.has(productId);
  },

  clear: () => {
    set({ ids: new Set(), isLoaded: false });
  },
}));