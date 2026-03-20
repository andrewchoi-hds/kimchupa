import { NextRequest, NextResponse } from "next/server";
import { rankingService } from "@kimchupa/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "xp";
  const limit = Number(searchParams.get("limit")) || 20;

  try {
    let data;
    switch (type) {
      case "weekly":
        data = await rankingService.getWeeklyXpRanking(limit);
        break;
      case "contributors":
        data = await rankingService.getTopContributors(limit);
        break;
      case "attendance":
        data = await rankingService.getAttendanceKings(limit);
        break;
      default:
        data = await rankingService.getXpRanking(limit);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Ranking API error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "랭킹 조회에 실패했습니다" } },
      { status: 500 }
    );
  }
}
