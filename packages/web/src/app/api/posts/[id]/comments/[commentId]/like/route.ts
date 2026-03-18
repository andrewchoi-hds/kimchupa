import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { commentService } from "@kimchupa/api";
import { checkRateLimit } from "@/lib/withRateLimit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const rateLimited = checkRateLimit(request, { interval: 60_000, limit: 30 });
  if (rateLimited) return rateLimited;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } },
      { status: 401 }
    );
  }

  const { commentId } = await params;
  const result = await commentService.toggleLike(commentId);

  return NextResponse.json({ success: true, data: result });
}
