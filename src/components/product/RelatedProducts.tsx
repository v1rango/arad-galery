import { Sparkles } from "lucide-react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
};

export default function RelatedProducts({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-royal-500 to-blush-500 flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black">
            <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
              محصولات مشابه
            </span>
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            شاید این محصولات هم برای شما جذاب باشند
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}