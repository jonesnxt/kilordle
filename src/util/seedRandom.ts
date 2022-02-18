import { NUM_WORDLES } from './words'

export function seedRandom() {
  // floor the unix time under PST and use it to seed the wordle
  const time = (new Date()).getTime() - 2880000; // 8 hours in milliseconds

  return Math.floor(time / 86400000) % NUM_WORDLES;
}