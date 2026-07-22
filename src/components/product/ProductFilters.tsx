"use client";

import { Search, ArrowUpDown } from "lucide-react";

type SortOption = "newest" | "cheapest" | "expensive" | "bestselling";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  totalCount: number;
};

export default function ProductFilters({
  search,
  onSearchChange,
  sort,
  onSortChange,
  totalCount,
}: Props) {
  return (
    <div className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو در محصولات..."
            className="w-full pr-11 pl-4 py-3 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
          />
        </div>

        <div className="relative">
          <ArrowUpDown
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full md:w-56 pr-11 pl-4 py-3 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white appearance-none cursor-pointer transition-colors"
          >
            <option value="newest">جدیدترین</option>
            <option value="cheapest">ارزان‌ترین</option>
            <option value="expensive">گران‌ترین</option>
            <option value="bestselling">پرفروش‌ترین</option>
          </select>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        {totalCount.toLocaleString("fa-IR")} محصول یافت شد
      </div>
    </div>
  );
}