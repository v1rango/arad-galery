export type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  discountPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isNew?: boolean;
};