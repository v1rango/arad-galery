import Link from "next/link";
import { Sparkles, Heart, ShieldCheck, Users, Award, Package, ArrowLeft, Star, Target, Zap } from "lucide-react";

export const metadata = {
  title: "درباره آراد گالری - فروشگاه آنلاین لوازم آرایشی اورجینال",
  description:
    "آشنایی با آراد گالری، مرجع خرید آنلاین لوازم آرایشی و بهداشتی اورجینال از برندهای معتبر جهانی. با تجربه چندین ساله در فروش کالاهای اصل با قیمت مناسب و ارسال سریع به سراسر ایران.",
  keywords: [
    "درباره آراد گالری",
    "فروشگاه لوازم آرایشی",
    "خرید لوازم آرایشی اورجینال",
    "لوازم بهداشتی",
    "برندهای معتبر",
    "چیتگر شمالی",
    "تهران",
  ],
  openGraph: {
    title: "درباره ما | آراد گالری",
    description: "با آراد گالری، مرجع خرید آنلاین لوازم آرایشی اورجینال آشنا شوید",
    type: "website",
  },
};

const stats = [
  { icon: Package, value: "+400", label: "محصول متنوع" },
  { icon: Users, value: "+500", label: "مشتری راضی" },
  { icon: Award, value: "+13", label: "برند معتبر" },
  { icon: Star, value: "4.3", label: "امتیاز کاربران" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "اصالت کالا",
    description: "تمامی محصولات ما اورجینال و دارای ضمانت اصالت هستند. با خیال راحت خرید کنید.",
  },
  {
    icon: Heart,
    title: "رضایت مشتری",
    description: "رضایت شما اولویت ماست. تیم پشتیبانی ما همیشه در کنار شماست.",
  },
  {
    icon: Zap,
    title: "ارسال سریع",
    description: "سفارش شما در کمترین زمان ممکن و با بسته‌بندی مطمئن به دستتان می‌رسد.",
  },
  {
    icon: Target,
    title: "قیمت منصفانه",
    description: "بهترین قیمت‌ها با تخفیف‌های ویژه برای مشتریان همیشگی.",
  },
];

export default function AboutPage() {
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
              <span>درباره ما</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black leading-[1.4] pb-2 mb-6">
              <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
                آراد گالری
              </span>
              <span className="text-gray-900 dark:text-white">، همراه زیبایی شما</span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-9">
              ما در آراد گالری، با انتخاب دقیق و ارائه بهترین محصولات آرایشی و بهداشتی از معتبرترین برندهای جهان، تلاش می‌کنیم تجربه‌ای متفاوت از خرید آنلاین برای شما رقم بزنیم.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-royal-500/10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-3xl bg-white dark:bg-royal-500/5 border border-royal-500/10 hover:border-royal-500/30 hover:-translate-y-1 transition-all"
                >
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-royal-500 to-blush-500 flex items-center justify-center">
                    <Icon size={26} className="text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-royal-500 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black mb-3">
                <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
                  درباره ما
                </span>
              </h2>
            </div>

            <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-6 md:p-10 space-y-5 text-gray-700 dark:text-gray-300 leading-9 text-sm md:text-base">
              <p>
                <strong className="text-royal-500">آراد گالری</strong> با هدف ارائه بهترین و اصیل‌ترین لوازم آرایشی و بهداشتی به مشتریان عزیز ایرانی، فعالیت خود را آغاز کرد. ما باور داریم زیبایی حق هر انسانی است و هر کس شایسته بهترین‌هاست.
              </p>

              <p>
                فروشگاه فیزیکی ما در تهران، منطقه ۲۱، شهرک چیتگر شمالی واقع شده و آماده پذیرایی از شما عزیزان است. همچنین با راه‌اندازی فروشگاه آنلاین، این امکان را فراهم کرده‌ایم تا از هر نقطه ایران، محصولات مورد نظر خود را با چند کلیک ساده تهیه کنید.
              </p>
              <p className="text-royal-500 font-bold">
                ما همچنان در حال رشد و پیشرفت هستیم و امیدواریم بتوانیم همراه همیشگی شما در مسیر زیبایی باشیم. ✨
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black mb-3">
              <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
                چرا آراد گالری؟
              </span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              ارزش‌هایی که ما رو متفاوت می‌کنه
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group p-6 md:p-8 rounded-3xl bg-white dark:bg-royal-500/5 border border-royal-500/10 hover:border-royal-500/30 transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royal-500 to-blush-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Icon size={26} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
                        {value.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-8">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-royal-500 to-blush-500 p-8 md:p-12 text-center">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-20 translate-y-20" />

              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-relaxed">
                  آماده‌اید تجربه‌ای متفاوت داشته باشید؟
                </h2>
                <p className="text-white/90 text-sm md:text-base mb-8 leading-8 max-w-2xl mx-auto">
                  همین حالا وارد فروشگاه شوید و از میان صدها محصول اورجینال، بهترین‌ها را برای خودتان انتخاب کنید
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-royal-500 font-bold rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <span>مشاهده محصولات</span>
                  <ArrowLeft size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}