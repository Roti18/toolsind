export const toUpperCase = (text: string) => text.toUpperCase();
export const toLowerCase = (text: string) => text.toLowerCase();
export const toCapitalized = (text: string) =>
  text.replace(/\b\w/g, (char) => char.toUpperCase());
