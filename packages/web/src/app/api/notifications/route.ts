import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { notificationService } from "@kimchupa/api";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const includeRead = searchParams.get("all") === "true";

  const data = await notificationService.getByUser(session.user.id, 20, includeRead);
  return NextResponse.json({ success: true, data });
}

export async function PATCH() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } },
      { status: 401 }
    );
  }

  await notificationService.markAllAsRead(session.user.id);
  return NextResponse.json({ success: true });
}
