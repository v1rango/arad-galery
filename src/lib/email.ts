import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

type SendEmailOptions = {
  subject: string;
  html: string;
};

export async function sendEmail({ subject, html }: SendEmailOptions) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.EMAIL_TO) {
      console.warn("⚠️  تنظیمات ایمیل کامل نیست، ایمیل ارسال نشد");
      return { success: false, error: "Email config missing" };
    }

    const info = await transporter.sendMail({
      from: `"آراد گالری" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject,
      html,
    });

    console.log(`📧 ایمیل ارسال شد: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ خطا در ارسال ایمیل:", error);
    return { success: false, error };
  }
}

export function createEmailTemplate(title: string, message: string, actionUrl?: string, actionText?: string) {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Tahoma, Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
            margin: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          .header {
            background: linear-gradient(135deg, #7c3aed, #ec4899);
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px 20px;
            color: #333;
            line-height: 1.8;
          }
          .content h2 {
            color: #7c3aed;
            margin-top: 0;
            font-size: 20px;
          }
          .message {
            background: #f9fafb;
            border-right: 4px solid #7c3aed;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .action-btn {
            display: inline-block;
            background: linear-gradient(135deg, #7c3aed, #ec4899);
            color: white !important;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 12px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ آراد گالری</h1>
          </div>
          <div class="content">
            <h2>${title}</h2>
            <div class="message">
              ${message}
            </div>
            ${actionUrl && actionText ? `<a href="${actionUrl}" class="action-btn">${actionText}</a>` : ""}
          </div>
          <div class="footer">
            <p>این ایمیل به‌صورت خودکار از پنل ادمین آراد گالری ارسال شده است</p>
            <p>© ۱۴۰۴ آراد گالری. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}