import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@kimchupa/db";
import { reportService } from "@kimchupa/api";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" },
      },
      { status: 401 }
    );
  }

  // Admin check
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        error: { code: "FORBIDDEN", message: "관리자만 접근할 수 있습니다" },
      },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  const validStatuses = ["pending", "reviewed", "resolved", "dismissed"];
  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "BAD_REQUEST", message: "잘못된 상태값입니다" },
      },
      { status: 400 }
    );
  }

  const report = await reportService.updateReportStatus(id, status);

  return NextResponse.json({ success: true, data: report });
}
