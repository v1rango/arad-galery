import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ProfileSidebar from "@/components/profile/ProfileSidebar";

export const metadata = {
  title: "پنل کاربری",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?redirect=/profile");
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-black mb-1">
            <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
              پنل کاربری
            </span>
          </h1>
          <p className="text-sm text-gray-500">
            مدیریت حساب کاربری و سفارش‌های شما
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProfileSidebar user={user} />
          </div>

          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}