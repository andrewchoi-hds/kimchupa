import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { postService } from "@kimchupa/api";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
  }

  const { id: postId } = await params;
  const result = await postService.toggleLike(postId, session.user.id);

  return NextResponse.json({ success: true, data: result });
}
