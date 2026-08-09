export default function OrganizationJsonLd() {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "آراد گالری",
    alternateName: "Arad Gallery",
    url: BASE_URL,
    logo: `${BASE_URL}/images/hero.webp`,
    description:
      "فروشگاه آنلاین لوازم آرایشی و بهداشتی اورجینال با ارسال به سراسر ایران",
    address: {
      "@type": "PostalAddress",
      streetAddress: "شهرک چیتگر شمالی، خیابان جهاد، نبش کوچه صفین",
      addressLocality: "تهران",
      addressRegion: "تهران",
      addressCountry: "IR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+98-939-557-4472",
      contactType: "customer service",
      availableLanguage: ["Persian", "Farsi"],
    },
    sameAs: [
      "https://instagram.com/arad-beauty2025",
      "https://wa.me/989395574472",
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
      ],
      opens: "09:00",
      closes: "21:00",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}