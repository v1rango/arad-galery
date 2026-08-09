import { NextResponse } from "next/server";
import { getCurrentUser } from "./auth";

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, error: "احراز هویت نشده" },
        { status: 401 }
      ),
      user: null,
    };
  }

  if (user.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز" },
        { status: 403 }
      ),
      user: null,
    };
  }

  return { error: null, user };
}