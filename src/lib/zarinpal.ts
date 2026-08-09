const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || "";
const IS_SANDBOX = process.env.ZARINPAL_SANDBOX === "true";

const BASE_URL = IS_SANDBOX
  ? "https://sandbox.zarinpal.com/pg/v4/payment"
  : "https://payment.zarinpal.com/pg/v4/payment";

const PAYMENT_GATEWAY_URL = IS_SANDBOX
  ? "https://sandbox.zarinpal.com/pg/StartPay"
  : "https://payment.zarinpal.com/pg/StartPay";

type RequestPaymentInput = {
  amount: number;
  description: string;
  callbackUrl: string;
  mobile?: string;
  email?: string;
};

type RequestPaymentResult = {
  success: boolean;
  authority?: string;
  paymentUrl?: string;
  error?: string;
};

export async function requestPayment(input: RequestPaymentInput): Promise<RequestPaymentResult> {
  try {
    const res = await fetch(`${BASE_URL}/request.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        amount: input.amount,
        description: input.description,
        callback_url: input.callbackUrl,
        metadata: {
          mobile: input.mobile,
          email: input.email,
        },
      }),
    });

    const data = await res.json();

    if (data.data && data.data.code === 100 && data.data.authority) {
      return {
        success: true,
        authority: data.data.authority,
        paymentUrl: `${PAYMENT_GATEWAY_URL}/${data.data.authority}`,
      };
    }

    const errorMsg = data.errors?.message || data.data?.message || "خطا در ایجاد درخواست پرداخت";
    return { success: false, error: errorMsg };
  } catch (error) {
    console.error("Zarinpal request error:", error);
    return { success: false, error: "خطا در ارتباط با درگاه پرداخت" };
  }
}

type VerifyPaymentInput = {
  authority: string;
  amount: number;
};

type VerifyPaymentResult = {
  success: boolean;
  refId?: string;
  cardPan?: string;
  error?: string;
};

export async function verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
  try {
    const res = await fetch(`${BASE_URL}/verify.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        authority: input.authority,
        amount: input.amount,
      }),
    });

    const data = await res.json();

    if (data.data && (data.data.code === 100 || data.data.code === 101)) {
      return {
        success: true,
        refId: data.data.ref_id?.toString(),
        cardPan: data.data.card_pan,
      };
    }

    const errorMsg = data.errors?.message || data.data?.message || "پرداخت تایید نشد";
    return { success: false, error: errorMsg };
  } catch (error) {
    console.error("Zarinpal verify error:", error);
    return { success: false, error: "خطا در تایید پرداخت" };
  }
}