"use client";

import { useEffect } from "react";
import { AlertTriangle, Info, CheckCircle, X } from "lucide-react";

type DialogType = "danger" | "warning" | "info" | "success";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: DialogType;
  isLoading?: boolean;
};

const typeConfig = {
  danger: {
    icon: AlertTriangle,
    iconBg: "bg-red-500",
    iconColor: "text-white",
    buttonBg: "bg-red-500 hover:bg-red-600",
    ringColor: "ring-red-500/20",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-orange-500",
    iconColor: "text-white",
    buttonBg: "bg-orange-500 hover:bg-orange-600",
    ringColor: "ring-orange-500/20",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-500",
    iconColor: "text-white",
    buttonBg: "bg-blue-500 hover:bg-blue-600",
    ringColor: "ring-blue-500/20",
  },
  success: {
    icon: CheckCircle,
    iconBg: "bg-green-500",
    iconColor: "text-white",
    buttonBg: "bg-green-500 hover:bg-green-600",
    ringColor: "ring-green-500/20",
  },
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "تایید",
  cancelText = "انصراف",
  type = "danger",
  isLoading = false,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in-up"
      onClick={() => !isLoading && onClose()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md bg-white dark:bg-black rounded-3xl border border-royal-500/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => !isLoading && onClose()}
          disabled={isLoading}
          className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <X size={16} />
        </button>

        <div className="p-6 md:p-8 text-center">
          <div
            className={`w-16 h-16 mx-auto mb-5 rounded-full ${config.iconBg} flex items-center justify-center ring-8 ${config.ringColor}`}
          >
            <Icon size={30} className={config.iconColor} />
          </div>

          <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white mb-3">
            {title}
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400 leading-7 mb-6">
            {message}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-5 py-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl ${config.buttonBg} text-white font-bold transition-all hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>در حال انجام...</span>
                </>
              ) : (
                <span>{confirmText}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}