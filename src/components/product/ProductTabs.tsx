"use client";

import { useState } from "react";
import { FileText, ListChecks, MessageSquare } from "lucide-react";
import { Product } from "@/types/product";

type Props = {
  product: Product;
};

type TabKey = "description" | "specs" | "reviews";

export default function ProductTabs({ product }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  const tabs: { key: TabKey; label: string; icon: typeof FileText }[] = [
    { key: "description", label: "توضیحات", icon: FileText },
    { key: "specs", label: "مشخصات", icon: ListChecks },
    { key: "reviews", label: "نظرات", icon: MessageSquare },
  ];

  return (
    <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 overflow-hidden">
      <div className="flex border-b border-royal-500/10 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 md:px-8 py-4 text-sm font-bold whitespace-nowrap transition-all relative ${
                isActive
                  ? "text-royal-500"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-l from-royal-500 to-blush-500" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-6 md:p-8 min-h-[200px]">
        {activeTab === "description" && (
          <div>
            {product.description ? (
              <p className="text-gray-700 dark:text-gray-300 leading-9 text-sm md:text-base">
                {product.description}
              </p>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <FileText size={40} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">توضیحاتی برای این محصول ثبت نشده است</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "specs" && (
          <div>
            {product.specs && product.specs.length > 0 ? (
              <div className="divide-y divide-royal-500/10">
                {product.specs.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <span className="text-sm font-medium text-gray-500">
                      {spec.key}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <ListChecks size={40} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">مشخصاتی برای این محصول ثبت نشده است</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-royal-500/20 to-blush-500/20 flex items-center justify-center">
              <MessageSquare size={30} className="text-royal-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              بخش نظرات به زودی...
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto leading-7">
              در نسخه بعدی، امکان ثبت نظر و امتیاز برای محصولات فراهم خواهد شد
            </p>
          </div>
        )}
      </div>
    </div>
  );
}