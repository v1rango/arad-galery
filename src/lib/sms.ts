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

function normalizePhone(phone: string): string {
  let normalized = phone.trim().replace(/\s+/g, "");
  if (normalized.startsWith("+98")) {
    normalized = "0" + normalized.slice(3);
  } else if (normalized.startsWith("98") && normalized.length === 12) {
    normalized = "0" + normalized.slice(2);
  }
  return normalized;
}

async function sendViaSmsIr(
  phone: string,
  code: string,
  apiKey: string,
  templateId: string
): Promise<SendSmsResult> {
  try {
    const normalizedPhone = normalizePhone(phone);

    const response = await fetch("https://api.sms.ir/v1/send/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        mobile: normalizedPhone,
        templateId: parseInt(templateId),
        parameters: [
          {
            name: "code",
            value: code,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.status === 1) {
      console.log(`✅ پیامک OTP به ${phone} ارسال شد (SMS.ir)`);
      return { success: true };
    }

    const errorMsg = data.message || "خطا در ارسال پیامک";
    console.error("خطای SMS.ir:", errorMsg, data);
    return { success: false, error: errorMsg };
  } catch (error) {
    console.error("خطای شبکه در ارسال پیامک SMS.ir:", error);
    return { success: false, error: "خطا در ارتباط با سرویس پیامک" };
  }
}

async function sendViaKavenegar(
  phone: string,
  code: string,
  apiKey: string,
  sender?: string | null
): Promise<SendSmsResult> {
  try {
    const senderNumber = sender || "10004346";
    const message = `کد تایید آراد گالری:\n${code}\nاین کد تا ۲ دقیقه معتبر است.`;

    const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json`;
    const params = new URLSearchParams({
      receptor: phone,
      sender: senderNumber,
      message,
    });

    const res = await fetch(`${url}?${params.toString()}`);
    const data = await res.json();

    if (data.return && data.return.status === 200) {
      console.log(`✅ پیامک به ${phone} ارسال شد (کاوه‌نگار)`);
      return { success: true };
    }

    const errorMsg = data.return?.message || "خطا در ارسال پیامک";
    console.error("خطای کاوه‌نگار:", errorMsg);
    return { success: false, error: errorMsg };
  } catch (error) {
    console.error("خطای شبکه در ارسال پیامک کاوه‌نگار:", error);
    return { success: false, error: "خطا در ارتباط با سرویس پیامک" };
  }
}

export async function sendOtpSms({ phone, code }: SendOtpParams): Promise<SendSmsResult> {
  const settings = await getSettings();

  const hasSmsIrConfig = !!(settings.smsApiKey && settings.smsTemplateId);
  const hasKavenegarConfig = !!settings.kavenegarApiKey;
  const hasAnyConfig = hasSmsIrConfig || hasKavenegarConfig;

  if (!settings.smsEnabled || !hasAnyConfig) {
    if (process.env.NODE_ENV === "development") {
      console.log("═══════════════════════════════════════");
      console.log(`📱 [DEV MODE] کد تایید برای ${phone}: ${code}`);
      console.log(`⏰ اعتبار: 2 دقیقه`);
      console.log("💡 برای فعال‌سازی: پنل ادمین → تنظیمات");
      console.log("═══════════════════════════════════════");
    } else {
      console.warn(`⚠️ SMS غیرفعال - کد به ${phone} ارسال نشد`);
    }
    return { success: true, logged: true };
  }

  const provider = settings.smsProvider || "smsir";

  if (provider === "smsir" && hasSmsIrConfig) {
    return sendViaSmsIr(phone, code, settings.smsApiKey!, settings.smsTemplateId!);
  }

  if (provider === "kavenegar" && hasKavenegarConfig) {
    return sendViaKavenegar(phone, code, settings.kavenegarApiKey!, settings.kavenegarSenderNumber);
  }

  if (hasSmsIrConfig) {
    return sendViaSmsIr(phone, code, settings.smsApiKey!, settings.smsTemplateId!);
  }

  if (hasKavenegarConfig) {
    return sendViaKavenegar(phone, code, settings.kavenegarApiKey!, settings.kavenegarSenderNumber);
  }

  return { success: false, error: "هیچ سرویس پیامکی تنظیم نشده" };
}