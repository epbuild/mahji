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

/** Section descriptions for educational content (ReadTheCard, tooltips, etc.) */
export const SECTION_DESCRIPTIONS: Record<CardSection, { desc: string; example: string }> = {
  year: { desc: 'Hands using digits of the current year', example: 'Year digits, 20, 25, etc.' },
  '2468': { desc: 'Even numbers only', example: 'Pairs, pungs, kongs of 2, 4, 6, 8' },
  any_like_numbers: { desc: 'Pick a number, repeat it', example: '111 111 1111 1111' },
  addition: { desc: 'Equations that add up', example: '1111 + 6666 = 7777' },
  quints: { desc: 'Hands with 5-of-a-kind groups', example: 'Requires jokers!' },
  consecutive_run: { desc: 'Sequential numbers in a row', example: '1-2-3, 3-4-5-6, etc.' },
  '13579': { desc: 'Odd numbers only', example: 'Pairs, pungs, kongs of 1, 3, 5, 7, 9' },
  winds_dragons: { desc: 'Emphasis on honor tiles', example: 'N, E, W, S, and dragons' },
  '369': { desc: 'Multiples of three', example: '3s, 6s, and 9s' },
  singles_pairs: { desc: 'No group larger than a pair', example: 'No jokers allowed!' },
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
