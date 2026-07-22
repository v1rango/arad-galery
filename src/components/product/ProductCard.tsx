"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types/product";
import { useState } from "react";

type Props = {
  product: Product;
};

function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR");
}

function calculateDiscount(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100);
}

export default function ProductCard({ product }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? calculateDiscount(product.price, product.discountPrice!)
    : 0;

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
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-3 left-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm hover:scale-110 transition-transform"
        aria-label="افزودن به علاقه‌مندی‌ها"
      >
        <Heart
          size={18}
          className={`transition-colors ${
            isFavorite ? "fill-blush-500 text-blush-500" : "text-gray-500"
          }`}
        />
      </button>

      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-royal-500/5">
          <Image
            src={product.image}
            alt={product.title}
            fill
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

        <div className="flex items-center gap-1 mt-2">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {product.rating.toLocaleString("fa-IR")}
          </span>
          <span className="text-xs text-gray-500">
            ({product.reviewsCount.toLocaleString("fa-IR")} نظر)
          </span>
        </div>

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

            <button
              disabled={!product.inStock}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-royal-500 to-blush-500 text-white hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-transform shrink-0"
              aria-label="افزودن به سبد خرید"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}