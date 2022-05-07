export function sortByValue(words: string[], guesses: string[]) {
  // iterate through each word and give it a score
  let scores = words.map((word) => scoreWordle(word, guesses));

  return scores
    .map<[string, number]>((score, i) => [words[i], score])
    .filter((p) => p[1] !== 100)
    .sort((a, b) => b[1] - a[1])
    .map((k) => k[0])
}

export function scoreWordle(word: string, guesses: string[]) {
  if (guesses.includes(word)) return 100;

  return word.split('').reduce((acc, letter, i) => 
    acc + guesses.reduce((best, guess) => 
      Math.max(best, letter === guess[i] ? 3 : (guess.includes(letter) ? 1 : 0)),
      0,
    ),
    0,
  );
}