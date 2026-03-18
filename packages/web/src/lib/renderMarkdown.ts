/**
 * Lightweight markdown-to-HTML renderer.
 * Supports: headings, bold, italic, inline code, code blocks, lists, links, paragraphs.
 * Includes basic XSS sanitization (strips script tags and event handlers).
 */
export function renderMarkdown(text: string): string {
  if (!text) return "";

  let html = text;

  // --- XSS sanitization ---
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  html = html.replace(/on\w+\s*=\s*"[^"]*"/gi, "");
  html = html.replace(/on\w+\s*=\s*'[^']*'/gi, "");

  // --- Code blocks (fenced) — process first to protect inner content ---
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    '<pre class="bg-muted p-4 rounded-[var(--radius)] overflow-x-auto my-4"><code>$2</code></pre>'
  );

  // --- Headings ---
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>'
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>'
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>'
  );

  // --- Inline formatting ---
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>'
  );

  // --- Links ---
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener">$1</a>'
  );

  // --- Unordered list items ---
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>');
  // Wrap consecutive <li> in <ul>
  html = html.replace(
    /(<li class="ml-4">[\s\S]*?<\/li>(\n|$))+/g,
    (match) => `<ul class="list-disc my-2">${match}</ul>`
  );

  // --- Paragraphs: double newlines ---
  html = html.replace(/\n\n/g, "</p><p class=\"mb-4\">");

  // --- Single newlines to <br> (but not inside <pre>) ---
  // Simple approach: replace \n that aren't inside pre blocks
  const parts = html.split(/(<pre[\s\S]*?<\/pre>)/g);
  html = parts
    .map((part, i) => (i % 2 === 0 ? part.replace(/\n/g, "<br>") : part))
    .join("");

  // Wrap non-tag content in paragraphs for top level
  if (!html.startsWith("<")) {
    html = `<p class="mb-4">${html}</p>`;
  }

  return html;
}
