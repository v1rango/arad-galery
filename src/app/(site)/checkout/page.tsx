"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Truck,
  CheckCircle,
  Tag,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import AddressForm, { AddressData } from "@/components/checkout/AddressForm";
import PaymentMethods, {
  PaymentMethod,
} from "@/components/checkout/PaymentMethods";
import OrderReview from "@/components/checkout/OrderReview";
import Link from "next/link";
import toast from "react-hot-toast";

function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR");
}

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);

  const [address, setAddress] = useState<AddressData>({
    fullName: "",
    phone: "",
    province: "",
    city: "",
    address: "",
    postalCode: "",
  });

  // پیش‌فرض روی کارت به کارت
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card_to_card");
  const [customerNote, setCustomerNote] = useState("");

  const [publicSettings, setPublicSettings] = useState({
    shippingCost: 50000,
    freeShippingThreshold: 2000000,
    onlinePaymentEnabled: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success) {
          const onlineEnabled = !!data.data.onlinePaymentEnabled;
          setPublicSettings({
            shippingCost: data.data.shippingCost ?? 50000,
            freeShippingThreshold: data.data.freeShippingThreshold ?? 2000000,
            onlinePaymentEnabled: onlineEnabled,
          });

          if (!onlineEnabled) {
            setPaymentMethod("card_to_card");
          }
        }
      } catch {}
    }
    loadSettings();
  }, []);

  useEffect(() => {
    if (mounted && user) {
      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [mounted, user]);

  const SHIPPING_COST = publicSettings.shippingCost;
  const FREE_SHIPPING_THRESHOLD = publicSettings.freeShippingThreshold;
  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const finalPrice = Math.max(0, totalPrice - couponDiscount + shippingCost);

  const validateAddress = (): boolean => {
    if (!address.fullName.trim()) {
      toast.error("نام و نام خانوادگی الزامی است");
      return false;
    }
    if (address.phone.length !== 11 || !address.phone.startsWith("09")) {
      toast.error("شماره تماس معتبر نیست");
      return false;
    }
    if (!address.province) {
      toast.error("استان را انتخاب کنید");
      return false;
    }
    if (!address.city.trim()) {
      toast.error("شهر الزامی است");
      return false;
    }
    if (address.address.trim().length < 10) {
      toast.error("آدرس دقیق را کامل وارد کنید");
      return false;
    }
    if (address.postalCode.length !== 10) {
      toast.error("کد پستی باید ۱۰ رقم باشد");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateAddress()) {
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmitOrder = async () => {
    if (!user) {
      toast.error("برای ثبت سفارش باید وارد شوید");
      router.push("/auth/login?redirect=/checkout");
      return;
    }

    setIsSubmitting(true);
    toast.loading("در حال ثبت سفارش...", { id: "submit" });

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          address,
          customerNote: customerNote.trim() || undefined,
          couponCode: appliedCoupon?.code || undefined,
          paymentMethod:
            paymentMethod === "card_to_card" ? "CARD_TO_CARD" : "ONLINE",
        }),
      });

      const data = await res.json();

      if (data.success) {
        const orderNum = data.data.orderNumber;
        clearCart();

        if (data.data.paymentUrl) {
          // پرداخت آنلاین
          toast.success("در حال انتقال به درگاه پرداخت...", { id: "submit" });
          window.location.href = data.data.paymentUrl;
        } else if (data.data.paymentMethod === "CARD_TO_CARD") {
          // کارت به کارت
          toast.success("سفارش ثبت شد. لطفاً رسید را ارسال کنید", {
            id: "submit",
          });
          window.location.href = `/checkout/card-to-card?orderNumber=${orderNum}`;
        } else {
          toast.success("سفارش ثبت شد! ✨", { id: "submit" });
          window.location.href = `/checkout/success?orderNumber=${orderNum}`;
        }
      } else {
        toast.error(data.error || "خطا در ثبت سفارش", { id: "submit" });
        setIsSubmitting(false);
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: "submit" });
      setIsSubmitting(false);
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
            برای ادامه فرآیند خرید، ابتدا محصولی به سبد اضافه کنید
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold"
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
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black mb-2">
          <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
            تکمیل خرید
          </span>
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          برای تکمیل سفارش، مراحل زیر را طی کنید
        </p>
      </div>

      <CheckoutSteps currentStep={currentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {currentStep === 1 && (
            <AddressForm data={address} onChange={setAddress} />
          )}

          {currentStep === 2 && (
            <PaymentMethods
              selected={paymentMethod}
              onSelect={setPaymentMethod}
              onlinePaymentEnabled={publicSettings.onlinePaymentEnabled}
            />
          )}

          {currentStep === 3 && (
            <>
              <OrderReview
                address={address}
                paymentMethod={paymentMethod}
                items={items}
              />

              <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-5 md:p-6">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  توضیحات اضافه (اختیاری)
                </label>
                <textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="مثلاً: لطفاً هدیه‌بندی کنید، یا زمان تحویل ترجیحی..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors resize-none"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-between gap-3 pt-4">
            {currentStep > 1 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-royal-500/10 text-royal-500 font-bold hover:bg-royal-500/20 transition-colors cursor-pointer"
              >
                <ArrowRight size={18} />
                <span>مرحله قبل</span>
              </button>
            ) : (
              <Link
                href="/cart"
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-royal-500/10 text-royal-500 font-bold hover:bg-royal-500/20 transition-colors"
              >
                <ArrowRight size={18} />
                <span>بازگشت به سبد</span>
              </Link>
            )}

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span>مرحله بعد</span>
                <ArrowLeft size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                <CheckCircle size={18} />
                <span>
                  {isSubmitting ? "در حال ثبت..." : "ثبت نهایی سفارش"}
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-20 bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-5 md:p-6">
            <h2 className="text-lg font-black mb-5 pb-4 border-b border-royal-500/10">
              <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
                خلاصه سفارش
              </span>
            </h2>

            <div className="space-y-3 pb-5 border-b border-royal-500/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  قیمت کالاها
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {formatPrice(totalPrice)} تومان
                </span>
              </div>

              {appliedCoupon && couponDiscount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <Tag size={14} />
                    <span>کد تخفیف ({appliedCoupon.code})</span>
                  </div>
                  <span className="font-bold text-green-600">
                    {formatPrice(couponDiscount)}-
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Truck size={14} />
                  <span>هزینه ارسال</span>
                </div>
                {shippingCost === 0 ? (
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

            <div className="pt-4 border-t border-royal-500/10">
              <p className="text-[11px] text-gray-500 text-center leading-6">
                🔒 پرداخت شما در بستری کاملاً امن انجام می‌شود
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}