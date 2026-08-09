"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Props = {
  size?: number;
  priority?: boolean;
};

export default function Logo({ size = 40, priority = false }: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/images/logo-dark.webp"
      : "/images/logo-light.webp";

  return (
    <div
      className="relative shrink-0 rounded-full overflow-hidden"
      style={{ width: size, height: size }}
    >
      <Image
        src={logoSrc}
        alt="آراد گالری"
        fill
        priority={priority}
        sizes={`${size}px`}
        className="object-cover"
      />
    </div>
  );
}