import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { sendOrderApprovedCustomerSms } from "@/lib/sms";

const VALID_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status, adminNote } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: "وضعیت نامعتبر" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) {
      return NextResponse.json(
        { success: false, error: "سفارش پیدا نشد" },
        { status: 404 }
      );
    }

    const isApprovingCardToCard =
      order.paymentMethod === "CARD_TO_CARD" &&
      order.paymentStatus !== "PAID" &&
      (status === "PROCESSING" || status === "SHIPPED" || status === "DELIVERED");

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: status as never,
        adminNote: adminNote !== undefined ? adminNote : order.adminNote,
        ...(isApprovingCardToCard ? { paymentStatus: "PAID" } : {}),
      },
      include: { items: true },
    });

    if (isApprovingCardToCard && updated.shippingPhone) {
      try {
        const itemLines = updated.items.map((item) => {
          const title = item.variantTitle
            ? `${item.productTitle} (${item.variantTitle})`
            : item.productTitle;
          return `${title} (${item.quantity} عدد)`;
        });
        const itemsSummary = itemLines.join("، ");

        await sendOrderApprovedCustomerSms({
          phone: updated.shippingPhone,
          orderNumber: updated.orderNumber,
          itemsSummary,
        });
      } catch (smsErr) {
        console.error("Failed to send customer approval SMS from status change:", smsErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "وضعیت سفارش به‌روزرسانی شد",
    });
  } catch (error) {
    console.error("خطا در تغییر وضعیت:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}