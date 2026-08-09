"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.length !== 11 || !phone.startsWith("09")) {
      toast.error("شماره موبایل معتبر نیست");
      return;
    }

    setIsLoading(true);
    toast.loading("در حال ارسال کد...", { id: "otp" });

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("کد تایید ارسال شد", { id: "otp" });
        router.push(`/auth/verify?phone=${phone}`);
      } else {
        toast.error(data.error || "خطا در ارسال کد", { id: "otp" });
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: "otp" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-6 md:p-8 shadow-2xl shadow-royal-500/5">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-500 to-blush-500 mb-4">
              <Sparkles size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-black mb-2">
              <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
                ورود به آراد گالری
              </span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              شماره موبایل خود را وارد کنید
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                شماره موبایل
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                  }
                  placeholder="09123456789"
                  maxLength={11}
                  dir="ltr"
                  autoFocus
                  className="w-full pr-10 pl-4 py-3.5 rounded-2xl bg-royal-500/5 border-2 border-royal-500/10 focus:border-royal-500 focus:outline-none text-base text-gray-900 dark:text-white transition-colors text-right font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || phone.length !== 11}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>در حال ارسال...</span>
                </>
              ) : (
                <>
                  <span>دریافت کد تایید</span>
                  <ArrowLeft size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-royal-500/10 text-center">
            <p className="text-xs text-gray-500 leading-6">
              با ورود به آراد گالری،{" "}
              <Link href="#" className="text-royal-500 hover:underline">
                قوانین و مقررات
              </Link>{" "}
              را می‌پذیرید
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-royal-500 transition-colors"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}