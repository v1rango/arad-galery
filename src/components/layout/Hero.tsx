"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden py-12 md:py-20 lg:py-32 rounded-[2rem] md:rounded-[2.5rem] mt-2 md:mt-4 border border-zinc-200/50 dark:border-zinc-800/50 bg-gradient-to-b from-royal-50/50 via-white to-white dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950"
    >
      <div className="absolute top-0 right-1/3 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-royal-500/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blush-500/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-5 md:space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-royal-500/10 dark:bg-royal-500/20 text-royal-600 dark:text-royal-400 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-extrabold border border-royal-500/20 backdrop-blur-md"
          >
            <Sparkles size={14} className="text-royal-500 animate-pulse" />
            <span>مجموعه‌ی جدید برندهای آرایشی رسید</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.3] md:leading-[1.25] text-zinc-900 dark:text-white"
          >
            <span className="bg-gradient-to-l from-royal-600 via-royal-500 to-blush-500 bg-clip-text text-transparent">
              درخشش و زیبایی
            </span>
            <br />
            شایسته شخصیت شماست
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-base md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto font-medium px-2 md:px-0"
          >
            مرجع تخصصی خرید آنلاین لوازم آرایشی و مراقبت پوستی اورجینال از برترین برندهای جهانی با ضمانت اصالت و ارسال فوری.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-4 px-4 sm:px-0"
          >
            <Link
              href="/products"
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 text-sm md:text-base bg-gradient-to-tr from-royal-600 via-royal-500 to-blush-500 text-white font-black rounded-2xl hover:shadow-xl hover:shadow-royal-500/25 active:scale-95 transition-all duration-300"
            >
              <span>مشاهده و خرید محصولات</span>
              <ArrowLeft size={16} className="group-hover:-translate-x-1.5 transition-transform duration-300" />
            </Link>

            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 text-sm md:text-base bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-bold rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-royal-500/50 dark:hover:border-royal-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 active:scale-95 transition-all duration-300 shadow-sm"
            >
              درباره آراد گالری
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}