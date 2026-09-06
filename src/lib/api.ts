import { Product, CategoryWithChildren } from "@/types/product";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
};

export type PaginationInfo = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

export type ProductsResponse = {
  products: Product[];
  pagination: PaginationInfo;
};

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

export async function fetchProducts(page: number = 1): Promise<ProductsResponse> {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/products?page=${page}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("خطا در دریافت محصولات");
    }

    const json = await res.json();
    return {
      products: json.data || [],
      pagination: json.pagination || {
        page: 1,
        pageSize: 12,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    };
  } catch (error) {
    console.error("fetchProducts error:", error);
    return {
      products: [],
      pagination: {
        page: 1,
        pageSize: 12,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    };
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const json: ApiResponse<Product> = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("fetchProductBySlug error:", error);
    return null;
  }
}

export async function fetchCategories(): Promise<CategoryWithChildren[]> {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("خطا در دریافت دسته‌بندی‌ها");
    }

    const json: ApiResponse<CategoryWithChildren[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("fetchCategories error:", error);
    return [];
  }
}