import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const categoriesData = [
  {
    name: "آرایش صورت",
    slug: "face-makeup",
    emoji: "💄",
    subcategories: [
      { name: "کرم پودر", slug: "foundation" },
      { name: "کانسیلر", slug: "concealer" },
      { name: "پنکک", slug: "powder" },
      { name: "رژگونه", slug: "blush" },
      { name: "هایلایتر", slug: "highlighter" },
      { name: "کانتور", slug: "contour" },
    ],
  },
  {
    name: "آرایش چشم",
    slug: "eye-makeup",
    emoji: "👁️",
    subcategories: [
      { name: "ریمل", slug: "mascara" },
      { name: "خط چشم", slug: "eyeliner" },
      { name: "مداد چشم", slug: "eye-pencil" },
      { name: "سایه چشم", slug: "eyeshadow" },
      { name: "مژه مصنوعی", slug: "false-lashes" },
    ],
  },
  {
    name: "آرایش لب",
    slug: "lip-makeup",
    emoji: "💋",
    subcategories: [
      { name: "رژ لب", slug: "lipstick" },
      { name: "برق لب", slug: "lip-gloss" },
      { name: "مداد لب", slug: "lip-pencil" },
      { name: "خط لب", slug: "lip-liner" },
      { name: "تینت لب", slug: "lip-tint" },
    ],
  },
  {
    name: "مراقبت پوست",
    slug: "skincare",
    emoji: "✨",
    subcategories: [],
  },
  {
    name: "عطر و ادکلن",
    slug: "perfume",
    emoji: "🌸",
    subcategories: [],
  },
  {
    name: "ابزار آرایشی",
    slug: "tools",
    emoji: "🖌️",
    subcategories: [],
  },
  {
    name: "رنگ مو و اکسیدان",
    slug: "hair-color",
    emoji: "🎨",
    subcategories: [],
  },
  {
    name: "مراقبت مو",
    slug: "hair-care",
    emoji: "💇‍♀️",
    subcategories: [
      { name: "شامپو", slug: "shampoo" },
      { name: "نرم کننده", slug: "conditioner" },
      { name: "ماسک مو", slug: "hair-mask" },
      { name: "نگه دارنده", slug: "hair-preserver" },
      { name: "حالت دهنده", slug: "hair-styling" },
      { name: "زیبایی مو", slug: "hair-beauty" },
    ],
  },
];
const productsData = [
  {
    slug: "foundation-maybelline-fit-me",
    title: "کرم پودر Fit Me میبلین",
    brand: "Maybelline",
    categorySlug: "foundation",
    price: 890000,
    discountPrice: 750000,
    inStock: true,
    stockCount: 15,
    isNew: true,
    description:
      "کرم پودر Fit Me میبلین با پوشش طبیعی و بافت سبک، برای تمام انواع پوست مناسب است. حاوی مواد مرطوب‌کننده و بدون ایجاد حس سنگینی روی پوست. مناسب برای استفاده روزانه و مجالس.",
    images: [
      "https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=800",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
    ],
    specs: [
      { key: "حجم", value: "۳۰ میلی‌لیتر" },
      { key: "رنگ", value: "شماره ۱۲۰ - Classic Ivory" },
      { key: "نوع پوست", value: "معمولی تا خشک" },
      { key: "پوشش", value: "متوسط تا کامل" },
      { key: "کشور سازنده", value: "آمریکا" },
    ],
  },
  {
    slug: "lipstick-mac-ruby-woo",
    title: "رژ لب مات مک مدل Ruby Woo",
    brand: "MAC",
    categorySlug: "lipstick",
    price: 1450000,
    inStock: true,
    stockCount: 8,
    description:
      "رژ لب مات Ruby Woo از برند مک، یکی از محبوب‌ترین رژ لب‌های قرمز کلاسیک در جهان. با ماندگاری بالا و رنگ‌دهی فوق‌العاده، انتخابی بی‌نظیر برای مجالس رسمی و مهمانی‌ها.",
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
      "https://images.unsplash.com/photo-1599733589046-8e348c045b0d?w=800",
      "https://images.unsplash.com/photo-1590156206657-8b0d67b0c30f?w=800",
    ],
    specs: [
      { key: "حجم", value: "۳ گرم" },
      { key: "رنگ", value: "قرمز کلاسیک" },
      { key: "نوع", value: "مات" },
      { key: "ماندگاری", value: "۸ ساعت" },
      { key: "کشور سازنده", value: "کانادا" },
    ],
  },
  {
    slug: "mascara-loreal-voluminous",
    title: "ریمل حجم دهنده لورآل",
    brand: "L'Oreal",
    categorySlug: "mascara",
    price: 680000,
    discountPrice: 520000,
    inStock: true,
    stockCount: 25,
    description:
      "ریمل حجم دهنده Voluminous لورآل با فرمول ویژه، مژه‌ها را تا ۵ برابر حجیم‌تر می‌کند. برس مخصوص طراحی شده برای پوشش کامل تمامی مژه‌ها از ریشه تا نوک.",
    images: [
      "https://images.unsplash.com/photo-1631214540553-ff044a3ff1d4?w=800",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800",
      "https://images.unsplash.com/photo-1583241800698-9c2e5c31c497?w=800",
    ],
    specs: [
      { key: "حجم", value: "۹ میلی‌لیتر" },
      { key: "رنگ", value: "مشکی" },
      { key: "نوع", value: "حجم دهنده" },
      { key: "ضدآب", value: "خیر" },
      { key: "کشور سازنده", value: "فرانسه" },
    ],
  },
  {
    slug: "perfume-dior-sauvage",
    title: "عطر دیور مدل ساواج",
    brand: "Dior",
    categorySlug: "perfume",
    price: 5800000,
    discountPrice: 4900000,
    inStock: false,
    stockCount: 0,
    description:
      "عطر Sauvage دیور، یکی از پرفروش‌ترین عطرهای مردانه در جهان. رایحه‌ای گرم، ادویه‌ای و چوبی با ماندگاری فوق‌العاده. مناسب برای استفاده در تمام فصول و مجالس رسمی.",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800",
    ],
    specs: [
      { key: "حجم", value: "۱۰۰ میلی‌لیتر" },
      { key: "جنسیت", value: "مردانه" },
      { key: "نوع رایحه", value: "چوبی - ادویه‌ای" },
      { key: "ماندگاری", value: "۸ تا ۱۰ ساعت" },
      { key: "کشور سازنده", value: "فرانسه" },
    ],
  },
  {
    slug: "eyeshadow-huda-beauty",
    title: "پالت سایه چشم هدی بیوتی",
    brand: "Huda Beauty",
    categorySlug: "eyeshadow",
    price: 2300000,
    inStock: true,
    stockCount: 12,
    isNew: true,
    description:
      "پالت سایه چشم هدی بیوتی با ۱۸ رنگ متنوع شامل رنگ‌های مات، شیمر و متالیک. فرمول بسیار نرم و رنگ‌دهی قوی، مناسب برای خلق میکاپ‌های روزانه و مجلسی.",
    images: [
      "https://images.unsplash.com/photo-1583241800698-9c2e5c31c497?w=800",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800",
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800",
    ],
    specs: [
      { key: "تعداد رنگ", value: "۱۸ رنگ" },
      { key: "نوع", value: "مات، شیمر، متالیک" },
      { key: "وزن", value: "۳۵ گرم" },
      { key: "کشور سازنده", value: "امارات" },
    ],
  },
  {
    slug: "concealer-nars-radiant",
    title: "کانسیلر نارس مدل Radiant",
    brand: "NARS",
    categorySlug: "concealer",
    price: 1650000,
    discountPrice: 1350000,
    inStock: true,
    stockCount: 18,
    description:
      "کانسیلر Radiant Creamy از برند نارس، بهترین انتخاب برای پوشش تیرگی زیر چشم و لکه‌های صورت. بافت کرمی و روان با پوشش بالا و ماندگاری طولانی.",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
      "https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=800",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
    ],
    specs: [
      { key: "حجم", value: "۶ میلی‌لیتر" },
      { key: "رنگ", value: "Vanilla" },
      { key: "پوشش", value: "متوسط تا کامل" },
      { key: "نوع پوست", value: "همه انواع پوست" },
      { key: "کشور سازنده", value: "فرانسه" },
    ],
  },
  {
    slug: "blush-nars-orgasm",
    title: "رژگونه نارس مدل Orgasm",
    brand: "NARS",
    categorySlug: "blush",
    price: 1980000,
    inStock: true,
    stockCount: 10,
    description:
      "رژگونه Orgasm نارس، افسانه‌ای‌ترین رژگونه دنیا! رنگ صورتی هلویی با ذرات طلایی که به پوست شما درخشش طبیعی می‌دهد. مناسب برای تمام رنگ پوست‌ها.",
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800",
      "https://images.unsplash.com/photo-1583241800698-9c2e5c31c497?w=800",
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800",
    ],
    specs: [
      { key: "وزن", value: "۴.۸ گرم" },
      { key: "رنگ", value: "صورتی هلویی با شیمر طلایی" },
      { key: "نوع", value: "پودری" },
      { key: "کشور سازنده", value: "فرانسه" },
    ],
  },
  {
    slug: "highlighter-fenty-beauty",
    title: "هایلایتر فنتی بیوتی",
    brand: "Fenty Beauty",
    categorySlug: "highlighter",
    price: 2450000,
    discountPrice: 1990000,
    inStock: true,
    stockCount: 20,
    isNew: true,
    description:
      "هایلایتر Killawatt از فنتی بیوتی، برند ریحانا. بافت کرمی-پودری با درخشش خیره‌کننده و بدون گلیتر درشت. مناسب برای هایلایت گونه، بینی و استخوان ابرو.",
    images: [
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800",
      "https://images.unsplash.com/photo-1583241800698-9c2e5c31c497?w=800",
    ],
    specs: [
      { key: "وزن", value: "۷ گرم" },
      { key: "رنگ", value: "طلایی-برنزی" },
      { key: "نوع", value: "پودری-کرمی" },
      { key: "کشور سازنده", value: "آمریکا" },
    ],
  },
];

