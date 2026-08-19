import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP } from "@/lib/auth";
import { sendOtpSms } from "@/lib/sms";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const OTP_EXPIRY_MINUTES = 2;
const RESEND_COOLDOWN_SECONDS = 30;

const IP_MAX_REQUESTS = 5;
const IP_WINDOW_MS = 60 * 60 * 1000;

const PHONE_MAX_REQUESTS = 3;
const PHONE_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const ipLimit = await rateLimit(`otp:ip:${ip}`, IP_MAX_REQUESTS, IP_WINDOW_MS);

    if (!ipLimit.success) {
      const minutes = Math.ceil(ipLimit.resetIn / 60000);
      return NextResponse.json(
        {
          success: false,
          error: `تعداد درخواست‌های شما زیاد است. ${minutes} دقیقه دیگر تلاش کنید`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { phone } = body;

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { success: false, error: "شماره موبایل الزامی است" },
        { status: 400 }
      );
    }

    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, error: "شماره موبایل معتبر نیست" },
        { status: 400 }
      );
    }
      const phoneLimit = await rateLimit(
      `otp:phone:${phone}`,
      PHONE_MAX_REQUESTS,
      PHONE_WINDOW_MS
    );

    if (!phoneLimit.success) {
      const minutes = Math.ceil(phoneLimit.resetIn / 60000);
      return NextResponse.json(
        {
          success: false,
          error: `این شماره در ۱۵ دقیقه گذشته چند بار درخواست داده. ${minutes} دقیقه دیگر تلاش کنید`,
        },
        { status: 429 }
      );
    }

    const cooldownAgo = new Date(Date.now() - RESEND_COOLDOWN_SECONDS * 1000);
    const recentCode = await prisma.verificationCode.findFirst({
      where: {
        phone,
        createdAt: { gte: cooldownAgo },
      },
      orderBy: { createdAt: "desc" },
    });

    if (recentCode) {
      const secondsLeft = Math.ceil(
        (recentCode.createdAt.getTime() + RESEND_COOLDOWN_SECONDS * 1000 - Date.now()) / 1000
      );
      return NextResponse.json(
        {
          success: false,
          error: `لطفاً ${secondsLeft} ثانیه دیگر تلاش کنید`,
          secondsLeft,
        },
        { status: 429 }
      );
    }

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.verificationCode.create({
      data: {
        phone,
        code,
        expiresAt,
      },
    });

    const smsResult = await sendOtpSms({ phone, code });

    if (!smsResult.success && !smsResult.logged) {
      return NextResponse.json(
        {
          success: false,
          error: smsResult.error || "خطا در ارسال پیامک",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "کد تایید ارسال شد",
      expiresInMinutes: OTP_EXPIRY_MINUTES,
    });
  } catch (error) {
    console.error("خطا در ارسال کد:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ارسال کد" },
      { status: 500 }
    );
  }
}