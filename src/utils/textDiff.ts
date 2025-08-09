import { diffWords } from "diff";

export function getTextDiff(oldText: string, newText: string) {
  const diff = diffWords(oldText, newText);
  return diff.map((part, index) => ({
    value: part.value,
    added: part.added || false,
    removed: part.removed || false,
    index,
  }));
}
