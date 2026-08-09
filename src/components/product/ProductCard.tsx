"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Plus, Minus, Trash2 } from "lucide-react";
import { Product } from "@/types/product";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  product: Product;
  priority?: boolean;
};

function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR");
}

function calculateDiscount(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100);
}

export default function ProductCard({ product, priority = false }: Props) {
  const router = useRouter();

  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const items = useCartStore((state) => state.items);

  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const user = useAuthStore((state) => state.user);

  const cartItem = items.find((item) => item.product.id === product.id);
  const inCart = !!cartItem;
  const currentQty = cartItem?.quantity ?? 0;
  const maxQty = product.stockCount ?? 99;

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? calculateDiscount(product.price, product.discountPrice!)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) return;

    addItem(product, 1);
    toast.success(`${product.title} به سبد خرید اضافه شد`);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentQty >= maxQty) {
      toast.error(`فقط ${maxQty.toLocaleString("fa-IR")} عدد در انبار موجود است`);
      return;
    }

    updateQuantity(product.id, currentQty + 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentQty > 1) {
      updateQuantity(product.id, currentQty - 1);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    removeItem(product.id);
    toast.success(`${product.title} از سبد حذف شد`);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
    <div className="group relative bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 hover:border-royal-500/30 overflow-hidden hover:shadow-2xl hover:shadow-royal-500/10 transition-all duration-500 hover:-translate-y-1 flex flex-col">
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-l from-royal-500 to-blush-500 text-white">
            جدید
          </span>
        )}
        {hasDiscount && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blush-500 text-white">
            ٪{discountPercent.toLocaleString("fa-IR")}
          </span>
        )}
      </div>

      <button
        onClick={handleToggleWishlist}
        className="absolute top-3 left-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm hover:scale-110 transition-all"
        aria-label={isInWishlist ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      >
        <Heart
          size={18}
          className={`transition-all ${
            isInWishlist
              ? "fill-blush-500 text-blush-500 scale-110"
              : "text-gray-500"
          }`}
        />
      </button>

      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-royal-500/5">
          <Image
            src={product.images[0]?.url || "/placeholder.png"}
            alt={`${product.title} - ${product.brand}${product.category ? ` - ${product.category.name}` : ""}`}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="px-4 py-2 rounded-full bg-white text-gray-900 font-bold text-sm">
                ناموجود
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-royal-500 mb-1">
          {product.brand}
        </span>

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[2.5rem] hover:text-royal-500 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-base md:text-lg font-black text-royal-500">
                  {formatPrice(hasDiscount ? product.discountPrice! : product.price)}
                </span>
                <span className="text-[10px] text-gray-500">تومان</span>
              </div>
            </div>

            {!inCart ? (
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-white hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shrink-0 bg-gradient-to-br from-royal-500 to-blush-500"
                aria-label="افزودن به سبد خرید"
              >
                <ShoppingCart size={18} />
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-royal-500/10 rounded-xl p-1">
                <button
                  onClick={handleIncrease}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-royal-500 to-blush-500 text-white hover:scale-110 transition-transform"
                  aria-label="افزایش تعداد"
                >
                  <Plus size={14} />
                </button>

                <span className="min-w-[24px] text-center text-sm font-black text-royal-500">
                  {currentQty.toLocaleString("fa-IR")}
                </span>

                {currentQty > 1 ? (
                  <button
                    onClick={handleDecrease}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-black text-royal-500 border border-royal-500/20 hover:bg-royal-500/10 transition-colors"
                    aria-label="کاهش تعداد"
                  >
                    <Minus size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleRemove}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-black text-red-500 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                    aria-label="حذف از سبد"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}