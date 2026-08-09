"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import toast from "react-hot-toast";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClearCart = () => {
    if (confirm("آیا از حذف تمام محصولات سبد اطمینان دارید؟")) {
      clearCart();
      toast.success("سبد خرید خالی شد");
    }
  };

  if (!mounted) {
    return (
      <div className="px-4 py-20 text-center">
        <div className="animate-pulse text-gray-500">در حال بارگذاری...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-md mx-auto text-center">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-royal-500/20 to-blush-500/20 flex items-center justify-center">
            <ShoppingBag size={60} className="text-royal-500" />
          </div>

          <h1 className="text-2xl md:text-3xl font-black mb-3">
            <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
              سبد خرید شما خالی است
            </span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 leading-8 mb-8">
            هنوز محصولی به سبد خرید خود اضافه نکرده‌اید.
            <br />
            از فروشگاه ما دیدن کنید و محصولات دلخواه‌تان را پیدا کنید!
          </p>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all duration-300 hover:-translate-y-1"
          >
            <span>مشاهده محصولات</span>
            <ArrowLeft size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-2">
            <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
              سبد خرید
            </span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {items.length.toLocaleString("fa-IR")} محصول در سبد شما موجود است
          </p>
        </div>

        <button
          onClick={handleClearCart}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors"
        >
          <Trash2 size={16} />
          <span>خالی کردن سبد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}