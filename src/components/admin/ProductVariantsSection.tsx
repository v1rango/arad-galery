"use client";

import { useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Palette,
  Ruler,
  FlaskConical,
  Tag,
  ChevronDown,
  ChevronUp,
  Calculator,
} from "lucide-react";

export type VariantFormItem = {
  id?: string;
  title: string;
  type: "COLOR" | "SIZE" | "VOLUME" | "OTHER";
  colorCode?: string;
  price?: string;
  discountPrice?: string;
  stockCount: string;
};

type Props = {
  hasVariants: boolean;
  setHasVariants: (val: boolean) => void;
  variants: VariantFormItem[];
  setVariants: React.Dispatch<React.SetStateAction<VariantFormItem[]>>;
  basePrice?: string;
  onSyncTotalStock?: (totalStock: number) => void;
};

const PRESET_COLORS = [
  { name: "مشکی", code: "#18181b" },
  { name: "سفید", code: "#ffffff" },
  { name: "قرمز", code: "#ef4444" },
  { name: "آبی", code: "#3b82f6" },
  { name: "صورتی", code: "#ec4899" },
  { name: "سبز", code: "#10b981" },
  { name: "زرد", code: "#eab308" },
  { name: "بنفش", code: "#a855f7" },
  { name: "قهوه‌ای", code: "#78350f" },
  { name: "طوسی", code: "#6b7280" },
  { name: "نارنجی", code: "#f97316" },
  { name: "کرم", code: "#fde047" },
];

const PRESET_SIZES = [
  "کوچک (S)",
  "متوسط (M)",
  "بزرگ (L)",
  "خیلی بزرگ (XL)",
  "۳۶",
  "۳۷",
  "۳۸",
  "۳۹",
  "۴۰",
  "۴۱",
  "۴۲",
];

const PRESET_VOLUMES = [
  "۳۰ میلی‌لیتر",
  "۵۰ میلی‌لیتر",
  "۱۰۰ میلی‌لیتر",
  "۱۵۰ میلی‌لیتر",
  "۲۰۰ میلی‌لیتر",
  "۲۵۰ میلی‌لیتر",
  "۵۰۰ میلی‌لیتر",
];

