import { prisma } from "./prisma";

export async function getSettings() {
  let settings = await prisma.settings.findFirst();

  if (!settings) {
    settings = await prisma.settings.create({
      data: {},
    });
  }

  const sender = settings.ippanelSenderNumber || process.env.IPPANEL_ORIGINATOR || "+983000505";

  return {
    ...settings,
    ippanelApiKey: settings.ippanelApiKey || process.env.IPPANEL_API_KEY || "",
    ippanelPatternCode: settings.ippanelPatternCode || process.env.IPPANEL_PATTERN_CODE || "",
    ippanelSenderNumber: sender,
    ippanelOriginator: sender,
  };
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
    cardNumber: settings.cardNumber,
    cardHolderName: settings.cardHolderName,
    onlinePaymentEnabled: settings.onlinePaymentEnabled ?? false,
  };
}