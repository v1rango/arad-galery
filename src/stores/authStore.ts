import { create } from "zustand";

export type AuthUser = {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
};

type AuthStore = {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;

  setUser: (user: AuthUser | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (data.success) {
        set({ user: data.user, isLoading: false, isInitialized: true });
      } else {
        set({ user: null, isLoading: false, isInitialized: true });
      }
    } catch {
      set({ user: null, isLoading: false, isInitialized: true });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      set({ user: null });
    }
  },
}));