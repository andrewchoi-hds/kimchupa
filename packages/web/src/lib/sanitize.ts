/**
 * Sanitize plain text input (strip all HTML tags).
 * Lightweight regex approach — no jsdom dependency,
 * safe for Vercel serverless runtime.
 */
export function sanitizeText(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}
