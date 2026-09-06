import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "لطفاً وارد شوید" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("receipt") as File | null;
    const orderId = formData.get("orderId") as string | null;

    if (!file || !orderId) {
      return NextResponse.json(
        { success: false, error: "فایل و شناسه سفارش الزامی است" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "فقط فایل تصویری مجاز است" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "حجم فایل نباید بیشتر از ۵ مگابایت باشد" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "سفارش یافت نشد" },
        { status: 404 }
      );
    }

    if (order.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    if (order.paymentMethod !== "CARD_TO_CARD") {
      return NextResponse.json(
        { success: false, error: "این سفارش کارت به کارت نیست" },
        { status: 400 }
      );
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { success: false, error: "این سفارش قبلاً پرداخت شده است" },
        { status: 400 }
      );
    }

    // ذخیره فایل
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `receipt-${order.orderNumber}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "receipts");

    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const receiptImageUrl = `/uploads/receipts/${filename}`;

    // اگر توکن نداشت، بساز
    let receiptToken = order.receiptToken;
    if (!receiptToken) {
      receiptToken = randomBytes(32).toString("hex");
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        receiptImageUrl,
        receiptToken,
        paymentStatus: "AWAITING_RECEIPT",
      },
    });

    // ارسال ایمیل به ادمین
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const approveUrl = `${appUrl}/api/payment/card-to-card/action?token=${receiptToken}&action=approve`;
    const rejectUrl = `${appUrl}/api/payment/card-to-card/action?token=${receiptToken}&action=reject`;

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Tahoma, Arial, sans-serif; background: #f5f5f5; padding: 20px; margin: 0; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; color: #333; line-height: 1.8; }
            .info { background: #f9fafb; border-right: 4px solid #7c3aed; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .btn { display: inline-block; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: bold; margin: 8px 6px; color: white !important; }
            .btn-approve { background: #16a34a; }
            .btn-reject { background: #dc2626; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #666; font-size: 12px; }
            img.receipt { max-width: 100%; border-radius: 12px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧾 رسید پرداخت جدید</h1>
            </div>
            <div class="content">
              <div class="info">
                <p><strong>شماره سفارش:</strong> ${order.orderNumber}</p>
                <p><strong>مبلغ:</strong> ${order.totalAmount.toLocaleString("fa-IR")} تومان</p>
                <p><strong>نام گیرنده:</strong> ${order.shippingFullName}</p>
                <p><strong>شماره تماس:</strong> ${order.shippingPhone}</p>
              </div>

              <p>تصویر رسید پرداخت:</p>
              <img class="receipt" src="${appUrl}${receiptImageUrl}" alt="رسید پرداخت" />

              <div style="text-align: center; margin-top: 30px;">
                <a href="${approveUrl}" class="btn btn-approve">✅ تایید رسید</a>
                <a href="${rejectUrl}" class="btn btn-reject">❌ رد رسید</a>
              </div>
            </div>
            <div class="footer">
              <p>این ایمیل به‌صورت خودکار از سیستم آراد گالری ارسال شده است</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      subject: `🧾 رسید پرداخت سفارش ${order.orderNumber}`,
      html,
    });

    return NextResponse.json({
      success: true,
      data: { receiptImageUrl },
      message: "رسید با موفقیت ارسال شد",
    });
  } catch (error) {
    console.error("Upload receipt error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در آپلود رسید" },
      { status: 500 }
    );
  }
}