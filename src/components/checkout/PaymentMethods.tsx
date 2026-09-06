"use client";

import { CreditCard, ShieldCheck, Landmark, Lock } from "lucide-react";

export type PaymentMethod = "online" | "card_to_card";

type Props = {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  onlinePaymentEnabled?: boolean;
};

export default function PaymentMethods({
  selected,
  onSelect,
  onlinePaymentEnabled = false,
}: Props) {
  return (
    <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-5 md:p-6">
      <h2 className="text-lg font-black mb-5">
        <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
          روش پرداخت
        </span>
      </h2>

      <div className="space-y-3">
        {/* پرداخت آنلاین */}
        <button
          type="button"
          disabled={!onlinePaymentEnabled}
          onClick={() => {
            if (onlinePaymentEnabled) onSelect("online");
          }}
          className={`w-full text-right flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
            !onlinePaymentEnabled
              ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/40 opacity-60 cursor-not-allowed"
              : selected === "online"
              ? "border-royal-500 bg-royal-500/10 cursor-pointer"
              : "border-royal-500/15 hover:border-royal-500/40 cursor-pointer"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center shrink-0 ${
              !onlinePaymentEnabled
                ? "bg-gray-400 dark:bg-gray-600"
                : "bg-gradient-to-br from-royal-500 to-blush-500"
            }`}
          >
            {!onlinePaymentEnabled ? <Lock size={24} /> : <CreditCard size={26} />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className={`text-base font-black ${
                  !onlinePaymentEnabled
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                پرداخت آنلاین
              </span>
              {onlinePaymentEnabled ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-l from-royal-500 to-blush-500 text-white">
                  امن
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-400 text-white">
                  به‌زودی
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-6">
              {onlinePaymentEnabled
                ? "پرداخت امن از طریق درگاه زرین‌پال"
                : "این درگاه فعلاً غیرفعال است — از کارت به کارت استفاده کنید"}
            </p>
          </div>

          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
              !onlinePaymentEnabled
                ? "border-gray-300 dark:border-gray-600"
                : selected === "online"
                ? "border-royal-500 bg-royal-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            {onlinePaymentEnabled && selected === "online" && (
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            )}
          </div>
        </button>

        {/* کارت به کارت */}
        <button
          type="button"
          onClick={() => onSelect("card_to_card")}
          className={`w-full text-right flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            selected === "card_to_card"
              ? "border-royal-500 bg-royal-500/10"
              : "border-royal-500/15 hover:border-royal-500/40"
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0">
            <Landmark size={26} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-black text-gray-900 dark:text-white">
                کارت به کارت
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                فعال
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-6">
              انتقال وجه به کارت و ارسال رسید
            </p>
          </div>

          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
              selected === "card_to_card"
                ? "border-royal-500 bg-royal-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            {selected === "card_to_card" && (
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            )}
          </div>
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-royal-500/5">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-green-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900 dark:text-white">
              پرداخت امن
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              با درگاه معتبر بانکی
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-royal-500/5">
          <div className="w-10 h-10 rounded-xl bg-royal-500/10 flex items-center justify-center shrink-0">
            <CreditCard size={20} className="text-royal-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900 dark:text-white">
              همه کارت‌های بانکی
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              شتاب پذیرفته می‌شود
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}