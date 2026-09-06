"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import Logo from "@/components/ui/Logo";

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
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Ambient Lights */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-royal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-blush-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-7 md:p-9 shadow-2xl shadow-royal-500/5">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-royal-500 to-blush-500 p-0.5 mb-4 shadow-lg shadow-royal-500/20">
              <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[14px] flex items-center justify-center">
                <Logo size={36} />
              </div>
            </div>
            <h1 className="text-2xl font-black mb-2 text-zinc-900 dark:text-white">
              ورود به{" "}
              <span className="bg-gradient-to-l from-royal-600 via-royal-500 to-blush-500 bg-clip-text text-transparent">
                آراد گالری
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400">
              جهت ورود یا ثبت‌نام، شماره موبایل خود را وارد کنید
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300">
                شماره موبایل
              </label>
              <div className="relative flex items-center">
                <Phone
                  size={18}
                  className="absolute right-4 text-zinc-400 dark:text-zinc-500 pointer-events-none"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                  }
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  maxLength={11}
                  dir="ltr"
                  autoFocus
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 focus:border-royal-500 dark:focus:border-royal-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none text-base text-zinc-900 dark:text-white font-black transition-all text-right placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || phone.length !== 11}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-tr from-royal-600 via-royal-500 to-blush-500 text-white font-black text-sm hover:shadow-lg hover:shadow-royal-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>در حال ارسال کد...</span>
                </>
              ) : (
                <>
                  <span>دریافت کد تایید</span>
                  <ArrowLeft size={18} />
                </>
              )}
            </button>
          </form>

          {/* Terms Note */}
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed flex items-center justify-center gap-1.5 flex-wrap">
              <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
              <span>با ورود به آراد گالری،</span>
              <Link href="#" className="text-royal-500 hover:underline font-bold">
                قوانین و مقررات
              </Link>
              <span>را می‌پذیرید</span>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-royal-600 dark:hover:text-royal-400 transition-colors inline-flex items-center gap-1.5"
          >
            <Sparkles size={14} className="text-royal-500" />
            <span>بازگشت به صفحه اصلی</span>
          </Link>
        </div>
      </div>
    </div>
  );
}