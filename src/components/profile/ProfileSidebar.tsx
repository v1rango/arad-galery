"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { User, Heart, Package, LogOut, UserCircle } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type Props = {
  user: {
    id: string;
    phone: string;
    name: string | null;
    email: string | null;
    role: string;
  };
};

const menuItems = [
  { href: "/profile", label: "اطلاعات کاربری", icon: User },
  { href: "/profile/orders", label: "سفارش‌های من", icon: Package },
  { href: "/profile/wishlist", label: "علاقه‌مندی‌ها", icon: Heart },
];

export default function ProfileSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const clearWishlist = useWishlistStore((state) => state.clear);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    clearWishlist();
    toast.success("با موفقیت خارج شدید");
    router.push("/");
  };

  const displayName = user.name || user.phone;

  return (
    <>
      <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 overflow-hidden lg:sticky lg:top-20">
        <div className="p-5 border-b border-royal-500/10 bg-gradient-to-br from-royal-500/5 to-blush-500/5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royal-500 to-blush-500 flex items-center justify-center shrink-0">
              <UserCircle size={28} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-black text-gray-900 dark:text-white truncate">
                {displayName}
              </div>
              <div className="text-[11px] text-gray-500" dir="ltr">
                {user.phone}
              </div>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
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

        <div className="p-3 border-t border-royal-500/10">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            <span>خروج از حساب</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="خروج از حساب"
        message="آیا می‌خواهید از حساب کاربری خود خارج شوید؟"
        confirmText="بله، خارج شوم"
        cancelText="انصراف"
        type="warning"
        isLoading={isLoggingOut}
      />
    </>
  );
}