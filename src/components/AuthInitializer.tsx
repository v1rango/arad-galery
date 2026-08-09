"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function AuthInitializer() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const user = useAuthStore((state) => state.user);
  const loadWishlist = useWishlistStore((state) => state.loadWishlist);
  const clearWishlist = useWishlistStore((state) => state.clear);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      clearWishlist();
    }
  }, [user, loadWishlist, clearWishlist]);

  return null;
}