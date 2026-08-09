"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Package,
  AlertTriangle,
  XCircle,
  ShoppingBag,
  CheckCheck,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

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

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

const loadNotifications = async () => {
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
      setNotifications(data.data);
      setUnreadCount(data.unreadCount);
    }
  } catch (error) {
    console.error("خطا:", error);
  } finally {
    setIsLoading(false);
  }
};
  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/notifications/${id}/read`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      toast.error("خطا در انجام عملیات");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/admin/notifications/mark-all-read", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${data.count.toLocaleString("fa-IR")} نوتیفیکیشن خونده شد`);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch {
      toast.error("خطا در انجام عملیات");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("نوتیفیکیشن حذف شد");
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch {
      toast.error("خطا در حذف");
    }
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-1">
            <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
              نوتیفیکیشن‌ها
            </span>
          </h1>
          <p className="text-sm text-gray-500">
            {unreadCount > 0
              ? `${unreadCount.toLocaleString("fa-IR")} نوتیفیکیشن خونده نشده`
              : "همه‌ی نوتیفیکیشن‌ها خونده شده"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-500/10 text-royal-500 text-sm font-bold hover:bg-royal-500/20 transition-colors"
          >
            <CheckCheck size={16} />
            <span>همه رو خونده کن</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-3 flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
            filter === "all"
              ? "bg-gradient-to-l from-royal-500 to-blush-500 text-white"
              : "text-gray-600 dark:text-gray-400 hover:bg-royal-500/10"
          }`}
        >
          همه ({notifications.length.toLocaleString("fa-IR")})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
            filter === "unread"
              ? "bg-gradient-to-l from-royal-500 to-blush-500 text-white"
              : "text-gray-600 dark:text-gray-400 hover:bg-royal-500/10"
          }`}
        >
          خونده نشده ({unreadCount.toLocaleString("fa-IR")})
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-4 animate-pulse"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-royal-500/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-royal-500/10 rounded" />
                  <div className="h-3 w-full bg-royal-500/10 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const config = iconConfig[notif.type] || iconConfig.NEW_USER;
            const Icon = config.icon;

            return (
              <div
                key={notif.id}
                className={`bg-white dark:bg-royal-500/5 rounded-2xl border transition-all p-4 ${
                  !notif.isRead
                    ? "border-royal-500/30 shadow-lg shadow-royal-500/5"
                    : "border-royal-500/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl ${config.bg} flex items-center justify-center shrink-0`}
                  >
                    <Icon size={22} className={config.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-black text-gray-900 dark:text-white">
                        {notif.title}
                      </h3>
                      {!notif.isRead && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span>جدید</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-7 mb-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="text-[10px] text-gray-500">
                        {timeAgo(notif.createdAt)}
                      </div>
                      <div className="flex items-center gap-2">
                        {!notif.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="flex items-center gap-1 text-[10px] font-bold text-royal-500 hover:text-blush-500 transition-colors"
                          >
                            <CheckCheck size={12} />
                            <span>خونده شد</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={12} />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10">
          <div className="w-20 h-20 rounded-full bg-royal-500/10 flex items-center justify-center mb-4">
            <Bell size={40} className="text-royal-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            نوتیفیکیشنی نیست
          </h3>
          <p className="text-gray-500 text-sm">
            {filter === "unread"
              ? "همه نوتیفیکیشن‌ها خونده شدن"
              : "هنوز نوتیفیکیشنی دریافت نشده"}
          </p>
        </div>
      )}
    </div>
  );
}
