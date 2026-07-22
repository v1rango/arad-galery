import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/900.css";
import ThemeProvider from "@/providers/ThemeProvider";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "آراد گالری | فروشگاه آنلاین",
  description: "فروشگاه آنلاین آراد گالری",
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
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}