"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductGridSkeleton from "@/components/product/ProductGridSkeleton";
import { Product } from "@/types/product";

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("خطا در بارگذاری:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-royal-500/10">
        <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
          <Heart size={20} className="text-blush-500" />
          <span>علاقه‌مندی‌ها</span>
        </h2>
        {!isLoading && products.length > 0 && (
          <span className="text-xs text-gray-500">
            {products.length.toLocaleString("fa-IR")} محصول
          </span>
        )}
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-royal-500/20 to-blush-500/20 flex items-center justify-center mb-4">
            <Heart size={40} className="text-blush-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            علاقه‌مندی خالیه
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md">
            محصولاتی که دوستشون داری با کلیک روی قلب اضافه کن، تا اینجا ذخیره شن.
          </p>
          <Link
            href="/products"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5"
          >
            <ShoppingBag size={18} />
            <span>مشاهده محصولات</span>
          </Link>
        </div>
      )}
    </div>
  );
}