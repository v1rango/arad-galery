"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Trash2, Package } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function DangerZonePage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/products/delete-all", {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message, { duration: 5000 });
        setShowConfirm(false);
      } else {
        toast.error(data.error || "خطا در حذف");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-1 flex items-center gap-2">
            <AlertTriangle size={28} className="text-red-500" />
            <span className="text-red-500">منطقه خطر</span>
          </h1>
          <p className="text-sm text-gray-500">
            عملیات حساس که نمی‌شه undo کرد
          </p>
        </div>

        <Link
          href="/admin/settings"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-500/10 text-royal-500 text-sm font-bold hover:bg-royal-500/20 transition-colors"
        >
          <ArrowRight size={18} />
          <span className="hidden sm:inline">بازگشت به تنظیمات</span>
        </Link>
      </div>

      <div className="bg-red-500/5 border-2 border-red-500/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center shrink-0">
            <Package size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">
              پاک کردن همه محصولات
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-7 mb-4">
              این گزینه <strong>همه محصولات</strong> فروشگاه رو پاک می‌کنه.
              معمولاً برای اولین بار استفاده می‌شه که محصولات تستی رو پاک کنی
              و محصولات واقعی رو اضافه کنی.
            </p>

            <div className="bg-white dark:bg-black/40 rounded-xl p-4 mb-4 border border-red-500/20">
              <div className="text-xs font-bold text-gray-900 dark:text-white mb-2">
                📌 نکات مهم:
              </div>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 leading-6">
                <li>✓ محصولاتی که <strong>سفارش نداشتن</strong> → کاملاً حذف میشن</li>
                <li>✓ محصولاتی که <strong>سفارش داشتن</strong> → غیرفعال میشن (برای تاریخچه)</li>
                <li>✓ دسته‌بندی‌ها دست نمی‌خورن</li>
                <li>✓ کاربران و سفارش‌ها دست نمی‌خورن</li>
                <li>⚠️ این عمل <strong>قابل بازگشت نیست</strong></li>
              </ul>
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
            >
              <Trash2 size={18} />
              <span>پاک کردن همه محصولات</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-6">
          💡 <strong>راهنما:</strong> بعد از پاک کردن، برو{" "}
          <Link
            href="/admin/products/new"
            className="font-bold underline"
          >
            افزودن محصول جدید
          </Link>{" "}
          و محصولات واقعی رو اضافه کن.
        </p>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDeleteAll}
        title="پاک کردن همه محصولات"
        message="آیا مطمئنی می‌خوای همه محصولات فروشگاه رو پاک کنی؟ این عمل قابل بازگشت نیست."
        confirmText="بله، همه رو پاک کن"
        cancelText="انصراف"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}