import Link from "next/link";
import { Home, Search, PackageX, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "صفحه پیدا نشد",
  description: "متأسفانه صفحه‌ای که دنبالش هستید یافت نشد.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-royal-500/20 to-blush-500/20 blur-3xl" />
          </div>

          <div className="relative">
            <div className="text-[120px] md:text-[150px] font-black leading-none bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
              404
            </div>
          </div>
        </div>

        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-royal-500 to-blush-500 flex items-center justify-center">
          <PackageX size={40} className="text-white" />
        </div>

        <h1 className="text-2xl md:text-3xl font-black mb-3 text-gray-900 dark:text-white">
          صفحه پیدا نشد!
        </h1>

        <p className="text-gray-600 dark:text-gray-400 leading-8 mb-8">
          متأسفانه صفحه‌ای که دنبالش هستید وجود نداره یا حذف شده.
          <br />
          می‌تونید از لینک‌های زیر ادامه بدید.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5"
          >
            <Home size={18} />
            <span>بازگشت به خانه</span>
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-royal-500/10 text-royal-500 font-bold hover:bg-royal-500/20 transition-colors"
          >
            <Search size={18} />
            <span>مشاهده محصولات</span>
          </Link>
        </div>

        <div className="pt-8 border-t border-royal-500/10">
          <p className="text-sm text-gray-500 mb-4">لینک‌های مفید:</p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <Link
              href="/about"
              className="flex items-center gap-1 text-sm text-royal-500 hover:text-blush-500 transition-colors"
            >
              <span>درباره ما</span>
              <ArrowLeft size={14} />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-1 text-sm text-royal-500 hover:text-blush-500 transition-colors"
            >
              <span>تماس با ما</span>
              <ArrowLeft size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}