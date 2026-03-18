import { NextRequest, NextResponse } from "next/server";
import { passwordResetService } from "@kimchupa/api";
import { checkRateLimit } from "@/lib/withRateLimit";

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, { interval: 60_000, limit: 5 });
  if (rateLimited) return rateLimited;

  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "토큰과 새 비밀번호를 입력해주세요.",
          },
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "WEAK_PASSWORD",
            message: "비밀번호는 8자 이상이어야 합니다.",
          },
        },
        { status: 400 }
      );
    }

    const result = await passwordResetService.resetPassword(token, password);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_TOKEN",
            message: result.error,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[reset-password] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "서버 오류가 발생했습니다.",
        },
      },
      { status: 500 }
    );
  }
}
