import { Metadata } from "next";

export const metadata: Metadata = {
  title: "خرید انواع لوازم آرایشی و مراقبت پوستی اورجینال",
  description:
    "مشاهده و خرید انواع لوازم آرایشی و بهداشتی اورجینال از برندهای معتبر جهانی با ضمانت اصالت کالا و ارسال سریع در فروشگاه آراد گالری.",
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