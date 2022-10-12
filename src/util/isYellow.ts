export function isYellow(wordle: string, guess: string, i: number): boolean {
  // Out of bounds sanity check
  if (i < 0 || i > 5) return false;

  const letter = guess[i];

  // Exact guess is not yellow
  if (wordle[i] === letter) return false;

  // Count non-guessed instances of guess letter
  const numMisplaced = wordle
    .split('')
    .filter(
      (trueLetter, j) => trueLetter === letter && guess[j] !== letter
    ).length;

  // Count instances of guess letter that are not exact guesses before current
  const numPreviousMisplaced = guess
    .split('')
    .filter(
      (guessLetter, j) =>
        guessLetter === letter && wordle[j] !== letter && j < i
    ).length;

  return numPreviousMisplaced < numMisplaced;
}
