import { NextResponse } from "next/server";

export function apiError(code: string, message: string, status: number, details?: Record<string, string[]>) {
  return NextResponse.json(
    { success: false, error: { code, message, ...(details ? { details } : {}) } },
    { status }
  );
}

export function apiUnauthorized() {
  return apiError("UNAUTHORIZED", "로그인이 필요합니다", 401);
}

export function apiNotFound(message = "리소스를 찾을 수 없습니다") {
  return apiError("NOT_FOUND", message, 404);
}

export function apiValidationError(message: string, details?: Record<string, string[]>) {
  return apiError("VALIDATION_ERROR", message, 400, details);
}

export function apiServerError(error: unknown) {
  console.error("[API Error]", error);
  return apiError("INTERNAL_ERROR", "서버 오류가 발생했습니다", 500);
}
