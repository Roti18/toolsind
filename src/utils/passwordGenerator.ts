export function generatePassword(
  length: number = 12,
  useUpper = true,
  useNumbers = true,
  useSymbols = true
) {
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()-_=+[]{};:,.<>?";

  let charPool = lowerChars;
  if (useUpper) charPool += upperChars;
  if (useNumbers) charPool += numberChars;
  if (useSymbols) charPool += symbolChars;

  if (charPool.length === 0) return "";

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charPool.length);
    password += charPool[randomIndex];
  }
  return password;
}
