"use client";
import Logo from "@/components/ui/Logo";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Bell,
  Menu,
  X,
  LogOut,
  Home,
  Settings,
  Tag,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import NotificationBell from "./NotificationBell";

type Props = {
  user: {
    id: string;
    phone: string;
    name: string | null;
    role: string;
  };
  children: React.ReactNode;
};

const menuItems = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: Tags },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingBag },
  { href: "/admin/coupons", label: "کدهای تخفیف", icon: Tag },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/notifications", label: "نوتیفیکیشن‌ها", icon: Bell },
  { href: "/admin/settings", label: "تنظیمات", icon: Settings },
];

export default function AdminShell({ user, children }: Props) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    toast.success("با موفقیت خارج شدید");
    router.push("/");
  };

  const displayName = user.name || user.phone;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex">
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-royal-500/5 border-l border-royal-500/10 fixed h-screen">
        <div className="p-5 border-b border-royal-500/10">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden">
              <Logo size={40} />
            </div>
            <div>
              <div className="text-sm font-black bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
                پنل ادمین
              </div>
              <div className="text-[10px] text-gray-500">آراد گالری</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-l from-royal-500 to-blush-500 text-white shadow-lg shadow-royal-500/30"
                    : "text-gray-700 dark:text-gray-300 hover:bg-royal-500/10 hover:text-royal-500"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-royal-500/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-royal-500/10 hover:text-royal-500 transition-all"
          >
            <Home size={18} />
            <span>مشاهده سایت</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            <span>خروج</span>
          </button>
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={() => setIsMobileOpen(false)}
        >
          <aside
            className="absolute right-0 top-0 h-full w-72 max-w-[85%] bg-white dark:bg-black shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-royal-500/10 flex items-center justify-between">
              <Link
                href="/admin"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden">
                  <Logo size={40} />
                </div>
                <div>
                  <div className="text-sm font-black bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
                    پنل ادمین
                  </div>
                </div>
              </Link>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-royal-500/10 text-royal-500"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-l from-royal-500 to-blush-500 text-white shadow-lg shadow-royal-500/30"
                        : "text-gray-700 dark:text-gray-300 hover:bg-royal-500/10 hover:text-royal-500"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-3 border-t border-royal-500/10 space-y-1">
              <Link
                href="/"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-royal-500/10 hover:text-royal-500 transition-all"
              >
                <Home size={18} />
                <span>مشاهده سایت</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={18} />
                <span>خروج</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 lg:mr-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-royal-500/10">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-royal-500/10 text-royal-500"
              aria-label="منو"
            >
              <Menu size={20} />
            </button>

            <div className="lg:hidden flex items-center gap-2">
              <div className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden">
                <Logo size={40} />
              </div>
              <span className="text-sm font-black bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
                پنل ادمین
              </span>
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell />

              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-royal-500/10">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-royal-500 to-blush-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {displayName.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-bold text-royal-500 max-w-[120px] truncate">
                  {displayName}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}