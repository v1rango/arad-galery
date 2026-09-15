import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { requireAdmin } from "@/lib/adminAuth";
import {
  notifyLowStock,
  notifyOutOfStock,
} from "@/lib/notifications";
import { sendOrderApprovedCustomerSms } from "@/lib/sms";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const orderId = searchParams.get("orderId");
  const action = searchParams.get("action"); // "approve" | "reject"
  const wantsJson = request.headers.get("accept")?.includes("application/json");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if ((!token && !orderId) || !action || !["approve", "reject"].includes(action)) {
    if (wantsJson) {
      return NextResponse.json(
        { success: false, error: "پارامترهای درخواست نامعتبر است" },
        { status: 400 }
      );
    }
    return NextResponse.redirect(
      `${appUrl}/checkout/failed?reason=invalid_action`
    );
  }

  try {
    let order = null;
    if (token) {
      order = await prisma.order.findUnique({
        where: { receiptToken: token },
        include: { items: true },
      });
    } else if (orderId) {
      const auth = await requireAdmin();
      if (auth.error) return auth.error;
      order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
    }

    if (!order) {
      if (wantsJson) {
        return NextResponse.json(
          { success: false, error: "سفارش یافت نشد یا لینک منقضی شده است" },
          { status: 404 }
        );
      }
      return new NextResponse(
        generateHtml(
          "خطا",
          "سفارش یافت نشد یا لینک منقضی شده است.",
          false
        ),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (order.paymentStatus === "PAID") {
      if (wantsJson) {
        return NextResponse.json(
          { success: false, error: `سفارش ${order.orderNumber} قبلاً تایید و پرداخت شده است` },
          { status: 400 }
        );
      }
      return new NextResponse(
        generateHtml(
          "قبلاً تایید شده",
          `سفارش ${order.orderNumber} قبلاً تایید و پرداخت شده است.`,
          true
        ),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (order.paymentStatus === "FAILED") {
      if (wantsJson) {
        return NextResponse.json(
          { success: false, error: `رسید سفارش ${order.orderNumber} قبلاً رد شده است` },
          { status: 400 }
        );
      }
      return new NextResponse(
        generateHtml(
          "قبلاً رد شده",
          `رسید سفارش ${order.orderNumber} قبلاً رد شده است.`,
          false
        ),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // ——— رد رسید ———
    if (action === "reject") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "FAILED",
          status: "CANCELLED",
        },
      });

      if (wantsJson) {
        return NextResponse.json({
          success: true,
          message: `رسید سفارش ${order.orderNumber} رد شد`,
        });
      }

      return new NextResponse(
        generateHtml(
          "رسید رد شد",
          `رسید سفارش ${order.orderNumber} با موفقیت رد شد. به کاربر پیام عدم تایید نمایش داده خواهد شد.`,
          false
        ),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // ——— تایید رسید ———
    const settings = await getSettings();
    const LOW_STOCK_THRESHOLD = settings.lowStockThreshold;

    const productIds = order.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true },
    });

    const stockUpdates: Array<{
      productId: string;
      title: string;
      newStock: number;
      wasAboveThreshold: boolean;
    }> = [];

    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) continue;

        if (item.variantId) {
          const variant = product.variants.find((v) => v.id === item.variantId);
          if (variant) {
            const newVariantStock = Math.max(0, variant.stockCount - item.quantity);
            await tx.productVariant.update({
              where: { id: variant.id },
              data: {
                stockCount: newVariantStock,
                inStock: newVariantStock > 0,
              },
            });
          }
        }

        const newStock = Math.max(0, product.stockCount - item.quantity);

        await tx.product.update({
          where: { id: product.id },
          data: {
            stockCount: newStock,
            inStock: newStock > 0,
          },
        });

        stockUpdates.push({
          productId: product.id,
          title: item.variantTitle
            ? `${product.title} (${item.variantTitle})`
            : product.title,
          newStock,
          wasAboveThreshold: product.stockCount > LOW_STOCK_THRESHOLD,
        });
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
        },
      });

      if (order.couponId) {
        await tx.couponUsage.create({
          data: {
            couponId: order.couponId,
            userId: order.userId,
            orderId: order.id,
          },
        });

        await tx.coupon.update({
          where: { id: order.couponId },
          data: { usageCount: { increment: 1 } },
        });
      }
    });

    // نوتیفیکیشن موجودی
    for (const update of stockUpdates) {
      if (update.newStock === 0) {
        await notifyOutOfStock(update.title, update.productId);
      } else if (
        update.newStock > 0 &&
        update.newStock <= LOW_STOCK_THRESHOLD &&
        update.wasAboveThreshold
      ) {
        await notifyLowStock(update.title, update.productId, update.newStock);
      }
    }

    // ارسال پیامک تایید سفارش به مشتری
    try {
      const customerPhone = order.shippingPhone;
      if (customerPhone) {
        const itemLines = order.items.map((item) => {
          const title = item.variantTitle
            ? `${item.productTitle} (${item.variantTitle})`
            : item.productTitle;
          return `${title} (${item.quantity} عدد)`;
        });
        const itemsSummary = itemLines.join("، ");

        await sendOrderApprovedCustomerSms({
          phone: customerPhone,
          orderNumber: order.orderNumber,
          itemsSummary,
        });
      }
    } catch (smsErr) {
      console.error("Failed to send customer approval SMS:", smsErr);
    }

    if (wantsJson) {
      return NextResponse.json({
        success: true,
        message: `پرداخت سفارش ${order.orderNumber} با موفقیت تایید شد`,
      });
    }

    return new NextResponse(
      generateHtml(
        "رسید تایید شد ✅",
        `پرداخت سفارش ${order.orderNumber} با موفقیت تایید شد و وضعیت سفارش به «در حال پردازش» تغییر کرد.`,
        true
      ),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (error) {
    console.error("Card-to-card action error:", error);
    if (wantsJson) {
      return NextResponse.json(
        { success: false, error: "خطا در پردازش درخواست" },
        { status: 500 }
      );
    }
    return new NextResponse(
      generateHtml("خطای سرور", "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.", false),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}

function generateHtml(title: string, message: string, success: boolean) {
  const color = success ? "#16a34a" : "#dc2626";
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} | آراد گالری</title>
        <style>
          body {
            font-family: Tahoma, Arial, sans-serif;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
          }
          .card {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            max-width: 420px;
            width: 100%;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          }
          .icon {
            font-size: 48px;
            margin-bottom: 16px;
          }
          h1 {
            color: ${color};
            font-size: 22px;
            margin: 0 0 12px;
          }
          p {
            color: #555;
            line-height: 1.8;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">${success ? "✅" : "❌"}</div>
          <h1>${title}</h1>
          <p>${message}</p>
        </div>
      </body>
    </html>
  `;
}