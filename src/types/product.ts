export type ProductSpec = {
  id: string;
  key: string;
  value: string;
  order: number;
  productId: string;
};

export type ProductImage = {
  id: string;
  url: string;
  order: number;
  productId: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  image: string | null;
};

export type ProductVariant = {
  id: string;
  productId: string;
  title: string;
  type?: string | null;
  colorCode?: string | null;
  price?: number | null;
  discountPrice?: number | null;
  stockCount: number;
  inStock: boolean;
  sku?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  inStock: boolean;
  stockCount: number;
  isNew: boolean;
  isActive: boolean;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  specs: ProductSpec[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
};

export type CategoryWithChildren = Category & {
  children: Category[];
};