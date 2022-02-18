import { seedRandom } from './seedRandom';
import { WORDLES, NUM_WORDLES } from './words'

export function generateWordlist() {
    const seed = seedRandom();
    const generator = 163; // n is a cyclic group so I can put any prime as a generator (maybe?)

    const wordlist = [];

    for(let i = 0; i < 1000; i++) {
        wordlist.push(WORDLES[(seed + (generator*i)) % NUM_WORDLES])
    }

    return wordlist;
}