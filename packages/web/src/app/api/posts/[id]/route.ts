import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { postService } from "@kimchupa/api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await postService.getById(id);

  if (!post) {
    return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "게시글을 찾을 수 없습니다" } }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: post });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const post = await postService.update(id, body);

  return NextResponse.json({ success: true, data: post });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
  }

  const { id } = await params;
  await postService.delete(id);

  return NextResponse.json({ success: true });
}
