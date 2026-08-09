"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Info,
  Type,
  FileText,
  Hash,
} from "lucide-react";

type Props = {
  seoTitle: string;
  setSeoTitle: (v: string) => void;
  seoDescription: string;
  setSeoDescription: (v: string) => void;
  seoKeywords: string;
  setSeoKeywords: (v: string) => void;
  defaultTitle?: string;
};

export default function SeoFieldsSection({
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  seoKeywords,
  setSeoKeywords,
  defaultTitle,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const titleLength = seoTitle.length;
  const descLength = seoDescription.length;

  const titleColor =
    titleLength === 0
      ? "text-gray-400"
      : titleLength < 30
      ? "text-orange-500"
      : titleLength <= 60
      ? "text-green-600"
      : "text-red-500";

  const descColor =
    descLength === 0
      ? "text-gray-400"
      : descLength < 120
      ? "text-orange-500"
      : descLength <= 160
      ? "text-green-600"
      : "text-red-500";

  return (
    <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between text-right hover:bg-royal-500/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Search size={18} className="text-royal-500" />
          <h2 className="text-base font-black text-gray-900 dark:text-white">
            تنظیمات SEO
          </h2>
          <span className="text-[10px] text-gray-500 mr-1">(اختیاری)</span>
        </div>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isExpanded && (
        <div className="p-5 pt-0 space-y-4 border-t border-royal-500/10">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2">
            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-6">
              اگه این فیلدها رو خالی بذاری، از عنوان و توضیحات محصول استفاده می‌شه.
              پر کردن این‌ها برای نمایش بهتر تو گوگل هست.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <Type size={12} />
              <span>عنوان SEO (Title)</span>
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder={defaultTitle || "مثلاً: خرید کرم پودر Fit Me میبلین اورجینال با قیمت مناسب"}
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] text-gray-500">
                💡 حاوی کلمه کلیدی اصلی + برند + مزیت باشه
              </p>
              <span className={`text-[10px] font-bold ${titleColor}`}>
                {titleLength}/60
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <FileText size={12} />
              <span>توضیح SEO (Description)</span>
            </label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="مثلاً: کرم پودر Fit Me میبلین با پوشش طبیعی، مناسب همه انواع پوست. خرید آنلاین با ضمانت اصالت و ارسال سریع از آراد گالری."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors resize-none"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] text-gray-500">
                💡 خلاصه‌ی جذاب برای گوگل که کاربر رو به کلیک وادار کنه
              </p>
              <span className={`text-[10px] font-bold ${descColor}`}>
                {descLength}/160
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <Hash size={12} />
              <span>کلمات کلیدی</span>
            </label>
            <input
              type="text"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="مثلاً: کرم پودر, میبلین, Fit Me, آرایش صورت, پوشش طبیعی"
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              💡 کلمات رو با کاما (,) جدا کن. ۵ تا ۱۰ کلمه کلیدی کافیه.
            </p>
          </div>

          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3">
            <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-6">
              <strong className="text-green-600">✅ پیش‌نمایش گوگل:</strong>
            </p>
            <div className="mt-2 bg-white dark:bg-black rounded-lg p-3">
              <div className="text-xs text-blue-600 font-medium line-clamp-1">
                {seoTitle || defaultTitle || "عنوان محصول شما"}
              </div>
              <div className="text-[10px] text-green-700 mt-0.5" dir="ltr">
                arad-gallery.ir › products › ...
              </div>
              <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 leading-6">
                {seoDescription ||
                  "توضیح خلاصه اینجا نمایش داده می‌شه. یه توضیح جذاب بنویسید که کاربر کلیک کنه."}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}