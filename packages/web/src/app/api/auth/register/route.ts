import { NextRequest, NextResponse } from "next/server";
import { authService } from "@kimchupa/api";

export async function POST(request: NextRequest) {
  const { email, password, nickname } = await request.json();

  if (!email || !password || !nickname) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_INPUT", message: "모든 필드를 입력해주세요" } },
      { status: 400 }
    );
  }

  const user = await authService.register(email, password, nickname);
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "EMAIL_EXISTS", message: "이미 사용 중인 이메일입니다" } },
      { status: 409 }
    );
  }

  return NextResponse.json({ success: true, data: { id: user.id, email: user.email } }, { status: 201 });
}
