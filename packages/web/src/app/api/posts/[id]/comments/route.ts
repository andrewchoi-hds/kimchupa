import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { commentService } from "@kimchupa/api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
  }

  const { id: postId } = await params;
  const { content, parentId } = await request.json();

  const comment = await commentService.create({
    postId,
    authorId: session.user.id,
    content,
    parentId,
  });

  return NextResponse.json({ success: true, data: comment }, { status: 201 });
}
