"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import { mockProducts } from "@/lib/mockProducts";
import { categories } from "@/lib/categories";
import { PackageSearch } from "lucide-react";

type SortOption = "newest" | "cheapest" | "expensive" | "bestselling";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const subSlug = searchParams.get("sub");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const currentCategory = categories.find((c) => c.slug === categorySlug);
  const currentSub = currentCategory?.subcategories?.find(
    (s) => s.slug === subSlug
  );

  const pageTitle = currentSub
    ? currentSub.name
    : currentCategory
    ? currentCategory.name
    : "همه محصولات";

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    if (currentSub) {
      result = result.filter((p) => p.category === currentSub.name);
    } else if (currentCategory) {
      const subNames = currentCategory.subcategories?.map((s) => s.name) || [];
      if (subNames.length > 0) {
        result = result.filter((p) => subNames.includes(p.category));
      }
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "cheapest":
        result.sort(
          (a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price)
        );
        break;
      case "expensive":
        result.sort(
          (a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price)
        );
        break;
      case "bestselling":
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      case "newest":
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [search, sort, currentCategory, currentSub]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span>محصولات</span>
          {currentCategory && (
            <>
              <span>/</span>
              <span className="text-royal-500">{currentCategory.name}</span>
            </>
          )}
          {currentSub && (
            <>
              <span>/</span>
              <span className="text-blush-500">{currentSub.name}</span>
            </>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-black">
          <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
            {pageTitle}
          </span>
        </h1>
      </div>

      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        totalCount={filteredProducts.length}
      />

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-royal-500/10 flex items-center justify-center mb-4">
            <PackageSearch size={40} className="text-royal-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            محصولی یافت نشد
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            لطفاً کلمه دیگری جستجو کنید یا دسته‌بندی را تغییر دهید
          </p>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8">در حال بارگذاری...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}