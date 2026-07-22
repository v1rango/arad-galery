export type Subcategory = {
  name: string;
  slug: string;
};

export type Category = {
  name: string;
  slug: string;
  emoji: string;
  subcategories?: Subcategory[];
};

export const categories: Category[] = [
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
  },
  {
    name: "عطر و ادکلن",
    slug: "perfume",
    emoji: "🌸",
  },
  {
    name: "ابزار آرایشی",
    slug: "tools",
    emoji: "🖌️",
  },
];