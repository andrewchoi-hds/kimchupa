import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { userService } from "@kimchupa/api";
import { updateProfileSchema } from "@kimchupa/shared";
import { apiServerError } from "@/lib/apiError";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
    }

    const user = await userService.getById(session.user.id);
    if (!user) {
      return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "사용자를 찾을 수 없습니다" } }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return apiServerError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다", details: parsed.error.flatten().fieldErrors } },
        { status: 400 }
      );
    }
    const user = await userService.updateProfile(session.user.id, parsed.data);

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return apiServerError(error);
  }
}
