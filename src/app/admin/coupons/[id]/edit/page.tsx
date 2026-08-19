"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import CouponForm from "../../CouponForm";

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCoupon() {
      try {
        const res = await fetch(`/api/admin/coupons/${id}`);
        const data = await res.json();
        if (data.success) {
          setInitialData(data.data);
        } else {
          toast.error("کوپن یافت نشد");
          router.push("/admin/coupons");
        }
      } catch {
        toast.error("خطا در بارگذاری");
      } finally {
        setIsLoading(false);
      }
    }
    loadCoupon();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={40} className="text-royal-500 animate-spin mb-3" />
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!initialData) return null;

  return (
    <CouponForm
      mode="edit"
      couponId={id}
      initialData={initialData}
      onSuccess={() => router.push("/admin/coupons")}
    />
  );
}