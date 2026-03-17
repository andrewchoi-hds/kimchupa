import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { bookmarkService } from "@kimchupa/api";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
  }

  const bookmarks = await bookmarkService.getByUser(session.user.id);
  return NextResponse.json({ success: true, data: bookmarks });
}
