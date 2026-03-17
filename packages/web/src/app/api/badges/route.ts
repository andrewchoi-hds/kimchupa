import { NextResponse } from "next/server";
import { badgeService } from "@kimchupa/api";

export async function GET() {
  const badges = await badgeService.getAll();
  return NextResponse.json({ success: true, data: badges });
}
