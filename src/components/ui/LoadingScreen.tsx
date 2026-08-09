"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Sparkles, Loader2 } from "lucide-react";

const WAITING_MESSAGE = "لطفاً منتظر بمانید";
const WARNING_THRESHOLD = 15000;

export default function LoadingScreen() {
  const [showWarning, setShowWarning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const warningTimer = setTimeout(() => {
      setShowWarning(true);
    }, WARNING_THRESHOLD);

    const elapsedTimer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(warningTimer);
      clearInterval(elapsedTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-black/95 backdrop-blur-sm">
      <div className="max-w-md w-full px-6 text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-royal-500/20 to-blush-500/20 blur-2xl animate-pulse-glow" />

          <div className="absolute inset-0 rounded-full border-4 border-royal-500/10" />

          <div className="absolute inset-0 rounded-full border-4 border-t-royal-500 border-r-blush-500 border-b-transparent border-l-transparent animate-spin-slow" />

          <div className="absolute inset-3 rounded-full border-4 border-b-royal-500 border-l-blush-500 border-t-transparent border-r-transparent animate-spin-reverse" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-500 to-blush-500 flex items-center justify-center animate-pulse-scale shadow-2xl shadow-royal-500/50">
              <Sparkles size={28} className="text-white animate-icon-spin" />
            </div>
          </div>
        </div>

        <div className="mb-6 min-h-[60px] flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
            <Loader2
              size={20}
              className="text-royal-500 animate-spin"
            />
            <span>{WAITING_MESSAGE}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-royal-500 to-blush-500 animate-bounce-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {showWarning && (
          <div className="animate-fade-in-up mt-6 p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/20">
            <div className="flex items-start gap-3 text-right">
              <AlertTriangle
                size={20}
                className="text-red-500 shrink-0 mt-0.5"
              />
              <div className="flex-1">
                <h3 className="text-sm font-black text-red-500 mb-1">
                  زمان بارگذاری طولانی شد
                </h3>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-6">
                  لطفاً اتصال اینترنت خود را بررسی کنید و صفحه را دوباره بارگذاری کنید.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  🔄 تلاش مجدد
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-[10px] text-gray-400" dir="ltr">
          {elapsedTime}s
        </div>
      </div>
    </div>
  );
}