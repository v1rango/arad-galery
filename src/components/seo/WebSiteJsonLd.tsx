export default function WebSiteJsonLd() {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://arad-gallery.ir";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "آراد گالری",
    alternateName: [
      "Arad Gallery",
      "گالری آراد",
      "فروشگاه آراد گالری",
      "آرادبیوتی",
      "Arad Beauty",
    ],
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "fa-IR",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
