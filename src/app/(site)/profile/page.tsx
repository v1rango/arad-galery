"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Save } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    toast.loading("در حال ذخیره...", { id: "save" });

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("اطلاعات با موفقیت ذخیره شد ✨", { id: "save" });
        await fetchUser();
      } else {
        toast.error(data.error || "خطا در ذخیره", { id: "save" });
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: "save" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-6 md:p-8">
      <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6 pb-4 border-b border-royal-500/10">
        اطلاعات کاربری
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
              type="text"
              value={user.phone}
              disabled
              dir="ltr"
              className="w-full pr-10 pl-3 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-royal-500/10 text-sm text-gray-500 cursor-not-allowed text-right"
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            🔒 شماره موبایل قابل تغییر نیست
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
            نام و نام خانوادگی
          </label>
          <div className="relative">
            <User
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: علی محمدی"
              className="w-full pr-10 pl-3 py-3 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
            ایمیل (اختیاری)
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              dir="ltr"
              className="w-full pr-10 pl-3 py-3 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>در حال ذخیره...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>ذخیره تغییرات</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}