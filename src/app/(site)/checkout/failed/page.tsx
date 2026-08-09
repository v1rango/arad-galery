"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, Home, RefreshCw, ShoppingBag } from "lucide-react";

const reasonMessages: Record<string, string> = {
  invalid_callback: "اطلاعات بازگشت نامعتبر است",
  order_not_found: "سفارش پیدا نشد",
  user_cancelled: "پرداخت توسط شما لغو شد",
  verify_failed: "پرداخت تایید نشد. اگر مبلغ از حساب شما کسر شده، ظرف ۷۲ ساعت بازگردانده می‌شود",
  server_error: "خطای سرور در پردازش پرداخت",
};

function FailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "server_error";
  const orderNumber = searchParams.get("order");

  const message = reasonMessages[reason] || "خطای نامشخص در پرداخت";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-8 md:p-10 text-center shadow-2xl shadow-royal-500/5">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
            <XCircle size={50} className="text-white" />
          </div>

          <h1 className="text-2xl md:text-3xl font-black mb-3 text-red-500">
            پرداخت ناموفق
          </h1>

          <p className="text-gray-600 dark:text-gray-400 leading-8 mb-6">
            {message}
          </p>

          {orderNumber && (
            <div className="bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 mb-6">
              <div className="text-xs text-gray-500 mb-1">شماره سفارش</div>
              <div
                className="text-xl md:text-2xl font-black text-royal-500 tracking-wider"
                dir="ltr"
              >
                {orderNumber}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/cart"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5"
            >
              <RefreshCw size={18} />
              <span>تلاش مجدد</span>
            </Link>

            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-royal-500/10 text-royal-500 font-bold hover:bg-royal-500/20 transition-colors"
            >
              <Home size={18} />
              <span>صفحه اصلی</span>
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-royal-500/10">
            <Link
              href="/profile/orders"
              className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-royal-500 transition-colors"
            >
              <ShoppingBag size={14} />
              <span>مشاهده سفارش‌ها</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FailedPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500">در حال بارگذاری...</div>
      }
    >
      <FailedContent />
    </Suspense>
  );
}