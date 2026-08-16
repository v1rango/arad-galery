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
  Camera,
  Send,
  MessageCircle,
  Clock,
  Settings as SettingsIcon,
  ArrowLeft,
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
  smsEnabled: boolean;
  smsProvider: string;
  smsApiKey: string | null;
  smsTemplateId: string | null;
  kavenegarApiKey: string | null;
  kavenegarSenderNumber: string | null;
};

export default function AdminSettingsPage() {
  const [, setSettings] = useState<Settings | null>(null);
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
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [smsProvider, setSmsProvider] = useState("smsir");
  const [smsApiKey, setSmsApiKey] = useState("");
  const [smsTemplateId, setSmsTemplateId] = useState("");
  const [kavenegarApiKey, setKavenegarApiKey] = useState("");
  const [kavenegarSenderNumber, setKavenegarSenderNumber] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success) {
          const s = data.data;
          setSettings(s);
          setShippingCost(s.shippingCost.toString());
          setFreeShippingThreshold(s.freeShippingThreshold.toString());
          setLowStockThreshold(s.lowStockThreshold.toString());
          setStoreName(s.storeName || "");
          setStorePhone(s.storePhone || "");
          setStorePhone2(s.storePhone2 || "");
          setStoreAddress(s.storeAddress || "");
          setInstagramHandle(s.instagramHandle || "");
          setTelegramHandle(s.telegramHandle || "");
          setWhatsappNumber(s.whatsappNumber || "");
          setWorkingHours(s.workingHours || "");
          setSmsEnabled(s.smsEnabled || false);
          setSmsProvider(s.smsProvider || "smsir");
          setSmsApiKey(s.smsApiKey || "");
          setSmsTemplateId(s.smsTemplateId || "");
          setKavenegarApiKey(s.kavenegarApiKey || "");
          setKavenegarSenderNumber(s.kavenegarSenderNumber || "");
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
    setIsSubmitting(true);
    toast.loading("در حال ذخیره...", { id: "save" });

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingCost,
          freeShippingThreshold,
          lowStockThreshold,
          storeName,
          storePhone,
          storePhone2,
          storeAddress,
          instagramHandle,
          telegramHandle,
          whatsappNumber,
          workingHours,
          smsEnabled,
          smsProvider,
          smsApiKey,
          smsTemplateId,
          kavenegarApiKey,
          kavenegarSenderNumber,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("تنظیمات ذخیره شد ✨", { id: "save" });
        setSettings(data.data);
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
                onChange={(e) => setShippingCost(e.target.value.replace(/\D/g, ""))}
                placeholder="50000"
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                هزینه ثابت ارسال برای هر سفارش
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
                onChange={(e) => setFreeShippingThreshold(e.target.value.replace(/\D/g, ""))}
                placeholder="2000000"
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                خرید بالاتر از این مبلغ، ارسال رایگان
              </p>
            </div>
          </div>
        </section>

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
              onChange={(e) => setLowStockThreshold(e.target.value.replace(/\D/g, ""))}
              placeholder="3"
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              وقتی موجودی محصولی به این عدد یا کمتر برسه، هشدار میدیم
            </p>
          </div>
        </section>

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
                onChange={(e) => setStorePhone(e.target.value.replace(/\D/g, ""))}
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
                onChange={(e) => setStorePhone2(e.target.value.replace(/\D/g, ""))}
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

        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10 flex items-center gap-2">
            <Camera size={18} className="text-blush-500" />
            <span>شبکه‌های اجتماعی</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <Camera size={12} />
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
              <Send size={12} />
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
              <MessageCircle size={12} />
              <span>شماره واتساپ</span>
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="989123456789"
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
            />
            <p className="text-[10px] text-gray-500 mt-1">با کد کشور (مثلاً 989121234567)</p>
          </div>
        </section>

        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10 flex items-center gap-2">
            <MessageCircle size={18} className="text-blue-500" />
            <span>سرویس پیامک</span>
          </h2>

          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={smsEnabled}
                onChange={(e) => setSmsEnabled(e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500 mt-0.5"
              />
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  فعال کردن ارسال پیامک واقعی
                </div>
                <div className="text-[11px] leading-6">
                  {smsEnabled ? (
                    <span className="text-green-600 font-medium">
                      ✅ پیامک‌ها واقعاً ارسال می‌شوند (هزینه از اعتبار حساب کسر می‌شود)
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      در حالت غیرفعال، کد OTP فقط در ترمینال چاپ می‌شود (برای تست)
                    </span>
                  )}
                </div>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              انتخاب سرویس پیامک
            </label>
            <select
              value={smsProvider}
              onChange={(e) => setSmsProvider(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
            >
              <option value="smsir">SMS.ir (پیشنهاد شده)</option>
              <option value="kavenegar">کاوه‌نگار</option>
            </select>
          </div>

          {smsProvider === "smsir" && (
            <>
              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <p className="text-[11px] text-green-700 dark:text-green-400 leading-6">
                  💡 برای دریافت API Key و Template ID، به{" "}
                  <a
                    href="https://app.sms.ir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold"
                  >
                    پنل SMS.ir
                  </a>{" "}
                  مراجعه کنید.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  API Key (SMS.ir)
                </label>
                <input
                  type="text"
                  value={smsApiKey}
                  onChange={(e) => setSmsApiKey(e.target.value)}
                  placeholder="مثلاً: xE...kd"
                  dir="ltr"
                  className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  از پنل SMS.ir → بخش برنامه‌نویسان → API Key
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Template ID (شناسه الگو)
                </label>
                <input
                  type="text"
                  value={smsTemplateId}
                  onChange={(e) => setSmsTemplateId(e.target.value.replace(/\D/g, ""))}
                  placeholder="مثلاً: 123456"
                  dir="ltr"
                  className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  کد الگویی که در پنل SMS.ir ساختید (باید پارامتر code داشته باشد)
                </p>
              </div>
            </>
          )}

          {smsProvider === "kavenegar" && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  API Key کاوه‌نگار
                </label>
                <input
                  type="text"
                  value={kavenegarApiKey}
                  onChange={(e) => setKavenegarApiKey(e.target.value)}
                  placeholder="مثلاً: 4A6B7C8D..."
                  dir="ltr"
                  className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  از پنل کاوه‌نگار → حساب کاربری → API Key
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  شماره فرستنده
                </label>
                <input
                  type="text"
                  value={kavenegarSenderNumber}
                  onChange={(e) => setKavenegarSenderNumber(e.target.value)}
                  placeholder="10004346"
                  dir="ltr"
                  className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  شماره‌ی خط اختصاصی یا اشتراکی کاوه‌نگار
                </p>
              </div>
            </>
          )}
        </section>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
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