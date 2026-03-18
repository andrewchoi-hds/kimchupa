import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { postService } from "@kimchupa/api";
import { checkRateLimit } from "@/lib/withRateLimit";
import type { PostType } from "@kimchupa/db";

export async function GET(request: NextRequest) {
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
}

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, { interval: 60_000, limit: 10 });
  if (rateLimited) return rateLimited;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
  }

  const body = await request.json();
  const { type, title, content, tags, images } = body;

  const post = await postService.create({
    type,
    title,
    content,
    tags,
    images,
    authorId: session.user.id,
  });

  return NextResponse.json({ success: true, data: post }, { status: 201 });
}
