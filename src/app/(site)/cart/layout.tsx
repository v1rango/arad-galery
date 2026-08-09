import { Metadata } from "next";

export const metadata: Metadata = {
  title: "سبد خرید",
  description: "سبد خرید شما در آراد گالری",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}