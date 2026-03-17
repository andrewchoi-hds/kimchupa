import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { attendanceService } from "@kimchupa/api";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
  }

  const attendance = await attendanceService.getSummary(session.user.id);
  return NextResponse.json({ success: true, data: attendance });
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
  }

  const result = await attendanceService.checkIn(session.user.id);
  return NextResponse.json({ success: true, data: result });
}
