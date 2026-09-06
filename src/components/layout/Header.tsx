"use client";
import Logo from "@/components/ui/Logo";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isScrolled, setIsScrolled] = useState(false);
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    <header 
      className={`sticky top-0 z-50 glass-effect border-b transition-all duration-300 ${
        isScrolled 
          ? "border-royal-500/10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-lg shadow-zinc-900/5 py-2" 
          : "border-transparent bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md py-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-16" : "h-20"}`}>
          
          {/* لوگو */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 shrink-0 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-royal-500 to-blush-500 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                <Logo size={36} priority />
              </div>
            </div>
            <span className={`font-black tracking-tight bg-gradient-to-l from-royal-600 via-royal-500 to-blush-500 bg-clip-text text-transparent transition-all duration-300 ${isScrolled ? "text-xl" : "text-2xl"}`}>
              آراد گالری
            </span>
          </Link>

          {/* نویگیشن دسکتاپ */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-900/80 p-1.5 rounded-full border border-zinc-200/50 dark:border-zinc-800/50">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-5 py-2 rounded-full text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-royal-600 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 shadow-none hover:shadow-sm transition-all duration-200 group"
              >
                <span className="absolute right-1/2 translate-x-1/2 -top-1 w-1.5 h-1.5 rounded-full bg-blush-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* اکشن‌ها */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {mounted && isInitialized && (
              <>
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="hidden sm:flex items-center gap-2.5 px-4 h-11 rounded-2xl bg-royal-50 dark:bg-royal-500/10 border border-royal-100 dark:border-royal-500/20 hover:bg-royal-100 dark:hover:bg-royal-500/20 text-royal-600 dark:text-royal-500 transition-all duration-200 max-w-[180px] group"
                    >
                      <UserCircle size={22} className="shrink-0 transition-transform group-hover:scale-110" />
                      <span className="text-sm font-bold truncate">{displayName}</span>
                    </button>

                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="sm:hidden w-11 h-11 flex items-center justify-center rounded-2xl bg-royal-50 dark:bg-royal-500/10 border border-royal-100 dark:border-royal-500/20 text-royal-600 dark:text-royal-500 transition-all duration-200"
                    >
                      <UserCircle size={22} />
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full left-0 mt-3 w-60 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-royal-500/10 overflow-hidden"
                        >
                          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                            <div className="text-xs font-medium text-zinc-400 mb-1">وارد شدید با</div>
                            <div className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide" dir="ltr">
                              {user.phone}
                            </div>
                            {user.name && (
                              <div className="text-xs font-semibold text-royal-600 dark:text-royal-500 mt-1">
                                {user.name}
                              </div>
                            )}
                          </div>

                          <div className="p-2 space-y-1">
                            <Link
                              href="/profile"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-royal-50 dark:hover:bg-royal-500/10 hover:text-royal-600 dark:hover:text-royal-500 transition-all duration-150"
                            >
                              <UserCircle size={18} />
                              <span>پروفایل من</span>
                            </Link>

                            {user.role === "ADMIN" && (
                              <Link
                                href="/admin"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-blush-600 dark:text-blush-500 hover:bg-blush-50 dark:hover:bg-blush-500/10 transition-all duration-150"
                              >
                                <ShieldCheck size={18} />
                                <span>پنل ادمین</span>
                              </Link>
                            )}

                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-150"
                            >
                              <LogOut size={18} />
                              <span>خروج از حساب</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="hidden sm:flex w-11 h-11 items-center justify-center rounded-2xl bg-royal-50 dark:bg-royal-500/10 border border-royal-100 dark:border-royal-500/20 text-royal-600 dark:text-royal-500 hover:bg-royal-100 dark:hover:bg-royal-500/20 transition-all duration-200"
                  >
                    <User size={22} />
                  </Link>
                )}
              </>
            )}

            {(!mounted || !isInitialized) && (
              <div className="hidden sm:block w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            )}

            {/* دکمه سبد خرید */}
            <Link
              href="/cart"
              className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-royal-50 dark:bg-royal-500/10 border border-royal-100 dark:border-royal-500/20 text-royal-600 dark:text-royal-500 hover:bg-royal-100 dark:hover:bg-royal-500/20 hover:shadow-lg hover:shadow-royal-500/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              <ShoppingCart size={22} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -left-1.5 min-w-[22px] h-5 px-1.5 bg-gradient-to-r from-blush-500 to-rose-500 text-white text-[11px] rounded-full flex items-center justify-center font-bold shadow-md shadow-blush-500/30 animate-pulse-scale">
                  {totalItems.toLocaleString("fa-IR")}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200"
              aria-label="منو"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* منوی موبایل */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-3 px-4 rounded-2xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-royal-50 dark:hover:bg-royal-500/10 hover:text-royal-600 dark:hover:text-royal-500 transition-all duration-150"
                  >
                    {link.label}
                  </Link>
                ))}

                {mounted && isInitialized && !user && (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-3 px-4 rounded-2xl text-sm font-semibold text-royal-600 dark:text-royal-500 bg-royal-50 dark:bg-royal-500/10 transition-all duration-150 mt-2"
                  >
                    ورود / ثبت‌نام
                  </Link>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}