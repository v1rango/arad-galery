import { Metadata } from "next";

export const metadata: Metadata = {
  title: "محصولات",
  description:
    "مشاهده و خرید تمام محصولات آراد گالری. لوازم آرایشی و بهداشتی اورجینال از برندهای معتبر جهانی مثل MAC، Maybelline، L'Oreal، NARS و ... با ارسال سریع به سراسر ایران.",
  keywords: [
    "محصولات آرایشی",
    "خرید لوازم آرایشی",
    "لوازم بهداشتی",
    "آراد گالری",
    "MAC",
    "Maybelline",
    "L'Oreal",
    "NARS",
  ],
  openGraph: {
    title: "محصولات | آراد گالری",
    description: "مشاهده و خرید تمام محصولات آراد گالری",
    type: "website",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}