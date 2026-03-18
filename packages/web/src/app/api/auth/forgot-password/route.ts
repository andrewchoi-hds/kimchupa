import { NextRequest, NextResponse } from "next/server";
import { passwordResetService } from "@kimchupa/api";
import { checkRateLimit } from "@/lib/withRateLimit";

async function sendResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || "https://kimchupa.vercel.app"}/reset-password?token=${token}`;

  if (process.env.RESEND_API_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "김추페 <noreply@kimchupa.vercel.app>",
        to: email,
        subject: "[김추페] 비밀번호 재설정",
        html: `<p>비밀번호를 재설정하려면 <a href="${resetUrl}">여기</a>를 클릭하세요. (1시간 유효)</p>`,
      }),
    });
  } else {
    console.log(`[Password Reset] ${email} → ${resetUrl}`);
  }
}

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, { interval: 60_000, limit: 3 });
  if (rateLimited) return rateLimited;

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "이메일을 입력해주세요.",
          },
        },
        { status: 400 }
      );
    }

    const token = await passwordResetService.requestReset(email);

    // If the user exists, send the email. But always return success
    // to avoid revealing whether an email is registered.
    if (token) {
      await sendResetEmail(email, token);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[forgot-password] Error:", error);
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
