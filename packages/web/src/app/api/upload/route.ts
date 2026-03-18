import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Allowed image types
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "파일이 없습니다." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "지원하지 않는 파일 형식입니다. (JPG, PNG, GIF, WebP만 가능)",
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "파일 크기는 5MB 이하여야 합니다." },
        { status: 400 }
      );
    }

    const blob = await put(
      `uploads/${session.user.id}/${Date.now()}-${file.name}`,
      file,
      { access: "public" }
    );

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "파일 업로드에 실패했습니다." },
      { status: 500 }
    );
  }
}

// Handle multiple file uploads
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "파일이 없습니다." },
        { status: 400 }
      );
    }

    if (files.length > 5) {
      return NextResponse.json(
        {
          success: false,
          error: "한 번에 최대 5개까지 업로드 가능합니다.",
        },
        { status: 400 }
      );
    }

    const results = [];

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        continue;
      }

      // Validate file size
      if (file.size > MAX_SIZE) {
        continue;
      }

      const blob = await put(
        `uploads/${session.user.id}/${Date.now()}-${file.name}`,
        file,
        { access: "public" }
      );

      results.push({
        url: blob.url,
        filename: file.name,
        originalName: file.name,
        size: file.size,
        type: file.type,
      });
    }

    return NextResponse.json({
      success: true,
      files: results,
      count: results.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "파일 업로드에 실패했습니다." },
      { status: 500 }
    );
  }
}
