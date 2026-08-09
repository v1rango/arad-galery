import ProductCardSkeleton from "./ProductCardSkeleton";

type Props = {
  count?: number;
};

export default function ProductGridSkeleton({ count = 8 }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}