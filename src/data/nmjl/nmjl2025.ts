// ═══════════════════════════════════════════════════════════════
// NMJL 2025 Card Data
// ═══════════════════════════════════════════════════════════════
//
// Transcribed from the official 2025 NMJL card photograph.
// Lines flagged needsReview may have transcription ambiguities.
// COPYRIGHT: This file stores STRUCTURED DATA ONLY — never
// display this as a facsimile of the original card.
//
// ═══════════════════════════════════════════════════════════════

import type { NMJLCard, HandDefinition, TileGroup, TileRef, CardColor, HandPattern } from './types';

// ── Helper factories ─────────────────────────────────────────

const s = (n: number): TileRef => ({ kind: 'suited', number: n });
const wN: TileRef = { kind: 'wind', type: 'N' };
const wE: TileRef = { kind: 'wind', type: 'E' };
const wW: TileRef = { kind: 'wind', type: 'W' };
const wS: TileRef = { kind: 'wind', type: 'S' };
const dR: TileRef = { kind: 'dragon', type: 'red' };
const dG: TileRef = { kind: 'dragon', type: 'green' };
const dW: TileRef = { kind: 'dragon', type: 'white' };
const dMatch: TileRef = { kind: 'dragon', match: 'color' };
const dOpp: TileRef = { kind: 'dragon', match: 'opposite' };
const fl: TileRef = { kind: 'flower' };
const zero: TileRef = { kind: 'zero' };

const single = (t: TileRef, c: CardColor): TileGroup => ({ tiles: [t], count: 1, type: 'single', color: c });
const pair = (t: TileRef, c: CardColor): TileGroup => ({ tiles: [t], count: 2, type: 'pair', color: c });
const pung = (t: TileRef, c: CardColor): TileGroup => ({ tiles: [t], count: 3, type: 'pung', color: c });
const kong = (t: TileRef, c: CardColor): TileGroup => ({ tiles: [t], count: 4, type: 'kong', color: c });
const quint = (t: TileRef, c: CardColor): TileGroup => ({ tiles: [t], count: 5, type: 'quint', color: c });
const mixed = (ts: TileRef[], c: CardColor): TileGroup => ({ tiles: ts, count: ts.length, type: 'mixed', color: c });

function check14(patterns: HandPattern[]): HandPattern[] {
  for (const p of patterns) {
    const total = p.groups.reduce((sum, g) => sum + g.count, 0);
    if (total !== 14) console.warn(`[NMJL 2025] Hand pattern has ${total} tiles, expected 14`);
  }
  return patterns;
}

// ═══════════════════════════════════════════════════════════════
// HANDS
// ═══════════════════════════════════════════════════════════════

