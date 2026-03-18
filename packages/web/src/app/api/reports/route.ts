import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { reportService } from "@kimchupa/api";
import { checkRateLimit } from "@/lib/withRateLimit";

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, { interval: 60_000, limit: 5 });
  if (rateLimited) return rateLimited;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { targetType, targetId, reason, description } = body;

  if (!targetType || !targetId || !reason) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: "필수 항목이 누락되었습니다" } },
      { status: 400 }
    );
  }

  const validTypes = ["post", "comment", "user"];
  if (!validTypes.includes(targetType)) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: "잘못된 신고 대상 유형입니다" } },
      { status: 400 }
    );
  }

  const validReasons = ["spam", "harassment", "inappropriate", "copyright", "other"];
  if (!validReasons.includes(reason)) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: "잘못된 신고 사유입니다" } },
      { status: 400 }
    );
  }

  const report = await reportService.createReport(
    session.user.id,
    targetType,
    targetId,
    reason,
    description || undefined
  );

  return NextResponse.json({ success: true, data: report }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } },
      { status: 401 }
    );
  }

  // Admin check
  if ((session.user as { role?: string }).role !== "admin") {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "관리자만 접근할 수 있습니다" } },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;

  const result = await reportService.getAllReports(status, page, limit);

  return NextResponse.json({
    success: true,
    data: result.reports,
    meta: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages },
  });
}
