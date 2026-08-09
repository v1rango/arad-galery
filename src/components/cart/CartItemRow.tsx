"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem, useCartStore } from "@/stores/cartStore";
import toast from "react-hot-toast";

type Props = {
  item: CartItem;
};

function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR");
}

export default function CartItemRow({ item }: Props) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const { product, quantity } = item;
  const maxQty = product.stockCount ?? 99;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const unitPrice = hasDiscount ? product.discountPrice! : product.price;
  const totalPrice = unitPrice * quantity;

  const handleIncrease = () => {
    if (quantity >= maxQty) {
      toast.error(`فقط ${maxQty.toLocaleString("fa-IR")} عدد در انبار موجود است`);
      return;
    }
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(product.id);
    toast.success(`${product.title} از سبد حذف شد`);
  };

  return (
    <div className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-4 flex gap-4 hover:border-royal-500/20 transition-colors">
      <Link
        href={`/products/${product.slug}`}
        className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-royal-500/5 shrink-0"
      >
        <Image
        src={product.images[0]?.url || "/placeholder.png"}
          alt={`${product.title} - ${product.brand}`}          
          fill
          sizes="120px"
          className="object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-[11px] font-medium text-royal-500">
            {product.brand}
          </span>

          <button
            onClick={handleRemove}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
            aria-label="حذف از سبد"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="text-sm md:text-base font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-royal-500 transition-colors"
        >
          {product.title}
        </Link>

        <div className="mt-auto pt-3 flex items-end justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-royal-500/10 rounded-xl p-1">
            <button
              onClick={handleIncrease}
              disabled={quantity >= maxQty}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-royal-500 to-blush-500 text-white hover:scale-110 disabled:opacity-40 disabled:hover:scale-100 transition-transform"
              aria-label="افزایش تعداد"
            >
              <Plus size={14} />
            </button>

            <span className="min-w-[28px] text-center text-sm font-black text-royal-500">
              {quantity.toLocaleString("fa-IR")}
            </span>

            <button
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-black text-royal-500 border border-royal-500/20 hover:bg-royal-500/10 disabled:opacity-40 transition-colors"
              aria-label="کاهش تعداد"
            >
              <Minus size={14} />
            </button>
          </div>

          <div className="flex flex-col items-end">
            {hasDiscount && (
              <span className="text-[11px] text-gray-400 line-through">
                {formatPrice(product.price * quantity)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-base md:text-lg font-black text-royal-500">
                {formatPrice(totalPrice)}
              </span>
              <span className="text-[10px] text-gray-500">تومان</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}