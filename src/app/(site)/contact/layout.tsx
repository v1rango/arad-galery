import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تماس با آراد گالری - آدرس فروشگاه و راه‌های ارتباطی",
  description:
    "راه‌های ارتباطی با آراد گالری. آدرس فروشگاه فیزیکی در تهران، شهرک چیتگر شمالی. شماره تماس، اینستاگرام، واتساپ و فرم تماس آنلاین برای پیگیری سفارش‌ها.",
  keywords: [
    "تماس با آراد گالری",
    "آدرس فروشگاه لوازم آرایشی",
    "شماره تماس آراد گالری",
    "چیتگر شمالی",
    "فروشگاه آرایشی تهران",
  ],
  openGraph: {
    title: "تماس با ما | آراد گالری",
    description: "راه‌های ارتباطی با فروشگاه آراد گالری",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}