"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { Category } from "@/types/product";

interface CategoryBarProps {
  categories: Category[];
}

export default function CategoryBar({ categories }: CategoryBarProps) {
  if (!categories?.length) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="-mx-4 flex items-center justify-start gap-5 overflow-x-auto px-4 pb-4 scrollbar-hide md:mx-0 md:justify-center md:gap-8 md:px-0">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, transform: "translateY(16px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              opacity: {
                duration: 0.25,
                delay: index * 0.04,
              },
              transform: {
                duration: 0.25,
                delay: index * 0.04,
              },
            }}
            className="shrink-0"
          >
            <Link
              href={`/products?category=${category.slug}`}
              className="group flex flex-col items-center gap-3"
            >
              <div className="relative">
                {/* Glow - فقط با CSS، بدون Motion */}
                <div className="absolute inset-0 rounded-[1.8rem] bg-gradient-to-tr from-royal-500 to-blush-500 opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-25" />

                <div className="relative h-24 w-24 overflow-hidden rounded-[1.8rem] border border-zinc-200/80 shadow-md transition-transform duration-200 group-hover:-translate-y-1 dark:border-zinc-800 md:h-28 md:w-28">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 96px, 112px"
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-50 text-4xl dark:bg-zinc-900">
                      {category.emoji || "🛍️"}
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </div>
              </div>

              <span className="relative text-sm font-bold text-zinc-700 transition-colors duration-150 group-hover:text-royal-600 dark:text-zinc-300 dark:group-hover:text-royal-400">
                {category.name}

                <span className="absolute -bottom-1 right-0 h-0.5 w-0 bg-royal-500 transition-[width] duration-200 group-hover:w-full" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}