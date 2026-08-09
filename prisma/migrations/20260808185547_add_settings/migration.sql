-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "shippingCost" INTEGER NOT NULL DEFAULT 50000,
    "freeShippingThreshold" INTEGER NOT NULL DEFAULT 2000000,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 3,
    "storeName" TEXT NOT NULL DEFAULT 'آراد گالری',
    "storePhone" TEXT NOT NULL DEFAULT '09395574472',
    "storePhone2" TEXT,
    "storeAddress" TEXT NOT NULL DEFAULT 'تهران، منطقه ۲۱، شهرک چیتگر شمالی، خیابان جهاد، نبش کوچه صفین',
    "instagramHandle" TEXT,
    "telegramHandle" TEXT,
    "whatsappNumber" TEXT,
    "workingHours" TEXT NOT NULL DEFAULT 'شنبه تا پنجشنبه: ۹:۰۰ تا ۲۱:۰۰',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
