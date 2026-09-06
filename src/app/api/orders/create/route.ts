import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/orderHelpers";
import { getSettings } from "@/lib/settings";
import { requestPayment } from "@/lib/zarinpal";
import { notifyNewOrder } from "@/lib/notifications";
import { randomBytes } from "crypto";

type CartItemInput = {
  productId: string;
  quantity: number;
};

type AddressInput = {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
};

export async function POST(request: NextRequest) {
  try {
    const settings = await getSettings();
    const SHIPPING_COST = settings.shippingCost;
    const FREE_SHIPPING_THRESHOLD = settings.freeShippingThreshold;

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "برای ثبت سفارش باید وارد شوید" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      items,
      address,
      customerNote,
      couponCode,
      paymentMethod = "ONLINE",
    }: {
      items: CartItemInput[];
      address: AddressInput;
      customerNote?: string;
      couponCode?: string;
      paymentMethod?: "ONLINE" | "CARD_TO_CARD";
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "سبد خرید خالی است" },
        { status: 400 }
      );
    }

    if (
      !address ||
      !address.fullName ||
      !address.phone ||
      !address.province ||
      !address.city ||
      !address.address ||
      !address.postalCode
    ) {
      return NextResponse.json(
        { success: false, error: "اطلاعات آدرس ناقص است" },
        { status: 400 }
      );
    }

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { success: false, error: "برخی محصولات دیگر موجود نیستند" },
        { status: 400 }
      );
    }

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;

      if (!product.inStock || product.stockCount < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `موجودی "${product.title}" کافی نیست (موجود: ${product.stockCount})`,
          },
          { status: 400 }
        );
      }
    }

    let subtotal = 0;
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const price = product.discountPrice ?? product.price;
      const totalPrice = price * item.quantity;
      subtotal += totalPrice;

      return {
        productId: product.id,
        productTitle: product.title,
        productBrand: product.brand,
        productImage: product.images[0]?.url || null,
        price: product.price,
        discountPrice: product.discountPrice,
        quantity: item.quantity,
        totalPrice,
      };
    });

    let discountAmount = 0;
    let validCouponId: string | null = null;
    let validCouponCode: string | null = null;

    if (couponCode && couponCode.trim()) {
      const normalizedCode = couponCode.trim().toUpperCase();
      const coupon = await prisma.coupon.findUnique({
        where: { code: normalizedCode },
      });

      if (!coupon) {
        return NextResponse.json(
          { success: false, error: "کد تخفیف نامعتبر است" },
          { status: 400 }
        );
      }

      if (!coupon.isActive) {
        return NextResponse.json(
          { success: false, error: "این کد تخفیف غیرفعال است" },
          { status: 400 }
        );
      }

      const now = new Date();

      if (coupon.startsAt > now) {
        return NextResponse.json(
          { success: false, error: "این کد تخفیف هنوز فعال نشده است" },
          { status: 400 }
        );
      }

      if (coupon.expiresAt && coupon.expiresAt < now) {
        return NextResponse.json(
          { success: false, error: "این کد تخفیف منقضی شده است" },
          { status: 400 }
        );
      }

      if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
        return NextResponse.json(
          { success: false, error: "ظرفیت این کد تخفیف به پایان رسیده" },
          { status: 400 }
        );
      }

      const userUsageCount = await prisma.couponUsage.count({
        where: {
          couponId: coupon.id,
          userId: user.id,
        },
      });

      if (userUsageCount >= coupon.perUserLimit) {
        return NextResponse.json(
          { success: false, error: "شما قبلاً از این کد تخفیف استفاده کرده‌اید" },
          { status: 400 }
        );
      }

      if (subtotal < coupon.minOrderAmount) {
        return NextResponse.json(
          {
            success: false,
            error: `حداقل مبلغ سفارش برای این کد ${coupon.minOrderAmount.toLocaleString("fa-IR")} تومان است`,
          },
          { status: 400 }
        );
      }

      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = Math.floor((subtotal * coupon.discountValue) / 100);
        if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
          discountAmount = coupon.maxDiscountAmount;
        }
      } else {
        discountAmount = coupon.discountValue;
        if (discountAmount > subtotal) {
          discountAmount = subtotal;
        }
      }

      validCouponId = coupon.id;
      validCouponCode = coupon.code;
    }

    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost);

    const isCardToCard = paymentMethod === "CARD_TO_CARD";
    const receiptToken = isCardToCard ? randomBytes(32).toString("hex") : null;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user.id,
        shippingFullName: address.fullName,
        shippingPhone: address.phone,
        shippingProvince: address.province,
        shippingCity: address.city,
        shippingAddress: address.address,
        shippingPostalCode: address.postalCode,
        subtotal,
        shippingCost,
        discountAmount,
        totalAmount,
        couponCode: validCouponCode,
        couponId: validCouponId,
        customerNote: customerNote || null,
        paymentMethod: isCardToCard ? "CARD_TO_CARD" : "ONLINE",
        paymentStatus: isCardToCard ? "AWAITING_RECEIPT" : "PENDING",
        receiptToken,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    const customerName = user.name || user.phone;
    await notifyNewOrder(order.id, customerName, order.totalAmount);

    // ——— کارت به کارت ———
    if (isCardToCard) {
      return NextResponse.json({
        success: true,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          paymentMethod: "CARD_TO_CARD",
        },
        message: "سفارش ثبت شد. لطفاً رسید پرداخت را ارسال کنید",
      });
    }

    // ——— پرداخت آنلاین (زرین‌پال) ———
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${appUrl}/api/payment/callback?orderId=${order.id}`;

    const paymentAmount = order.totalAmount * 10;

    const paymentRequest = await requestPayment({
      amount: paymentAmount,
      description: `پرداخت سفارش ${order.orderNumber}`,
      callbackUrl,
      mobile: user.phone,
    });

    if (paymentRequest.success && paymentRequest.authority) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentRef: paymentRequest.authority },
      });

      return NextResponse.json({
        success: true,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          paymentUrl: paymentRequest.paymentUrl,
          paymentMethod: "ONLINE",
        },
        message: "در حال انتقال به درگاه پرداخت",
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        paymentError: paymentRequest.error,
        paymentMethod: "ONLINE",
      },
      message: "سفارش ثبت شد ولی خطا در اتصال به درگاه پرداخت",
    });
  } catch (error) {
    console.error("خطا در ثبت سفارش:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ثبت سفارش" },
      { status: 500 }
    );
  }
}