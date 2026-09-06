"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import ProductGridSkeleton from "@/components/product/ProductGridSkeleton";
import { PackageSearch, Plus, Check, ChevronLeft } from "lucide-react";
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
      try {
        const [productsRes, categoriesData] = await Promise.all([
          fetchProducts(1),
          fetchCategories(),
        ]);
        setProducts(productsRes.products);
        setPagination(productsRes.pagination);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handleLoadMore = async () => {
    if (!pagination || !pagination.hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = pagination.page + 1;
      const res = await fetchProducts(nextPage);

      setProducts((prev) => [...prev, ...res.products]);
      setPagination(res.pagination);
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setIsLoadingMore(false);
    }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header Section */}
      <div className="space-y-3">
        <nav className="flex items-center gap-2 text-xs font-bold text-zinc-400">
          <span>محصولات</span>
          {currentCategory && (
            <>
              <ChevronLeft size={14} className="text-zinc-300 dark:text-zinc-600" />
              <span className="text-royal-600 dark:text-royal-400">{currentCategory.name}</span>
            </>
          )}
          {currentSub && (
            <>
              <ChevronLeft size={14} className="text-zinc-300 dark:text-zinc-600" />
              <span className="text-blush-500">{currentSub.name}</span>
            </>
          )}
        </nav>

        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
          {pageTitle}
        </h1>

        {!isLoading && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl">
            {currentSub
              ? `مجموعه‌ی کامل ${currentSub.name} از برترین برندهای آرایشی و بهداشتی`
              : currentCategory
              ? `مشاهده و خرید محصولات ${currentCategory.name} با ضمانت اصالت کالا`
              : "مشاهده تمام محصولات آراد گالری - مرجع تخصصی آرایشی و مراقبت پوستی اورجینال"}
          </p>
        )}
      </div>

      {/* Filters Bar */}
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        totalCount={filteredProducts.length}
      />

      {/* Product Grid */}
      {isLoading ? (
        <ProductGridSkeleton count={12} />
      ) : filteredProducts.length > 0 ? (
        <div className="space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More Button & Stats */}
          {pagination && (
            <div className="flex flex-col items-center justify-center gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800/60">
              <p className="text-xs font-bold text-zinc-400">
                نمایش{" "}
                <span className="text-zinc-900 dark:text-white">
                  {products.length.toLocaleString("fa-IR")}
                </span>{" "}
                از{" "}
                <span className="text-zinc-900 dark:text-white">
                  {pagination.total.toLocaleString("fa-IR")}
                </span>{" "}
                محصول
              </p>

              {pagination.hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-tr from-royal-600 via-royal-500 to-blush-500 text-white text-sm font-black hover:shadow-lg hover:shadow-royal-500/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    <Check size={16} />
                    <span>همه‌ی محصولات مشاهده شدند</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="w-16 h-16 rounded-2xl bg-royal-500/10 flex items-center justify-center mb-4 text-royal-500">
            <PackageSearch size={32} />
          </div>
          <h3 className="text-base font-black text-zinc-900 dark:text-white mb-1">
            محصولی یافت نشد
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm font-medium">
            نتیجه‌ای متناسب با فیلترهای انتخابی شما پیدا نشد. عبارت دیگری را جستجو کنید.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProductGridSkeleton count={8} />
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}