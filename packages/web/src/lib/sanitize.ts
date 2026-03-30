import DOMPurify from "isomorphic-dompurify";

// Sanitize plain text input (strip all HTML)
export function sanitizeText(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

// Sanitize HTML content (allow safe tags only)
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ["h1", "h2", "h3", "p", "strong", "em", "code", "pre", "a", "ul", "ol", "li", "br", "blockquote"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });
}
