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

export async function sendOtpSms({ phone, code }: SendOtpParams): Promise<SendSmsResult> {
  const settings = await getSettings();

if (!settings.smsEnabled || !settings.kavenegarApiKey) {
  if (process.env.NODE_ENV === "development") {
    console.log("═══════════════════════════════════════");
    console.log(`📱 [DEV MODE] کد تایید برای ${phone}: ${code}`);
    console.log(`⏰ اعتبار: 2 دقیقه`);
    console.log("💡 برای فعال کردن پیامک واقعی، تو پنل ادمین → تنظیمات → smsEnabled رو فعال کنید");
    console.log("═══════════════════════════════════════");
  } else {
    console.warn(`⚠️ SMS غیرفعال - کد به ${phone} ارسال نشد`);
  }
  return { success: true, logged: true };
}
  try {
    const apiKey = settings.kavenegarApiKey;
    const sender = settings.kavenegarSenderNumber || "10004346";

    const message = `کد تایید آراد گالری:\n${code}\nاین کد تا ۲ دقیقه معتبر است.`;

    const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json`;
    const params = new URLSearchParams({
      receptor: phone,
      sender,
      message,
    });

    const res = await fetch(`${url}?${params.toString()}`);
    const data = await res.json();

    if (data.return && data.return.status === 200) {
      console.log(`✅ پیامک به ${phone} ارسال شد`);
      return { success: true };
    }

    const errorMsg = data.return?.message || "خطا در ارسال پیامک";
    console.error("خطای کاوه‌نگار:", errorMsg);
    return { success: false, error: errorMsg };
  } catch (error) {
    console.error("خطای شبکه در ارسال پیامک:", error);
    return { success: false, error: "خطا در ارتباط با سرویس پیامک" };
  }
}