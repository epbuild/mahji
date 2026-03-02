// ═══════════════════════════════════════════════════════════════
// NMJL 2024 Card Data
// ═══════════════════════════════════════════════════════════════
//
// Transcribed from the official 2024 NMJL card photograph.
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

/** Verify a hand pattern sums to 14 tiles */
function check14(patterns: HandPattern[]): HandPattern[] {
  for (const p of patterns) {
    const total = p.groups.reduce((sum, g) => sum + g.count, 0);
    if (total !== 14) console.warn(`[NMJL 2024] Hand pattern has ${total} tiles, expected 14`);
  }
  return patterns;
}

// ═══════════════════════════════════════════════════════════════
// HANDS
// ═══════════════════════════════════════════════════════════════

const hands: HandDefinition[] = [

  // ─── YEAR (2024) ────────────────────────────────────────────

  {
    id: '2024-year-1',
    section: 'year',
    displayPattern: '222 000 2222 4444',
    patterns: check14([{
      groups: [pung(s(2), 'green'), pung(zero, 'blue'), kong(s(2), 'red'), kong(s(4), 'red')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 Suits',
  },
  {
    id: '2024-year-2',
    section: 'year',
    displayPattern: 'FFFF 2222 0000 24',
    patterns: check14([{
      groups: [kong(fl, 'blue'), kong(s(2), 'green'), kong(zero, 'green'), single(s(2), 'red'), single(s(4), 'red')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 Suits',
  },
  {
    id: '2024-year-3',
    section: 'year',
    displayPattern: 'FF 2024 2222 2222',
    patterns: check14([{
      groups: [
        pair(fl, 'blue'),
        mixed([s(2), zero, s(2), s(4)], 'red'),
        kong(s(2), 'green'),
        kong(s(2), 'blue'),
      ],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Like Kongs 2s or 4s',
  },
  {
    id: '2024-year-4',
    section: 'year',
    displayPattern: 'NN EEE 2024 WWW SS',
    patterns: check14([{
      groups: [
        pair(wN, 'blue'), pung(wE, 'blue'),
        mixed([s(2), zero, s(2), s(4)], 'green'),
        pung(wW, 'blue'), pair(wS, 'blue'),
      ],
    }]),
    points: 30, exposure: 'C', jokerPolicy: 'standard',
    description: '2024 Any 1 Suit',
  },

  // ─── 2468 ───────────────────────────────────────────────────

  {
    id: '2024-2468-1',
    section: '2468',
    displayPattern: '222 444 6666 8888',
    patterns: check14([
      { groups: [pung(s(2), 'green'), pung(s(4), 'green'), kong(s(6), 'green'), kong(s(8), 'green')] },
      { groups: [pung(s(2), 'green'), pung(s(4), 'red'), kong(s(6), 'red'), kong(s(8), 'red')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 or 2 Suits',
  },
  {
    id: '2024-2468-2',
    section: '2468',
    displayPattern: '22 444 44 666 8888',
    patterns: check14([{
      groups: [pair(s(2), 'green'), pung(s(4), 'green'), pair(s(4), 'red'), pung(s(6), 'red'), kong(s(8), 'blue')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits',
  },
  {
    id: '2024-2468-3',
    section: '2468',
    displayPattern: '22 44 666 888 DDDD',
    patterns: check14([{
      groups: [pair(s(2), 'green'), pair(s(4), 'green'), pung(s(6), 'green'), pung(s(8), 'green'), kong(dMatch, 'green')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 Suit w Matching Dragons',
  },
  {
    id: '2024-2468-4',
    section: '2468',
    displayPattern: 'FFFF 4444 x 6666 = 24',
    patterns: check14([
      { groups: [kong(fl, 'blue'), kong(s(4), 'green'), kong(s(6), 'red'), mixed([s(2), s(4)], 'blue')] },
      { groups: [kong(fl, 'blue'), kong(s(6), 'green'), kong(s(8), 'red'), mixed([s(4), s(8)], 'blue')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits (multiplication hands)',
  },
  {
    id: '2024-2468-5',
    section: '2468',
    displayPattern: 'FF 2222 44 66 8888',
    patterns: check14([
      { groups: [pair(fl, 'blue'), kong(s(2), 'green'), pair(s(4), 'green'), pair(s(6), 'green'), kong(s(8), 'green')] },
      { groups: [pair(fl, 'blue'), kong(s(2), 'green'), pair(s(4), 'red'), pair(s(6), 'red'), kong(s(8), 'red')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 or 2 Suits',
  },
  {
    id: '2024-2468-6',
    section: '2468',
    displayPattern: 'FF 222 44 666 88 88',
    patterns: check14([{
      groups: [pair(fl, 'blue'), pung(s(2), 'green'), pair(s(4), 'green'), pung(s(6), 'green'), pair(s(8), 'red'), pair(s(8), 'blue')],
    }]),
    points: 35, exposure: 'C', jokerPolicy: 'standard',
    description: 'Any 3 Suits',
  },

  // ─── ANY LIKE NUMBERS ───────────────────────────────────────

  {
    id: '2024-aln-1',
    section: 'any_like_numbers',
    displayPattern: 'FFFF 111 1111 111',
    patterns: check14([{
      groups: [kong(fl, 'blue'), pung(s(1), 'green'), kong(s(1), 'red'), pung(s(1), 'green')],
      numberConstraint: { type: 'any_like', positions: [1, 2, 3] },
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits',
  },
  {
    id: '2024-aln-2',
    section: 'any_like_numbers',
    displayPattern: '11 DDD 11 DDD 1111',
    patterns: check14([{
      groups: [pair(s(1), 'green'), pung(dMatch, 'green'), pair(s(1), 'red'), pung(dMatch, 'red'), kong(s(1), 'blue')],
      numberConstraint: { type: 'any_like', positions: [0, 2, 4] },
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Pairs and Dragons Match',
  },
  {
    id: '2024-aln-3',
    section: 'any_like_numbers',
    displayPattern: 'FF 1111 NEWS 1111',
    patterns: check14([{
      groups: [pair(fl, 'blue'), kong(s(1), 'green'), mixed([wN, wE, wW, wS], 'blue'), kong(s(1), 'red')],
      numberConstraint: { type: 'any_like', positions: [1, 3] },
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 Suits',
  },

  // ─── ADDITION HANDS (LUCKY SEVENS) ─────────────────────────

  {
    id: '2024-add-1',
    section: 'addition',
    displayPattern: 'FF 1111 + 6666 = 7777',
    patterns: check14([{
      groups: [pair(fl, 'blue'), kong(s(1), 'green'), kong(s(6), 'green'), kong(s(7), 'green')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 Suit',
  },
  {
    id: '2024-add-2',
    section: 'addition',
    displayPattern: 'FF 2222 + 5555 = 7777',
    patterns: check14([{
      groups: [pair(fl, 'blue'), kong(s(2), 'green'), kong(s(5), 'green'), kong(s(7), 'green')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 Suit',
  },
  {
    id: '2024-add-3',
    section: 'addition',
    displayPattern: 'FF 3333 + 4444 = 7777',
    patterns: check14([{
      groups: [pair(fl, 'blue'), kong(s(3), 'green'), kong(s(4), 'green'), kong(s(7), 'green')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 Suit',
  },

  // ─── QUINTS ─────────────────────────────────────────────────

  {
    id: '2024-quint-1',
    section: 'quints',
    displayPattern: 'FF 11111 22 33333',
    patterns: check14([{
      groups: [pair(fl, 'blue'), quint(s(1), 'green'), pair(s(2), 'green'), quint(s(3), 'green')],
      numberConstraint: { type: 'any_run', length: 3 },
    }]),
    points: 40, exposure: 'X', jokerPolicy: 'quints_required',
    description: 'Any 1 Suit, Any 3 Consec. Nos.',
  },
  {
    id: '2024-quint-2',
    section: 'quints',
    displayPattern: '11111 NNNN 88888',
    patterns: check14([{
      groups: [quint(s(1), 'green'), kong(wN, 'blue'), quint(s(8), 'red')],
      numberConstraint: { type: 'any_number' },
    }]),
    points: 40, exposure: 'X', jokerPolicy: 'quints_required',
    description: 'Any 2 Suits, Quints Any 2 Non-Matching Nos., Any Wind',
  },
  {
    id: '2024-quint-3',
    section: 'quints',
    displayPattern: '11 22222 11 22222',
    patterns: check14([{
      groups: [pair(s(1), 'green'), quint(s(2), 'green'), pair(s(1), 'red'), quint(s(2), 'red')],
      numberConstraint: { type: 'any_run', length: 2 },
    }]),
    points: 45, exposure: 'X', jokerPolicy: 'quints_required',
    description: 'Any 2 Suits, Any 2 Consec. Nos.',
  },
  {
    id: '2024-quint-4',
    section: 'quints',
    displayPattern: 'FFFFF DDDD 11111',
    patterns: check14([{
      groups: [quint(fl, 'blue'), kong(dMatch, 'green'), quint(s(1), 'green')],
      numberConstraint: { type: 'any_number' },
    }]),
    points: 40, exposure: 'X', jokerPolicy: 'quints_required',
    description: 'Any 2 Suits, Quint Any No.',
  },

  // ─── CONSECUTIVE RUN ────────────────────────────────────────

  {
    id: '2024-consec-1',
    section: 'consecutive_run',
    displayPattern: '111 22 3333 44 555',
    patterns: check14([
      { groups: [pung(s(1), 'green'), pair(s(2), 'green'), kong(s(3), 'green'), pair(s(4), 'green'), pung(s(5), 'green')] },
      { groups: [pung(s(5), 'green'), pair(s(6), 'green'), kong(s(7), 'green'), pair(s(8), 'green'), pung(s(9), 'green')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'These Nos. Only',
  },
  {
    id: '2024-consec-2',
    section: 'consecutive_run',
    displayPattern: '11 222 DDDD 333 44',
    patterns: check14([{
      groups: [pair(s(1), 'green'), pung(s(2), 'green'), kong(dOpp, 'red'), pung(s(3), 'green'), pair(s(4), 'green')],
      numberConstraint: { type: 'any_run', length: 4 },
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 4 Consec. Nos. in Any 1 Suit, Kong Opp. Dragons',
  },
  {
    id: '2024-consec-3',
    section: 'consecutive_run',
    displayPattern: 'FF 1111 2222 3333',
    patterns: check14([
      { groups: [pair(fl, 'blue'), kong(s(1), 'green'), kong(s(2), 'green'), kong(s(3), 'green')], numberConstraint: { type: 'any_run', length: 3 } },
      { groups: [pair(fl, 'blue'), kong(s(1), 'red'), kong(s(2), 'green'), kong(s(3), 'red')], numberConstraint: { type: 'any_run', length: 3 } },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 or 3 Suits, Any 3 Consec. Nos.',
  },
  {
    id: '2024-consec-4',
    section: 'consecutive_run',
    displayPattern: '1 22 3333 1 22 3333',
    patterns: check14([{
      groups: [single(s(1), 'green'), pair(s(2), 'green'), kong(s(3), 'green'), single(s(1), 'red'), pair(s(2), 'red'), kong(s(3), 'red')],
      numberConstraint: { type: 'any_run', length: 3 },
    }]),
    points: 30, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 Suits, Any 3 Consec. Nos.',
  },
  {
    id: '2024-consec-5',
    section: 'consecutive_run',
    displayPattern: '11 22 333 444 DDDD',
    patterns: check14([{
      groups: [pair(s(1), 'green'), pair(s(2), 'green'), pung(s(3), 'green'), pung(s(4), 'green'), kong(dMatch, 'green')],
      numberConstraint: { type: 'any_run', length: 4 },
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 Suit, Any 4 Consec. Nos. w Matching Dragons',
  },
  {
    id: '2024-consec-6',
    section: 'consecutive_run',
    displayPattern: 'FFFFF 123 444 444',
    patterns: check14([{
      groups: [quint(fl, 'blue'), mixed([s(1), s(2), s(3)], 'green'), pung(s(4), 'red'), pung(s(4), 'blue')],
      numberConstraint: { type: 'any_run', length: 4 },
    }]),
    points: 30, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Any 4 Consec. Nos.',
  },
  {
    id: '2024-consec-7',
    section: 'consecutive_run',
    displayPattern: '111 222 3333 4444',
    patterns: check14([
      { groups: [pung(s(1), 'green'), pung(s(2), 'green'), kong(s(3), 'green'), kong(s(4), 'green')], numberConstraint: { type: 'any_run', length: 4 } },
      { groups: [pung(s(1), 'green'), pung(s(2), 'red'), kong(s(3), 'green'), kong(s(4), 'red')], numberConstraint: { type: 'any_run', length: 4 } },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 or 2 Suits, Any 4 Consec. Nos.',
  },
  {
    id: '2024-consec-8',
    section: 'consecutive_run',
    displayPattern: '111 222 111 222 33',
    patterns: check14([{
      groups: [pung(s(1), 'green'), pung(s(2), 'green'), pung(s(1), 'red'), pung(s(2), 'red'), pair(s(3), 'blue')],
      numberConstraint: { type: 'any_run', length: 3 },
    }]),
    points: 30, exposure: 'C', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Any 3 Consec. Nos.',
  },

  // ─── 13579 ──────────────────────────────────────────────────

  {
    id: '2024-13579-1',
    section: '13579',
    displayPattern: '111 33 5555 77 999',
    patterns: check14([
      { groups: [pung(s(1), 'green'), pair(s(3), 'green'), kong(s(5), 'green'), pair(s(7), 'green'), pung(s(9), 'green')] },
      { groups: [pung(s(1), 'red'), pair(s(3), 'red'), kong(s(5), 'red'), pair(s(7), 'red'), pung(s(9), 'red')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 or 3 Suits',
  },
  {
    id: '2024-13579-2',
    section: '13579',
    displayPattern: '111 333 3333 5555',
    patterns: check14([
      { groups: [pung(s(1), 'green'), pung(s(3), 'red'), kong(s(3), 'red'), kong(s(5), 'red')] },
      { groups: [pung(s(5), 'green'), pung(s(7), 'red'), kong(s(7), 'red'), kong(s(9), 'red')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 Suits',
  },
  {
    id: '2024-13579-3',
    section: '13579',
    displayPattern: 'FF 11 333 5555 DDD',
    patterns: check14([
      { groups: [pair(fl, 'blue'), pair(s(1), 'green'), pung(s(3), 'green'), kong(s(5), 'green'), pung(dMatch, 'green')] },
      { groups: [pair(fl, 'blue'), pair(s(5), 'green'), pung(s(7), 'green'), kong(s(9), 'green'), pung(dMatch, 'green')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 Suit w Matching Dragons',
  },
  {
    id: '2024-13579-4',
    section: '13579',
    displayPattern: '11 33 55 7777 9999',
    patterns: check14([{
      groups: [pair(s(1), 'green'), pair(s(3), 'green'), pair(s(5), 'green'), kong(s(7), 'red'), kong(s(9), 'blue')],
    }]),
    points: 30, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits',
  },
  {
    id: '2024-13579-5',
    section: '13579',
    displayPattern: 'FFFF 3333 x 5555 = 15',
    patterns: check14([
      { groups: [kong(fl, 'blue'), kong(s(3), 'green'), kong(s(5), 'red'), mixed([s(1), s(5)], 'blue')] },
      { groups: [kong(fl, 'blue'), kong(s(5), 'green'), kong(s(7), 'red'), mixed([s(3), s(5)], 'blue')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits',
  },
  {
    id: '2024-13579-6',
    section: '13579',
    displayPattern: '11 33 333 555 DDDD',
    patterns: check14([
      { groups: [pair(s(1), 'green'), pair(s(3), 'green'), pung(s(3), 'red'), pung(s(5), 'red'), kong(dMatch, 'blue')] },
      { groups: [pair(s(5), 'green'), pair(s(7), 'green'), pung(s(7), 'red'), pung(s(9), 'red'), kong(dMatch, 'blue')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits',
  },
  {
    id: '2024-13579-7',
    section: '13579',
    displayPattern: '111 33 555 333 333',
    patterns: check14([
      { groups: [pung(s(1), 'green'), pair(s(3), 'green'), pung(s(5), 'green'), pung(s(3), 'red'), pung(s(3), 'blue')] },
      { groups: [pung(s(5), 'green'), pair(s(7), 'green'), pung(s(9), 'green'), pung(s(7), 'red'), pung(s(7), 'blue')] },
    ]),
    points: 35, exposure: 'C', jokerPolicy: 'standard',
    description: 'Any 3 Suits, These Nos. Only',
  },

  // ─── WINDS & DRAGONS ────────────────────────────────────────

  {
    id: '2024-wd-1',
    section: 'winds_dragons',
    displayPattern: 'NNNN EEE WWW SSSS',
    patterns: check14([
      { groups: [kong(wN, 'blue'), pung(wE, 'blue'), pung(wW, 'blue'), kong(wS, 'blue')] },
      { groups: [pung(wN, 'blue'), kong(wE, 'blue'), kong(wW, 'blue'), pung(wS, 'blue')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
  },
  {
    id: '2024-wd-2',
    section: 'winds_dragons',
    displayPattern: 'FFFF DDD DDDD DDD',
    patterns: check14([{
      groups: [kong(fl, 'blue'), pung(dR, 'red'), kong(dG, 'green'), pung(dW, 'blue')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Dragons',
  },
  {
    id: '2024-wd-3',
    section: 'winds_dragons',
    displayPattern: 'NNN SSS 1111 2222',
    patterns: check14([
      { groups: [pung(wN, 'blue'), pung(wS, 'blue'), kong(s(1), 'green'), kong(s(2), 'red')], numberConstraint: { type: 'any_run', length: 2 } },
      { groups: [pung(wE, 'blue'), pung(wW, 'blue'), kong(s(1), 'green'), kong(s(2), 'red')], numberConstraint: { type: 'any_run', length: 2 } },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 Suits, Any 2 Consec. Nos.',
  },
  {
    id: '2024-wd-4',
    section: 'winds_dragons',
    displayPattern: 'FF NN EEE WWW SSSS',
    patterns: check14([{
      groups: [pair(fl, 'blue'), pair(wN, 'blue'), pung(wE, 'blue'), pung(wW, 'blue'), kong(wS, 'blue')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
  },
  {
    id: '2024-wd-5',
    section: 'winds_dragons',
    displayPattern: 'NNNN 11 22 33 SSSS',
    patterns: check14([
      { groups: [kong(wN, 'blue'), pair(s(1), 'green'), pair(s(2), 'green'), pair(s(3), 'green'), kong(wS, 'blue')], numberConstraint: { type: 'any_run', length: 3 } },
      { groups: [kong(wE, 'blue'), pair(s(1), 'green'), pair(s(2), 'green'), pair(s(3), 'green'), kong(wW, 'blue')], numberConstraint: { type: 'any_run', length: 3 } },
    ]),
    points: 30, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 Suit, Any 3 Consec. Nos.',
  },
  {
    id: '2024-wd-6',
    section: 'winds_dragons',
    displayPattern: 'FF DDDD NEWS DDDD',
    patterns: check14([{
      groups: [pair(fl, 'blue'), kong(dR, 'red'), mixed([wN, wE, wW, wS], 'blue'), kong(dG, 'green')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 Dragons',
  },
  {
    id: '2024-wd-7',
    section: 'winds_dragons',
    displayPattern: 'NNN EW SSS 111 111',
    patterns: check14([{
      groups: [pung(wN, 'blue'), single(wE, 'blue'), single(wW, 'blue'), pung(wS, 'blue'), pung(s(1), 'green'), pung(s(1), 'red')],
      numberConstraint: { type: 'any_like', positions: [4, 5] },
    }]),
    points: 30, exposure: 'C', jokerPolicy: 'standard',
    description: 'Any 2 Suits, Any Like Nos.',
  },

  // ─── 369 ────────────────────────────────────────────────────

  {
    id: '2024-369-1',
    section: '369',
    displayPattern: '333 666 6666 9999',
    patterns: check14([
      { groups: [pung(s(3), 'green'), pung(s(6), 'green'), kong(s(6), 'green'), kong(s(9), 'green')] },
      { groups: [pung(s(3), 'green'), pung(s(6), 'red'), kong(s(6), 'red'), kong(s(9), 'red')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 or 3 Suits',
  },
  {
    id: '2024-369-2',
    section: '369',
    displayPattern: 'FF 3 66 999 333 333',
    patterns: check14([
      // Like pungs of 3
      { groups: [pair(fl, 'blue'), single(s(3), 'green'), pair(s(6), 'green'), pung(s(9), 'green'), pung(s(3), 'red'), pung(s(3), 'blue')] },
      // Like pungs of 6
      { groups: [pair(fl, 'blue'), single(s(3), 'green'), pair(s(6), 'green'), pung(s(9), 'green'), pung(s(6), 'red'), pung(s(6), 'blue')] },
      // Like pungs of 9
      { groups: [pair(fl, 'blue'), single(s(3), 'green'), pair(s(6), 'green'), pung(s(9), 'green'), pung(s(9), 'red'), pung(s(9), 'blue')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits, Like Pungs 3, 6 or 9',
  },
  {
    id: '2024-369-3',
    section: '369',
    displayPattern: 'FF 3333 6666 9999',
    patterns: check14([
      { groups: [pair(fl, 'blue'), kong(s(3), 'green'), kong(s(6), 'green'), kong(s(9), 'green')] },
      { groups: [pair(fl, 'blue'), kong(s(3), 'red'), kong(s(6), 'green'), kong(s(9), 'red')] },
    ]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 1 or 3 Suits',
  },
  {
    id: '2024-369-4',
    section: '369',
    displayPattern: '333 DDDD 333 DDDD',
    patterns: check14([{
      groups: [pung(s(3), 'green'), kong(dMatch, 'green'), pung(s(3), 'red'), kong(dMatch, 'red')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 2 Suits, Pungs 3, 6 or 9 w Matching Dragons',
  },
  {
    id: '2024-369-5',
    section: '369',
    displayPattern: '3333 66 66 66 9999',
    patterns: check14([{
      groups: [kong(s(3), 'green'), pair(s(6), 'green'), pair(s(6), 'red'), pair(s(6), 'blue'), kong(s(9), 'green')],
    }]),
    points: 30, exposure: 'X', jokerPolicy: 'standard',
    description: 'Any 3 Suits, 3s and 9s Match',
  },
  {
    id: '2024-369-6',
    section: '369',
    displayPattern: 'FFFF 33 66 999 DDD',
    patterns: check14([{
      groups: [kong(fl, 'blue'), pair(s(3), 'green'), pair(s(6), 'green'), pung(s(9), 'green'), pung(dOpp, 'red')],
    }]),
    points: 25, exposure: 'X', jokerPolicy: 'standard',
    description: 'Nos. Any 1 Suit, Any Opp. Dragon',
  },
  {
    id: '2024-369-7',
    section: '369',
    displayPattern: '333 666 333 666 99',
    patterns: check14([{
      groups: [pung(s(3), 'green'), pung(s(6), 'green'), pung(s(3), 'red'), pung(s(6), 'red'), pair(s(9), 'blue')],
    }]),
    points: 30, exposure: 'C', jokerPolicy: 'standard',
    description: 'Any 3 Suits',
  },

  // ─── SINGLES AND PAIRS ──────────────────────────────────────

  {
    id: '2024-sp-1',
    section: 'singles_pairs',
    displayPattern: 'FF 22 46 88 22 46 88',
    patterns: check14([{
      groups: [
        pair(fl, 'blue'),
        pair(s(2), 'green'), mixed([s(4), s(6)], 'green'), pair(s(8), 'green'),
        pair(s(2), 'red'), mixed([s(4), s(6)], 'red'), pair(s(8), 'red'),
      ],
    }]),
    points: 50, exposure: 'C', jokerPolicy: 'no_jokers',
    description: 'Any 2 Suits',
  },
  {
    id: '2024-sp-2',
    section: 'singles_pairs',
    displayPattern: 'FF 11 33 55 55 77 99',
    patterns: check14([{
      groups: [
        pair(fl, 'blue'),
        pair(s(1), 'green'), pair(s(3), 'green'), pair(s(5), 'green'),
        pair(s(5), 'red'), pair(s(7), 'red'), pair(s(9), 'red'),
      ],
    }]),
    points: 50, exposure: 'C', jokerPolicy: 'no_jokers',
    description: 'Any 2 Suits',
  },
  {
    id: '2024-sp-3',
    section: 'singles_pairs',
    displayPattern: '112 11223 112233',
    patterns: check14([
      { groups: [mixed([s(1), s(1), s(2)], 'green'), mixed([s(1), s(1), s(2), s(2), s(3)], 'red'), mixed([s(1), s(1), s(2), s(2), s(3), s(3)], 'blue')] },
      { groups: [mixed([s(9), s(9), s(8)], 'green'), mixed([s(9), s(9), s(8), s(8), s(7)], 'red'), mixed([s(9), s(9), s(8), s(8), s(7), s(7)], 'blue')] },
    ]),
    points: 50, exposure: 'C', jokerPolicy: 'no_jokers',
    description: 'Any 3 Suits, These Nos. Only',
  },
  {
    id: '2024-sp-4',
    section: 'singles_pairs',
    displayPattern: 'FF 33 66 99 369 369',
    patterns: check14([{
      groups: [
        pair(fl, 'blue'),
        pair(s(3), 'green'), pair(s(6), 'green'), pair(s(9), 'green'),
        mixed([s(3), s(6), s(9)], 'red'), mixed([s(3), s(6), s(9)], 'blue'),
      ],
    }]),
    points: 50, exposure: 'C', jokerPolicy: 'no_jokers',
    description: 'Any 3 Suits',
  },
  {
    id: '2024-sp-5',
    section: 'singles_pairs',
    displayPattern: '11 22 33 44 55 DD DD',
    patterns: check14([{
      groups: [
        pair(s(1), 'green'), pair(s(2), 'green'), pair(s(3), 'green'), pair(s(4), 'green'), pair(s(5), 'green'),
        pair(dOpp, 'red'), pair(dOpp, 'blue'),
      ],
      numberConstraint: { type: 'any_run', length: 5 },
    }]),
    points: 50, exposure: 'C', jokerPolicy: 'no_jokers',
    description: 'Any 5 Consec. Nos. w Opp. Dragons',
  },
  {
    id: '2024-sp-6',
    section: 'singles_pairs',
    displayPattern: '2024 NN EW SS 2024',
    patterns: check14([{
      groups: [
        mixed([s(2), zero, s(2), s(4)], 'green'),
        pair(wN, 'blue'), single(wE, 'blue'), single(wW, 'blue'), pair(wS, 'blue'),
        mixed([s(2), zero, s(2), s(4)], 'red'),
      ],
    }]),
    points: 75, exposure: 'C', jokerPolicy: 'no_jokers',
    description: 'Any 2 Suits',
  },
];

// ═══════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════

export const NMJL_2024: NMJLCard = {
  year: 2024,
  hands,
  meta: {
    totalHands: hands.length,
    sections: ['year', '2468', 'any_like_numbers', 'addition', 'quints', 'consecutive_run', '13579', 'winds_dragons', '369', 'singles_pairs'],
    encodedDate: '2026-03-01',
    formatVersion: 1,
  },
};
