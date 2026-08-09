"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  Package,
  AlertTriangle,
  XCircle,
  ShoppingBag,
  CheckCheck,
  ArrowLeft,
} from "lucide-react";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const iconConfig: Record<
  string,
  { icon: typeof Bell; color: string; bg: string }
> = {
  NEW_ORDER: {
    icon: ShoppingBag,
    color: "text-green-600",
    bg: "bg-green-500/10",
  },
  LOW_STOCK: {
    icon: AlertTriangle,
    color: "text-orange-600",
    bg: "bg-orange-500/10",
  },
  OUT_OF_STOCK: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  PAYMENT_SUCCESS: {
    icon: CheckCheck,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },
  NEW_USER: {
    icon: Package,
    color: "text-purple-600",
    bg: "bg-purple-500/10",
  },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} روز پیش`;
  if (hours > 0) return `${hours} ساعت پیش`;
  if (minutes > 0) return `${minutes} دقیقه پیش`;
  return "چند لحظه پیش";
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadUnreadCount = async () => {
    try {
      const res = await fetch("/api/admin/notifications/unread-count");

      if (!res.ok) return;

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) return;

      const data = await res.json();
      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error("خطا:", error);
    }
  };

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");

      if (!res.ok) {
        setIsLoading(false);
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setNotifications(data.data.slice(0, 5));
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("خطا:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      loadNotifications();
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await fetch(`/api/admin/notifications/${notification.id}/read`, {
          method: "PATCH",
        });
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("خطا:", error);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative w-10 h-10 flex items-center justify-center rounded-full bg-royal-500/10 text-royal-500 hover:bg-royal-500/20 transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount.toLocaleString("fa-IR")}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 max-w-[90vw] rounded-2xl bg-white dark:bg-black border border-royal-500/10 shadow-2xl shadow-royal-500/10 overflow-hidden z-50">
          <div className="p-4 border-b border-royal-500/10 flex items-center justify-between bg-gradient-to-l from-royal-500/5 to-blush-500/5">
            <div>
              <div className="text-sm font-black text-gray-900 dark:text-white">
                نوتیفیکیشن‌ها
              </div>
              <div className="text-[11px] text-gray-500">
                {unreadCount > 0
                  ? `${unreadCount.toLocaleString("fa-IR")} خونده نشده`
                  : "همه خونده شده"}
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-royal-500/20 border-t-royal-500 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-gray-500">در حال بارگذاری...</p>
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-royal-500/10">
                {notifications.map((notif) => {
                  const config = iconConfig[notif.type] || iconConfig.NEW_USER;
                  const Icon = config.icon;

                  return (
                    <button
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`w-full text-right p-4 hover:bg-royal-500/5 transition-colors ${
                        !notif.isRead ? "bg-royal-500/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}
                        >
                          <Icon size={18} className={config.color} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                              {notif.title}
                            </h4>
                            {!notif.isRead && (
                              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-6">
                            {notif.message}
                          </p>
                          <div className="text-[10px] text-gray-500 mt-1">
                            {timeAgo(notif.createdAt)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-royal-500/10 flex items-center justify-center">
                  <Bell size={24} className="text-royal-500" />
                </div>
                <p className="text-sm text-gray-500">هیچ نوتیفیکیشنی نیست</p>
              </div>
            )}
          </div>

          <Link
            href="/admin/notifications"
            onClick={() => setIsOpen(false)}
            className="block p-3 text-center bg-royal-500/5 hover:bg-royal-500/10 border-t border-royal-500/10 transition-colors"
          >
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-royal-500">
              <span>مشاهده همه</span>
              <ArrowLeft size={12} />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}