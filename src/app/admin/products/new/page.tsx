"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Upload,
  X,
  Plus,
  Save,
  Trash2,
  GripVertical,
} from "lucide-react";
import toast from "react-hot-toast";
import SeoFieldsSection from "@/components/admin/SeoFieldsSection";

type LeafCategory = {
  id: string;
  name: string;
  fullName: string;
};

type Spec = {
  key: string;
  value: string;
};

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<LeafCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stockCount, setStockCount] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [specs, setSpecs] = useState<Spec[]>([{ key: "", value: "" }]);

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories/leaf");
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch {
        toast.error("خطا در بارگذاری دسته‌بندی‌ها");
      }
    }
    loadCategories();
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[\s\u0600-\u06FF]+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          newImages.push(data.url);
        } else {
          toast.error(data.error || "خطا در آپلود");
        }
      } catch {
        toast.error("خطا در ارتباط با سرور");
      }
    }

    setImages((prev) => [...prev, ...newImages]);
    setIsUploading(false);

    if (newImages.length > 0) {
      toast.success(`${newImages.length} عکس آپلود شد`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const newImages = [...images];
    [newImages[from], newImages[to]] = [newImages[to], newImages[from]];
    setImages(newImages);
  };

  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpec = (index: number) => {
    if (specs.length === 1) {
      setSpecs([{ key: "", value: "" }]);
    } else {
      setSpecs(specs.filter((_, i) => i !== index));
    }
  };

  const updateSpec = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast.error("عنوان محصول الزامی است");
      return false;
    }
    if (!slug.trim()) {
      toast.error("slug الزامی است");
      return false;
    }
    if (!brand.trim()) {
      toast.error("برند الزامی است");
      return false;
    }
    if (!categoryId) {
      toast.error("دسته‌بندی را انتخاب کنید");
      return false;
    }
    if (!price || parseInt(price) <= 0) {
      toast.error("قیمت معتبر وارد کنید");
      return false;
    }
    if (discountPrice && parseInt(discountPrice) >= parseInt(price)) {
      toast.error("قیمت با تخفیف باید کمتر از قیمت اصلی باشد");
      return false;
    }
    if (images.length === 0) {
      toast.error("حداقل یک عکس اضافه کنید");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    toast.loading("در حال ذخیره...", { id: "save" });

    try {
      const res = await fetch("/api/admin/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          brand: brand.trim(),
          description: description.trim() || null,
          price,
          discountPrice: discountPrice || null,
          stockCount: stockCount || "0",
          isNew,
          categoryId,
          images,
          specs: specs.filter((s) => s.key.trim() && s.value.trim()),
          seoTitle: seoTitle.trim() || null,
          seoDescription: seoDescription.trim() || null,
          seoKeywords: seoKeywords.trim() || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("محصول اضافه شد ✨", { id: "save" });
        router.push("/admin/products");
      } else {
        toast.error(data.error || "خطا در ذخیره", { id: "save" });
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: "save" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-1">
            <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
              افزودن محصول جدید
            </span>
          </h1>
          <p className="text-sm text-gray-500">مشخصات محصول را وارد کنید</p>
        </div>

        <Link
          href="/admin/products"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-500/10 text-royal-500 text-sm font-bold hover:bg-royal-500/20 transition-colors"
        >
          <ArrowRight size={18} />
          <span className="hidden sm:inline">بازگشت</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10">
            اطلاعات اصلی
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              عنوان محصول <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="مثلاً: کرم پودر Fit Me میبلین"
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              Slug (آدرس در URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="foundation-maybelline-fit-me"
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors font-mono"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              با تایپ عنوان، خودکار پر میشه. می‌تونی دستی هم عوض کنی.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                برند <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="مثلاً: Maybelline"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                دسته‌بندی <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors cursor-pointer"
              >
                <option value="">انتخاب کنید...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              توضیحات
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات کامل محصول..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors resize-none"
            />
          </div>
        </section>

        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10">
            قیمت و موجودی
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                قیمت (تومان) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
                placeholder="890000"
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                قیمت با تخفیف (اختیاری)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value.replace(/\D/g, ""))}
                placeholder="750000"
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                موجودی (تعداد)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={stockCount}
                onChange={(e) => setStockCount(e.target.value.replace(/\D/g, ""))}
                placeholder="10"
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors text-right"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="w-4 h-4 rounded accent-royal-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              نشان‌گذاری به عنوان محصول جدید ✨
            </span>
          </label>
        </section>

        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10">
            عکس‌های محصول <span className="text-red-500">*</span>
          </h2>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-royal-500/30 text-royal-500 hover:bg-royal-500/5 transition-colors disabled:opacity-60"
          >
            <Upload size={20} />
            <span className="font-bold">
              {isUploading ? "در حال آپلود..." : "کلیک کنید یا عکس‌ها رو انتخاب کنید"}
            </span>
          </button>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {images.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden bg-royal-500/5 border-2 border-royal-500/10 group"
                >
                  <Image
                    src={url}
                    alt={`عکس ${index + 1}`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />

                  {index === 0 && (
                    <div className="absolute top-1 right-1 px-2 py-0.5 rounded-full bg-gradient-to-l from-royal-500 to-blush-500 text-white text-[10px] font-bold">
                      اصلی
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      disabled={index === 0}
                      className="w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 transition-colors flex items-center justify-center"
                    >
                      →
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center"
                    >
                      <X size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      disabled={index === images.length - 1}
                      className="w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 transition-colors flex items-center justify-center"
                    >
                      ←
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] text-gray-500">
            💡 اولین عکس، عکس اصلی محصوله. با کلیک روی عکس‌ها می‌تونی ترتیبشون رو عوض کنی.
          </p>
        </section>

        <SeoFieldsSection
          seoTitle={seoTitle}
          setSeoTitle={setSeoTitle}
          seoDescription={seoDescription}
          setSeoDescription={setSeoDescription}
          seoKeywords={seoKeywords}
          setSeoKeywords={setSeoKeywords}
          defaultTitle={title ? `${title} | آراد گالری` : undefined}
        />

        <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-royal-500/10">
            <h2 className="text-base font-black text-gray-900 dark:text-white">
              مشخصات فنی
            </h2>
            <button
              type="button"
              onClick={addSpec}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-royal-500/10 text-royal-500 text-xs font-bold hover:bg-royal-500/20 transition-colors"
            >
              <Plus size={14} />
              <span>افزودن</span>
            </button>
          </div>

          <div className="space-y-2">
            {specs.map((spec, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="text-gray-400">
                  <GripVertical size={16} />
                </div>
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => updateSpec(index, "key", e.target.value)}
                  placeholder="مثلاً: حجم"
                  className="flex-1 px-3 py-2 rounded-lg bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateSpec(index, "value", e.target.value)}
                  placeholder="مثلاً: ۳۰ میلی‌لیتر"
                  className="flex-1 px-3 py-2 rounded-lg bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => removeSpec(index)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            انصراف
          </Link>

          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>در حال ذخیره...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>ذخیره محصول</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}