import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { kimchiDexService } from "@kimchupa/api";
import { z } from "zod";

const kimchiDexEntrySchema = z.object({
  kimchiId: z.string(),
  status: z.enum(["want_to_try", "tried", "favorite"]),
  rating: z.number().min(1).max(5).optional(),
  memo: z.string().max(500).optional(),
});

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

  const body = await request.json();
  const parsed = kimchiDexEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다", details: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }

  const { kimchiId, status, rating, memo } = parsed.data;
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
