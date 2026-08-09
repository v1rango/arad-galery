"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  title: string;
};

export default function ProductGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const hasMultiple = images.length > 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-royal-500/5 border border-royal-500/10 group">
        <Image
          src={images[activeIndex]}
          alt={`${title} - عکس ${activeIndex + 1} از ${images.length}`}

          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />

        {hasMultiple && (
          <>
            <button
              onClick={goPrev}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center text-royal-500 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
              aria-label="عکس قبلی"
            >
              <ChevronRight size={22} />
            </button>

            <button
              onClick={goNext}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center text-royal-500 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
              aria-label="عکس بعدی"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
              {(activeIndex + 1).toLocaleString("fa-IR")} / {images.length.toLocaleString("fa-IR")}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                activeIndex === index
                  ? "border-royal-500 ring-2 ring-royal-500/20"
                  : "border-royal-500/10 hover:border-royal-500/40 opacity-70 hover:opacity-100"
              }`}
              aria-label={`نمایش عکس ${index + 1}`}
            >
              <Image
                src={img}
                alt={`${title} - عکس ${index + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}