import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = {
  title: "پنل مدیریت | آراد گالری",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/auth/login?redirect=/admin");
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}