"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import ProductGridSkeleton from "@/components/product/ProductGridSkeleton";
import { PackageSearch, Plus, Check } from "lucide-react";
import { Product, CategoryWithChildren } from "@/types/product";
import { fetchProducts, fetchCategories, PaginationInfo } from "@/lib/api";

type SortOption = "newest" | "cheapest" | "expensive" | "bestselling";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const subSlug = searchParams.get("sub");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      const [productsRes, categoriesData] = await Promise.all([
        fetchProducts(1),
        fetchCategories(),
      ]);
      setProducts(productsRes.products);
      setPagination(productsRes.pagination);
      setCategories(categoriesData);
      setIsLoading(false);
    }
    loadInitialData();
  }, []);

  const handleLoadMore = async () => {
    if (!pagination || !pagination.hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    const nextPage = pagination.page + 1;
    const res = await fetchProducts(nextPage);

    setProducts((prev) => [...prev, ...res.products]);
    setPagination(res.pagination);
    setIsLoadingMore(false);
  };

  const currentCategory = categories.find((c) => c.slug === categorySlug);
  const currentSub = currentCategory?.children?.find((s) => s.slug === subSlug);

  const pageTitle = currentSub
    ? currentSub.name
    : currentCategory
    ? currentCategory.name
    : "همه محصولات";

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (currentSub) {
      result = result.filter((p) => p.categoryId === currentSub.id);
    } else if (currentCategory) {
      const childrenIds = currentCategory.children?.map((s) => s.id) || [];
      if (childrenIds.length > 0) {
        result = result.filter((p) => childrenIds.includes(p.categoryId));
      }
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
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
        result.sort((a, b) => b.stockCount - a.stockCount);
        break;
      case "newest":
      default:
        result.sort((a, b) => {
          const aDate = new Date(a.createdAt).getTime();
          const bDate = new Date(b.createdAt).getTime();
          return bDate - aDate;
        });
        break;
    }

    return result;
  }, [search, sort, currentCategory, currentSub, products]);

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

        {!isLoading && (
          <p className="text-sm text-gray-500 mt-2">
            {currentSub
              ? `مجموعه‌ی کامل ${currentSub.name} از برندهای معتبر جهانی`
              : currentCategory
              ? `مشاهده و خرید محصولات ${currentCategory.name} با ضمانت اصالت کالا`
              : "مشاهده تمام محصولات آراد گالری - لوازم آرایشی و بهداشتی اورجینال"}
          </p>
        )}
      </div>

      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        totalCount={filteredProducts.length}
      />

      {isLoading ? (
        <ProductGridSkeleton count={12} />
      ) : filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {pagination && (
            <div className="mt-10 flex flex-col items-center gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                نمایش{" "}
                <span className="font-bold text-royal-500">
                  {products.length.toLocaleString("fa-IR")}
                </span>{" "}
                از{" "}
                <span className="font-bold text-royal-500">
                  {pagination.total.toLocaleString("fa-IR")}
                </span>{" "}
                محصول
              </p>

              {pagination.hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>در حال بارگذاری...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      <span>نمایش محصولات بیشتر</span>
                    </>
                  )}
                </button>
              ) : (
                products.length > 0 && (
                  <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-500/10 text-green-600 dark:text-green-500 font-medium text-sm">
                    <Check size={18} />
                    <span>همه‌ی محصولات نمایش داده شدند</span>
                  </div>
                )
              )}
            </div>
          )}
        </>
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