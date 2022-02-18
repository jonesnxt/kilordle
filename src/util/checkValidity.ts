import { WORDLES, WORDS } from './words';

export function checkValidity(word: string) {
  return WORDLES.includes(word) || WORDS.includes(word);
}