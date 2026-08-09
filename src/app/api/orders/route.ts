import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/orderHelpers";
import {
  notifyNewOrder,
  notifyLowStock,
  notifyOutOfStock,
} from "@/lib/notifications";

const SHIPPING_COST = 50000;
const FREE_SHIPPING_THRESHOLD = 2000000;
const LOW_STOCK_THRESHOLD = 3;

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
    }: {
      items: CartItemInput[];
      address: AddressInput;
      customerNote?: string;
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

    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const totalAmount = subtotal + shippingCost;

    const result = await prisma.$transaction(async (tx) => {
      const savedAddress = await tx.address.create({
        data: {
          userId: user.id,
          fullName: address.fullName,
          phone: address.phone,
          province: address.province,
          city: address.city,
          address: address.address,
          postalCode: address.postalCode,
        },
      });

      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: user.id,
          addressId: savedAddress.id,
          subtotal,
          shippingCost,
          totalAmount,
          customerNote: customerNote || null,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      const stockUpdates: Array<{
        productId: string;
        title: string;
        newStock: number;
        wasAboveThreshold: boolean;
      }> = [];

      for (const item of items) {
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

      return { order, stockUpdates };
    });

    const customerName = user.name || user.phone;
    await notifyNewOrder(
      result.order.id,
      customerName,
      result.order.totalAmount
    );

    for (const update of result.stockUpdates) {
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

    return NextResponse.json({
      success: true,
      data: {
        orderId: result.order.id,
        orderNumber: result.order.orderNumber,
        totalAmount: result.order.totalAmount,
      },
      message: "سفارش با موفقیت ثبت شد",
    });
  } catch (error) {
    console.error("خطا در ثبت سفارش:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ثبت سفارش" },
      { status: 500 }
    );
  }
}