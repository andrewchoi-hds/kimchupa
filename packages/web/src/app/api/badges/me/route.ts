import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { badgeService } from "@kimchupa/api";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
  }

  const badges = await badgeService.getUserBadges(session.user.id);
  return NextResponse.json({ success: true, data: badges });
}
