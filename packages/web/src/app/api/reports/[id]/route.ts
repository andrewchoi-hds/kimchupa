import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@kimchupa/db";
import { reportService } from "@kimchupa/api";
import { z } from "zod";

const updateReportStatusSchema = z.object({
  status: z.enum(["pending", "reviewed", "resolved", "dismissed"]),
});

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
  const parsed = updateReportStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다", details: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }

  const report = await reportService.updateReportStatus(id, parsed.data.status);

  return NextResponse.json({ success: true, data: report });
}
