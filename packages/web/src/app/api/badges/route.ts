import { NextResponse } from "next/server";
import { badgeService } from "@kimchupa/api";
import { apiServerError } from "@/lib/apiError";

export async function GET() {
  try {
    const badges = await badgeService.getAll();
    return NextResponse.json({ success: true, data: badges });
  } catch (error) {
    return apiServerError(error);
  }
}
