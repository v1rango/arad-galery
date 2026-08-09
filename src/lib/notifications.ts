import { prisma } from "./prisma";
import { sendEmail, createEmailTemplate } from "./email";

export type NotificationType =
  | "NEW_ORDER"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "PAYMENT_SUCCESS"
  | "NEW_USER";

type CreateNotificationOptions = {
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  sendEmailNotification?: boolean;
  emailActionUrl?: string;
  emailActionText?: string;
};

export async function createNotification({
  type,
  title,
  message,
  data,
  sendEmailNotification = true,
  emailActionUrl,
  emailActionText,
}: CreateNotificationOptions) {
  try {
    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        data: data ? JSON.parse(JSON.stringify(data)) : undefined,
      },
    });

    if (sendEmailNotification) {
      const html = createEmailTemplate(
        title,
        message.replace(/\n/g, "<br/>"),
        emailActionUrl,
        emailActionText
      );

      await sendEmail({
        subject: `${title} | آراد گالری`,
        html,
      });
    }

    return notification;
  } catch (error) {
    console.error("خطا در ایجاد نوتیفیکیشن:", error);
    return null;
  }
}

export async function notifyLowStock(productTitle: string, productId: string, remainingCount: number) {
  return createNotification({
    type: "LOW_STOCK",
    title: "⚠️ موجودی محصول کم شد",
    message: `موجودی محصول "${productTitle}" به ${remainingCount} عدد رسیده است. لطفاً بررسی کنید.`,
    data: { productId, remainingCount },
    emailActionUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/products`,
    emailActionText: "مشاهده در پنل ادمین",
  });
}

export async function notifyOutOfStock(productTitle: string, productId: string) {
  return createNotification({
    type: "OUT_OF_STOCK",
    title: "❌ محصول ناموجود شد",
    message: `محصول "${productTitle}" کاملاً تمام شد و به‌صورت خودکار به حالت ناموجود درآمد.`,
    data: { productId },
    emailActionUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/products`,
    emailActionText: "مشاهده در پنل ادمین",
  });
}

export async function notifyNewOrder(orderId: string, customerName: string, totalAmount: number) {
  return createNotification({
    type: "NEW_ORDER",
    title: "🛒 سفارش جدید ثبت شد",
    message: `${customerName} یک سفارش جدید به مبلغ ${totalAmount.toLocaleString("fa-IR")} تومان ثبت کرد.`,
    data: { orderId, customerName, totalAmount },
    emailActionUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/orders/${orderId}`,
    emailActionText: "مشاهده جزئیات سفارش",
  });
}

export async function notifyNewUser(userName: string, phone: string) {
  return createNotification({
    type: "NEW_USER",
    title: "👤 کاربر جدید ثبت‌نام کرد",
    message: `کاربر جدیدی با شماره ${phone} در سایت ثبت‌نام کرد.`,
    data: { phone, userName },
    sendEmailNotification: false,
  });
}