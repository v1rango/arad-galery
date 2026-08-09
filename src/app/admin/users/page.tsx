"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  ShieldCheck,
  User,
  Package,
  Heart,
  Calendar,
} from "lucide-react";

type UserItem = {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  _count: {
    orders: number;
    wishlist: number;
  };
};

type Stats = {
  total: number;
  admins: number;
  regular: number;
  withOrders: number;
};

type FilterOption = "all" | "admin" | "user" | "with-orders";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    admins: 0,
    regular: 0,
    withOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
          setStats(data.stats);
        }
      } catch (error) {
        console.error("خطا:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (filter === "admin") {
      result = result.filter((u) => u.role === "ADMIN");
    } else if (filter === "user") {
      result = result.filter((u) => u.role === "USER");
    } else if (filter === "with-orders") {
      result = result.filter((u) => u._count.orders > 0);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (u) =>
          u.phone.includes(q) ||
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q))
      );
    }

    return result;
  }, [users, search, filter]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-black mb-1 flex items-center gap-2">
          <Users size={28} className="text-royal-500" />
          <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
            کاربران
          </span>
        </h1>
        <p className="text-sm text-gray-500">
          {stats.total.toLocaleString("fa-IR")} کاربر ثبت شده
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={Users}
          label="کل کاربران"
          value={stats.total}
          color="royal"
        />
        <StatCard
          icon={User}
          label="کاربران عادی"
          value={stats.regular}
          color="blue"
        />
        <StatCard
          icon={ShieldCheck}
          label="ادمین‌ها"
          value={stats.admins}
          color="blush"
        />
        <StatCard
          icon={Package}
          label="با سفارش"
          value={stats.withOrders}
          color="green"
        />
      </div>

      <div className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-4 space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو با نام، شماره یا ایمیل..."
            className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-gray-500 ml-1">
            <Filter size={12} />
            <span>فیلتر:</span>
          </div>

          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="همه"
            count={stats.total}
          />
          <FilterButton
            active={filter === "user"}
            onClick={() => setFilter("user")}
            label="کاربر عادی"
            count={stats.regular}
            color="blue"
          />
          <FilterButton
            active={filter === "admin"}
            onClick={() => setFilter("admin")}
            label="ادمین"
            count={stats.admins}
            color="blush"
          />
          <FilterButton
            active={filter === "with-orders"}
            onClick={() => setFilter("with-orders")}
            label="با سفارش"
            count={stats.withOrders}
            color="green"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-4 animate-pulse h-24"
            />
          ))}
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-4 hover:border-royal-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      user.role === "ADMIN"
                        ? "bg-gradient-to-br from-blush-500 to-royal-500"
                        : "bg-gradient-to-br from-royal-500 to-blush-500"
                    }`}
                  >
                    {user.role === "ADMIN" ? (
                      <ShieldCheck size={20} className="text-white" />
                    ) : (
                      <User size={20} className="text-white" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-black text-gray-900 dark:text-white">
                        {user.name || "بدون نام"}
                      </div>
                      {user.role === "ADMIN" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blush-500/10 text-blush-500">
                          ادمین
                        </span>
                      )}
                    </div>
                    <div
                      className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2"
                      dir="ltr"
                    >
                      <Phone size={10} />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                  <Calendar size={12} />
                  <span>{formatDate(user.createdAt)}</span>
                </div>
              </div>

              {user.email && (
                <div
                  className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3"
                  dir="ltr"
                >
                  <Mail size={12} />
                  <span>{user.email}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-royal-500/10">
                <Link
                  href="/admin/orders"
                  className="flex items-center justify-center gap-2 py-2 rounded-xl bg-green-500/10 text-green-600 text-xs font-bold hover:bg-green-500/20 transition-colors"
                >
                  <Package size={14} />
                  <span>
                    {user._count.orders.toLocaleString("fa-IR")} سفارش
                  </span>
                </Link>

                <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-blush-500/10 text-blush-500 text-xs font-bold">
                  <Heart size={14} />
                  <span>
                    {user._count.wishlist.toLocaleString("fa-IR")} علاقه‌مندی
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10">
          <div className="w-20 h-20 rounded-full bg-royal-500/10 flex items-center justify-center mb-4">
            <Users size={40} className="text-royal-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            کاربری یافت نشد
          </h3>
          <p className="text-gray-500 text-sm">
            {search ? "با این جستجو کاربری پیدا نشد" : "هنوز کاربری ثبت نشده"}
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  color: "royal" | "blue" | "blush" | "green";
}) {
  const colors = {
    royal: "from-royal-500 to-royal-600",
    blue: "from-blue-500 to-blue-600",
    blush: "from-blush-500 to-blush-600",
    green: "from-green-500 to-emerald-600",
  };

  return (
    <div className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-4">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-2`}
      >
        <Icon size={18} className="text-white" />
      </div>
      <div className="text-xl font-black text-gray-900 dark:text-white mb-0.5">
        {value.toLocaleString("fa-IR")}
      </div>
      <div className="text-[11px] text-gray-500">{label}</div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  count,
  color = "royal",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color?: "royal" | "blue" | "blush" | "green";
}) {
  const colors = {
    royal: active
      ? "bg-gradient-to-l from-royal-500 to-blush-500 text-white"
      : "bg-royal-500/10 text-royal-500 hover:bg-royal-500/20",
    blue: active
      ? "bg-blue-500 text-white"
      : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
    blush: active
      ? "bg-blush-500 text-white"
      : "bg-blush-500/10 text-blush-500 hover:bg-blush-500/20",
    green: active
      ? "bg-green-500 text-white"
      : "bg-green-500/10 text-green-600 hover:bg-green-500/20",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${colors[color]}`}
    >
      <span>{label}</span>
      <span className="text-[10px] opacity-80">
        {count.toLocaleString("fa-IR")}
      </span>
    </button>
  );
}