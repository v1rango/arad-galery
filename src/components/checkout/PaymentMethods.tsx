"use client";

import { CreditCard, ShieldCheck } from "lucide-react";

export type PaymentMethod = "online";

type Props = {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
};

export default function PaymentMethods({ selected, onSelect }: Props) {
  return (
    <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-5 md:p-6">
      <h2 className="text-lg font-black mb-5">
        <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
          روش پرداخت
        </span>
      </h2>

      <button
        onClick={() => onSelect("online")}
        className="w-full text-right flex items-center gap-4 p-5 rounded-2xl border-2 border-royal-500 bg-royal-500/10 transition-all"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royal-500 to-blush-500 text-white flex items-center justify-center shrink-0">
          <CreditCard size={26} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-black text-gray-900 dark:text-white">
              پرداخت آنلاین
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-l from-royal-500 to-blush-500 text-white">
              امن
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-6">
            پرداخت امن از طریق درگاه زرین‌پال
          </p>
        </div>

        <div className="w-6 h-6 rounded-full border-2 border-royal-500 bg-royal-500 flex items-center justify-center shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
        </div>
      </button>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-royal-500/5">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-green-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900 dark:text-white">
              پرداخت امن
            </div>
            <div className="text-[11px] text-gray-500">
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
            <div className="text-[11px] text-gray-500">
              شتاب پذیرفته می‌شود
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}