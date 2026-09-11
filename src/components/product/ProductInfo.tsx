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
import { Product, ProductVariant } from "@/types/product";
import { useCartStore, getCartItemKey } from "@/stores/cartStore";
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
  const hasVariants = !!(product.variants && product.variants.length > 0);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    hasVariants
      ? product.variants!.find((v) => v.inStock && v.stockCount > 0) ||
          product.variants![0]
      : null
  );

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);

  const currentCartKey = selectedVariant
    ? `${product.id}-${selectedVariant.id}`
    : product.id;

  const inCart = items.find(
    (item) => getCartItemKey(item) === currentCartKey
  );

  const user = useAuthStore((state) => state.user);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product.id)
  );
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  // محاسبه قیمت و تخفیف بر اساس تنوع انتخاب شده یا قیمت اصلی
  const currentBasePrice = selectedVariant?.price ?? product.price;
  const currentDiscountPrice =
    selectedVariant?.discountPrice ??
    (selectedVariant?.price ? null : product.discountPrice);

  const hasDiscount =
    currentDiscountPrice !== null &&
    currentDiscountPrice !== undefined &&
    currentDiscountPrice < currentBasePrice;

  const finalUnitPrice = hasDiscount
    ? currentDiscountPrice!
    : currentBasePrice;

  const discountPercent = hasDiscount
    ? calculateDiscount(currentBasePrice, currentDiscountPrice!)
    : 0;

  // وضعیت موجودی بر اساس تنوع انتخاب شده یا محصول اصلی
  const isInStock = selectedVariant
    ? selectedVariant.inStock && selectedVariant.stockCount > 0
    : product.inStock && product.stockCount > 0;

  const currentStock = selectedVariant
    ? selectedVariant.stockCount
    : product.stockCount;

  const maxQuantity = currentStock ?? 99;
  const lowStock = isInStock && currentStock <= 5;

  const increaseQty = () => {
    if (quantity < maxQuantity) setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!isInStock) {
      toast.error("این گزینه در انبار موجود نیست");
      return;
    }

    addItem(product, quantity, selectedVariant);
    setJustAdded(true);

    const variantName = selectedVariant ? ` (${selectedVariant.title})` : "";
    toast.success(
      `${quantity.toLocaleString("fa-IR")} عدد ${product.title}${variantName} به سبد اضافه شد`
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

  const primaryVariantType = product.variants?.[0]?.type;

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
        {isInStock ? (
          <>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-600 dark:text-green-500">
              موجود در انبار
            </span>

            {lowStock && (
              <span className="text-xs text-blush-500 mr-2">
                فقط {currentStock.toLocaleString("fa-IR")} عدد باقی مانده!
              </span>
            )}
          </>
        ) : (
          <>
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-sm font-medium text-red-500">
              {hasVariants ? "این گزینه ناموجود است" : "ناموجود"}
            </span>
          </>
        )}
      </div>

      {/* بخش انتخاب تنوع (رنگ / سایز / حجم / مدل) */}
      {hasVariants && (
        <div className="p-4 rounded-2xl bg-royal-500/5 border border-royal-500/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <span>
                {primaryVariantType === "COLOR"
                  ? "انتخاب رنگ:"
                  : primaryVariantType === "SIZE"
                  ? "انتخاب سایز:"
                  : primaryVariantType === "VOLUME"
                  ? "انتخاب حجم:"
                  : "انتخاب مدل / ویژگی:"}
              </span>
              <span className="text-royal-600 dark:text-royal-400 font-black">
                {selectedVariant?.title}
              </span>
            </span>

            {selectedVariant && selectedVariant.price && (
              <span className="text-[11px] text-gray-500">
                قیمت اختصاصی این گزینه
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {product.variants!.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              const isOutOfStock = !v.inStock || v.stockCount <= 0;

              if (v.type === "COLOR" || v.colorCode) {
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleSelectVariant(v)}
                    disabled={isOutOfStock}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "border-royal-500 bg-white dark:bg-zinc-900 text-royal-600 shadow-md shadow-royal-500/15 ring-2 ring-royal-500/30"
                        : isOutOfStock
                        ? "opacity-40 border-gray-200 dark:border-zinc-800 line-through cursor-not-allowed bg-gray-50 dark:bg-zinc-900"
                        : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-royal-500/40 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {v.colorCode && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs shrink-0"
                        style={{ backgroundColor: v.colorCode }}
                      />
                    )}
                    <span>{v.title}</span>
                    {isOutOfStock && (
                      <span className="text-[10px] text-red-500 mr-0.5">
                        (ناموجود)
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleSelectVariant(v)}
                  disabled={isOutOfStock}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-l from-royal-500 to-blush-500 text-white border-transparent shadow-md shadow-royal-500/25 ring-2 ring-royal-500/30"
                      : isOutOfStock
                      ? "opacity-40 border-gray-200 dark:border-zinc-800 line-through cursor-not-allowed bg-gray-50 dark:bg-zinc-900 text-gray-400"
                      : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 hover:border-royal-500/50"
                  }`}
                >
                  <span>{v.title}</span>
                  {isOutOfStock && (
                    <span className="text-[10px] text-red-400 mr-1">
                      (ناموجود)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* قیمت */}
      <div className="bg-royal-500/5 rounded-2xl p-5 border border-royal-500/10">
        {hasDiscount && (
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(currentBasePrice)} تومان
            </span>

            <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-blush-500 text-white">
              ٪{discountPercent.toLocaleString("fa-IR")} تخفیف
            </span>
          </div>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-black text-royal-500">
            {formatPrice(finalUnitPrice)}
          </span>
          <span className="text-sm text-gray-500">تومان</span>
        </div>
      </div>

      {inCart && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-green-500/10 border border-green-500/20">
          <Check size={18} className="text-green-600" />

          <span className="text-sm font-medium text-green-700 dark:text-green-500">
            {inCart.quantity.toLocaleString("fa-IR")} عدد از این مورد در سبد شماست
          </span>

          <Link
            href="/cart"
            className="mr-auto text-xs font-bold text-royal-500 hover:text-blush-500 transition-colors"
          >
            مشاهده سبد ←
          </Link>
        </div>
      )}

      {isInStock && (
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex items-center bg-royal-500/5 rounded-2xl border border-royal-500/10 p-1">
            <button
              onClick={decreaseQty}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-royal-500 hover:bg-royal-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
              className="w-10 h-10 flex items-center justify-center rounded-xl text-royal-500 hover:bg-royal-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="افزایش تعداد"
            >
              <Plus size={18} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
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
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-royal-500/5 border border-royal-500/10 hover:border-royal-500/30 transition-colors shrink-0 cursor-pointer"
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