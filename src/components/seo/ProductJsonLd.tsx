import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductJsonLd({ product }: Props) {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const productUrl = `${BASE_URL}/products/${product.slug}`;

  const images = product.images.map((img) =>
    img.url.startsWith("http") ? img.url : `${BASE_URL}${img.url}`
  );

  const price = product.discountPrice || product.price;
  const availability = product.inStock
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description:
      product.description ||
      `خرید ${product.title} از برند ${product.brand}`,
    image: images,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "IRR",
      price: price * 10,
      availability,
      seller: {
        "@type": "Organization",
        name: "آراد گالری",
      },
      priceValidUntil: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}