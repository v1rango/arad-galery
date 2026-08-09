import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth";

export async function POST() {
  try {
    await removeAuthCookie();
    return NextResponse.json({
      success: true,
      message: "با موفقیت خارج شدید",
    });
  } catch (error) {
    console.error("خطا در خروج:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}