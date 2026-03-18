import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { kimchiDexService } from "@kimchupa/api";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
  }

  const dex = await kimchiDexService.getByUser(session.user.id);
  return NextResponse.json({ success: true, data: dex });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
  }

  const { kimchiId, status, rating, memo } = await request.json();
  const entry = await kimchiDexService.setStatus(session.user.id, kimchiId, status, rating, memo);

  return NextResponse.json({ success: true, data: entry });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
  }

  const { kimchiId } = await request.json();
  await kimchiDexService.removeEntry(session.user.id, kimchiId);

  return NextResponse.json({ success: true, data: null });
}
