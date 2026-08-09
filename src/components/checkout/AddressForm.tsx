"use client";

import { User, Phone, MapPin, Home, Mail } from "lucide-react";

export type AddressData = {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
};

type Props = {
  data: AddressData;
  onChange: (data: AddressData) => void;
};

const provinces = [
  "تهران", "اصفهان", "فارس", "خراسان رضوی", "آذربایجان شرقی",
  "آذربایجان غربی", "مازندران", "گیلان", "کرمان", "خوزستان",
  "البرز", "قم", "کرمانشاه", "همدان", "یزد", "زنجان", "سایر"
];

export default function AddressForm({ data, onChange }: Props) {
  const handleChange = (field: keyof AddressData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-5 md:p-6">
      <h2 className="text-lg font-black mb-5">
        <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
          اطلاعات گیرنده
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
            نام و نام خانوادگی <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="مثلاً: علی محمدی"
              className="w-full pr-9 pl-3 py-3 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
            شماره تماس <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, ""))}
              placeholder="09123456789"
              maxLength={11}
              dir="ltr"
              className="w-full pr-9 pl-3 py-3 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
            استان <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              value={data.province}
              onChange={(e) => handleChange("province", e.target.value)}
              className="w-full pr-9 pl-3 py-3 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white appearance-none cursor-pointer transition-colors"
            >
              <option value="">استان را انتخاب کنید</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
            شهر <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={data.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="مثلاً: تهران"
              className="w-full pr-9 pl-3 py-3 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
            آدرس دقیق <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Home
              size={16}
              className="absolute right-3 top-3 text-gray-400"
            />
            <textarea
              value={data.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="خیابان، کوچه، پلاک، طبقه، واحد"
              rows={3}
              className="w-full pr-9 pl-3 py-3 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors resize-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
            کد پستی <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={data.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value.replace(/\D/g, ""))}
              placeholder="1234567890"
              maxLength={10}
              dir="ltr"
              className="w-full pr-9 pl-3 py-3 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 p-3 rounded-xl bg-royal-500/5 border border-royal-500/10">
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-6">
          💡 لطفاً اطلاعات را با دقت وارد کنید. سفارش شما به همین آدرس ارسال خواهد شد.
        </p>
      </div>
    </div>
  );
}