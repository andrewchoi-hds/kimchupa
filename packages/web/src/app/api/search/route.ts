import { NextRequest, NextResponse } from "next/server";
import { searchService } from "@kimchupa/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ success: true, data: [] });
  }

  const results = await searchService.search(query);
  return NextResponse.json({ success: true, data: results });
}
