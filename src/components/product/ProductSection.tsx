import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
};

export default function ProductSection({ title, subtitle, products, viewAllHref }: Props) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-royal-500" />
            <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-2 text-xs md:text-sm font-bold text-royal-600 dark:text-royal-400 hover:text-blush-500 dark:hover:text-blush-400 transition-colors w-fit"
          >
            <span>مشاهده همه محصولات</span>
            <div className="w-8 h-8 rounded-xl bg-royal-50 dark:bg-royal-950/50 flex items-center justify-center group-hover:translate-x-[-4px] transition-transform duration-200">
              <ArrowLeft size={16} />
            </div>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}
      </div>
    </section>
  );
}