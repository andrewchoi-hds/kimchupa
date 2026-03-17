import type { AffiliateProduct } from "@/constants/affiliateProducts";

export async function trackAffiliateClick(product: AffiliateProduct): Promise<void> {
  try {
    await fetch("/api/affiliate/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product.id,
        partner: product.partner,
        affiliateUrl: product.affiliateUrl,
      }),
    });
  } catch (error) {
    // Don't block user navigation on tracking errors
    console.error("Failed to track affiliate click:", error);
  }
}

export function handleAffiliateClick(product: AffiliateProduct): void {
  // Track the click asynchronously
  trackAffiliateClick(product);

  // Open affiliate link in new tab
  window.open(product.affiliateUrl, "_blank", "noopener,noreferrer");
}

// For analytics display
export async function getAffiliateStats(): Promise<{
  totalClicks: number;
  byPartner: Record<string, number>;
  recentClicks: Array<{
    productId: string;
    partner: string;
    timestamp: string;
  }>;
}> {
  try {
    const response = await fetch("/api/affiliate/track");
    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }
    return response.json();
  } catch (error) {
    console.error("Failed to get affiliate stats:", error);
    return {
      totalClicks: 0,
      byPartner: {},
      recentClicks: [],
    };
  }
}
