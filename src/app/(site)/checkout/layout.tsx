import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تکمیل خرید",
  description: "تکمیل فرآیند خرید در آراد گالری",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}