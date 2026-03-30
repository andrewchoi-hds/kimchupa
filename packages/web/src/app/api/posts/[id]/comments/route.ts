import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { commentService } from "@kimchupa/api";
import { checkRateLimit } from "@/lib/withRateLimit";
import { createCommentSchema } from "@kimchupa/shared";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimited = checkRateLimit(request, { interval: 60_000, limit: 20 });
  if (rateLimited) return rateLimited;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
  }

  const { id: postId } = await params;
  const body = await request.json();
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다", details: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }

  const comment = await commentService.create({
    postId,
    authorId: session.user.id,
    ...parsed.data,
  });

  return NextResponse.json({ success: true, data: comment }, { status: 201 });
}
