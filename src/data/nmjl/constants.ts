// ═══════════════════════════════════════════════════════════════
// NMJL Card Constants
// ═══════════════════════════════════════════════════════════════

import type { CardSection, JokerPolicy, SuitedTileSuit } from './types';

/** Joker policy per section */
export const SECTION_JOKER_POLICY: Record<CardSection, JokerPolicy> = {
  year: 'standard',
  '2468': 'standard',
  any_like_numbers: 'standard',
  addition: 'standard',
  quints: 'quints_required',
  consecutive_run: 'standard',
  '13579': 'standard',
  winds_dragons: 'standard',
  '369': 'standard',
  singles_pairs: 'no_jokers',
};

/** Section display order (as printed on the card) */
export const SECTION_ORDER: CardSection[] = [
  'year', '2468', 'any_like_numbers', 'addition', 'quints',
  'consecutive_run', '13579', 'winds_dragons', '369', 'singles_pairs',
];

/** Section display labels */
export const SECTION_LABELS: Record<CardSection, string> = {
  year: 'Year',
  '2468': '2468',
  any_like_numbers: 'Any Like Numbers',
  addition: 'Addition Hands',
  quints: 'Quints',
  consecutive_run: 'Consecutive Run',
  '13579': '13579',
  winds_dragons: 'Winds & Dragons',
  '369': '369',
  singles_pairs: 'Singles & Pairs',
};

/** Dragon type that "matches" each suit */
export const DRAGON_SUIT_MAP: Record<SuitedTileSuit, 'red' | 'green' | 'white'> = {
  characters: 'red',
  bamboo: 'green',
  dots: 'white',
};

/** Reverse: dragon type to its "home" suit */
export const SUIT_FOR_DRAGON: Record<'red' | 'green' | 'white', SuitedTileSuit> = {
  red: 'characters',
  green: 'bamboo',
  white: 'dots',
};

/** Map tileData suit names to tile ID prefix */
export const SUIT_TO_PREFIX: Record<SuitedTileSuit, string> = {
  dots: 'dot',
  bamboo: 'bam',
  characters: 'char',
};

/** All valid consecutive run starting numbers for a given length */
export function getValidRunStarts(length: number): number[] {
  const starts: number[] = [];
  for (let s = 1; s <= 9 - length + 1; s++) starts.push(s);
  return starts;
}
