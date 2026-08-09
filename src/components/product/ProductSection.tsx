import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
};

export default function ProductSection({ title, subtitle, products, viewAllHref }: Props) {
  return (
    <section className="py-16">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-2">
              <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                {subtitle}
              </p>
            )}
          </div>

          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-royal-500 hover:text-blush-500 transition-colors"
            >
              <span>مشاهده همه</span>
              <ArrowLeft size={16} />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}