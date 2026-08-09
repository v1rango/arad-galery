import { Metadata } from "next";

export const metadata: Metadata = {
  title: "همه محصولات",
  description:
    "مشاهده و خرید تمام محصولات آراد گالری. لوازم آرایشی و بهداشتی اورجینال از برندهای معتبر جهانی مثل MAC، Maybelline، L'Oreal، NARS، Huda Beauty و ... با ضمانت اصالت و ارسال سریع به سراسر ایران.",
  keywords: [
    "محصولات آرایشی",
    "خرید لوازم آرایشی",
    "لوازم بهداشتی",
    "آراد گالری",
    "MAC",
    "Maybelline",
    "L'Oreal",
    "NARS",
    "Huda Beauty",
    "کرم پودر",
    "رژ لب",
    "ریمل",
    "سایه چشم",
    "عطر",
    "شامپو",
  ],
  openGraph: {
    title: "همه محصولات | آراد گالری",
    description: "مشاهده و خرید تمام محصولات آراد گالری - لوازم آرایشی اورجینال",
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