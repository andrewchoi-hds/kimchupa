import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { userService } from "@kimchupa/api";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
  }

  const user = await userService.getById(session.user.id);
  if (!user) {
    return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "사용자를 찾을 수 없습니다" } }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: user });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
  }

  const body = await request.json();
  const user = await userService.updateProfile(session.user.id, body);

  return NextResponse.json({ success: true, data: user });
}
