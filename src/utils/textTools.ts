// src/utils/textTools.ts

export function truncateByChars(text: string, limit: number) {
  return text.length > limit ? text.slice(0, limit) + "..." : text;
}

export function truncateByWords(text: string, limit: number) {
  const words = text.split(/\s+/);
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
}

export function truncateByKeyword(text: string, keyword: string) {
  const index = text.indexOf(keyword);
  if (index === -1) return "..."; // kalau keyword tidak ditemukan
  return text.slice(0, index) + "...";
}

// fungsi utama supaya FE / API lebih rapi
export function truncateText(
  text: string,
  limit: number | string,
  mode: "chars" | "words" | "keyword"
) {
  if (mode === "chars" && typeof limit === "number") {
    return truncateByChars(text, limit);
  }
  if (mode === "words" && typeof limit === "number") {
    return truncateByWords(text, limit);
  }
  if (mode === "keyword" && typeof limit === "string") {
    return truncateByKeyword(text, limit);
  }
  return text;
}
