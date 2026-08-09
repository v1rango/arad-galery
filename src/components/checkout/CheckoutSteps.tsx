"use client";

import { Check, MapPin, Truck, CheckCircle } from "lucide-react";

type Props = {
  currentStep: number;
};

const steps = [
  { id: 1, label: "آدرس تحویل", icon: MapPin },
  { id: 2, label: "روش پرداخت", icon: Truck },
  { id: 3, label: "تایید نهایی", icon: CheckCircle },
];

export default function CheckoutSteps({ currentStep }: Props) {
  return (
    <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-4 md:p-6 mb-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-gradient-to-br from-royal-500 to-blush-500 text-white shadow-lg shadow-royal-500/30 scale-110"
                      : "bg-royal-500/10 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={20} />
                  ) : (
                    <Icon size={20} />
                  )}
                </div>
                <span
                  className={`text-[11px] md:text-xs font-bold text-center whitespace-nowrap ${
                    isActive
                      ? "text-royal-500"
                      : isCompleted
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-2 md:mx-4 transition-colors ${
                    isCompleted
                      ? "bg-green-500"
                      : "bg-royal-500/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}