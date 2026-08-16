import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: filePath } = await params;
    const filename = filePath.join("/");
    
    // مسیر فایل روی disk
    const fullPath = path.join(process.cwd(), "public", "uploads", filename);
    
    if (!existsSync(fullPath)) {
      return new NextResponse("Not Found", { status: 404 });
    }
    
    const file = await readFile(fullPath);
    
    // تشخیص content-type
    const ext = filename.split(".").pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
    };
    const contentType = contentTypes[ext || ""] || "application/octet-stream";
    
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}