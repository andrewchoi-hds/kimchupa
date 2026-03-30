import { NextRequest, NextResponse } from "next/server";
import { authService } from "@kimchupa/api";
import { checkRateLimit } from "@/lib/withRateLimit";
import { registerSchema } from "@kimchupa/shared";

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, { interval: 60_000, limit: 5 });
  if (rateLimited) return rateLimited;

  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다", details: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }

  const { email, password, nickname } = parsed.data;
  const user = await authService.register(email, password, nickname);
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "EMAIL_EXISTS", message: "이미 사용 중인 이메일입니다" } },
      { status: 409 }
    );
  }

  return NextResponse.json({ success: true, data: { id: user.id, email: user.email } }, { status: 201 });
}
