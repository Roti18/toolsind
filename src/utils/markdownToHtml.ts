// src/utils/markdownToHtml.ts
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/**
 * Convert markdown -> sanitized HTML (server-side)
 * Compatible with marked@16.1.2
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  // Configure marked (modern way for v16+)
  marked.use({
    gfm: true,
    breaks: false,
    // Note: smartypants and mangle removed from marked v16+
    // Use separate plugins if needed
  });

  // Parse markdown -> raw HTML (marked v16+ returns Promise<string>)
  const rawHtml = await marked.parse(markdown || "");

  // Sanitize to mitigate XSS
  const clean = sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "figure",
      "figcaption",
      "pre",
      "code",
      "blockquote",
    ]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      code: ["class"], // for syntax highlighting
      pre: ["class"],
      "*": ["class", "id", "title", "align"],
    },
    allowedSchemes: ["http", "https", "mailto", "data"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    },
  });

  return clean;
}

// Optional: Simple version without custom renderer
export async function markdownToHtmlSimple(markdown: string): Promise<string> {
  // Configure marked (let it handle code blocks automatically)
  marked.use({
    gfm: true,
    breaks: false,
  });

  const rawHtml = await marked.parse(markdown || "");

  const clean = sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "figure",
      "figcaption",
      "pre",
      "code",
      "blockquote",
    ]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      code: ["class"],
      pre: ["class"],
      "*": ["class", "id", "title"],
    },
    allowedSchemes: ["http", "https", "mailto", "data"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    },
  });

  return clean;
}
