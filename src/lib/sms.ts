import { getSettings } from "./settings";

type SendOtpParams = {
  phone: string;
  code: string;
};

type SendSmsResult = {
  success: boolean;
  error?: string;
  logged?: boolean;
};

const ADMIN_PHONES_FOR_LOG = [
  "09394606013",
  "09129367584",
  "09395574472",
  "09039948453",
];

function normalizePhone(phone: string): string {
  let normalized = phone.trim().replace(/\s+/g, "");
  if (normalized.startsWith("+98")) {
    normalized = "0" + normalized.slice(3);
  } else if (normalized.startsWith("98") && normalized.length === 12) {
    normalized = "0" + normalized.slice(2);
  }
  return normalized;
}

function isAdminPhone(phone: string): boolean {
  return ADMIN_PHONES_FOR_LOG.includes(normalizePhone(phone));
}

async function sendPatternViaPanelchi({
  phone,
  patternCode,
  variables,
  apiKey,
  customSourceNumber,
}: {
  phone: string;
  patternCode: string;
  variables: Record<string, string | number>;
  apiKey: string;
  customSourceNumber?: string | null;
}): Promise<SendSmsResult> {
  try {
    const normalizedPhone = normalizePhone(phone);
    const recipient = "+98" + normalizedPhone.slice(1);
    const cleanApiKey = apiKey.trim().replace(/^Bearer\s+/i, "");
    const cleanPatternCode = patternCode.trim();
    const sourceNumber = (customSourceNumber || "10001").trim();

    const formattedVariables: Record<string, string> = {};
    for (const [k, v] of Object.entries(variables)) {
      formattedVariables[k] = v !== undefined && v !== null ? v.toString() : "";
    }

    console.log(`📡 [Panelchi API] ارسال پترن ${cleanPatternCode} به ${recipient} از خط ${sourceNumber}`);

    const response = await fetch("https://api.panelchi.com/sms/pattern", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cleanApiKey}`,
      },
      body: JSON.stringify({
        pattern: cleanPatternCode,
        variables: formattedVariables,
        recipient: recipient,
        sourceNumber: sourceNumber,
      }),
    });

    const responseText = await response.text();
    let data: any = {};
    try { data = JSON.parse(responseText); } catch {}

    if (response.ok || response.status === 201 || data?.status === "CREATED") {
      console.log(`✅ [Panelchi API] پیامک با موفقیت به ${recipient} ارسال شد.`);
      return { success: true };
    }

    console.error("❌ خطای ارسال پیامک پنل‌چی:", responseText);
    return { success: false, error: responseText };
  } catch (err: any) {
    console.error("❌ خطای شبکه ارسال پیامک:", err.message);
    return { success: false, error: err.message };
  }
}

export async function sendOtpSms({ phone, code }: SendOtpParams): Promise<SendSmsResult> {
  const settings = await getSettings();

  const apiKey = (settings.ippanelApiKey || process.env.IPPANEL_API_KEY || "").trim();
  const patternCode = (settings.ippanelPatternCode || process.env.IPPANEL_PATTERN_CODE || "46qd0").trim();
  const originator = (settings.ippanelSenderNumber || settings.ippanelOriginator || process.env.IPPANEL_ORIGINATOR || "10001").trim();

  const hasConfig = !!(apiKey && patternCode);

  if (process.env.NODE_ENV === "development") {
    console.log(`📱 [DEV] OTP ${phone}: ${code}`);
  }

  if (process.env.NODE_ENV === "production" && isAdminPhone(phone)) {
    console.log(`🔐 [ADMIN] OTP ${phone}: ${code}`);
  }

  if (!settings.smsEnabled || !hasConfig) {
    return { success: true, logged: true };
  }

  return sendPatternViaPanelchi({
    phone,
    patternCode,
    variables: { code },
    apiKey,
    customSourceNumber: originator,
  });
}

// شماره مادر گرامی جهت دریافت پیامک اطلاع‌رسانی سفارش جدید
export const ADMIN_NOTIF_PHONE = "09129367584";
export const PATTERN_NEW_ORDER_ADMIN = "v2ej6";
export const PATTERN_ORDER_APPROVED_CUSTOMER = "fmulg";

/**
 * ارسال پیامک به مادر برای سفارش جدید کارت‌به‌کارت (پترن v2ej6)
 */
export async function sendNewOrderAdminSms({
  orderNumber,
}: {
  orderNumber: string;
}): Promise<SendSmsResult> {
  const settings = await getSettings();
  const apiKey = (settings.ippanelApiKey || process.env.IPPANEL_API_KEY || "").trim();
  const originator = (settings.ippanelSenderNumber || settings.ippanelOriginator || process.env.IPPANEL_ORIGINATOR || "10001").trim();

  if (!apiKey) {
    console.warn("⚠️ تنظیمات سامانه پیامک موجود نیست، پیامک به ادمین ارسال نشد");
    return { success: false, error: "SMS API Key missing" };
  }

  const numericOrderId = orderNumber.replace(/\D/g, "") || orderNumber;

  console.log(`📱 در حال ارسال پیامک سفارش جدید (${orderNumber} -> ${numericOrderId}) به ادمین (${ADMIN_NOTIF_PHONE})...`);

  return sendPatternViaPanelchi({
    phone: ADMIN_NOTIF_PHONE,
    patternCode: PATTERN_NEW_ORDER_ADMIN,
    variables: {
      orderId: numericOrderId,
    },
    apiKey,
    customSourceNumber: originator,
  });
}

/**
 * ارسال پیامک تایید سفارش به مشتری با جزئیات اقلام و قیمت (پترن fmulg)
 */
export async function sendOrderApprovedCustomerSms({
  phone,
  orderNumber,
  itemsSummary,
}: {
  phone: string;
  orderNumber: string;
  itemsSummary: string;
}): Promise<SendSmsResult> {
  const settings = await getSettings();
  const apiKey = (settings.ippanelApiKey || process.env.IPPANEL_API_KEY || "").trim();
  const originator = (settings.ippanelSenderNumber || settings.ippanelOriginator || process.env.IPPANEL_ORIGINATOR || "10001").trim();

  if (!apiKey) {
    console.warn("⚠️ تنظیمات سامانه پیامک موجود نیست، پیامک تایید به مشتری ارسال نشد");
    return { success: false, error: "SMS API Key missing" };
  }

  const numericOrderId = orderNumber.replace(/\D/g, "") || orderNumber;

  console.log(`📱 در حال ارسال پیامک تایید سفارش (${orderNumber} -> ${numericOrderId}) به مشتری (${phone})...`);

  return sendPatternViaPanelchi({
    phone,
    patternCode: PATTERN_ORDER_APPROVED_CUSTOMER,
    variables: {
      items: itemsSummary,
      orderId: numericOrderId,
    },
    apiKey,
    customSourceNumber: originator,
  });
}