"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Sparkles,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  User,
  Mail,
  MessageCircle,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import toast from "react-hot-toast";

const StoreMap = dynamic(() => import("@/components/ui/StoreMap"), {
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-royal-500/5">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-royal-500/20 border-t-royal-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">در حال بارگذاری نقشه...</p>
      </div>
    </div>
  ),
});

type FormData = {
  name: string;
  phone: string;
  subject: string;
  message: string;
};

const contactCards = [
  {
    icon: Phone,
    title: "تماس تلفنی",
    lines: ["۰۹۳۹ ۵۵۷ ۴۴۷۲", "۰۹۳۹ ۵۵۷ ۴۴۷۳"],
    linkType: "tel" as const,
    linkValue: "09395574472",
  },
  {
    icon: MapPin,
    title: "آدرس فروشگاه",
    lines: [
      "تهران، منطقه ۲۱، بزرگراه لشگری غرب،",
      "شهرک چیتگر شمالی، خیابان جهاد، نبش کوچه صفین",
    ],
    linkType: null,
    linkValue: null,
  },
  {
    icon: Clock,
    title: "ساعات کاری",
    lines: ["شنبه تا پنجشنبه: ۹:۰۰ تا ۲۱:۰۰", "جمعه: تعطیل"],
    linkType: null,
    linkValue: null,
  },
];

const socials = [
  {
    name: "اینستاگرام",
    handle: "@arad-beauty2025",
    href: "https://instagram.com/arad-beauty2025",
    icon: FaInstagram,
    color: "from-pink-500 to-purple-500",
  },
  {
    name: "واتساپ",
    handle: "۰۹۳۹ ۵۵۷ ۴۴۷۲",
    href: "https://wa.me/989395574472",
    icon: MessageCircle,
    color: "from-green-500 to-emerald-500",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("لطفاً نام خود را وارد کنید");
      return false;
    }
    if (formData.phone.length !== 11 || !formData.phone.startsWith("09")) {
      toast.error("شماره تماس معتبر نیست");
      return false;
    }
    if (!formData.subject.trim()) {
      toast.error("موضوع را وارد کنید");
      return false;
    }
    if (formData.message.trim().length < 10) {
      toast.error("پیام باید حداقل ۱۰ حرف باشد");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    toast.loading("در حال ارسال پیام...", { id: "contact" });

    setTimeout(() => {
      toast.success("پیام شما با موفقیت ارسال شد! ✨", { id: "contact" });
      setFormData({ name: "", phone: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-royal-500/10 via-white to-blush-500/10 dark:from-royal-500/20 dark:via-black dark:to-blush-500/20" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-royal-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blush-500/20 rounded-full blur-3xl" />

        <div className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-royal-500/10 text-royal-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>تماس با ما</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black leading-[1.4] pb-2 mb-6">
              <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
                در ارتباط باشیم
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-9">
              سوالی دارید؟ نظری دارید؟ ما اینجا هستیم تا به شما کمک کنیم.
              با ما در تماس باشید، تیم پشتیبانی آراد گالری در سریع‌ترین زمان پاسخگو خواهد بود.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-royal-500/10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {contactCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="group p-6 rounded-3xl bg-white dark:bg-royal-500/5 border border-royal-500/10 hover:border-royal-500/30 hover:-translate-y-1 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royal-500 to-blush-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={26} className="text-white" />
                  </div>

                  <h3 className="text-base font-black text-gray-900 dark:text-white mb-3">
                    {card.title}
                  </h3>

                  <div className="space-y-1">
                    {card.lines.map((line, i) =>
                      card.linkType === "tel" && i < 2 ? (
                        <a
                          key={i}
                          href={`tel:0939557447${i === 0 ? "2" : "3"}`}
                          className="block text-sm text-gray-600 dark:text-gray-400 hover:text-royal-500 transition-colors"
                          dir="ltr"
                        >
                          {line}
                        </a>
                      ) : (
                        <p
                          key={i}
                          className="text-sm text-gray-600 dark:text-gray-400 leading-7"
                        >
                          {line}
                        </p>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-royal-500 to-blush-500 flex items-center justify-center">
                  <MessageSquare size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">
                    فرم تماس
                  </h2>
                  <p className="text-xs text-gray-500">
                    پیام خود را برای ما ارسال کنید
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                    نام و نام خانوادگی <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="نام خود را وارد کنید"
                      className="w-full pr-9 pl-3 py-3 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                    شماره تماس <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleChange("phone", e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="09123456789"
                      maxLength={11}
                      dir="ltr"
                      className="w-full pr-9 pl-3 py-3 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                    موضوع <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      placeholder="مثلاً: پیگیری سفارش، مشاوره خرید"
                      className="w-full pr-9 pl-3 py-3 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                    پیام <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare
                      size={16}
                      className="absolute right-3 top-3 text-gray-400"
                    />
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="پیام خود را اینجا بنویسید..."
                      rows={5}
                      className="w-full pr-9 pl-3 py-3 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  <span>{isSubmitting ? "در حال ارسال..." : "ارسال پیام"}</span>
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-6 md:p-8">
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
                  در شبکه‌های اجتماعی
                </h3>
                <p className="text-xs text-gray-500 mb-5">
                  ما را در شبکه‌های اجتماعی دنبال کنید
                </p>

                <div className="space-y-3">
                  {socials.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-2xl bg-royal-500/5 border border-royal-500/10 hover:border-royal-500/30 hover:-translate-y-0.5 transition-all group"
                      >
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${social.color} flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform`}
                        >
                          <Icon size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {social.name}
                          </div>
                          <div className="text-xs text-gray-500" dir="ltr">
                            {social.handle}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-royal-500 to-blush-500 p-8 text-center">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-16 translate-y-16" />

                <div className="relative">
                  <MapPin size={40} className="text-white/80 mx-auto mb-3" />
                  <h3 className="text-lg font-black text-white mb-2">
                    از فروشگاه فیزیکی ما دیدن کنید
                  </h3>
                  <p className="text-white/90 text-xs md:text-sm leading-7 mb-5">
                    آدرس فروشگاه: تهران، منطقه ۲۱، شهرک چیتگر شمالی، خیابان جهاد، نبش کوچه صفین
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-royal-500 font-bold rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-0.5 text-sm"
                  >
                    <span>مشاهده محصولات</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black mb-3">
                <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
                  موقعیت ما روی نقشه
                </span>
              </h2>
              <p className="text-gray-500 text-sm">
                برای دیدن موقعیت دقیق فروشگاه، از نقشه استفاده کنید
              </p>
            </div>

            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-royal-500/5 border border-royal-500/10 shadow-2xl shadow-royal-500/10">
              <StoreMap />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}