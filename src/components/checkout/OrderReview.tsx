"use client";

import Image from "next/image";
import { MapPin, CreditCard, Package, User, Phone, Tag } from "lucide-react";
import { CartItem } from "@/stores/cartStore";
import { useCartStore } from "@/stores/cartStore";
import { AddressData } from "./AddressForm";
import { PaymentMethod } from "./PaymentMethods";

type Props = {
  address: AddressData;
  paymentMethod: PaymentMethod;
  items: CartItem[];
};

const paymentLabels: Record<PaymentMethod, string> = {
  online: "پرداخت آنلاین (زرین‌پال)",
};

function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR");
}

export default function OrderReview({ address, paymentMethod, items }: Props) {
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={20} className="text-royal-500" />
          <h3 className="text-base font-black text-gray-900 dark:text-white">
            آدرس تحویل
          </h3>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <User size={14} className="text-gray-400" />
            <span className="font-bold">{address.fullName}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300" dir="ltr">
            <Phone size={14} className="text-gray-400" />
            <span>{address.phone}</span>
          </div>
          <div className="text-gray-600 dark:text-gray-400 leading-7 mt-2">
            {address.province}، {address.city}، {address.address}
          </div>
          <div className="text-xs text-gray-500 mt-1" dir="ltr">
            کد پستی: {address.postalCode}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={20} className="text-royal-500" />
          <h3 className="text-base font-black text-gray-900 dark:text-white">
            روش پرداخت
          </h3>
        </div>

        <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
          {paymentLabels[paymentMethod]}
        </div>
      </div>

      {appliedCoupon && (
        <div className="bg-green-500/5 rounded-3xl border border-green-500/20 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={20} className="text-green-600" />
            <h3 className="text-base font-black text-green-700 dark:text-green-400">
              کد تخفیف اعمال شده
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-green-700 dark:text-green-400" dir="ltr">
                {appliedCoupon.code}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {appliedCoupon.discountType === "PERCENTAGE"
                  ? `${appliedCoupon.discountValue}٪ تخفیف`
                  : `${formatPrice(appliedCoupon.discountValue)} تومان تخفیف`}
              </div>
            </div>
            <div className="text-left">
              <div className="text-lg font-black text-green-600">
                {formatPrice(appliedCoupon.discountAmount)}-
              </div>
              <div className="text-[10px] text-gray-500">تومان</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package size={20} className="text-royal-500" />
          <h3 className="text-base font-black text-gray-900 dark:text-white">
            محصولات ({items.length.toLocaleString("fa-IR")} مورد)
          </h3>
        </div>

        <div className="space-y-3">
          {items.map((item) => {
            const price = item.product.discountPrice ?? item.product.price;
            return (
              <div
                key={item.product.id}
                className="flex items-center gap-3 pb-3 last:pb-0 border-b border-royal-500/10 last:border-b-0"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-royal-500/5 shrink-0">
                  <Image
                    src={item.product.images[0]?.url || "/placeholder.png"}
                    alt={`${item.product.title} - ${item.product.brand}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs text-royal-500 font-medium mb-0.5">
                    {item.product.brand}
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                    {item.product.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.quantity.toLocaleString("fa-IR")} × {formatPrice(price)} تومان
                  </div>
                </div>

                <div className="text-sm font-black text-royal-500 shrink-0">
                  {formatPrice(price * item.quantity)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}