export default function ProductVariantsSection({
  hasVariants,
  setHasVariants,
  variants,
  setVariants,
  basePrice,
  onSyncTotalStock,
}: Props) {
  const [activeType, setActiveType] = useState<"COLOR" | "SIZE" | "VOLUME" | "OTHER">("COLOR");
  const [expandedPrices, setExpandedPrices] = useState<Record<number, boolean>>({});

  const handleToggleHasVariants = (checked: boolean) => {
    setHasVariants(checked);
    if (checked && variants.length === 0) {
      setVariants([
        {
          title: "",
          type: activeType,
          colorCode: activeType === "COLOR" ? "#18181b" : undefined,
          stockCount: "1",
        },
      ]);
    }
  };

  const handleAddVariant = (presetTitle?: string, presetColor?: string) => {
    setVariants((prev) => [
      ...prev,
      {
        title: presetTitle || "",
        type: activeType,
        colorCode: presetColor || (activeType === "COLOR" ? "#18181b" : undefined),
        stockCount: "1",
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateVariant = (index: number, field: keyof VariantFormItem, value: any) => {
    setVariants((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const togglePriceExpand = (index: number) => {
    setExpandedPrices((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const totalStockCount = variants.reduce((sum, v) => sum + (parseInt(v.stockCount) || 0), 0);

  return (
    <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-royal-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-royal-500/10 flex items-center justify-center text-royal-500">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900 dark:text-white">
              تنوع‌های محصول (رنگ، سایز، حجم، مدل)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              اگر این محصول چند رنگ، سایز یا حجم مختلف دارد، این بخش را فعال کنید
            </p>
          </div>
        </div>

        {/* سوییچ ساده روشن/خاموش */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={hasVariants}
            onChange={(e) => handleToggleHasVariants(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royal-500"></div>
          <span className="mr-3 text-sm font-bold text-gray-700 dark:text-gray-300">
            {hasVariants ? "فعال است" : "غیرفعال"}
          </span>
        </label>
      </div>

      {hasVariants && (
        <div className="space-y-6 animate-fadeIn">
          {/* انتخاب نوع تنوع با دکمه‌های شکیل */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              نوع تنوع پیش‌فرض برای گزینه‌ها:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setActiveType("COLOR")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                  activeType === "COLOR"
                    ? "bg-royal-500 text-white border-royal-500 shadow-md shadow-royal-500/20"
                    : "bg-royal-500/5 text-gray-700 dark:text-gray-300 border-transparent hover:bg-royal-500/10"
                }`}
              >
                <Palette size={16} />
                <span>رنگ‌بندی 🎨</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveType("SIZE")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                  activeType === "SIZE"
                    ? "bg-royal-500 text-white border-royal-500 shadow-md shadow-royal-500/20"
                    : "bg-royal-500/5 text-gray-700 dark:text-gray-300 border-transparent hover:bg-royal-500/10"
                }`}
              >
                <Ruler size={16} />
                <span>سایزبندی 📏</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveType("VOLUME")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                  activeType === "VOLUME"
                    ? "bg-royal-500 text-white border-royal-500 shadow-md shadow-royal-500/20"
                    : "bg-royal-500/5 text-gray-700 dark:text-gray-300 border-transparent hover:bg-royal-500/10"
                }`}
              >
                <FlaskConical size={16} />
                <span>حجم / وزن 🧴</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveType("OTHER")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                  activeType === "OTHER"
                    ? "bg-royal-500 text-white border-royal-500 shadow-md shadow-royal-500/20"
                    : "bg-royal-500/5 text-gray-700 dark:text-gray-300 border-transparent hover:bg-royal-500/10"
                }`}
              >
                <Tag size={16} />
                <span>سایر مدل‌ها 🏷️</span>
              </button>
            </div>
          </div>

          {/* چیپ‌های افزودن سریع (Quick Add Chips) */}
          <div className="p-3 bg-royal-500/5 rounded-xl border border-royal-500/10 space-y-2">
            <span className="text-xs font-bold text-royal-600 dark:text-royal-400 block">
              افزودن سریع با یک کلیک:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeType === "COLOR" &&
                PRESET_COLORS.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleAddVariant(c.name, c.code)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-royal-500/15 text-xs font-medium hover:border-royal-500 transition-colors"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: c.code }}
                    />
                    <span>{c.name}</span>
                    <Plus size={12} className="text-gray-400" />
                  </button>
                ))}

              {activeType === "SIZE" &&
                PRESET_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddVariant(s)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-royal-500/15 text-xs font-medium hover:border-royal-500 transition-colors"
                  >
                    <span>{s}</span>
                    <Plus size={12} className="text-gray-400" />
                  </button>
                ))}

              {activeType === "VOLUME" &&
                PRESET_VOLUMES.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleAddVariant(v)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-royal-500/15 text-xs font-medium hover:border-royal-500 transition-colors"
                  >
                    <span>{v}</span>
                    <Plus size={12} className="text-gray-400" />
                  </button>
                ))}

              {activeType === "OTHER" && (
                <span className="text-xs text-gray-500">
                  برای افزودن مدل دلخواه، از دکمه «افزودن گزینه جدید» پایین استفاده کنید.
                </span>
              )}
            </div>
          </div>

          {/* لیست ردیف‌های تنوع */}
          <div className="space-y-3">
            {variants.map((v, index) => {
              const isPriceOpen = expandedPrices[index] || !!v.price || !!v.discountPrice;
              return (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-royal-500/15 shadow-sm space-y-3"
                >
                  <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                    {/* اگر نوع رنگ باشد: دایره و Color Picker */}
                    {v.type === "COLOR" && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <label
                          className="w-9 h-9 rounded-xl border-2 border-gray-300 dark:border-gray-600 shadow-sm cursor-pointer relative overflow-hidden flex items-center justify-center transition-transform hover:scale-105"
                          style={{ backgroundColor: v.colorCode || "#18181b" }}
                          title="انتخاب رنگ"
                        >
                          <input
                            type="color"
                            value={v.colorCode || "#18181b"}
                            onChange={(e) =>
                              handleUpdateVariant(index, "colorCode", e.target.value)
                            }
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                          />
                        </label>
                      </div>
                    )}

                    {/* نام یا عنوان تنوع */}
                    <div className="flex-1 min-w-[140px]">
                      <input
                        type="text"
                        value={v.title}
                        onChange={(e) =>
                          handleUpdateVariant(index, "title", e.target.value)
                        }
                        placeholder={
                          v.type === "COLOR"
                            ? "نام رنگ (مثلاً: قرمز، مشکی)"
                            : v.type === "SIZE"
                            ? "سایز (مثلاً: ۳۸، لارج)"
                            : v.type === "VOLUME"
                            ? "حجم (مثلاً: ۵۰ میل)"
                            : "عنوان گزینه (مثلاً: مدل چرمی)"
                        }
                        className="w-full px-3 py-2 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm font-medium"
                      />
                    </div>

                    {/* تعداد موجودی انبار */}
                    <div className="w-28 shrink-0">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={v.stockCount}
                          onChange={(e) =>
                            handleUpdateVariant(index, "stockCount", e.target.value)
                          }
                          placeholder="موجودی"
                          className="w-full px-3 py-2 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-center font-bold"
                        />
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">
                          عدد
                        </span>
                      </div>
                    </div>

                    {/* دکمه تنظیم قیمت اختصاصی */}
                    <button
                      type="button"
                      onClick={() => togglePriceExpand(index)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0 ${
                        v.price
                          ? "bg-royal-500 text-white"
                          : "bg-royal-500/10 text-royal-600 dark:text-royal-400 hover:bg-royal-500/20"
                      }`}
                    >
                      <span>{v.price ? "قیمت متغیر" : "قیمت یکسان"}</span>
                      {isPriceOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {/* دکمه حذف */}
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                      title="حذف این تنوع"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* بخش قیمت اختصاصی اختیاری */}
                  {isPriceOpen && (
                    <div className="pt-2 border-t border-royal-500/10 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-royal-500/5 p-3 rounded-xl">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                          قیمت این گزینه (تومان) - اختیاری:
                        </label>
                        <input
                          type="number"
                          value={v.price || ""}
                          onChange={(e) =>
                            handleUpdateVariant(index, "price", e.target.value)
                          }
                          placeholder={basePrice ? `پیش‌فرض: ${basePrice}` : "همان قیمت اصلی محصول"}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-royal-500/10 text-xs font-medium"
                        />
                        <span className="text-[10px] text-gray-400 mt-0.5 block">
                          اگر خالی بماند از قیمت اصلی محصول استفاده می‌شود.
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                          قیمت تخفیف‌خورده این گزینه (تومان) - اختیاری:
                        </label>
                        <input
                          type="number"
                          value={v.discountPrice || ""}
                          onChange={(e) =>
                            handleUpdateVariant(index, "discountPrice", e.target.value)
                          }
                          placeholder="اختیاری"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-royal-500/10 text-xs font-medium"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* دکمه افزودن گزینه جدید و همگام‌سازی موجودی */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleAddVariant()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-l from-royal-500 to-blush-500 text-white text-xs font-bold hover:shadow-lg hover:shadow-royal-500/25 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>افزودن گزینه جدید</span>
            </button>

            {onSyncTotalStock && variants.length > 0 && (
              <button
                type="button"
                onClick={() => onSyncTotalStock(totalStockCount)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-royal-500/10 text-royal-600 dark:text-royal-400 text-xs font-bold hover:bg-royal-500/20 transition-colors cursor-pointer"
                title="موجودی کل محصول را برابر جمع موجودی تمام تنوع‌ها قرار می‌دهد"
              >
                <Calculator size={14} />
                <span>تنظیم موجودی کل به {totalStockCount.toLocaleString("fa-IR")} عدد</span>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
