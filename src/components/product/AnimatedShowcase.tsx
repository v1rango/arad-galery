"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BadgePercent } from "lucide-react";
import { Product } from "@/types/product";

interface AnimatedShowcaseProps {
  products: Product[];
}

export default function AnimatedShowcase({ products }: AnimatedShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length]);

  if (!products || products.length === 0) return null;

  const currentProduct = products[currentIndex];
  const productImage = currentProduct.images?.[0]?.url || "/placeholder.jpg";

  const displayPrice = currentProduct.discountPrice 
    ? Number(currentProduct.discountPrice) 
    : Number(currentProduct.price);

  const hasDiscount = currentProduct.discountPrice !== null && currentProduct.discountPrice > 0;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative min-h-[450px] md:min-h-[400px] rounded-[2.5rem] overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 bg-gradient-to-br from-white via-royal-50/30 to-blush-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 luxury-shadow flex flex-col">
        
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-royal-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blush-500/10 rounded-full blur-[100px] pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative w-full flex-grow flex flex-col-reverse md:flex-row items-center justify-between p-6 md:p-12 gap-6"
          >
            {/* بخش متن و دکمه خرید */}
            <div className="w-full md:w-1/2 text-center md:text-right space-y-4 z-10 flex flex-col items-center md:items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-royal-500/10 dark:bg-royal-500/20 text-royal-600 dark:text-royal-400 px-4 py-2 rounded-full text-xs font-bold border border-royal-500/20"
              >
                <BadgePercent size={16} className="text-blush-500" />
                <span>پیشنهاد ویژه آراد گالری</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white"
              >
                {currentProduct.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto md:mx-0 line-clamp-2"
              >
                {currentProduct.description || "تجربه‌ای متفاوت از کیفیت و زیبایی با محصولات اورجینال و خاص."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center md:justify-start gap-6 pt-2"
              >
                <div className="flex flex-col items-center md:items-start">
                  {hasDiscount && (
                    <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500 line-through">
                      {Number(currentProduct.price).toLocaleString("fa-IR")}
                    </span>
                  )}
                  <span className="text-2xl font-black text-royal-600 dark:text-royal-400">
                    {displayPrice.toLocaleString("fa-IR")}
                    <span className="text-sm font-normal mr-1">تومان</span>
                  </span>
                </div>
                
                <Link
                  href={`/products/${currentProduct.slug}`}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-tr from-royal-600 to-blush-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-royal-500/30 active:scale-95 transition-all duration-300"
                >
                  <span>مشاهده محصول</span>
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* بخش عکس محصول */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full md:w-1/2 h-full flex items-center justify-center relative"
            >
              <div className="absolute w-48 h-48 md:w-72 md:h-72 bg-gradient-to-br from-royal-500/20 to-blush-500/20 rounded-full blur-2xl" />
              
              <div className="relative w-48 h-48 md:w-72 md:h-72 rounded-[2rem] overflow-hidden border border-white/50 dark:border-zinc-800/80 luxury-shadow bg-white dark:bg-zinc-900">
                <img
                  src={productImage}
                  alt={currentProduct.title}
                  className="w-full h-full object-cover transition-transform duration-[3000ms] hover:scale-110"
                />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="relative py-4 flex justify-center gap-2 z-20">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "w-8 bg-gradient-to-r from-royal-500 to-blush-500" 
                  : "w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400"
              }`}
              aria-label={`اسلاید ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}