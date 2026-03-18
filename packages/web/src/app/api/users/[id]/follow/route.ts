import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { followService } from "@kimchupa/api";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } },
      { status: 401 }
    );
  }

  const { id: targetUserId } = await params;

  try {
    const isNowFollowing = await followService.toggle(session.user.id, targetUserId);
    return NextResponse.json({ success: true, data: { isFollowing: isNowFollowing } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "팔로우에 실패했습니다";
    return NextResponse.json(
      { success: false, error: { code: "FOLLOW_ERROR", message } },
      { status: 400 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id: targetUserId } = await params;

  const status = await followService.getStatus(
    session?.user?.id ?? null,
    targetUserId
  );

  return NextResponse.json({ success: true, data: status });
}
