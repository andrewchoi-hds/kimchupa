import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getRateLimitHeaders, type RateLimitConfig } from "./rateLimit";

export function checkRateLimit(
  request: NextRequest,
  config?: RateLimitConfig
) {
  // Use IP address or forwarded header as key
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
             request.headers.get("x-real-ip") ||
             "anonymous";

  const path = new URL(request.url).pathname;
  const key = `${ip}:${path}`;

  const result = rateLimit(key, config);

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: { code: "TOO_MANY_REQUESTS", message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." } },
      { status: 429, headers: getRateLimitHeaders(result) }
    );
  }

  return null; // No rate limit hit
}
