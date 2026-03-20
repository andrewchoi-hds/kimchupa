import { NextRequest, NextResponse } from "next/server";
import { challengeService } from "@kimchupa/api";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/withRateLimit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimited = checkRateLimit(request, { interval: 60_000, limit: 10 });
  if (rateLimited) return rateLimited;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const postId = body.postId as string | undefined;

  try {
    const result = await challengeService.complete(id, session.user.id, postId);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "완료 처리에 실패했습니다";
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message } },
      { status: 400 }
    );
  }
}
