"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Save,
  ArrowRight,
  Tag,
  Percent,
  DollarSign,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

type CouponData = {
  id?: string;
  code?: string;
  description?: string | null;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  maxDiscountAmount?: number | null;
  minOrderAmount?: number;
  usageLimit?: number | null;
  perUserLimit?: number;
  startsAt?: string;
  expiresAt?: string | null;
  isActive?: boolean;
};

type Props = {
  mode: "create" | "edit";
  couponId?: string;
  initialData?: CouponData;
  onSuccess: () => void;
};

function toDateInput(d: string | null | undefined): string {
  if (!d) return "";
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CouponForm({
  mode,
  couponId,
  initialData,
  onSuccess,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [code, setCode] = useState(initialData?.code || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">(
    initialData?.discountType || "PERCENTAGE"
  );
  const [discountValue, setDiscountValue] = useState(
    initialData?.discountValue?.toString() || ""
  );
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(
    initialData?.maxDiscountAmount?.toString() || ""
  );
  const [minOrderAmount, setMinOrderAmount] = useState(
    initialData?.minOrderAmount?.toString() || "0"
  );
  const [usageLimit, setUsageLimit] = useState(
    initialData?.usageLimit?.toString() || ""
  );
  const [perUserLimit, setPerUserLimit] = useState(
    initialData?.perUserLimit?.toString() || "1"
  );
  const [startsAt, setStartsAt] = useState(toDateInput(initialData?.startsAt));
  const [expiresAt, setExpiresAt] = useState(toDateInput(initialData?.expiresAt));
  const [isActive, setIsActive] = useState(initialData?.isActive !== false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("کد کوپن الزامی است");
      return;
    }

    const dValue = parseInt(discountValue);
    if (!dValue || dValue <= 0) {
      toast.error("مقدار تخفیف باید مثبت باشد");
      return;
    }

    if (discountType === "PERCENTAGE" && dValue > 100) {
      toast.error("تخفیف درصدی نمی‌تواند بیش از 100 باشد");
      return;
    }

    setIsSubmitting(true);
    toast.loading("در حال ذخیره...", { id: "save" });

    const payload = {
      code: code.trim(),
      description: description.trim() || null,
      discountType,
      discountValue: dValue,
      maxDiscountAmount: maxDiscountAmount ? parseInt(maxDiscountAmount) : null,
      minOrderAmount: minOrderAmount ? parseInt(minOrderAmount) : 0,
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      perUserLimit: perUserLimit ? parseInt(perUserLimit) : 1,
      startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      isActive,
    };

    try {
      const url =
        mode === "create"
          ? "/api/admin/coupons"
          : `/api/admin/coupons/${couponId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          mode === "create" ? "کوپن ساخته شد ✨" : "کوپن به‌روزرسانی شد ✨",
          { id: "save" }
        );
        onSuccess();
      } else {
        toast.error(data.error || "خطا در ذخیره", { id: "save" });
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: "save" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-1 flex items-center gap-2">
            <Tag size={28} className="text-royal-500" />
            <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
              {mode === "create" ? "کوپن جدید" : "ویرایش کوپن"}
            </span>
          </h1>
          <p className="text-sm text-gray-500">
            {mode === "create"
              ? "یک کد تخفیف جدید بسازید"
              : "اطلاعات کوپن را ویرایش کنید"}
          </p>
        </div>

        <Link
          href="/admin/coupons"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-500/10 text-royal-500 text-sm font-bold hover:bg-royal-500/20 transition-colors"
        >
          <ArrowRight size={16} />
          <span>بازگشت</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black pb-3 border-b border-royal-500/10">
            اطلاعات کلی
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              کد کوپن *
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="مثلاً: NOWRUZ1404"
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right font-mono"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              کد کوپن به صورت خودکار به حروف بزرگ تبدیل می‌شود
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              توضیحات (اختیاری)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثلاً: تخفیف ویژه نوروز"
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
            />
          </div>

          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500 mt-0.5"
              />
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  کوپن فعال باشد
                </div>
                <div className="text-[11px] text-gray-500 leading-6">
                  اگر غیرفعال کنید، کاربران نمی‌توانند از این کد استفاده کنند
                </div>
              </div>
            </label>
          </div>
        </section>

        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black pb-3 border-b border-royal-500/10">
            نوع و مقدار تخفیف
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              نوع تخفیف *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDiscountType("PERCENTAGE")}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  discountType === "PERCENTAGE"
                    ? "border-royal-500 bg-royal-500/10"
                    : "border-royal-500/10 hover:border-royal-500/30"
                }`}
              >
                <Percent
                  size={24}
                  className={
                    discountType === "PERCENTAGE" ? "text-royal-500" : "text-gray-400"
                  }
                />
                <span className="text-sm font-bold">درصدی</span>
                <span className="text-[10px] text-gray-500">مثلاً 20٪</span>
              </button>

              <button
                type="button"
                onClick={() => setDiscountType("FIXED")}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  discountType === "FIXED"
                    ? "border-royal-500 bg-royal-500/10"
                    : "border-royal-500/10 hover:border-royal-500/30"
                }`}
              >
                <DollarSign
                  size={24}
                  className={
                    discountType === "FIXED" ? "text-royal-500" : "text-gray-400"
                  }
                />
                <span className="text-sm font-bold">مبلغ ثابت</span>
                <span className="text-[10px] text-gray-500">مثلاً 50 هزار تومان</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              مقدار تخفیف *{" "}
              <span className="text-gray-500 font-normal">
                {discountType === "PERCENTAGE" ? "(1 تا 100)" : "(به تومان)"}
              </span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value.replace(/\D/g, ""))}
              placeholder={discountType === "PERCENTAGE" ? "20" : "50000"}
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
            />
          </div>

          {discountType === "PERCENTAGE" && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                سقف تخفیف (اختیاری){" "}
                <span className="text-gray-500 font-normal">(به تومان)</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={maxDiscountAmount}
                onChange={(e) =>
                  setMaxDiscountAmount(e.target.value.replace(/\D/g, ""))
                }
                placeholder="مثلاً: 200000"
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                حداکثر مبلغی که به عنوان تخفیف اعمال می‌شود
              </p>
            </div>
          )}
        </section>

        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black pb-3 border-b border-royal-500/10">
            محدودیت‌ها
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              حداقل مبلغ سفارش{" "}
              <span className="text-gray-500 font-normal">(به تومان)</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              0 یعنی بدون محدودیت
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                حداکثر تعداد استفاده (کل)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value.replace(/\D/g, ""))}
                placeholder="نامحدود"
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                خالی = نامحدود
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                حداکثر استفاده هر کاربر
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={perUserLimit}
                onChange={(e) => setPerUserLimit(e.target.value.replace(/\D/g, ""))}
                placeholder="1"
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                معمولاً 1 بار
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black pb-3 border-b border-royal-500/10">
            تاریخ اعتبار
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                تاریخ شروع (اختیاری)
              </label>
              <input
                type="date"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                خالی = از همین الان
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                تاریخ انقضا (اختیاری)
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                خالی = بدون تاریخ انقضا
              </p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/coupons"
            className="px-5 py-3 rounded-xl bg-gray-500/10 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-500/20 transition-colors"
          >
            انصراف
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>در حال ذخیره...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{mode === "create" ? "ساخت کوپن" : "ذخیره تغییرات"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}