import { NextRequest, NextResponse } from "next/server";
import { passwordResetService } from "@kimchupa/api";
import { checkRateLimit } from "@/lib/withRateLimit";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, { interval: 60_000, limit: 5 });
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다", details: parsed.error.flatten().fieldErrors } },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;
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
