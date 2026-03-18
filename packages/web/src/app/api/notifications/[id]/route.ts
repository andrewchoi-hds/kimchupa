import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { notificationService } from "@kimchupa/api";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } },
      { status: 401 }
    );
  }

  const { id } = await params;
  await notificationService.markAsRead(id, session.user.id);
  return NextResponse.json({ success: true });
}
