export default function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 overflow-hidden flex flex-col animate-pulse">
      {/* عکس */}
      <div className="aspect-square bg-royal-500/10" />

      {/* محتوا */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* برند */}
        <div className="h-3 w-16 bg-royal-500/10 rounded-md" />

        {/* عنوان */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-royal-500/10 rounded-md" />
          <div className="h-4 w-3/4 bg-royal-500/10 rounded-md" />
        </div>

        {/* قیمت و دکمه */}
        <div className="mt-auto pt-3 flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <div className="h-3 w-12 bg-royal-500/10 rounded-md" />
            <div className="h-5 w-20 bg-royal-500/10 rounded-md" />
          </div>
          <div className="w-10 h-10 bg-royal-500/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}