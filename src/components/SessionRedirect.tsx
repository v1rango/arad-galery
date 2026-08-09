"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const EXCLUDED_PATHS = ["/auth/login", "/auth/verify", "/admin"];

export default function SessionRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    const fromLogin = sessionStorage.getItem("fromLogin");

    if (!hasVisited) {
      sessionStorage.setItem("hasVisited", "true");

      const isExcluded = EXCLUDED_PATHS.some((path) => pathname.startsWith(path));

      if (fromLogin === "true") {
        sessionStorage.removeItem("fromLogin");
        return;
      }

      if (pathname !== "/" && !isExcluded) {
        router.replace("/");
      }
    }
  }, []);

  return null;
}