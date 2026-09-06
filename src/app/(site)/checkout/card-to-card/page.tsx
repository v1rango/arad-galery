"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  Copy,
  CheckCircle,
  Upload,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR");
}

function formatCardDisplay(card: string): string {
  const raw = card.replace(/\D/g, "");
  if (raw.length !== 16) return card;
  return raw.replace(/(\d{4})(?=\d)/g, "$1 - ");
}

type OrderData = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  paymentStatus: string;
  receiptImageUrl: string | null;
};

function CardToCardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber =
    searchParams.get("orderNumber") || searchParams.get("order");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardHolderName: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!orderNumber) {
      toast.error("شماره سفارش یافت نشد");
      router.replace("/profile/orders");
      return;
    }

    async function loadData() {
      try {
        const [orderRes, settingsRes] = await Promise.all([
          fetch(`/api/orders/by-number/${orderNumber}`),
          fetch("/api/settings"),
        ]);

        const orderData = await orderRes.json();
        const settingsData = await settingsRes.json();

        if (!orderData.success) {
          toast.error(orderData.error || "سفارش یافت نشد");
          router.replace("/profile/orders");
          return;
        }

        setOrder(orderData.data);

        if (settingsData.success) {
          setCardInfo({
            cardNumber: settingsData.data.cardNumber || "",
            cardHolderName: settingsData.data.cardHolderName || "",
          });
        }
      } catch {
        toast.error("خطا در بارگذاری اطلاعات");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [orderNumber, router]);

  const copyCardNumber = () => {
    if (!cardInfo.cardNumber) return;
    navigator.clipboard.writeText(cardInfo.cardNumber.replace(/\s/g, ""));
    toast.success("شماره کارت کپی شد");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("فقط فایل تصویری مجاز است");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile || !order) return;

    setUploading(true);
    toast.loading("در حال ارسال رسید...", { id: "upload" });

    try {
      const formData = new FormData();
      formData.append("receipt", selectedFile);
      formData.append("orderId", order.id);

      const res = await fetch("/api/orders/upload-receipt", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("رسید با موفقیت ارسال شد و در صف تایید قرار گرفت", {
          id: "upload",
        });
        setOrder((prev) =>
          prev
            ? {
                ...prev,
                receiptImageUrl: data.data.receiptImageUrl,
                paymentStatus: data.data.paymentStatus || "AWAITING_RECEIPT",
              }
            : null
        );
        setSelectedFile(null);
        setPreview(null);
      } else {
        toast.error(data.error || "خطا در ارسال رسید", { id: "upload" });
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: "upload" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-royal-500" />
        <p className="mt-4 text-gray-500">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!order) return null;

  const alreadyUploaded = !!order.receiptImageUrl;
  const isPaid = order.paymentStatus === "PAID";
  const isRejected = order.paymentStatus === "FAILED";

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center">
            <CreditCard size={32} />
          </div>
          <h1 className="text-2xl font-black mb-2">
            <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
              پرداخت کارت به کارت
            </span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            سفارش #{order.orderNumber}
          </p>
        </div>

        {isPaid && (
          <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
            <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={22} />
            <div>
              <p className="font-bold text-green-700 dark:text-green-400">
                پرداخت شما با موفقیت تایید شد
              </p>
              <p className="text-sm text-green-600/80 mt-1">
                سفارش شما در حال آماده‌سازی است.
              </p>
              <Link
                href={`/profile/orders/${order.id}`}
                className="inline-block mt-3 text-sm font-bold text-green-700 underline"
              >
                مشاهده سفارش
              </Link>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={22} />
            <div>
              <p className="font-bold text-red-700 dark:text-red-400">
                رسید شما تایید نشد
              </p>
              <p className="text-sm text-red-600/80 mt-1">
                لطفاً با پشتیبانی تماس بگیرید.
              </p>
            </div>
          </div>
        )}

        {!isPaid && !isRejected && !alreadyUploaded && (
          <div className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
            <Upload className="text-blue-600 shrink-0 mt-0.5" size={22} />
            <div>
              <p className="font-bold text-blue-700 dark:text-blue-400">
                در انتظار ارسال رسید توسط شما
              </p>
              <p className="text-sm text-blue-600/80 mt-1">
                لطفاً مبلغ را به کارت بالا واریز کرده و تصویر رسید را ارسال کنید.
              </p>
            </div>
          </div>
        )}

        {!isPaid && !isRejected && alreadyUploaded && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <Loader2
              className="text-amber-600 shrink-0 mt-0.5 animate-spin"
              size={22}
            />
            <div>
              <p className="font-bold text-amber-700 dark:text-amber-400">
                در صف تایید رسید
              </p>
              <p className="text-sm text-amber-600/80 mt-1">
                رسید شما دریافت شد و در حال بررسی است. به محض تایید به شما اطلاع
                داده می‌شود.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-5 mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            مبلغ قابل پرداخت
          </p>
          <p className="text-3xl font-black text-royal-500">
            {formatPrice(order.totalAmount)}
            <span className="text-sm font-bold text-gray-500 mr-1">تومان</span>
          </p>
        </div>

        <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-5 mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            شماره کارت مقصد
          </p>
          <div className="flex items-center justify-between gap-3">
            <p
              className="text-lg sm:text-xl font-black tracking-wider text-gray-900 dark:text-white"
              dir="ltr"
              style={{ textAlign: "left" }}
            >
              {cardInfo.cardNumber
                ? formatCardDisplay(cardInfo.cardNumber)
                : "در حال بارگذاری..."}
            </p>
            <button
              type="button"
              onClick={copyCardNumber}
              disabled={!cardInfo.cardNumber}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-royal-500/10 text-royal-500 text-sm font-bold hover:bg-royal-500/20 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Copy size={16} />
              کپی
            </button>
          </div>
          {cardInfo.cardHolderName && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              به نام:{" "}
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {cardInfo.cardHolderName}
              </span>
            </p>
          )}
        </div>

        {!isPaid && !isRejected && (
          <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-5">
            <h2 className="font-black mb-4 text-gray-900 dark:text-white">
              ارسال رسید پرداخت
            </h2>

            {preview ? (
              <div className="mb-4">
                <img
                  src={preview}
                  alt="پیش‌نمایش رسید"
                  className="w-full max-h-64 object-contain rounded-2xl border border-royal-500/10"
                />
              </div>
            ) : alreadyUploaded && order.receiptImageUrl ? (
              <div className="mb-4">
                <img
                  src={order.receiptImageUrl}
                  alt="رسید ارسال‌شده"
                  className="w-full max-h-64 object-contain rounded-2xl border border-royal-500/10"
                />
              </div>
            ) : null}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-royal-500/30 text-royal-500 font-bold hover:bg-royal-500/5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <ImageIcon size={20} />
                {preview || alreadyUploaded
                  ? "تغییر تصویر"
                  : "انتخاب تصویر رسید"}
              </button>

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
                >
                  {uploading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Upload size={20} />
                  )}
                  {uploading ? "در حال ارسال..." : "ارسال رسید"}
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-6">
              بعد از واریز، تصویر رسید را آپلود کنید. رسید شما بررسی و در صورت
              تایید، سفارش فعال می‌شود.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/profile/orders"
            className="text-sm text-royal-500 font-bold hover:underline"
          >
            مشاهده سفارش‌های من
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CardToCardPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-royal-500" />
          <p className="mt-4 text-gray-500">در حال بارگذاری...</p>
        </div>
      }
    >
      <CardToCardContent />
    </Suspense>
  );
}