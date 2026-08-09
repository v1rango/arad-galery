import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createToken, setAuthCookie } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const ipLimit = rateLimit(`verify:ip:${ip}`, 10, 15 * 60 * 1000);

    if (!ipLimit.success) {
      const minutes = Math.ceil(ipLimit.resetIn / 60000);
      return NextResponse.json(
        {
          success: false,
          error: `تلاش‌های زیاد. ${minutes} دقیقه دیگر تلاش کنید`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: "شماره و کد الزامی است" },
        { status: 400 }
      );
    }

    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        phone,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!verificationCode) {
      return NextResponse.json(
        { success: false, error: "کد نامعتبر یا منقضی شده است" },
        { status: 400 }
      );
    }

    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { used: true },
    });

    let user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          role: "USER",
        },
      });
    }

    const token = createToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: "با موفقیت وارد شدید",
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("خطا در تایید کد:", error);
    return NextResponse.json(
      { success: false, error: "خطا در تایید کد" },
      { status: 500 }
    );
  }
}