function getRandomWord() {
  const words = [
    "amet",
    "dolor",
    "sit",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
    "ut",
    "enim",
    "minim",
    "veniam",
    "quis",
    "nostrud",
    "exercitation",
    "ullamco",
    "laboris",
    "nisi",
    "ut",
    "aliquip",
    "ex",
    "ea",
    "commodo",
    "consequat",
    "duis",
    "aute",
    "irure",
    "dolor",
    "in",
    "reprehenderit",
    "voluptate",
    "velit",
    "esse",
    "cillum",
    "fugiat",
  ];
  return words[Math.floor(Math.random() * words.length)];
}

function insertRandomPunctuation(wordsArray: string[]): string[] {
  return wordsArray.map((word, index) => {
    if (index > 0 && Math.random() < 0.07) {
      return word + ",";
    }
    if (index > 3 && Math.random() < 0.05) {
      return word + ".";
    }
    return word;
  });
}

export function generateLoremIpsum(totalWords: number = 50): string {
  const classicText = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  `.trim();

  const classicWords = classicText.split(/\s+/);

  if (totalWords <= classicWords.length) {
    const result = classicWords.slice(0, totalWords).join(" ");
    return result.endsWith(".") ? result : result + ".";
  }

  const remainingCount = totalWords - classicWords.length;
  const randomWords = Array.from({ length: remainingCount }, getRandomWord);

  // Koma/titik hanya di randomWords
  const randomWithPunctuation = insertRandomPunctuation(randomWords);

  let finalText = [...classicWords, ...randomWithPunctuation].join(" ");

  // Pastikan diakhiri titik
  if (!finalText.trim().endsWith(".")) {
    finalText += ".";
  }

  return finalText;
}