const hands: HandDefinition[] = [

  // ─── YEAR (2025) ────────────────────────────────────────────

  {
    id: '2025-year-1',
    section: 'year',
    displayPattern: 'FFFF 2025 222 222',
    patterns: check14([{
      groups: [kong(fl, 'blue'), mixed([s(2), zero, s(2), s(5)], 'green'), pung(s(2), 'red'), pung(s(2), 'blue')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Like Pungs 2s or 5s in Opp. Suits',
  },
  {
    id: '2025-year-2',
    section: 'year',
    displayPattern: '222 0000 222 5555',
    patterns: check14([{
      groups: [pung(s(2), 'green'), kong(zero, 'blue'), pung(s(2), 'red'), kong(s(5), 'red')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 Suits',
  },
  {
    id: '2025-year-3',
    section: 'year',
    displayPattern: '2025 222 555 DDDD',
    patterns: check14([{
      groups: [mixed([s(2), zero, s(2), s(5)], 'green'), pung(s(2), 'red'), pung(s(5), 'red'), kong(dMatch, 'blue')],
    }]),
    points: 30, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits',
  },
  {
    id: '2025-year-4',
    section: 'year',
    displayPattern: 'FF 222 000 222 555',
    patterns: check14([{
      groups: [pair(fl, 'blue'), pung(s(2), 'green'), pung(zero, 'blue'), pung(s(2), 'red'), pung(s(5), 'blue')],
    }]),
    points: 30, exposure: 'C', jokerPolicy: 'standard',
    description: 'Any 3 Suits',
  },

  // ─── 2468 ───────────────────────────────────────────────────

  {
    id: '2025-2468-1',
    section: '2468',
    displayPattern: '222 4444 666 8888 -or- 222 4444 666 8888',
    patterns: check14([
      { groups: [pung(s(2), 'blue'), kong(s(4), 'blue'), pung(s(6), 'blue'), kong(s(8), 'blue')] },
      { groups: [pung(s(2), 'green'), kong(s(4), 'green'), pung(s(6), 'red'), kong(s(8), 'red')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 or 2 Suits',
  },
  {
    id: '2025-2468-2',
    section: '2468',
    displayPattern: 'FF 2222 + 4444 = 6666 -or- FF 2222 + 6666 = 8888',
    patterns: check14([
      { groups: [pair(fl, 'blue'), kong(s(2), 'green'), kong(s(4), 'red'), kong(s(6), 'blue')] },
      { groups: [pair(fl, 'blue'), kong(s(2), 'green'), kong(s(6), 'red'), kong(s(8), 'blue')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits',
  },
  {
    id: '2025-2468-3',
    section: '2468',
    displayPattern: '22 444 66 888 DDDD',
    patterns: check14([{
      groups: [pair(s(2), 'blue'), pung(s(4), 'blue'), pair(s(6), 'blue'), pung(s(8), 'blue'), kong(dMatch, 'blue')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 Suit',
  },
  {
    id: '2025-2468-4',
    section: '2468',
    displayPattern: 'FFFF 2468 222 222',
    patterns: check14([{
      groups: [kong(fl, 'blue'), mixed([s(2), s(4), s(6), s(8)], 'green'), pung(s(2), 'red'), pung(s(2), 'blue')],
      numberConstraint: { type: 'any_even' },
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Like Pungs Any Even No.',
  },
  {
    id: '2025-2468-5',
    section: '2468',
    displayPattern: 'FFF 22 44 666 8888',
    patterns: check14([{
      groups: [pung(fl, 'blue'), pair(s(2), 'blue'), pair(s(4), 'blue'), pung(s(6), 'blue'), kong(s(8), 'blue')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 Suit',
  },
  {
    id: '2025-2468-6',
    section: '2468',
    displayPattern: '222 4444 666 88 88',
    patterns: check14([{
      groups: [pung(s(2), 'green'), kong(s(4), 'green'), pung(s(6), 'green'), pair(s(8), 'red'), pair(s(8), 'blue')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Pairs 8s Only',
  },
  {
    id: '2025-2468-7',
    section: '2468',
    displayPattern: 'FF 2222 DDDD 2222',
    patterns: check14([{
      groups: [pair(fl, 'blue'), kong(s(2), 'green'), kong(dMatch, 'red'), kong(s(2), 'blue')],
      numberConstraint: { type: 'any_even' },
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Like Kongs Any Even No.',
  },
  {
    id: '2025-2468-8',
    section: '2468',
    displayPattern: '22 44 66 88 222 222',
    patterns: check14([{
      groups: [pair(s(2), 'green'), pair(s(4), 'green'), pair(s(6), 'green'), pair(s(8), 'green'), pung(s(2), 'red'), pung(s(2), 'blue')],
      numberConstraint: { type: 'any_even' },
    }]),
    points: 30, exposure: 'C', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Like Pungs Any Even No.',
  },

  // ─── ANY LIKE NUMBERS ───────────────────────────────────────

  {
    id: '2025-aln-1',
    section: 'any_like_numbers',
    displayPattern: 'FF 1111 D 1111 D 11',
    patterns: check14([{
      groups: [pair(fl, 'blue'), kong(s(1), 'green'), single(dMatch, 'green'), kong(s(1), 'red'), single(dMatch, 'red'), pair(s(1), 'blue')],
      numberConstraint: { type: 'any_like', positions: [1, 3, 5] },
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits',
  },
  {
    id: '2025-aln-2',
    section: 'any_like_numbers',
    displayPattern: 'FFFF 11 111 111 11',
    patterns: check14([{
      groups: [kong(fl, 'blue'), pair(s(1), 'green'), pung(s(1), 'red'), pung(s(1), 'blue'), pair(s(1), 'green')],
      numberConstraint: { type: 'any_like', positions: [1, 2, 3, 4] },
    }]),
    points: 30, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Pairs Must Be Same Suit',
  },
  {
    id: '2025-aln-3',
    section: 'any_like_numbers',
    displayPattern: 'FF 111 111 111 DDD',
    patterns: check14([{
      groups: [pair(fl, 'blue'), pung(s(1), 'green'), pung(s(1), 'red'), pung(s(1), 'blue'), pung(dMatch, 'green')],
      numberConstraint: { type: 'any_like', positions: [1, 2, 3] },
    }]),
    points: 30, exposure: 'C', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Any Dragon',
  },

  // ─── QUINTS ─────────────────────────────────────────────────

  {
    id: '2025-quint-1',
    section: 'quints',
    displayPattern: 'FF 111 2222 33333',
    patterns: check14([{
      groups: [pair(fl, 'blue'), pung(s(1), 'green'), kong(s(2), 'red'), quint(s(3), 'blue')],
      numberConstraint: { type: 'any_run', length: 3 },
    }]),
    points: 40, exposure: 'X', jokerPolicy: 'quints_required',
    description: 'Any 3 Suits, Any 3 Consec. Nos.',
  },
  {
    id: '2025-quint-2',
    section: 'quints',
    displayPattern: '11111 NNNN 22222',
    patterns: check14([{
      groups: [quint(s(1), 'blue'), kong(wN, 'blue'), quint(s(2), 'blue')],
      numberConstraint: { type: 'any_run', length: 2 },
    }]),
    points: 45, exposure: 'X', jokerPolicy: 'quints_required',
    description: 'Any 1 Suit, Any 2 Consec. Nos., Any Wind',
  },
  {
    id: '2025-quint-3',
    section: 'quints',
    displayPattern: 'FF 11111 11 11111',
    patterns: check14([{
      groups: [pair(fl, 'blue'), quint(s(1), 'green'), pair(s(1), 'red'), quint(s(1), 'blue')],
      numberConstraint: { type: 'any_like', positions: [1, 2, 3] },
    }]),
    points: 45, exposure: 'X', jokerPolicy: 'quints_required',
    description: 'Any 3 Suits, Any Like Nos.',
  },

  // ─── CONSECUTIVE RUN ────────────────────────────────────────

  {
    id: '2025-consec-1',
    section: 'consecutive_run',
    displayPattern: '11 222 3333 444 55 -or- 55 666 7777 888 99',
    patterns: check14([
      { groups: [pair(s(1), 'blue'), pung(s(2), 'blue'), kong(s(3), 'blue'), pung(s(4), 'blue'), pair(s(5), 'blue')] },
      { groups: [pair(s(5), 'blue'), pung(s(6), 'blue'), kong(s(7), 'blue'), pung(s(8), 'blue'), pair(s(9), 'blue')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 Suit, These Nos. Only',
  },
  {
    id: '2025-consec-2',
    section: 'consecutive_run',
    displayPattern: '111 2222 333 4444 -or- 111 2222 333 4444',
    patterns: check14([
      { groups: [pung(s(1), 'blue'), kong(s(2), 'blue'), pung(s(3), 'blue'), kong(s(4), 'blue')], numberConstraint: { type: 'any_run', length: 4 } },
      { groups: [pung(s(1), 'green'), kong(s(2), 'green'), pung(s(3), 'red'), kong(s(4), 'red')], numberConstraint: { type: 'any_run', length: 4 } },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 or 2 Suits, Any 4 Consec. Nos.',
  },
  {
    id: '2025-consec-3',
    section: 'consecutive_run',
    displayPattern: 'FFFF 1111 22 3333 -or- FFFF 1111 22 3333',
    patterns: check14([
      { groups: [kong(fl, 'blue'), kong(s(1), 'blue'), pair(s(2), 'blue'), kong(s(3), 'blue')], numberConstraint: { type: 'any_run', length: 3 } },
      { groups: [kong(fl, 'blue'), kong(s(1), 'green'), pair(s(2), 'red'), kong(s(3), 'blue')], numberConstraint: { type: 'any_run', length: 3 } },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 or 3 Suits, Any 3 Consec. Nos.',
  },
  {
    id: '2025-consec-4',
    section: 'consecutive_run',
    displayPattern: 'FFF 123 4444 5555',
    patterns: check14([{
      groups: [pung(fl, 'blue'), mixed([s(1), s(2), s(3)], 'green'), kong(s(4), 'red'), kong(s(5), 'blue')],
      numberConstraint: { type: 'any_run', length: 5 },
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Any 5 Consec. Nos.',
  },
  {
    id: '2025-consec-5',
    section: 'consecutive_run',
    displayPattern: 'FF 11 222 3333 DDD',
    patterns: check14([{
      groups: [pair(fl, 'blue'), pair(s(1), 'blue'), pung(s(2), 'blue'), kong(s(3), 'blue'), pung(dMatch, 'blue')],
      numberConstraint: { type: 'any_run', length: 3 },
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 Suit, Any 3 Consec. Nos.',
  },
  {
    id: '2025-consec-6',
    section: 'consecutive_run',
    displayPattern: '111 222 3333 DD DD',
    patterns: check14([{
      groups: [pung(s(1), 'green'), pung(s(2), 'green'), kong(s(3), 'green'), pair(dOpp, 'red'), pair(dOpp, 'blue')],
      numberConstraint: { type: 'any_run', length: 3 },
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Any 3 Consec. Nos. w Opp. Dragons',
  },
  {
    id: '2025-consec-7',
    section: 'consecutive_run',
    displayPattern: '112345 1111 1111 -or- 122345 2222 2222 -or- 123345 3333 3333 -or- 123445 4444 4444 -or- 123455 5555 5555',
    patterns: check14([
      // Pair of 1st number in run, kongs match pair
      { groups: [mixed([s(1), s(1), s(2), s(3), s(4), s(5)], 'green'), kong(s(1), 'red'), kong(s(1), 'blue')], numberConstraint: { type: 'any_run', length: 5 } },
      // Pair of 2nd number in run
      { groups: [mixed([s(1), s(2), s(2), s(3), s(4), s(5)], 'green'), kong(s(2), 'red'), kong(s(2), 'blue')], numberConstraint: { type: 'any_run', length: 5 } },
      // Pair of 3rd number in run
      { groups: [mixed([s(1), s(2), s(3), s(3), s(4), s(5)], 'green'), kong(s(3), 'red'), kong(s(3), 'blue')], numberConstraint: { type: 'any_run', length: 5 } },
      // Pair of 4th number in run
      { groups: [mixed([s(1), s(2), s(3), s(4), s(4), s(5)], 'green'), kong(s(4), 'red'), kong(s(4), 'blue')], numberConstraint: { type: 'any_run', length: 5 } },
      // Pair of 5th number in run
      { groups: [mixed([s(1), s(2), s(3), s(4), s(5), s(5)], 'green'), kong(s(5), 'red'), kong(s(5), 'blue')], numberConstraint: { type: 'any_run', length: 5 } },
    ]),
    points: 30, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Any 5 Consec. Nos., Pair Any No. in Run, Kongs Match Pair',
  },
  {
    id: '2025-consec-8',
    section: 'consecutive_run',
    displayPattern: 'FF 1 22 333 1 22 333',
    patterns: check14([{
      groups: [pair(fl, 'blue'), single(s(1), 'green'), pair(s(2), 'green'), pung(s(3), 'green'), single(s(1), 'red'), pair(s(2), 'red'), pung(s(3), 'red')],
      numberConstraint: { type: 'any_run', length: 3 },
    }]),
    points: 30, exposure: 'C', jokerPolicy: 'standard',
    description: 'Any 2 Suits, Any Same 3 Consec. Nos.',
  },

  // ─── 13579 ──────────────────────────────────────────────────

  {
    id: '2025-13579-1',
    section: '13579',
    displayPattern: '11 333 5555 777 99 -or- 11 333 5555 777 99',
    patterns: check14([
      { groups: [pair(s(1), 'blue'), pung(s(3), 'blue'), kong(s(5), 'blue'), pung(s(7), 'blue'), pair(s(9), 'blue')] },
      { groups: [pair(s(1), 'green'), pung(s(3), 'green'), kong(s(5), 'red'), pung(s(7), 'blue'), pair(s(9), 'blue')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 or 3 Suits',
  },
  {
    id: '2025-13579-2',
    section: '13579',
    displayPattern: '111 3333 333 5555 -or- 555 7777 777 9999',
    patterns: check14([
      { groups: [pung(s(1), 'green'), kong(s(3), 'green'), pung(s(3), 'red'), kong(s(5), 'red')] },
      { groups: [pung(s(5), 'green'), kong(s(7), 'green'), pung(s(7), 'red'), kong(s(9), 'red')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 Suits',
  },
  {
    id: '2025-13579-3',
    section: '13579',
    displayPattern: '1111 333 5555 DDD -or- 5555 777 9999 DDD',
    patterns: check14([
      { groups: [kong(s(1), 'blue'), pung(s(3), 'blue'), kong(s(5), 'blue'), pung(dMatch, 'blue')] },
      { groups: [kong(s(5), 'blue'), pung(s(7), 'blue'), kong(s(9), 'blue'), pung(dMatch, 'blue')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 Suit',
  },
  {
    id: '2025-13579-4',
    section: '13579',
    displayPattern: 'FFFF 1111 + 9999 = 10',
    patterns: check14([{
      groups: [kong(fl, 'blue'), kong(s(1), 'green'), kong(s(9), 'green'), mixed([s(1), zero], 'red')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 Suits, These Nos. Only',
  },
  {
    id: '2025-13579-5',
    section: '13579',
    displayPattern: 'FFF 135 7777 9999 -or- FFF 135 7777 9999',
    patterns: check14([
      { groups: [pung(fl, 'blue'), mixed([s(1), s(3), s(5)], 'blue'), kong(s(7), 'blue'), kong(s(9), 'blue')] },
      { groups: [pung(fl, 'blue'), mixed([s(1), s(3), s(5)], 'green'), kong(s(7), 'red'), kong(s(9), 'blue')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 or 3 Suits',
  },
  {
    id: '2025-13579-6',
    section: '13579',
    displayPattern: '111 333 5555 DD DD -or- 555 777 9999 DD DD',
    patterns: check14([
      { groups: [pung(s(1), 'green'), pung(s(3), 'green'), kong(s(5), 'green'), pair(dOpp, 'red'), pair(dOpp, 'blue')] },
      { groups: [pung(s(5), 'green'), pung(s(7), 'green'), kong(s(9), 'green'), pair(dOpp, 'red'), pair(dOpp, 'blue')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits w Opp. Dragons',
  },
  {
    id: '2025-13579-7',
    section: '13579',
    displayPattern: '11 333 NEWS 333 55 -or- 55 777 NEWS 777 99',
    patterns: check14([
      { groups: [pair(s(1), 'green'), pung(s(3), 'green'), mixed([wN, wE, wW, wS], 'blue'), pung(s(3), 'red'), pair(s(5), 'red')] },
      { groups: [pair(s(5), 'green'), pung(s(7), 'green'), mixed([wN, wE, wW, wS], 'blue'), pung(s(7), 'red'), pair(s(9), 'red')] },
    ]),
    points: 30, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 Suits',
  },
  {
    id: '2025-13579-8',
    section: '13579',
    displayPattern: '1111 33 55 77 9999',
    patterns: check14([{
      groups: [kong(s(1), 'green'), pair(s(3), 'red'), pair(s(5), 'red'), pair(s(7), 'red'), kong(s(9), 'green')],
    }]),
    points: 30, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 Suits',
  },
  {
    id: '2025-13579-9',
    section: '13579',
    displayPattern: 'FF 11 33 111 333 55 -or- FF 55 77 555 777 99',
    patterns: check14([
      { groups: [pair(fl, 'blue'), pair(s(1), 'green'), pair(s(3), 'green'), pung(s(1), 'red'), pung(s(3), 'red'), pair(s(5), 'blue')] },
      { groups: [pair(fl, 'blue'), pair(s(5), 'green'), pair(s(7), 'green'), pung(s(5), 'red'), pung(s(7), 'red'), pair(s(9), 'blue')] },
    ]),
    points: 30, exposure: 'C', jokerPolicy: 'standard',
    description: 'Any 3 Suits',
  },

  // ─── WINDS & DRAGONS ────────────────────────────────────────

  {
    id: '2025-wd-1',
    section: 'winds_dragons',
    displayPattern: 'NNNN EEE WWW SSSS -or- NNN EEEE WWWW SSS',
    patterns: check14([
      { groups: [kong(wN, 'blue'), pung(wE, 'blue'), pung(wW, 'blue'), kong(wS, 'blue')] },
      { groups: [pung(wN, 'blue'), kong(wE, 'blue'), kong(wW, 'blue'), pung(wS, 'blue')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
  },
  {
    id: '2025-wd-2',
    section: 'winds_dragons',
    displayPattern: 'FF 123 DD DDD DDDD',
    patterns: check14([{
      groups: [pair(fl, 'blue'), mixed([s(1), s(2), s(3)], 'blue'), pair(dR, 'green'), pung(dG, 'red'), kong(dW, 'blue')],
      numberConstraint: { type: 'any_run', length: 3 },
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Consec. Nos. in Any 1 Suit, Any 3 Dragons',
  },
  {
    id: '2025-wd-3',
    section: 'winds_dragons',
    displayPattern: 'FFF NN EE WWW SSSS',
    patterns: check14([{
      groups: [pung(fl, 'blue'), pair(wN, 'blue'), pair(wE, 'blue'), pung(wW, 'blue'), kong(wS, 'blue')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
  },
  {
    id: '2025-wd-4',
    section: 'winds_dragons',
    displayPattern: 'FFFF DDD NEWS DDD',
    patterns: check14([{
      groups: [kong(fl, 'blue'), pung(dR, 'green'), mixed([wN, wE, wW, wS], 'blue'), pung(dG, 'red')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Dragons Any 2 Suits',
  },
  {
    id: '2025-wd-5',
    section: 'winds_dragons',
    displayPattern: 'NNNN 1 11 111 SSSS',
    patterns: check14([{
      groups: [kong(wN, 'blue'), single(s(1), 'green'), pair(s(1), 'red'), pung(s(1), 'blue'), kong(wS, 'blue')],
      numberConstraint: { type: 'any_odd' },
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any Like Odd Nos. in 3 Suits',
  },
  {
    id: '2025-wd-6',
    section: 'winds_dragons',
    displayPattern: 'EEEE 2 22 222 WWWW',
    patterns: check14([{
      groups: [kong(wE, 'blue'), single(s(2), 'green'), pair(s(2), 'red'), pung(s(2), 'blue'), kong(wW, 'blue')],
      numberConstraint: { type: 'any_even' },
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any Like Even Nos. in 3 Suits',
  },
  {
    id: '2025-wd-7',
    section: 'winds_dragons',
    displayPattern: 'NN EEE WWW SS 2025 -or- NNN EE WW SSS 2025',
    patterns: check14([
      { groups: [pair(wN, 'blue'), pung(wE, 'blue'), pung(wW, 'blue'), pair(wS, 'blue'), mixed([s(2), zero, s(2), s(5)], 'blue')] },
      { groups: [pung(wN, 'blue'), pair(wE, 'blue'), pair(wW, 'blue'), pung(wS, 'blue'), mixed([s(2), zero, s(2), s(5)], 'blue')] },
    ]),
    points: 30, exposure: 'X', jokerPolicy: 'standard',
    description: '2025 Any 1 Suit',
  },
  {
    id: '2025-wd-8',
    section: 'winds_dragons',
    displayPattern: 'NN EE WWW SSS DDDD',
    patterns: check14([{
      groups: [pair(wN, 'blue'), pair(wE, 'blue'), pung(wW, 'blue'), pung(wS, 'blue'), kong(dMatch, 'blue')],
    }]),
    points: 30, exposure: 'C', jokerPolicy: 'standard',
    description: 'Kong Any Dragon',
  },

  // ─── 369 ────────────────────────────────────────────────────

  {
    id: '2025-369-1',
    section: '369',
    displayPattern: '333 6666 666 9999 -or- 333 6666 666 9999',
    patterns: check14([
      { groups: [pung(s(3), 'green'), kong(s(6), 'green'), pung(s(6), 'red'), kong(s(9), 'red')] },
      { groups: [pung(s(3), 'green'), kong(s(6), 'green'), pung(s(6), 'red'), kong(s(9), 'blue')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 or 3 Suits',
  },
  {
    id: '2025-369-2',
    section: '369',
    displayPattern: 'FF 3333 + 6666 = 9999 -or- FF 3333 + 6666 = 9999',
    patterns: check14([
      { groups: [pair(fl, 'blue'), kong(s(3), 'blue'), kong(s(6), 'blue'), kong(s(9), 'blue')] },
      { groups: [pair(fl, 'blue'), kong(s(3), 'green'), kong(s(6), 'red'), kong(s(9), 'blue')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 or 3 Suits',
  },
  {
    id: '2025-369-3',
    section: '369',
    displayPattern: '3333 DDD 3333 DDD',
    patterns: check14([{
      groups: [kong(s(3), 'green'), pung(dMatch, 'green'), kong(s(3), 'red'), pung(dMatch, 'red')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 Suits, Like Kongs 3, 6 or 9 w Matching Dragons',
  },
  {
    id: '2025-369-4',
    section: '369',
    displayPattern: 'FFF 3333 369 9999',
    patterns: check14([{
      groups: [pung(fl, 'blue'), kong(s(3), 'green'), mixed([s(3), s(6), s(9)], 'red'), kong(s(9), 'green')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 Suits',
  },
  {
    id: '2025-369-5',
    section: '369',
    displayPattern: '33 66 99 3333 3333',
    patterns: check14([{
      groups: [pair(s(3), 'green'), pair(s(6), 'green'), pair(s(9), 'green'), kong(s(3), 'red'), kong(s(3), 'blue')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Like Kongs 3, 6, or 9',
  },
  {
    id: '2025-369-6',
    section: '369',
    displayPattern: 'FF 333 D 666 D 999 D',
    patterns: check14([{
      groups: [pair(fl, 'blue'), pung(s(3), 'green'), single(dMatch, 'green'), pung(s(6), 'red'), single(dMatch, 'red'), pung(s(9), 'blue'), single(dMatch, 'blue')],
    }]),
    points: 30, exposure: 'C', jokerPolicy: 'standard',
    description: 'Any 3 Suits w Matching Dragons',
  },

  // ─── SINGLES AND PAIRS ──────────────────────────────────────

  {
    id: '2025-sp-1',
    section: 'singles_pairs',
    displayPattern: 'NN E W SS 11 22 33 44',
    patterns: check14([{
      groups: [
        pair(wN, 'blue'), single(wE, 'blue'), single(wW, 'blue'), pair(wS, 'blue'),
        pair(s(1), 'blue'), pair(s(2), 'blue'), pair(s(3), 'blue'), pair(s(4), 'blue'),
      ],
      numberConstraint: { type: 'any_run', length: 4 },
    }]),
    points: 50, exposure: 'C', jokerPolicy: 'no_jokers',
    description: 'Any 1 Suit, Any 4 Consec. Nos.',
  },
  {
    id: '2025-sp-2',
    section: 'singles_pairs',
    displayPattern: 'FF 2468 DD 2468 DD',
    patterns: check14([{
      groups: [
        pair(fl, 'blue'),
        mixed([s(2), s(4), s(6), s(8)], 'green'), pair(dMatch, 'green'),
        mixed([s(2), s(4), s(6), s(8)], 'red'), pair(dMatch, 'red'),
      ],
    }]),
    points: 50, exposure: 'C', jokerPolicy: 'no_jokers',
    description: 'Any 2 Suits w Matching Dragons',
  },
  {
    id: '2025-sp-3',
    section: 'singles_pairs',
    displayPattern: '336699 336699 33',
    patterns: check14([{
      groups: [
        mixed([s(3), s(3), s(6), s(6), s(9), s(9)], 'green'),
        mixed([s(3), s(3), s(6), s(6), s(9), s(9)], 'red'),
        pair(s(3), 'blue'),
      ],
    }]),
    points: 50, exposure: 'C', jokerPolicy: 'no_jokers',
    description: 'Any 3 Suits, Pair 3, 6, or 9 in Third Suit',
  },
  {
    id: '2025-sp-4',
    section: 'singles_pairs',
    displayPattern: 'FF 11 22 11 22 11 22',
    patterns: check14([{
      groups: [
        pair(fl, 'blue'),
        pair(s(1), 'green'), pair(s(2), 'green'),
        pair(s(1), 'red'), pair(s(2), 'red'),
        pair(s(1), 'blue'), pair(s(2), 'blue'),
      ],
      numberConstraint: { type: 'any_run', length: 2 },
    }]),
    points: 50, exposure: 'C', jokerPolicy: 'no_jokers',
    description: 'Any 3 Suits, Any 2 Consec. Nos.',
  },
  {
    id: '2025-sp-5',
    section: 'singles_pairs',
    displayPattern: '11 33 55 77 99 11 11',
    patterns: check14([{
      groups: [
        pair(s(1), 'green'), pair(s(3), 'green'), pair(s(5), 'green'), pair(s(7), 'green'), pair(s(9), 'green'),
        pair(s(1), 'red'), pair(s(1), 'blue'),
      ],
      numberConstraint: { type: 'any_odd' },
    }]),
    points: 50, exposure: 'C', jokerPolicy: 'no_jokers',
    description: 'Any 3 Suits, Pairs Any Like Odd Nos. in Opp. Suits',
  },
  {
    id: '2025-sp-6',
    section: 'singles_pairs',
    displayPattern: 'FF 2025 2025 2025',
    patterns: check14([{
      groups: [
        pair(fl, 'blue'),
        mixed([s(2), zero, s(2), s(5)], 'green'),
        mixed([s(2), zero, s(2), s(5)], 'red'),
        mixed([s(2), zero, s(2), s(5)], 'blue'),
      ],
    }]),
    points: 75, exposure: 'C', jokerPolicy: 'no_jokers',
    description: 'Any 3 Suits',
  },
];

// ═══════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════

export const NMJL_2025: NMJLCard = {
  year: 2025,
  hands,
  meta: {
    totalHands: hands.length,
    sections: ['year', '2468', 'any_like_numbers', 'quints', 'consecutive_run', '13579', 'winds_dragons', '369', 'singles_pairs'],
    encodedDate: '2026-03-01',
    formatVersion: 1,
  },
};
