"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, PackageSearch, Filter } from "lucide-react";
import { Product } from "@/types/product";
import AdminProductCard from "@/components/admin/AdminProductCard";

type FilterOption = "all" | "active" | "inactive" | "outOfStock" | "lowStock";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("خطا در بارگذاری محصولات:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    switch (filter) {
      case "active":
        result = result.filter((p) => p.isActive);
        break;
      case "inactive":
        result = result.filter((p) => !p.isActive);
        break;
      case "outOfStock":
        result = result.filter((p) => p.stockCount === 0);
        break;
      case "lowStock":
        result = result.filter((p) => p.stockCount > 0 && p.stockCount <= 3);
        break;
    }

    return result;
  }, [products, search, filter]);

  const stats = useMemo(() => {
    return {
      total: products.length,
      active: products.filter((p) => p.isActive).length,
      inactive: products.filter((p) => !p.isActive).length,
      outOfStock: products.filter((p) => p.stockCount === 0).length,
      lowStock: products.filter((p) => p.stockCount > 0 && p.stockCount <= 3).length,
    };
  }, [products]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-1">
            <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
              مدیریت محصولات
            </span>
          </h1>
          <p className="text-sm text-gray-500">
            {stats.total.toLocaleString("fa-IR")} محصول در فروشگاه
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5 text-sm"
        >
          <Plus size={18} />
          <span>محصول جدید</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-4 space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در محصولات..."
            className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-gray-500 ml-1">
            <Filter size={12} />
            <span>فیلتر:</span>
          </div>

          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="همه"
            count={stats.total}
          />
          <FilterButton
            active={filter === "active"}
            onClick={() => setFilter("active")}
            label="فعال"
            count={stats.active}
            color="green"
          />
          <FilterButton
            active={filter === "inactive"}
            onClick={() => setFilter("inactive")}
            label="مخفی"
            count={stats.inactive}
            color="gray"
          />
          <FilterButton
            active={filter === "lowStock"}
            onClick={() => setFilter("lowStock")}
            label="کم‌موجود"
            count={stats.lowStock}
            color="orange"
          />
          <FilterButton
            active={filter === "outOfStock"}
            onClick={() => setFilter("outOfStock")}
            label="ناموجود"
            count={stats.outOfStock}
            color="red"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-4 animate-pulse"
            >
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-xl bg-royal-500/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 bg-royal-500/10 rounded" />
                  <div className="h-4 w-full bg-royal-500/10 rounded" />
                  <div className="h-4 w-3/4 bg-royal-500/10 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <AdminProductCard
              key={product.id}
              product={product}
              onUpdate={loadProducts}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10">
          <div className="w-20 h-20 rounded-full bg-royal-500/10 flex items-center justify-center mb-4">
            <PackageSearch size={40} className="text-royal-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            محصولی یافت نشد
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {search ? "با این کلمه چیزی پیدا نشد" : "هنوز محصولی اضافه نکردید"}
          </p>
          {!search && (
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-500/10 text-royal-500 text-sm font-bold hover:bg-royal-500/20 transition-colors"
            >
              <Plus size={16} />
              <span>افزودن اولین محصول</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  count,
  color = "royal",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color?: "royal" | "green" | "orange" | "red" | "gray";
}) {
  const colors = {
    royal: active
      ? "bg-gradient-to-l from-royal-500 to-blush-500 text-white"
      : "bg-royal-500/10 text-royal-500 hover:bg-royal-500/20",
    green: active
      ? "bg-green-500 text-white"
      : "bg-green-500/10 text-green-600 hover:bg-green-500/20",
    orange: active
      ? "bg-orange-500 text-white"
      : "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
    red: active
      ? "bg-red-500 text-white"
      : "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    gray: active
      ? "bg-gray-700 text-white"
      : "bg-gray-500/10 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${colors[color]}`}
    >
      <span>{label}</span>
      <span className="text-[10px] opacity-80">
        {count.toLocaleString("fa-IR")}
      </span>
    </button>
  );
}