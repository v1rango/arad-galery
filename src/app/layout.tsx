import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/900.css";
import ThemeProvider from "@/providers/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SidebarWrapper from "@/components/layout/SidebarWrapper";

export const metadata: Metadata = {
  title: "آراد گالری | فروشگاه آنلاین لوازم آرایشی و بهداشتی",
  description: "خرید آنلاین لوازم آرایشی و بهداشتی اورجینال با ارسال به سراسر کشور",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Header />
          <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
            <SidebarWrapper />
            <main className="flex-1 min-w-0">{children}</main>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}