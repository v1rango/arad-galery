import Link from "next/link";
import { Phone, MapPin, Send, MessageCircle, ArrowUpLeft, ShieldCheck, Truck, Clock, Sparkles } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  const currentYear = new Date().toLocaleDateString("fa-IR", { year: "numeric" });

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-royal-500" />,
      title: "ضمانت اصالت ۱۰۰٪",
      desc: "تضمین اورجینال بودن کلیه محصولات",
    },
    {
      icon: <Truck className="w-6 h-6 text-blush-500" />,
      title: "ارسال سریع به سراسر کشور",
      desc: "تحویل فوری در ایمن‌ترین بسته‌بندی",
    },
    {
      icon: <Clock className="w-6 h-6 text-royal-500" />,
      title: "پشتیبانی تخصصی",
      desc: "پاسخگویی و مشاوره در تمام روزها",
    },
  ];

  const quickLinks = [
    { href: "/", label: "صفحه اصلی" },
    { href: "/products", label: "فروشگاه و محصولات" },
    { href: "/about", label: "درباره آراد گالری" },
    { href: "/contact", label: "ارتباط با ما" },
  ];

  const helpLinks = [
    { href: "#", label: "نحوه ثبت سفارش" },
    { href: "#", label: "روش‌های پرداخت" },
    { href: "#", label: "شیوه و هزینه ارسال" },
    { href: "#", label: "شرایط بازگشت کالا" },
  ];

  return (
    <footer className="relative mt-20 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-b from-zinc-50/50 via-white to-royal-50/20 dark:from-zinc-950 dark:via-zinc-950 dark:to-royal-950/20 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-royal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blush-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-8 pb-12 border-b border-zinc-200/60 dark:border-zinc-800/60">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700/50 flex items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-black text-zinc-900 dark:text-white text-sm sm:text-base leading-tight">
                  {feature.title}
                </h4>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-12 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-12 h-12 shrink-0 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-royal-500 to-blush-500 transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                  <Logo size={40} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-l from-royal-600 via-royal-500 to-blush-500 bg-clip-text text-transparent">
                  آراد گالری
                </span>
                <span className="text-[10px] font-semibold text-zinc-400 tracking-wider">
                  ARAD BEAUTY GALLERY
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              مرجع تخصصی نقد، بررسی و فروش آنلاین برترین برندهای آرایشی و مراقبت از پوست اورجینال. تضمین اصالت و کیفیت، شایسته زیبایی شماست.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/arad-beauty2025"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:border-transparent transition-all duration-300 shadow-sm hover:scale-110"
                aria-label="اینستاگرام"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://wa.me/989395574472"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300 shadow-sm hover:scale-110"
                aria-label="واتساپ"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-white hover:bg-sky-500 hover:border-sky-500 transition-all duration-300 shadow-sm hover:scale-110"
                aria-label="تلگرام"
              >
                <Send size={20} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 col-span-1 space-y-4">
            <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-royal-500" />
              دسترسی سریع
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-royal-600 dark:hover:text-royal-400 transition-colors inline-flex items-center gap-1 group font-medium"
                  >
                    <ArrowUpLeft className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-royal-500" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 col-span-1 space-y-4">
            <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blush-500" />
              راهنمای مشتریان
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              {helpLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-blush-600 dark:hover:text-blush-400 transition-colors inline-flex items-center gap-1 group font-medium"
                  >
                    <ArrowUpLeft className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-blush-500" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">
              اطلاعات تماس و نمادها
            </h3>
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-royal-500 shrink-0 mt-0.5" />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="text-[11px] text-zinc-400 font-bold">شماره‌های پشتیبانی:</div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-zinc-800 dark:text-zinc-200 font-black" dir="ltr">
                    <a href="tel:09395574472" className="hover:text-royal-500 transition-colors">
                      0939 557 4472
                    </a>
                    <span>-</span>
                    <a href="tel:09395574473" className="hover:text-royal-500 transition-colors">
                      0939 557 4473
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-blush-500 shrink-0 mt-0.5" />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="text-[11px] text-zinc-400 font-bold">نشانی دفتر مرکزی:</div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                    تهران، منطقه ۲۱، بزرگراه لشگری غرب، شهرک چیتگر شمالی، خیابان جهاد، نبش کوچه صفین
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-20 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 p-2 flex items-center justify-center hover:border-royal-500/50 transition-colors cursor-pointer">
                  <span className="text-xs font-bold text-zinc-400">نماد اینماد</span>
                </div>
                <div className="flex-1 h-20 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 p-2 flex items-center justify-center hover:border-blush-500/50 transition-colors cursor-pointer">
                  <span className="text-xs font-bold text-zinc-400">ساماندهی</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <p>
            © {currentYear} آراد گالری. تمامی حقوق مادی و معنوی محفوظ است.
          </p>
          <p className="flex items-center gap-1.5">
            طراحی شده با عشق برای زیبایی شما
          </p>
        </div>
      </div>
    </footer>
  );
}