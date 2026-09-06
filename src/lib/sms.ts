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

async function sendViaPanelchi(
  phone: string,
  code: string,
  apiKey: string,
  patternCode: string,
  customSourceNumber?: string | null
): Promise<SendSmsResult> {
  try {
    const normalizedPhone = normalizePhone(phone);
    const recipient = "+98" + normalizedPhone.slice(1);
    const cleanApiKey = apiKey.trim().replace(/^Bearer\s+/i, "");
    const cleanPatternCode = patternCode.trim();
    const sourceNumber = (customSourceNumber || "10001").trim();

    console.log(`📡 [Panelchi API] ارسال سریع OTP به ${recipient} از خط ${sourceNumber}`);

    const response = await fetch("https://api.panelchi.com/sms/pattern", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cleanApiKey}`,
      },
      body: JSON.stringify({
        pattern: cleanPatternCode,
        variables: {
          code: code.toString(),
        },
        recipient: recipient,
        sourceNumber: sourceNumber,
      }),
    });

    const responseText = await response.text();
    let data: any = {};
    try { data = JSON.parse(responseText); } catch {}

    if (response.ok || response.status === 201 || data?.status === "CREATED") {
      console.log(`✅ پیامک با موفقیت ارسال شد.`);
      return { success: true };
    }

    console.error("❌ خطای ارسال پیامک پنل‌چی:", responseText);
    return { success: false, error: responseText };
  } catch (err: any) {
    console.error("❌ خطای شبکه:", err.message);
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

  return sendViaPanelchi(phone, code, apiKey, patternCode, originator);
}