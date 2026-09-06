import { NextResponse } from "next/server";
import { getPublicSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getPublicSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    console.error("خطا در دریافت تنظیمات عمومی:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت تنظیمات" },
      { status: 500 }
    );
  }
}