import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: filePath } = await params;
    const filename = filePath.join("/");

    // مسیر فایل روی disk
    const fullPath = path.join(process.cwd(), "public", "uploads", filename);

    const ext = filename.split(".").pop()?.toLowerCase() || "";
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

    if (existsSync(fullPath)) {
      const file = await readFile(fullPath);
      return new NextResponse(file, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // اگر فایل لوکال نبود، تلاش برای واکشی از سرور اصلی (پروداکشن)
    const remoteUrl = `https://arad-gallery.ir/api/uploads/${filename}`;
    try {
      const remoteRes = await fetch(remoteUrl, { signal: AbortSignal.timeout(5000) });
      if (remoteRes.ok) {
        const arrayBuffer = await remoteRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // ذخیره کش در پوشه لوکال
        try {
          const dir = path.dirname(fullPath);
          if (!existsSync(dir)) {
            await mkdir(dir, { recursive: true });
          }
          await writeFile(fullPath, buffer);
        } catch {
          // خطا در ذخیره لوکال مانع ارسال فایل نمی‌شود
        }

        return new NextResponse(buffer, {
          headers: {
            "Content-Type": remoteRes.headers.get("content-type") || contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch {
      // سرور پروداکشن در دسترس نیست یا فایل وجود ندارد
    }

    return new NextResponse("Not Found", { status: 404 });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}