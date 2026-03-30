import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { attendanceService } from "@kimchupa/api";
import { checkRateLimit } from "@/lib/withRateLimit";
import { apiServerError } from "@/lib/apiError";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
    }

    const attendance = await attendanceService.getSummary(session.user.id);
    return NextResponse.json({ success: true, data: attendance });
  } catch (error) {
    return apiServerError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimited = checkRateLimit(request, { interval: 60_000, limit: 5 });
    if (rateLimited) return rateLimited;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
    }

    const result = await attendanceService.checkIn(session.user.id);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return apiServerError(error);
  }
}
