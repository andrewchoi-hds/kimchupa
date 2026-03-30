import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { postService } from "@kimchupa/api";
import { updatePostSchema } from "@kimchupa/shared";
import { apiServerError } from "@/lib/apiError";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await postService.getByIdWithViewIncrement(id);

    if (!post) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "게시글을 찾을 수 없습니다" } }, { status: 404 });
    }

    // Check if the current user has liked this post
    const session = await auth();
    let isLiked = false;
    if (session?.user?.id) {
      isLiked = await postService.isLikedByUser(id, session.user.id);
    }

    return NextResponse.json({ success: true, data: { ...post, isLiked } });
  } catch (error) {
    return apiServerError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updatePostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다", details: parsed.error.flatten().fieldErrors } },
        { status: 400 }
      );
    }
    const post = await postService.update(id, parsed.data);

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return apiServerError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
    }

    const { id } = await params;
    await postService.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiServerError(error);
  }
}
