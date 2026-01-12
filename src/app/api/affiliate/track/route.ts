import { NextRequest, NextResponse } from "next/server";

// In production, this would save to a database
const clickLogs: Array<{
  productId: string;
  partner: string;
  timestamp: string;
  userAgent: string;
  referrer: string;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, partner, affiliateUrl } = body;

    if (!productId || !partner) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log the click
    const clickData = {
      productId,
      partner,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || "unknown",
      referrer: request.headers.get("referer") || "direct",
    };

    // In production, save to database
    clickLogs.push(clickData);

    // Log for demo purposes
    console.log("[Affiliate Click]", clickData);

    return NextResponse.json({
      success: true,
      message: "Click tracked successfully",
      redirectUrl: affiliateUrl,
    });
  } catch (error) {
    console.error("Error tracking affiliate click:", error);
    return NextResponse.json(
      { error: "Failed to track click" },
      { status: 500 }
    );
  }
}

// Get click statistics (for admin dashboard)
export async function GET() {
  // In production, fetch from database
  const stats = {
    totalClicks: clickLogs.length,
    byPartner: clickLogs.reduce(
      (acc, log) => {
        acc[log.partner] = (acc[log.partner] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    recentClicks: clickLogs.slice(-10),
  };

  return NextResponse.json(stats);
}
