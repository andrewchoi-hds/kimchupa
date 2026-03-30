import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { postService } from "@kimchupa/api";
import { checkRateLimit, checkBodySize } from "@/lib/withRateLimit";
import { apiServerError } from "@/lib/apiError";
import { createPostSchema } from "@kimchupa/shared";
import { sanitizeText } from "@/lib/sanitize";
import type { PostType } from "@kimchupa/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const type = searchParams.get("type") as PostType | null;
    const tag = searchParams.get("tag") || undefined;
    const sort = searchParams.get("sort"); // "popular" or default "latest"

    if (sort === "popular") {
      const result = await postService.listPopular({
        page,
        limit,
        type: type || undefined,
      });
      return NextResponse.json({
        success: true,
        data: result.posts,
        meta: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages },
      });
    }

    const result = await postService.list({
      page,
      limit,
      type: type || undefined,
      tag,
    });

    return NextResponse.json({ success: true, data: result.posts, meta: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages } });
  } catch (error) {
    return apiServerError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimited = checkRateLimit(request, { interval: 60_000, limit: 10 });
    if (rateLimited) return rateLimited;

    const tooLarge = checkBodySize(request, 50_000);
    if (tooLarge) return tooLarge;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다", details: parsed.error.flatten().fieldErrors } },
        { status: 400 }
      );
    }

    const post = await postService.create({
      ...parsed.data,
      title: sanitizeText(parsed.data.title),
      authorId: session.user.id,
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    return apiServerError(error);
  }
}
