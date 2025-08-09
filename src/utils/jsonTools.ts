// utils/jsonTools.ts
export function formatJSON(jsonString: string): string | null {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2); // Indent 2 spaces
  } catch {
    return null;
  }
}

export function validateJSON(jsonString: string): {
  valid: boolean;
  error?: string;
} {
  try {
    JSON.parse(jsonString);
    return { valid: true };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return { valid: false, error: errorMessage };
  }
}
