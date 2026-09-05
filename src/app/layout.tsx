import AuthInitializer from "@/components/AuthInitializer";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/900.css";
import ThemeProvider from "@/providers/ThemeProvider";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "آراد گالری | فروشگاه آنلاین لوازم آرایشی و بهداشتی اورجینال",
    template: "%s | آراد گالری",
  },
  description:
    "خرید آنلاین لوازم آرایشی و بهداشتی اورجینال از برندهای معتبر جهانی مثل MAC، Maybelline، L'Oreal، NARS. آراد گالری با ضمانت اصالت کالا، ارسال سریع به سراسر ایران و قیمت مناسب.",
  icons: {
    icon: "/images/logo-light.webp",
    shortcut: "/images/logo-light.webp",
    apple: "/images/logo-light.webp",
  },
  keywords: [
    "لوازم آرایشی",
    "لوازم بهداشتی",
    "خرید آنلاین لوازم آرایشی",
    "آراد گالری",
    "کرم پودر",
    "رژ لب",
    "ریمل",
    "عطر و ادکلن",
    "شامپو",
    "مراقبت پوست",
    "مراقبت مو",
    "MAC",
    "Maybelline",
    "L'Oreal",
    "NARS",
    "Huda Beauty",
    "فروشگاه آنلاین آرایشی",
    "خرید لوازم آرایشی اورجینال",
  ],
  authors: [{ name: "آراد گالری" }],
  creator: "آراد گالری",
  publisher: "آراد گالری",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "آراد گالری | فروشگاه آنلاین لوازم آرایشی و بهداشتی اورجینال",
    description:
      "خرید آنلاین لوازم آرایشی اورجینال از برندهای معتبر جهانی با ارسال سریع و ضمانت اصالت کالا",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "آراد گالری",
    images: [
      {
        url: "/images/logo-light.webp",
        width: 512,
        height: 512,
        alt: "آراد گالری",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "آراد گالری | فروشگاه آنلاین لوازم آرایشی و بهداشتی اورجینال",
    description:
      "خرید آنلاین لوازم آرایشی اورجینال از برندهای معتبر جهانی با ارسال سریع",
    images: ["/images/logo-light.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>
        <OrganizationJsonLd />
        <ThemeProvider>
          <AuthInitializer />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#7c3aed",
                color: "#fff",
                fontFamily: "Vazirmatn, sans-serif",
                fontSize: "14px",
                fontWeight: "bold",
                padding: "12px 20px",
                borderRadius: "16px",
                boxShadow: "0 10px 40px rgba(124, 58, 237, 0.3)",
              },
              success: {
                iconTheme: {
                  primary: "#fff",
                  secondary: "#7c3aed",
                },
              },
              error: {
                style: {
                  background: "#ec4899",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#ec4899",
                },
              },
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}