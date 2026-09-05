"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function SessionRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    if (!pathname.startsWith("/auth")) return;
    if (!isInitialized) return;
    if (user) router.replace("/");
  }, [user, isInitialized, pathname, router]);

  return null;
}