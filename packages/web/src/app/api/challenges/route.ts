import { NextRequest, NextResponse } from "next/server";
import { challengeService } from "@kimchupa/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const active = searchParams.get("active");

  if (active === "true") {
    const challenge = await challengeService.getActive();
    return NextResponse.json({ success: true, data: challenge });
  }

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const result = await challengeService.getAll(page, limit);
  return NextResponse.json({
    success: true,
    data: result.challenges,
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
}
