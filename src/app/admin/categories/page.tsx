"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  ChevronDown,
  ChevronLeft,
  Tags,
  Save,
  X,
  ImagePlus,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  emoji: string | null;
  parentId: string | null;
  parent: { id: string; name: string } | null;
  _count: {
    children: number;
    products: number;
  };
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const [showFormFor, setShowFormFor] = useState<
    | { mode: "new-main" }
    | { mode: "new-sub"; parentId: string }
    | { mode: "edit"; category: CategoryWithCount }
    | null
  >(null);

  const [deleteTarget, setDeleteTarget] = useState<CategoryWithCount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch {
      toast.error("خطا در بارگذاری");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const mainCategories = categories.filter((c) => !c.parentId);
  const getChildren = (parentId: string) =>
    categories.filter((c) => c.parentId === parentId);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("دسته حذف شد");
        setDeleteTarget(null);
        loadCategories();
      } else {
        toast.error(data.error || "خطا در حذف");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-1 flex items-center gap-2">
            <Tags size={28} className="text-royal-500" />
            <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
              دسته‌بندی‌ها
            </span>
          </h1>
          <p className="text-sm text-gray-500">
            {mainCategories.length.toLocaleString("fa-IR")} دسته اصلی
          </p>
        </div>

        <button
          onClick={() => setShowFormFor({ mode: "new-main" })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5 text-sm"
        >
          <Plus size={18} />
          <span>دسته جدید</span>
        </button>
      </div>

      {showFormFor?.mode === "new-main" && (
        <CategoryForm
          mode="create"
          onCancel={() => setShowFormFor(null)}
          onSuccess={() => {
            setShowFormFor(null);
            loadCategories();
          }}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-4 animate-pulse h-16"
            />
          ))}
        </div>
      ) : mainCategories.length > 0 ? (
        <div className="space-y-3">
          {mainCategories.map((cat) => {
            const children = getChildren(cat.id);
            const isExpanded = expandedIds.has(cat.id);
            const isEditing =
              showFormFor?.mode === "edit" && showFormFor.category.id === cat.id;
            const isAddingSub =
              showFormFor?.mode === "new-sub" && showFormFor.parentId === cat.id;

            return (
              <div key={cat.id} className="space-y-2">
                <div className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 overflow-hidden">
                  {!isEditing ? (
                    <div className="p-4 flex items-center gap-3 flex-wrap">
                      {children.length > 0 && (
                        <button
                          onClick={() => toggleExpanded(cat.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-royal-500/10 text-royal-500 hover:bg-royal-500/20 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronLeft size={16} />
                          )}
                        </button>
                      )}

                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">{cat.emoji || "📁"}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-black text-gray-900 dark:text-white">
                          {cat.name}
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono" dir="ltr">
                          {cat.slug}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        {children.length > 0 && (
                          <span className="px-2 py-1 rounded-full bg-blush-500/10 text-blush-500 font-bold">
                            {children.length.toLocaleString("fa-IR")} زیردسته
                          </span>
                        )}
                        {cat._count.products > 0 && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 font-bold">
                            <Package size={10} />
                            <span>
                              {cat._count.products.toLocaleString("fa-IR")}
                            </span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            setShowFormFor({ mode: "new-sub", parentId: cat.id })
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                          title="افزودن زیردسته"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() =>
                            setShowFormFor({ mode: "edit", category: cat })
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-royal-500/10 text-royal-500 hover:bg-royal-500/20 transition-colors"
                          title="ویرایش"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <CategoryForm
                      mode="edit"
                      initialData={cat}
                      onCancel={() => setShowFormFor(null)}
                      onSuccess={() => {
                        setShowFormFor(null);
                        loadCategories();
                      }}
                    />
                  )}
                </div>

                {isAddingSub && (
                  <div className="mr-8">
                    <CategoryForm
                      mode="create"
                      parentId={cat.id}
                      onCancel={() => setShowFormFor(null)}
                      onSuccess={() => {
                        setShowFormFor(null);
                        setExpandedIds((prev) => new Set(prev).add(cat.id));
                        loadCategories();
                      }}
                    />
                  </div>
                )}

                {isExpanded && children.length > 0 && (
                  <div className="mr-8 space-y-2">
                    {children.map((child) => {
                      const isChildEditing =
                        showFormFor?.mode === "edit" &&
                        showFormFor.category.id === child.id;

                      if (isChildEditing) {
                        return (
                          <div
                            key={child.id}
                            className="bg-white dark:bg-royal-500/5 rounded-xl border border-royal-500/10 overflow-hidden"
                          >
                            <CategoryForm
                              mode="edit"
                              initialData={child}
                              onCancel={() => setShowFormFor(null)}
                              onSuccess={() => {
                                setShowFormFor(null);
                                loadCategories();
                              }}
                            />
                          </div>
                        );
                      }

                      return (
                        <div
                          key={child.id}
                          className="bg-white dark:bg-royal-500/5 rounded-xl border border-royal-500/10 p-3 flex items-center gap-3 flex-wrap"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                            {child.image ? (
                              <img src={child.image} alt={child.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl">{child.emoji || "📄"}</span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-gray-900 dark:text-white">
                              {child.name}
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono" dir="ltr">
                              {child.slug}
                            </div>
                          </div>

                          {child._count.products > 0 && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold">
                              <Package size={10} />
                              <span>
                                {child._count.products.toLocaleString("fa-IR")}
                              </span>
                            </span>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                setShowFormFor({ mode: "edit", category: child })
                              }
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-royal-500/10 text-royal-500 hover:bg-royal-500/20 transition-colors"
                              title="ویرایش"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(child)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                              title="حذف"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10">
          <div className="w-20 h-20 rounded-full bg-royal-500/10 flex items-center justify-center mb-4">
            <Tags size={40} className="text-royal-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            هنوز دسته‌بندی نداری
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            برای شروع، اولین دسته‌بندی رو اضافه کن
          </p>
          <button
            onClick={() => setShowFormFor({ mode: "new-main" })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-500/10 text-royal-500 text-sm font-bold hover:bg-royal-500/20 transition-colors"
          >
            <Plus size={16} />
            <span>افزودن دسته</span>
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف دسته‌بندی"
        message={`آیا از حذف "${deleteTarget?.name}" اطمینان دارید؟`}
        confirmText="بله، حذف کن"
        cancelText="انصراف"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

function CategoryForm({
  mode,
  initialData,
  parentId,
  onCancel,
  onSuccess,
}: {
  mode: "create" | "edit";
  initialData?: CategoryWithCount;
  parentId?: string;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [emoji, setEmoji] = useState(initialData?.emoji || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (value: string) => {
    setName(value);
    if (mode === "create" && !slug) {
      const generated = value
        .toLowerCase()
        .trim()
        .replace(/[\s\u0600-\u06FF]+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("در حال آپلود عکس...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImage(data.url);
        toast.success("عکس آپلود شد ✨", { id: toastId });
      } else {
        toast.error(data.error || "خطا در آپلود", { id: toastId });
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("نام دسته الزامی است");
      return;
    }
    if (!slug.trim()) {
      toast.error("slug الزامی است");
      return;
    }

    setIsSubmitting(true);
    toast.loading("در حال ذخیره...", { id: "cat-save" });

    try {
      const url =
        mode === "create"
          ? "/api/admin/categories/create"
          : `/api/admin/categories/${initialData!.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          emoji: emoji.trim() || null,
          image: image || null,
          parentId: parentId || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(mode === "create" ? "دسته اضافه شد ✨" : "ذخیره شد ✨", {
          id: "cat-save",
        });
        onSuccess();
      } else {
        toast.error(data.error || "خطا در ذخیره", { id: "cat-save" });
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: "cat-save" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-royal-500/5 border-y border-royal-500/10 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* بخش آپلود عکس */}
        <div className="md:col-span-1 flex flex-col items-center justify-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="relative w-full h-32 rounded-2xl border-2 border-dashed border-royal-500/30 hover:border-royal-500 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center gap-2 transition-colors group overflow-hidden"
          >
            {image ? (
              <>
                <img src={image} alt="پیش‌نمایش" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                  تغییر عکس
                </div>
              </>
            ) : (
              <>
                {isUploading ? (
                  <Loader2 size={24} className="animate-spin text-royal-500" />
                ) : (
                  <ImagePlus size={28} className="text-royal-500" />
                )}
                <span className="text-xs text-gray-500 font-medium">
                  {isUploading ? "در حال آپلود..." : "آپلود عکس دسته"}
                </span>
              </>
            )}
          </button>
        </div>

        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">
              ایموجی (اختیاری)
            </label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="💄"
              maxLength={4}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-royal-500/10 focus:border-royal-500 focus:outline-none text-lg text-center"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">
              نام <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="مثلاً: رژ لب"
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="lipstick"
              dir="ltr"
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm font-mono"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
        >
          <X size={14} />
          <span>انصراف</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-l from-royal-500 to-blush-500 text-white text-xs font-bold hover:shadow-lg transition-all disabled:opacity-60"
        >
          {isSubmitting ? (
            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={14} />
          )}
          <span>ذخیره</span>
        </button>
      </div>
    </form>
  );
}