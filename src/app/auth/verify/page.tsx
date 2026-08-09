"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/authStore";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [code, setCode] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phone || phone.length !== 11) {
      router.replace("/auth/login");
    }
  }, [phone, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((d) => d !== "") && newCode.join("").length === 4) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      const newCode = pasted.split("");
      setCode(newCode);
      handleVerify(pasted);
    }
  };

  const handleVerify = async (fullCode: string) => {
    setIsLoading(true);
    toast.loading("در حال تایید...", { id: "verify" });

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: fullCode }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("با موفقیت وارد شدید! ✨", { id: "verify" });
        await fetchUser();
        const redirect = searchParams.get("redirect");
        if (redirect) {
          sessionStorage.setItem("fromLogin", "true");
        }
        router.push(redirect || "/");
      } else {
        toast.error(data.error || "کد نامعتبر است", { id: "verify" });
        setCode(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: "verify" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    toast.loading("در حال ارسال مجدد...", { id: "resend" });

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("کد مجدد ارسال شد", { id: "resend" });
        setCountdown(30);
        setCode(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(data.error || "خطا در ارسال", { id: "resend" });
        if (data.secondsLeft) {
          setCountdown(data.secondsLeft);
        }
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: "resend" });
    } finally {
      setIsResending(false);
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
                کد تایید
              </span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-7">
              کد ۴ رقمی ارسال شده به شماره
            </p>
            <p className="text-base font-bold text-royal-500 mt-1" dir="ltr">
              {phone}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-6" dir="ltr">
            {code.map((digit, index) => (
              <div
                key={index}
                className="relative w-14 h-14 md:w-16 md:h-16"
              >
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  maxLength={1}
                  disabled={isLoading}
                  dir="ltr"
                  className="absolute inset-0 w-full h-full text-center text-2xl font-black rounded-2xl bg-royal-500/5 border-2 border-royal-500/10 focus:border-royal-500 focus:outline-none text-transparent caret-royal-500 transition-colors disabled:opacity-60 z-10"
                />
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-gray-900 dark:text-white pointer-events-none">
                  {digit}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">
                ارسال مجدد کد تا{" "}
                <span className="font-bold text-royal-500">
                  {countdown.toLocaleString("fa-IR")}
                </span>{" "}
                ثانیه
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="inline-flex items-center gap-2 text-sm font-bold text-royal-500 hover:text-blush-500 transition-colors disabled:opacity-60"
              >
                <RefreshCw size={14} className={isResending ? "animate-spin" : ""} />
                <span>{isResending ? "در حال ارسال..." : "ارسال مجدد کد"}</span>
              </button>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-royal-500/10 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-royal-500 transition-colors"
            >
              <ArrowRight size={14} />
              <span>تغییر شماره</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">در حال بارگذاری...</div>}>
      <VerifyContent />
    </Suspense>
  );
}