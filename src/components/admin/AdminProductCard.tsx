"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Plus,
  Minus,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  AlertTriangle,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import { Product } from "@/types/product";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type Props = {
  product: Product;
  onUpdate: () => void;
};

function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR");
}

export default function AdminProductCard({ product, onUpdate }: Props) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isLowStock = product.stockCount > 0 && product.stockCount <= 3;
  const isOutOfStock = product.stockCount === 0;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const handleStockChange = async (action: "increment" | "decrement") => {
    setIsLoading(action);
    try {
      const res = await fetch(`/api/admin/products/${product.id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (data.success) {
        if (action === "increment") {
          toast.success("موجودی افزایش یافت");
        } else {
          toast.success("موجودی کاهش یافت");
        }
        onUpdate();
      } else {
        toast.error(data.error || "خطا در تغییر موجودی");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(null);
    }
  };

  const handleToggleActive = async () => {
    setIsLoading("toggle");
    try {
      const res = await fetch(`/api/admin/products/${product.id}/toggle`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.data.isActive ? "محصول فعال شد" : "محصول مخفی شد");
        onUpdate();
      } else {
        toast.error(data.error || "خطا در تغییر وضعیت");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(null);
    }
  };
const handleDelete = async () => {
  setIsLoading("delete");
  try {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      if (data.wasSoftDeleted) {
        toast.success("محصول غیرفعال شد (به‌خاطر سفارش‌های قبلی)");
      } else {
        toast.success("محصول حذف شد");
      }
      setShowDeleteDialog(false);
      onUpdate();
    } else {
      toast.error(data.error || "خطا در حذف محصول");
    }
  } catch {
    toast.error("خطا در ارتباط با سرور");
  } finally {
    setIsLoading(null);
  }
};
  return (
    <>
      <div
        className={`bg-white dark:bg-royal-500/5 rounded-2xl border-2 overflow-hidden transition-all ${
          !product.isActive
            ? "border-gray-300 dark:border-gray-700 opacity-60"
            : isOutOfStock
            ? "border-red-500/30"
            : isLowStock
            ? "border-orange-500/30"
            : "border-royal-500/10"
        }`}
      >
        <div className="flex gap-3 p-3">
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-royal-500/5 shrink-0">
            <Image
              src={product.images[0]?.url || "/placeholder.png"}
              alt={product.title}
              fill
              sizes="100px"
              className="object-cover"
            />
            {!product.isActive && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <EyeOff size={20} className="text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-[11px] font-medium text-royal-500">
                {product.brand}
              </span>
              {product.category && (
                <span className="text-[10px] text-gray-500 shrink-0">
                  {product.category.name}
                </span>
              )}
            </div>

            <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">
              {product.title}
            </h3>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-baseline gap-1">
                {hasDiscount && (
                  <span className="text-[10px] text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
                <span className="text-sm font-black text-royal-500">
                  {formatPrice(hasDiscount ? product.discountPrice! : product.price)}
                </span>
                <span className="text-[10px] text-gray-500">تومان</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`px-3 py-2 flex items-center justify-between border-t ${
            isOutOfStock
              ? "border-red-500/20 bg-red-500/5"
              : isLowStock
              ? "border-orange-500/20 bg-orange-500/5"
              : "border-royal-500/10 bg-royal-500/5"
          }`}
        >
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <>
                <AlertTriangle size={14} className="text-red-500" />
                <span className="text-xs font-bold text-red-500">ناموجود</span>
              </>
            ) : isLowStock ? (
              <>
                <AlertTriangle size={14} className="text-orange-500" />
                <span className="text-xs font-bold text-orange-500">
                  فقط {product.stockCount.toLocaleString("fa-IR")} عدد
                </span>
              </>
            ) : (
              <>
                <Package size={14} className="text-green-600" />
                <span className="text-xs font-bold text-green-600">
                  موجودی: {product.stockCount.toLocaleString("fa-IR")}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleStockChange("decrement")}
              disabled={isLoading !== null || product.stockCount === 0}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-black text-red-500 border border-red-500/20 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="کاهش موجودی"
            >
              <Minus size={14} />
            </button>

            <span className="min-w-[32px] text-center text-sm font-black text-gray-900 dark:text-white">
              {product.stockCount.toLocaleString("fa-IR")}
            </span>

            <button
              onClick={() => handleStockChange("increment")}
              disabled={isLoading !== null}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-br from-royal-500 to-blush-500 text-white hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed transition-transform"
              aria-label="افزایش موجودی"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="p-2 grid grid-cols-3 gap-1 border-t border-royal-500/10">
          <button
            onClick={handleToggleActive}
            disabled={isLoading !== null}
            className={`flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-40 ${
              product.isActive
                ? "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
                : "bg-green-500/10 text-green-600 hover:bg-green-500/20"
            }`}
          >
            {product.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{product.isActive ? "مخفی" : "نمایش"}</span>
          </button>

          <Link
            href={`/admin/products/${product.id}/edit`}
            className="flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold bg-royal-500/10 text-royal-500 hover:bg-royal-500/20 transition-colors"
          >
            <Edit size={14} />
            <span>ویرایش</span>
          </Link>

          <button
            onClick={() => setShowDeleteDialog(true)}
            disabled={isLoading !== null}
            className="flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-40"
          >
            <Trash2 size={14} />
            <span>حذف</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="حذف محصول"
        message={`آیا از حذف "${product.title}" اطمینان دارید؟ این عمل قابل بازگشت نیست.`}
        confirmText="بله، حذف کن"
        cancelText="انصراف"
        type="danger"
        isLoading={isLoading === "delete"}
      />
    </>
  );
}