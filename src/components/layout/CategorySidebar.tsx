"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { CategoryWithChildren } from "@/types/product";
import { fetchCategories } from "@/lib/api";

type Props = {
  isMobile?: boolean;
  onClose?: () => void;
};

export default function CategorySidebar({ isMobile = false, onClose }: Props) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      const data = await fetchCategories();
      setCategories(data);
      setIsLoading(false);
    }
    loadCategories();
  }, []);

  const toggleCategory = (slug: string) => {
    setOpenCategory(openCategory === slug ? null : slug);
  };

  return (
    <aside className="w-full h-full bg-white dark:bg-black">
      <div className="p-5 border-b border-royal-500/10 flex items-center justify-between">
        <h2 className="text-lg font-black bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
          دسته‌بندی محصولات
        </h2>
        {isMobile && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-royal-500/10 text-royal-500"
            aria-label="بستن"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="p-3 space-y-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-xl bg-royal-500/5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          categories.map((category) => {
            const hasSubcategories =
              category.children && category.children.length > 0;
            const isOpen = openCategory === category.slug;

            return (
              <div key={category.slug}>
                {hasSubcategories ? (
                  <button
                    onClick={() => toggleCategory(category.slug)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-royal-500/10 hover:text-royal-500 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.emoji}</span>
                      <span>{category.name}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={`/products?category=${category.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-royal-500/10 hover:text-royal-500 transition-all"
                  >
                    <span className="text-xl">{category.emoji}</span>
                    <span>{category.name}</span>
                  </Link>
                )}

                {hasSubcategories && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96 mt-1" : "max-h-0"
                    }`}
                  >
                    <div className="mr-6 pr-3 border-r-2 border-royal-500/20 space-y-1">
                      {category.children.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/products?category=${category.slug}&sub=${sub.slug}`}
                          onClick={onClose}
                          className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-blush-500/10 hover:text-blush-500 transition-all"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>
    </aside>
  );
}