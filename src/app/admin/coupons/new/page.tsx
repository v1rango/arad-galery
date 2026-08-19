"use client";

import { useRouter } from "next/navigation";
import CouponForm from "../CouponForm";

export default function NewCouponPage() {
  const router = useRouter();

  return (
    <CouponForm
      mode="create"
      onSuccess={() => router.push("/admin/coupons")}
    />
  );
}