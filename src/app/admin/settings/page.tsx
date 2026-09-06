"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  Truck,
  AlertTriangle,
  Store,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  Settings as SettingsIcon,
  Key,
  Hash,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";

type Settings = {
  id: string;
  shippingCost: number;
  freeShippingThreshold: number;
  lowStockThreshold: number;
  storeName: string;
  storePhone: string;
  storePhone2: string | null;
  storeAddress: string;
  instagramHandle: string | null;
  telegramHandle: string | null;
  whatsappNumber: string | null;
  workingHours: string;
  cardNumber: string | null;
  cardHolderName: string | null;
  onlinePaymentEnabled: boolean;
  smsEnabled: boolean;
  smsProvider: string;
  ippanelApiKey: string | null;
  ippanelPatternCode: string | null;
  ippanelSenderNumber: string | null;
};

const formatNumber = (num: string) => {
  const raw = num.replace(/\D/g, "");
  return raw ? Number(raw).toLocaleString("fa-IR") : "";
};

const getRawNumber = (num: string) => num.replace(/[^\d]/g, "");

const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length > 0) {
    return parts.join(" - ");
  } else {
    return v;
  }
};

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingCost, setShippingCost] = useState("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storePhone2, setStorePhone2] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [workingHours, setWorkingHours] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [onlinePaymentEnabled, setOnlinePaymentEnabled] = useState(false);

  const [smsEnabled, setSmsEnabled] = useState(false);
  const [smsProvider, setSmsProvider] = useState("ippanel");
  const [ippanelApiKey, setIppanelApiKey] = useState("");
  const [ippanelPatternCode, setIppanelPatternCode] = useState("");
  const [ippanelSenderNumber, setIppanelSenderNumber] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success) {
          const s: Settings = data.data;
          setShippingCost(s.shippingCost ? s.shippingCost.toString() : "0");
          setFreeShippingThreshold(s.freeShippingThreshold ? s.freeShippingThreshold.toString() : "0");
          setLowStockThreshold(s.lowStockThreshold ? s.lowStockThreshold.toString() : "0");
          setStoreName(s.storeName || "");
          setStorePhone(s.storePhone || "");
          setStorePhone2(s.storePhone2 || "");
          setStoreAddress(s.storeAddress || "");
          setInstagramHandle(s.instagramHandle || "");
          setTelegramHandle(s.telegramHandle || "");
          setWhatsappNumber(s.whatsappNumber || "");
          setWorkingHours(s.workingHours || "");

          setCardNumber(s.cardNumber ? formatCardNumber(s.cardNumber) : "");
          setCardHolderName(s.cardHolderName || "");
          setOnlinePaymentEnabled(s.onlinePaymentEnabled || false);

          setSmsEnabled(s.smsEnabled || false);
          setSmsProvider(s.smsProvider || "ippanel");
          setIppanelApiKey(s.ippanelApiKey || "");
          setIppanelPatternCode(s.ippanelPatternCode || "");
          setIppanelSenderNumber(s.ippanelSenderNumber || "");
        }
      } catch {
        toast.error("خطا در بارگذاری تنظیمات");
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (smsEnabled && (!ippanelApiKey.trim() || !ippanelPatternCode.trim())) {
      toast.error("در صورت فعال بودن سامانه پیامک، API Key و کد الگو الزامی هستند.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("در حال ذخیره...", { id: "save" });

    const rawCard = getRawNumber(cardNumber);
    if (rawCard && rawCard.length !== 16) {
      toast.error("شماره کارت بانکی باید ۱۶ رقم باشد.", { id: "save" });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      shippingCost: Number(getRawNumber(shippingCost)) || 0,
      freeShippingThreshold: Number(getRawNumber(freeShippingThreshold)) || 0,
      lowStockThreshold: Number(getRawNumber(lowStockThreshold)) || 0,
      storeName: storeName.trim(),
      storePhone: storePhone.trim(),
      storePhone2: storePhone2.trim() || null,
      storeAddress: storeAddress.trim(),
      instagramHandle: instagramHandle.trim() || null,
      telegramHandle: telegramHandle.trim() || null,
      whatsappNumber: whatsappNumber.trim() || null,
      workingHours: workingHours.trim(),
      cardNumber: rawCard || null,
      cardHolderName: cardHolderName.trim() || null,
      onlinePaymentEnabled,
      smsEnabled,
      smsProvider,
      ippanelApiKey: ippanelApiKey.trim() || null,
      ippanelPatternCode: ippanelPatternCode.trim() || null,
      ippanelSenderNumber: ippanelSenderNumber.trim() || null,
      ippanelOriginator: ippanelSenderNumber.trim() || null,
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("تنظیمات ذخیره شد ✨", { id: "save" });
      } else {
        toast.error(data.error || "خطا در ذخیره", { id: "save" });
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: "save" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-royal-500/20 border-t-royal-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-black mb-1 flex items-center gap-2">
          <SettingsIcon size={28} className="text-royal-500" />
          <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
            تنظیمات فروشگاه
          </span>
        </h1>
        <p className="text-sm text-gray-500">
          تنظیمات کلی سایت و اطلاعات تماس
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* تنظیمات ارسال */}
        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10 flex items-center gap-2">
            <Truck size={18} className="text-royal-500" />
            <span>تنظیمات ارسال</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                هزینه ارسال (تومان)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={shippingCost}
                onChange={(e) => setShippingCost(getRawNumber(e.target.value))}
                placeholder="50000"
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                {shippingCost ? `${formatNumber(shippingCost)} تومان` : "هزینه ثابت ارسال برای هر سفارش"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                آستانه ارسال رایگان (تومان)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(getRawNumber(e.target.value))}
                placeholder="2000000"
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                {freeShippingThreshold ? `${formatNumber(freeShippingThreshold)} تومان` : "خرید بالاتر از این مبلغ، ارسال رایگان"}
              </p>
            </div>
          </div>
        </section>

        {/* هشدارها */}
        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10 flex items-center gap-2">
            <AlertTriangle size={18} className="text-orange-500" />
            <span>هشدارها</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              آستانه هشدار موجودی کم
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(getRawNumber(e.target.value))}
              placeholder="3"
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              وقتی موجودی محصولی به این عدد یا کمتر برسه، هشدار میدیم
            </p>
          </div>
        </section>

        {/* درگاه پرداخت آنلاین */}
        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10 flex items-center gap-2">
            <CreditCard size={18} className="text-royal-500" />
            <span>درگاه پرداخت آنلاین</span>
          </h2>

          <div className="p-4 rounded-xl bg-royal-500/5 border border-royal-500/20">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={onlinePaymentEnabled}
                onChange={(e) => setOnlinePaymentEnabled(e.target.checked)}
                className="w-5 h-5 rounded accent-royal-500 mt-0.5 cursor-pointer"
              />
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  فعال‌سازی پرداخت آنلاین (زرین‌پال)
                </div>
                <div className="text-[11px] leading-6">
                  {onlinePaymentEnabled ? (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      ✅ درگاه آنلاین برای کاربران فعال است
                    </span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      ⚠️ فعلاً غیرفعال — کاربران فقط کارت به کارت می‌بینند
                    </span>
                  )}
                </div>
              </div>
            </label>
          </div>
        </section>

        {/* تنظیمات حساب و کارت به کارت */}
        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10 flex items-center gap-2">
            <CreditCard size={18} className="text-emerald-500" />
            <span>تنظیمات حساب (کارت به کارت)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                شماره کارت بانکی (۱۶ رقم)
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={25}
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="6037 - 9911 - 2233 - 4455"
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-center font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                نام صاحب کارت
              </label>
              <input
                type="text"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                placeholder="مثال: آراد رضوانی"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
              />
            </div>
          </div>
        </section>

        {/* اطلاعات فروشگاه */}
        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10 flex items-center gap-2">
            <Store size={18} className="text-royal-500" />
            <span>اطلاعات فروشگاه</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              نام فروشگاه
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="آراد گالری"
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                <Phone size={12} />
                <span>شماره تماس اصلی</span>
              </label>
              <input
                type="text"
                value={storePhone}
                onChange={(e) => setStorePhone(getRawNumber(e.target.value))}
                placeholder="09123456789"
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                <Phone size={12} />
                <span>شماره تماس دوم (اختیاری)</span>
              </label>
              <input
                type="text"
                value={storePhone2}
                onChange={(e) => setStorePhone2(getRawNumber(e.target.value))}
                placeholder="09123456780"
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <MapPin size={12} />
              <span>آدرس فروشگاه</span>
            </label>
            <textarea
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              placeholder="آدرس دقیق فروشگاه فیزیکی"
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <Clock size={12} />
              <span>ساعات کاری</span>
            </label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder="شنبه تا پنجشنبه: ۹:۰۰ تا ۲۱:۰۰"
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
            />
          </div>
        </section>

        {/* شبکه‌های اجتماعی */}
        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10 flex items-center gap-2">
            <Store size={18} className="text-blush-500" />
            <span>شبکه‌های اجتماعی</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <span className="text-blush-500">📸</span>
              <span>آیدی اینستاگرام</span>
            </label>
            <input
              type="text"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              placeholder="arad-beauty2025"
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
            />
            <p className="text-[10px] text-gray-500 mt-1">بدون @ وارد کنید</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <Send size={12} className="text-blue-400" />
              <span>آیدی تلگرام</span>
            </label>
            <input
              type="text"
              value={telegramHandle}
              onChange={(e) => setTelegramHandle(e.target.value)}
              placeholder="arad_gallery"
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <MessageCircle size={12} className="text-green-500" />
              <span>شماره واتساپ</span>
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(getRawNumber(e.target.value))}
              placeholder="989123456789"
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
            />
            <p className="text-[10px] text-gray-500 mt-1">با کد کشور (مثلاً 989121234567)</p>
          </div>
        </section>

        {/* سرویس پیامک آی‌پی‌پنل */}
        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10 flex items-center gap-2">
            <MessageCircle size={18} className="text-blue-500" />
            <span>سرویس پیامک (IPPanel)</span>
          </h2>

          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={smsEnabled}
                onChange={(e) => setSmsEnabled(e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500 mt-0.5 cursor-pointer"
              />
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  فعال کردن ارسال پیامک واقعی
                </div>
                <div className="text-[11px] leading-6">
                  {smsEnabled ? (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      ✅ پیامک‌های ورود با وب‌سرویس آی‌پی‌پنل ارسال می‌شوند
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      ⚠️ غیرفعال: کد OTP فقط در لاگ‌ها نمایش داده می‌شود
                    </span>
                  )}
                </div>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              سامانه ارائه‌دهنده فعال
            </label>
            <select
              value={smsProvider}
              onChange={(e) => setSmsProvider(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors font-medium"
            >
              <option value="ippanel">IPPanel.com (آی‌پی‌پنل)</option>
            </select>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                <Key size={12} className="text-gray-400" />
                <span>API Key</span>
              </label>
              <input
                type="password"
                value={ippanelApiKey}
                onChange={(e) => setIppanelApiKey(e.target.value)}
                placeholder="مثلاً: SKLo8kg..."
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Hash size={12} className="text-gray-400" />
                  <span>کد الگو</span>
                </label>
                <input
                  type="text"
                  value={ippanelPatternCode}
                  onChange={(e) => setIppanelPatternCode(e.target.value.trim())}
                  placeholder="مثلاً: 46qd0"
                  dir="ltr"
                  className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Phone size={12} className="text-gray-400" />
                  <span>خط فرستنده</span>
                </label>
                <input
                  type="text"
                  value={ippanelSenderNumber}
                  onChange={(e) => setIppanelSenderNumber(e.target.value.trim())}
                  placeholder="+9810001"
                  dir="ltr"
                  className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right font-mono"
                />
              </div>
            </div>
          </div>
        </section>

        {/* دکمه ذخیره */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>در حال ذخیره...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>ذخیره تنظیمات</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* منطقه خطر */}
      <section className="bg-red-500/5 border-2 border-red-500/30 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={24} className="text-red-500 shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-sm font-black text-red-500 mb-1">منطقه خطر</h3>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-6 mb-3">
              عملیات حساس مثل پاک کردن همه محصولات فروشگاه
            </p>
            <Link
              href="/admin/settings/danger-zone"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-colors"
            >
              <span>ورود به منطقه خطر</span>
              <ArrowLeft size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}