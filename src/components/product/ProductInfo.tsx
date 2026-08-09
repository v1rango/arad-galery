"use client";

import { useState } from "react";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  CreditCard,
  Check,
} from "lucide-react";
import { Product } from "@/types/product";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

type Props = {
  product: Product;
};

function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR");
}

function calculateDiscount(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100);
}

export default function ProductInfo({ product }: Props) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const inCart = items.find((item) => item.product.id === product.id);

  const user = useAuthStore((state) => state.user);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  const hasDiscount =
    product.discountPrice !== null &&
    product.discountPrice !== undefined &&
    product.discountPrice < product.price;

  const discountPercent = hasDiscount
    ? calculateDiscount(product.price, product.discountPrice!)
    : 0;

  const maxQuantity = product.stockCount ?? 99;
  const lowStock =
    product.inStock && product.stockCount && product.stockCount <= 5;

  const increaseQty = () => {
    if (quantity < maxQuantity) setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;

    addItem(product, quantity);
    setJustAdded(true);

    toast.success(
      `${quantity.toLocaleString("fa-IR")} عدد ${product.title} به سبد اضافه شد`
    );

    setTimeout(() => setJustAdded(false), 2500);
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("برای افزودن به علاقه‌مندی‌ها باید وارد شوید");
      router.push("/auth/login");
      return;
    }

    const result = await toggleWishlist(product.id);

    if (result.success) {
      if (result.action === "added") {
        toast.success("به علاقه‌مندی‌ها اضافه شد 💝");
      } else {
        toast.success("از علاقه‌مندی‌ها حذف شد");
      }
    } else {
      toast.error(result.error || "خطا در انجام عملیات");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-royal-500/10 text-royal-500">
          {product.brand}
        </span>

        {product.category && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blush-500/10 text-blush-500">
            {product.category.name}
          </span>
        )}

        {product.isNew && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-l from-royal-500 to-blush-500 text-white">
            جدید
          </span>
        )}
      </div>

      <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-relaxed">
        {product.title}
      </h1>

      <div className="flex items-center gap-2 pb-4 border-b border-royal-500/10">
        {product.inStock ? (
          <>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-600 dark:text-green-500">
              موجود در انبار
            </span>

            {lowStock && (
              <span className="text-xs text-blush-500 mr-2">
                فقط {product.stockCount.toLocaleString("fa-IR")} عدد باقی مانده!
              </span>
            )}
          </>
        ) : (
          <>
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-sm font-medium text-red-500">ناموجود</span>
          </>
        )}
      </div>

      <div className="bg-royal-500/5 rounded-2xl p-5 border border-royal-500/10">
        {hasDiscount && (
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)} تومان
            </span>

            <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-blush-500 text-white">
              ٪{discountPercent.toLocaleString("fa-IR")} تخفیف
            </span>
          </div>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-black text-royal-500">
            {formatPrice(hasDiscount ? product.discountPrice! : product.price)}
          </span>
          <span className="text-sm text-gray-500">تومان</span>
        </div>
      </div>

      {inCart && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-green-500/10 border border-green-500/20">
          <Check size={18} className="text-green-600" />

          <span className="text-sm font-medium text-green-700 dark:text-green-500">
            {inCart.quantity.toLocaleString("fa-IR")} عدد از این محصول در سبد شماست
          </span>

          <Link
            href="/cart"
            className="mr-auto text-xs font-bold text-royal-500 hover:text-blush-500 transition-colors"
          >
            مشاهده سبد ←
          </Link>
        </div>
      )}

      {product.inStock && (
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex items-center bg-royal-500/5 rounded-2xl border border-royal-500/10 p-1">
            <button
              onClick={decreaseQty}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-royal-500 hover:bg-royal-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="کاهش تعداد"
            >
              <Minus size={18} />
            </button>

            <span className="w-12 text-center font-bold text-gray-900 dark:text-white">
              {quantity.toLocaleString("fa-IR")}
            </span>

            <button
              onClick={increaseQty}
              disabled={quantity >= maxQuantity}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-royal-500 hover:bg-royal-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="افزایش تعداد"
            >
              <Plus size={18} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all duration-300 hover:-translate-y-0.5 ${
              justAdded
                ? "bg-green-500"
                : "bg-gradient-to-l from-royal-500 to-blush-500"
            }`}
          >
            {justAdded ? (
              <>
                <Check size={20} />
                <span>اضافه شد ✓</span>
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                <span>افزودن به سبد خرید</span>
              </>
            )}
          </button>

          <button
            onClick={handleToggleWishlist}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-royal-500/5 border border-royal-500/10 hover:border-royal-500/30 transition-colors shrink-0"
            aria-label={
              isInWishlist ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
            }
          >
            <Heart
              size={20}
              className={`transition-all ${
                isInWishlist
                  ? "fill-blush-500 text-blush-500 scale-110"
                  : "text-gray-500"
              }`}
            />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-royal-500/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-royal-500/5">
          <div className="w-10 h-10 rounded-xl bg-royal-500/10 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-royal-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900 dark:text-white">
              ضمانت اصالت
            </div>
            <div className="text-[11px] text-gray-500">کالای اورجینال</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-royal-500/5">
          <div className="w-10 h-10 rounded-xl bg-royal-500/10 flex items-center justify-center shrink-0">
            <Truck size={20} className="text-royal-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900 dark:text-white">
              ارسال سریع
            </div>
            <div className="text-[11px] text-gray-500">به سراسر ایران</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-royal-500/5">
          <div className="w-10 h-10 rounded-xl bg-royal-500/10 flex items-center justify-center shrink-0">
            <CreditCard size={20} className="text-royal-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900 dark:text-white">
              پرداخت امن
            </div>
            <div className="text-[11px] text-gray-500">درگاه زرین‌پال</div>
          </div>
        </div>
      </div>
    </div>
  );
}