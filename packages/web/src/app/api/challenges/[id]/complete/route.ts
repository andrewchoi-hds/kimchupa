import { NextRequest, NextResponse } from "next/server";
import { challengeService } from "@kimchupa/api";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/withRateLimit";
import { z } from "zod";

const completeChallengeSchema = z.object({
  postId: z.string().max(100).optional(),
});

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
  const parsed = completeChallengeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다", details: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }
  const postId = parsed.data.postId;

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
