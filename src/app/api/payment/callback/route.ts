import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPayment } from "@/lib/zarinpal";
import { getSettings } from "@/lib/settings";
import {
  notifyLowStock,
  notifyOutOfStock,
} from "@/lib/notifications";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");
  const orderId = searchParams.get("orderId");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!authority || !orderId) {
    return NextResponse.redirect(
      `${appUrl}/checkout/failed?reason=invalid_callback`
    );
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.redirect(
        `${appUrl}/checkout/failed?reason=order_not_found`
      );
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.redirect(
        `${appUrl}/checkout/success?order=${order.orderNumber}`
      );
    }

    if (status !== "OK") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "FAILED",
          status: "CANCELLED",
        },
      });

      return NextResponse.redirect(
        `${appUrl}/checkout/failed?reason=user_cancelled&order=${order.orderNumber}`
      );
    }

    const paymentAmount = order.totalAmount * 10;
    const verifyResult = await verifyPayment({
      authority,
      amount: paymentAmount,
    });

    if (!verifyResult.success) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "FAILED",
        },
      });

      return NextResponse.redirect(
        `${appUrl}/checkout/failed?reason=verify_failed&order=${order.orderNumber}`
      );
    }

    const settings = await getSettings();
    const LOW_STOCK_THRESHOLD = settings.lowStockThreshold;

    const productIds = order.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const insufficientItems: string[] = [];
    for (const item of order.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        insufficientItems.push(item.productTitle);
        continue;
      }
      if (!product.inStock || product.stockCount < item.quantity) {
        insufficientItems.push(product.title);
      }
    }

    if (insufficientItems.length > 0) {
      console.error(
        `⚠️ پرداخت موفق اما موجودی ناکافی برای سفارش ${order.orderNumber}:`,
        insufficientItems
      );

      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
          paymentRef: verifyResult.refId || authority,
          adminNote: `⚠️ نیاز به بررسی: موجودی ناکافی برای: ${insufficientItems.join(", ")}. نیاز به refund یا هماهنگی با مشتری.`,
        },
      });

      if (order.couponId) {
        await prisma.$transaction([
          prisma.couponUsage.create({
            data: {
              couponId: order.couponId,
              userId: order.userId,
              orderId: order.id,
            },
          }),
          prisma.coupon.update({
            where: { id: order.couponId },
            data: { usageCount: { increment: 1 } },
          }),
        ]);
      }

      return NextResponse.redirect(
        `${appUrl}/checkout/success?order=${order.orderNumber}&ref=${verifyResult.refId || ""}&warning=stock`
      );
    }

    const stockUpdates: Array<{
      productId: string;
      title: string;
      newStock: number;
      wasAboveThreshold: boolean;
    }> = [];

    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        const product = products.find((p) => p.id === item.productId)!;
        const newStock = product.stockCount - item.quantity;

        await tx.product.update({
          where: { id: product.id },
          data: {
            stockCount: newStock,
            inStock: newStock > 0,
          },
        });

        stockUpdates.push({
          productId: product.id,
          title: product.title,
          newStock,
          wasAboveThreshold: product.stockCount > LOW_STOCK_THRESHOLD,
        });
      }

      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
          paymentRef: verifyResult.refId || authority,
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

    for (const update of stockUpdates) {
      if (update.newStock === 0) {
        await notifyOutOfStock(update.title, update.productId);
      } else if (
        update.newStock > 0 &&
        update.newStock <= LOW_STOCK_THRESHOLD &&
        update.wasAboveThreshold
      ) {
        await notifyLowStock(
          update.title,
          update.productId,
          update.newStock
        );
      }
    }

    return NextResponse.redirect(
      `${appUrl}/checkout/success?order=${order.orderNumber}&ref=${verifyResult.refId || ""}`
    );
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      `${appUrl}/checkout/failed?reason=server_error`
    );
  }
}