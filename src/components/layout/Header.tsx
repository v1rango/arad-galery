"use client";
import Logo from "@/components/ui/Logo";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Menu, X, User, LogOut, UserCircle, ShieldCheck } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const totalItems = useCartStore((state) => state.getTotalItems());
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    toast.success("با موفقیت خارج شدید");
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "خانه" },
    { href: "/products", label: "محصولات" },
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس با ما" },
  ];

  const displayName = user?.name || user?.phone;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-royal-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden">
            <Logo size={40} priority />  
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

            {mounted && isInitialized && (
              <>
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="hidden sm:flex items-center gap-2 px-3 h-10 rounded-full bg-royal-500/10 hover:bg-royal-500/20 text-royal-500 transition-colors max-w-[180px]"
                    >
                      <UserCircle size={20} className="shrink-0" />
                      <span className="text-sm font-bold truncate">{displayName}</span>
                    </button>

                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="sm:hidden w-10 h-10 flex items-center justify-center rounded-full bg-royal-500/10 hover:bg-royal-500/20 text-royal-500 transition-colors"
                    >
                      <UserCircle size={20} />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-black border border-royal-500/10 shadow-2xl shadow-royal-500/10 overflow-hidden">
                        <div className="p-4 border-b border-royal-500/10">
                          <div className="text-xs text-gray-500 mb-1">وارد شدید با</div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white" dir="ltr">
                            {user.phone}
                          </div>
                          {user.name && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {user.name}
                            </div>
                          )}
                        </div>

                        <div className="p-2">
                          <Link
                            href="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-royal-500/10 hover:text-royal-500 transition-colors"
                          >
                            <UserCircle size={18} />
                            <span>پروفایل من</span>
                          </Link>

                          {user.role === "ADMIN" && (
                            <Link
                              href="/admin"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-blush-500 hover:bg-blush-500/10 transition-colors"
                            >
                              <ShieldCheck size={18} />
                              <span>پنل ادمین</span>
                            </Link>
                          )}

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut size={18} />
                            <span>خروج از حساب</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full bg-royal-500/10 hover:bg-royal-500/20 text-royal-500 transition-colors"
                  >
                    <User size={20} />
                  </Link>
                )}
              </>
            )}

            {(!mounted || !isInitialized) && (
              <div className="hidden sm:block w-10 h-10 rounded-full bg-royal-500/10 animate-pulse" />
            )}

            <Link
              href="/cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-royal-500/10 hover:bg-royal-500/20 text-royal-500 transition-colors"
            >
              <ShoppingCart size={20} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -left-1 min-w-[20px] h-5 px-1 bg-blush-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {totalItems.toLocaleString("fa-IR")}
                </span>
              )}
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

            {mounted && isInitialized && !user && (
              <Link
                href="/auth/login"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 px-4 rounded-lg text-sm font-medium text-royal-500 hover:bg-royal-500/10 transition-colors"
              >
                ورود / ثبت‌نام
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}