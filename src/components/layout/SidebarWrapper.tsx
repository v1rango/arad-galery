"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import CategorySidebar from "./CategorySidebar";

export default function SidebarWrapper() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <aside className="hidden lg:block w-72 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <CategorySidebar />
      </aside>

      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-royal-500 to-blush-500 text-white shadow-2xl shadow-royal-500/40 hover:scale-110 transition-transform"
        aria-label="دسته‌بندی‌ها"
      >
        <Menu size={24} />
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[85%] animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <CategorySidebar isMobile onClose={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}