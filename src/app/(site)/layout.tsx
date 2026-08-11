import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SidebarWrapper from "@/components/layout/SidebarWrapper";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
        <SidebarWrapper />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <Footer />
    </>
  );
}