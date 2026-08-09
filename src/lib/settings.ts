import { prisma } from "./prisma";

export async function getSettings() {
  let settings = await prisma.settings.findFirst();

  if (!settings) {
    settings = await prisma.settings.create({
      data: {},
    });
  }

  return settings;
}

export async function getPublicSettings() {
  const settings = await getSettings();

  return {
    shippingCost: settings.shippingCost,
    freeShippingThreshold: settings.freeShippingThreshold,
    storeName: settings.storeName,
    storePhone: settings.storePhone,
    storePhone2: settings.storePhone2,
    storeAddress: settings.storeAddress,
    instagramHandle: settings.instagramHandle,
    telegramHandle: settings.telegramHandle,
    whatsappNumber: settings.whatsappNumber,
    workingHours: settings.workingHours,
  };
}