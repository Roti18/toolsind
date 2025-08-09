export function convertUnixToLocal(unix: number): string {
  try {
    if (isNaN(unix)) throw new Error("Invalid timestamp");
    const date = new Date(unix * 1000);
    return date.toLocaleString(); // format lokal default
  } catch {
    return "Invalid timestamp";
  }
}
