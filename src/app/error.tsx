"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-red-500 to-blush-500 flex items-center justify-center">
          <AlertTriangle size={40} className="text-white" />
        </div>

        <h1 className="text-2xl md:text-3xl font-black mb-3 text-gray-900 dark:text-white">
          خطایی رخ داد!
        </h1>

        <p className="text-gray-600 dark:text-gray-400 leading-8 mb-8">
          متأسفانه مشکلی پیش اومد. می‌تونید دوباره تلاش کنید یا به صفحه اصلی برگردید.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5"
          >
            <RefreshCw size={18} />
            <span>تلاش مجدد</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-royal-500/10 text-royal-500 font-bold hover:bg-royal-500/20 transition-colors"
          >
            <Home size={18} />
            <span>بازگشت به خانه</span>
          </Link>
        </div>
      </div>
    </div>
  );
}