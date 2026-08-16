import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { getSettings } from "@/lib/settings";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const settings = await getSettings();
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const {
      shippingCost,
      freeShippingThreshold,
      lowStockThreshold,
      storeName,
      storePhone,
      storePhone2,
      storeAddress,
      instagramHandle,
      telegramHandle,
      whatsappNumber,
      workingHours,
      smsEnabled,
      smsProvider,
      smsApiKey,
      smsTemplateId,
      kavenegarApiKey,
      kavenegarSenderNumber,
    } = body;

    const current = await getSettings();

    const updated = await prisma.settings.update({
      where: { id: current.id },
      data: {
        shippingCost: parseInt(shippingCost) || 0,
        freeShippingThreshold: parseInt(freeShippingThreshold) || 0,
        lowStockThreshold: parseInt(lowStockThreshold) || 3,
        storeName: storeName?.trim() || "آراد گالری",
        storePhone: storePhone?.trim() || "",
        storePhone2: storePhone2?.trim() || null,
        storeAddress: storeAddress?.trim() || "",
        instagramHandle: instagramHandle?.trim() || null,
        telegramHandle: telegramHandle?.trim() || null,
        whatsappNumber: whatsappNumber?.trim() || null,
        workingHours: workingHours?.trim() || "",
        smsEnabled: !!smsEnabled,
        smsProvider: smsProvider?.trim() || "smsir",
        smsApiKey: smsApiKey?.trim() || null,
        smsTemplateId: smsTemplateId?.trim() || null,
        kavenegarApiKey: kavenegarApiKey?.trim() || null,
        kavenegarSenderNumber: kavenegarSenderNumber?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "تنظیمات ذخیره شد",
    });
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ذخیره تنظیمات" },
      { status: 500 }
    );
  }
}