// ═══════════════════════════════════════════════════
// تابع اصلی seed
// ═══════════════════════════════════════════════════
async function main() {
  console.log("🌱 شروع seed کردن دیتابیس...\n");

  // 1️⃣ ساخت کاربر ادمین
  console.log("👤 ساخت کاربر ادمین...");
  const admin = await prisma.user.upsert({
    where: { phone: "09394606013" },
    update: {},
    create: {
      phone: "09394606013",
      name: "آراد وفایی",
      role: "ADMIN",
    },
  });
  console.log(`✅ کاربر ادمین: ${admin.name} (${admin.phone})\n`);

  // 2️⃣ ساخت دسته‌بندی‌ها
  console.log("🏷️  ساخت دسته‌بندی‌ها...");
  for (const category of categoriesData) {
    const parent = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        emoji: category.emoji,
      },
    });
    console.log(`  ${category.emoji} ${parent.name}`);

    for (const sub of category.subcategories) {
      await prisma.category.upsert({
        where: { slug: sub.slug },
        update: {},
        create: {
          name: sub.name,
          slug: sub.slug,
          parentId: parent.id,
        },
      });
      console.log(`     └─ ${sub.name}`);
    }
  }

  // 3️⃣ ساخت محصولات
  console.log("\n📦 ساخت محصولات...");
  for (const productData of productsData) {
    // پیدا کردن دسته‌بندی از روی slug
    const category = await prisma.category.findUnique({
      where: { slug: productData.categorySlug },
    });

    if (!category) {
      console.log(`⚠️  دسته پیدا نشد: ${productData.categorySlug}`);
      continue;
    }

    // پاک کردن محصول قبلی (اگه بود) و ساخت جدید
    await prisma.product.deleteMany({
      where: { slug: productData.slug },
    });

    const product = await prisma.product.create({
      data: {
        slug: productData.slug,
        title: productData.title,
        brand: productData.brand,
        description: productData.description,
        price: productData.price,
        discountPrice: productData.discountPrice,
        inStock: productData.inStock,
        stockCount: productData.stockCount,
        isNew: productData.isNew ?? false,
        categoryId: category.id,
        images: {
          create: productData.images.map((url, index) => ({
            url,
            order: index,
          })),
        },
        specs: {
          create: productData.specs.map((spec, index) => ({
            key: spec.key,
            value: spec.value,
            order: index,
          })),
        },
      },
    });
    console.log(`  ✓ ${product.title}`);
  }

  console.log("\n✨ Seed با موفقیت تمام شد!");
}

main()
  .catch((e) => {
    console.error("❌ خطا در seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });