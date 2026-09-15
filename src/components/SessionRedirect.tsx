"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

function SessionRedirectContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    if (!pathname.startsWith("/auth")) return;
    if (!isInitialized) return;
    if (user) {
      const redirect = searchParams.get("redirect");
      const target = redirect && redirect.startsWith("/") ? redirect : "/";
      router.replace(target);
    }
  }, [user, isInitialized, pathname, router, searchParams]);

  return null;
}

export default function SessionRedirect() {
  return (
    <Suspense fallback={null}>
      <SessionRedirectContent />
    </Suspense>
  );
}