"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // منطق افکت ۳ بعدی تیلت
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5; // حداکثر ۵ درجه چرخش
    const rotateY = ((x - centerX) / centerX) * 5;
    
    setMousePosition({ 
      x: (x / rect.width) * 100, 
      y: (y / rect.height) * 100,
    });
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
  };

  return (
    <div className="group relative" style={{ perspective: "1000px" }}>
      {/* هاله نورانی پشت کارت */}
      <div
        className="absolute -inset-0.5 bg-gradient-to-tr from-royal-500 via-blush-500 to-royal-500 rounded-[1.8rem] opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500"
        style={{
          backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`
        }}
      />

      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative bg-white dark:bg-zinc-900 rounded-[1.6rem] border border-zinc-100 dark:border-zinc-800/80 overflow-hidden luxury-shadow transition-transform duration-300 ease-out flex flex-col justify-between h-full"
      >
        <div className="relative">
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-royal-600 to-royal-400 text-white shadow-md shadow-royal-500/20 tracking-wider backdrop-blur-md">
                جدید
              </span>
            )}
            {hasDiscount && (
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-blush-600 to-rose-500 text-white shadow-md shadow-blush-500/20 backdrop-blur-md">
                ٪{discountPercent.toLocaleString("fa-IR")}
              </span>
            )}
          </div>

          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 left-3 z-20 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border border-white/20 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm"
            aria-label={isInWishlist ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
          >
            <Heart
              size={18}
              className={`transition-colors duration-200 ${
                isInWishlist ? "fill-rose-500 text-rose-500" : "hover:text-rose-500"
              }`}
            />
          </button>

          <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-zinc-50 dark:bg-zinc-950/50">
            <Image
              src={product.images[0]?.url || "/placeholder.png"}
              alt={`${product.title} - ${product.brand}${product.category ? ` - ${product.category.name}` : ""}`}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {!product.inStock && (
              <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                <span className="px-4 py-2 rounded-2xl bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white font-bold text-xs tracking-wider shadow-lg">
                  اتمام موجودی
                </span>
              </div>
            )}
          </Link>
        </div>

        <div className="p-5 flex flex-col flex-1 justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-royal-600 dark:text-royal-400">
              {product.brand}
            </span>

            <Link href={`/products/${product.slug}`} className="block group/title">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 line-clamp-2 leading-relaxed min-h-[2.75rem] group-hover/title:text-royal-600 dark:group-hover/title:text-royal-400 transition-colors">
                {product.title}
              </h3>
            </Link>
          </div>

          <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between gap-2 h-[60px]">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-xs text-zinc-400 line-through font-medium">
                  {formatPrice(product.price)}
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
                  {formatPrice(hasDiscount ? product.discountPrice! : product.price)}
                </span>
                <span className="text-[11px] font-bold text-zinc-400">تومان</span>
              </div>
            </div>

            <div className="relative w-11 h-11">
              <AnimatePresence mode="wait">
                {!inCart ? (
                  <motion.button
                    key="add"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    initial={{ y: 20, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -20, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center rounded-2xl text-white bg-gradient-to-tr from-royal-600 via-royal-500 to-blush-500 hover:shadow-lg hover:shadow-royal-500/40 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100 transition-all duration-200 shrink-0"
                    aria-label="افزودن به سبد خرید"
                  >
                    <ShoppingCart size={19} />
                  </motion.button>
                ) : (
                  <motion.div
                    key="counter"
                    initial={{ y: 20, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -20, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 px-1 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50"
                  >
                    <button
                      onClick={handleIncrease}
                      className="w-7 h-7 flex items-center justify-center rounded-xl bg-royal-600 text-white hover:bg-royal-700 active:scale-90 transition-all"
                      aria-label="افزایش تعداد"
                    >
                      <Plus size={12} />
                    </button>

                    <span className="flex-grow text-center text-xs font-black text-zinc-800 dark:text-zinc-100">
                      {currentQty.toLocaleString("fa-IR")}
                    </span>

                    {currentQty > 1 ? (
                      <button
                        onClick={handleDecrease}
                        className="w-7 h-7 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-90 transition-all"
                        aria-label="کاهش تعداد"
                      >
                        <Minus size={12} />
                      </button>
                    ) : (
                      <button
                        onClick={handleRemove}
                        className="w-7 h-7 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 active:scale-90 transition-all"
                        aria-label="حذف از سبد"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}