import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPayment } from "@/lib/zarinpal";

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

    if (verifyResult.success) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
          paymentRef: verifyResult.refId || authority,
        },
      });

      return NextResponse.redirect(
        `${appUrl}/checkout/success?order=${order.orderNumber}&ref=${verifyResult.refId || ""}`
      );
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "FAILED",
      },
    });

    return NextResponse.redirect(
      `${appUrl}/checkout/failed?reason=verify_failed&order=${order.orderNumber}`
    );
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      `${appUrl}/checkout/failed?reason=server_error`
    );
  }
}