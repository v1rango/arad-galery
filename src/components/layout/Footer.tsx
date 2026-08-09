import Link from "next/link";
import { Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="mt-20 bg-royal-500/5 dark:bg-royal-500/10 border-t border-royal-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo size={40} />
              <span className="text-xl font-black bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
                آراد گالری
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-7">
              مرجع خرید آنلاین لوازم آرایشی و بهداشتی اورجینال با ارسال به سراسر کشور
            </p>
          </div>

          <div>
            <h3 className="font-bold text-royal-500 mb-4">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-royal-500 transition-colors">
                  خانه
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 dark:text-gray-400 hover:text-royal-500 transition-colors">
                  محصولات
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-royal-500 transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-royal-500 transition-colors">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-royal-500 mb-4">راهنمای خرید</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-royal-500 transition-colors">
                  نحوه ثبت سفارش
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-royal-500 transition-colors">
                  روش‌های پرداخت
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-royal-500 transition-colors">
                  ارسال سفارشات
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-royal-500 transition-colors">
                  ضمانت اصالت کالا
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-royal-500 mb-4">ارتباط با ما</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-royal-500 shrink-0 mt-1" />
                <div className="flex flex-col gap-1">
                  <a href="tel:09395574472" className="hover:text-royal-500 transition-colors" dir="ltr">
                    0939 557 4472
                  </a>
                  <a href="tel:09395574473" className="hover:text-royal-500 transition-colors" dir="ltr">
                    0939 557 4473
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-royal-500 shrink-0 mt-1" />
                <span className="leading-7">
                  تهران، منطقه ۲۱، بزرگراه لشگری غرب، شهرک چیتگر شمالی، خیابان جهاد، نبش کوچه صفین
                </span>
              </li>
            </ul>

            <div className="flex gap-2 mt-5">
              <a
                href="https://instagram.com/arad-beauty2025"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-royal-500 to-blush-500 text-white hover:scale-110 transition-transform"
                aria-label="اینستاگرام"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://wa.me/989395574472"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-royal-500 to-blush-500 text-white hover:scale-110 transition-transform"
                aria-label="واتساپ"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-royal-500 to-blush-500 text-white hover:scale-110 transition-transform"
                aria-label="تلگرام"
              >
                <Send size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-royal-500/10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © ۱۴۰۴ آراد گالری. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}