"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Tag, CreditCard, Truck, Info } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import toast from "react-hot-toast";

function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR");
}

export default function CartSummary() {
  const [discountCode, setDiscountCode] = useState("");
  const [shippingSettings, setShippingSettings] = useState({
    shippingCost: 50000,
    freeShippingThreshold: 2000000,
  });

  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const totalDiscount = useCartStore((state) => state.getTotalDiscount());
  const originalTotal = useCartStore((state) => state.getOriginalTotal());
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success) {
          setShippingSettings({
            shippingCost: data.data.shippingCost,
            freeShippingThreshold: data.data.freeShippingThreshold,
          });
        }
      } catch {}
    }
    loadSettings();
  }, []);

  const SHIPPING_COST = shippingSettings.shippingCost;
  const FREE_SHIPPING_THRESHOLD = shippingSettings.freeShippingThreshold;

  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : SHIPPING_COST;
  const finalPrice = totalPrice + shippingCost;
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice;

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      toast.error("لطفاً کد تخفیف را وارد کنید");
      return;
    }
    toast.error("این کد تخفیف معتبر نیست");
  };

  return (
    <div className="lg:sticky lg:top-20 bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-5 md:p-6">
      <h2 className="text-lg font-black mb-5 pb-4 border-b border-royal-500/10">
        <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
          خلاصه سبد خرید
        </span>
      </h2>

      <div className="mb-5">
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
          کد تخفیف دارید؟
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="کد تخفیف را وارد کنید"
              className="w-full pr-9 pl-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
            />
          </div>
          <button
            onClick={handleApplyDiscount}
            className="px-4 py-2.5 rounded-xl bg-royal-500/10 text-royal-500 text-sm font-bold hover:bg-royal-500/20 transition-colors"
          >
            ثبت
          </button>
        </div>
      </div>

      {!isFreeShipping && (
        <div className="mb-5 p-3 rounded-xl bg-blush-500/10 border border-blush-500/20">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-blush-500 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-6">
              با خرید{" "}
              <span className="font-bold text-blush-500">
                {formatPrice(remainingForFreeShipping)} تومان
              </span>{" "}
              دیگر، ارسال شما{" "}
              <span className="font-bold text-blush-500">رایگان</span> می‌شود!
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3 pb-5 border-b border-royal-500/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            تعداد کالاها
          </span>
          <span className="font-bold text-gray-900 dark:text-white">
            {totalItems.toLocaleString("fa-IR")} عدد
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">قیمت کالاها</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {formatPrice(originalTotal)} تومان
          </span>
        </div>

        {totalDiscount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-blush-500">سود شما از خرید</span>
            <span className="font-bold text-blush-500">
              {formatPrice(totalDiscount)}-
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Truck size={14} />
            <span>هزینه ارسال</span>
          </div>
          {isFreeShipping ? (
            <span className="font-bold text-green-600">رایگان</span>
          ) : (
            <span className="font-bold text-gray-900 dark:text-white">
              {formatPrice(shippingCost)} تومان
            </span>
          )}
        </div>
      </div>

      <div className="py-5 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
          مبلغ قابل پرداخت
        </span>
        <div className="text-left">
          <div className="text-xl md:text-2xl font-black text-royal-500">
            {formatPrice(finalPrice)}
          </div>
          <div className="text-[10px] text-gray-500">تومان</div>
        </div>
      </div>

      <Link
        href="/checkout"
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all duration-300 hover:-translate-y-0.5"
      >
        <CreditCard size={20} />
        <span>ادامه فرآیند خرید</span>
      </Link>

      <p className="text-[11px] text-gray-500 text-center mt-4 leading-5">
        با کلیک روی دکمه بالا، به مرحله ثبت آدرس و پرداخت هدایت می‌شوید
      </p>
    </div>
  );
}