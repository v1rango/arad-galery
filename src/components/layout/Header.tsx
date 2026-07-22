"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "خانه" },
    { href: "/products", label: "محصولات" },
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس با ما" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-royal-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-blush-500 flex items-center justify-center">
              <span className="text-white font-black text-lg">آ</span>
            </div>
            <span className="text-xl font-black bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
              آراد گالری
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-royal-500 dark:hover:text-royal-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Link
              href="/auth/login"
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full bg-royal-500/10 hover:bg-royal-500/20 text-royal-500 transition-colors"
            >
              <User size={20} />
            </Link>

            <Link
              href="/cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-royal-500/10 hover:bg-royal-500/20 text-royal-500 transition-colors"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-blush-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                ۰
              </span>
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-royal-500/10 hover:bg-royal-500/20 text-royal-500 transition-colors"
              aria-label="منو"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-royal-500/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 px-4 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-royal-500/10 hover:text-royal-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}