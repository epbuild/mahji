// ═══════════════════════════════════════════════════════════════
// NMJL Hand Validation & Matching Engine
// ═══════════════════════════════════════════════════════════════

import type { GameTile } from '@/data/tileData';
import type {
  NMJLCard, HandDefinition, HandPattern, TileGroup,
  TileRef, CardColor, ColorAssignment, SuitedTileSuit,
  MatchResult, PartialMatchResult, NumberConstraint,
} from './types';
import { DRAGON_SUIT_MAP, SUIT_TO_PREFIX, getValidRunStarts } from './constants';

// ═══════════════════════════════════════════════════════════════
// COLOR ASSIGNMENT ENUMERATION
// ═══════════════════════════════════════════════════════════════

const ALL_SUITS: SuitedTileSuit[] = ['dots', 'bamboo', 'characters'];

/**
 * Enumerate all valid suit assignments for the card colors used
 * in a pattern's suited tile groups.
 */
export function enumerateColorAssignments(pattern: HandPattern): ColorAssignment[] {
  const suitedColors = new Set<CardColor>();
  for (const group of pattern.groups) {
    const hasSuitedRef = group.tiles.some(t =>
      t.kind === 'suited' || t.kind === 'zero' ||
      (t.kind === 'dragon' && 'match' in t)
    );
    if (hasSuitedRef && group.color !== 'blue') {
      // Non-blue groups with suited/dragon-match refs need color assignment
      suitedColors.add(group.color);
    }
    // Blue groups with suited refs also need assignment (for 3-suit hands)
    if (hasSuitedRef && group.color === 'blue') {
      suitedColors.add('blue');
    }
  }

  const colorList = Array.from(suitedColors);
  if (colorList.length === 0) {
    return [{ red: 'dots', green: 'bamboo', blue: 'characters' }];
  }

  const results: ColorAssignment[] = [];
  function permute(idx: number, used: Set<SuitedTileSuit>, current: Partial<ColorAssignment>) {
    if (idx === colorList.length) {
      // Fill missing colors with any unused suit
      const full: ColorAssignment = { red: 'dots', green: 'bamboo', blue: 'characters', ...current };
      results.push(full);
      return;
    }
    for (const suit of ALL_SUITS) {
      if (used.has(suit)) continue;
      current[colorList[idx]] = suit;
      used.add(suit);
      permute(idx + 1, used, current);
      used.delete(suit);
      delete current[colorList[idx]];
    }
  }
  permute(0, new Set(), {});
  return results;
}

// ═══════════════════════════════════════════════════════════════
// TILE REF RESOLUTION
// ═══════════════════════════════════════════════════════════════

/**
 * Resolve a TileRef to a tileData.ts ID given a color assignment.
 * Returns null for refs that match multiple tiles (flowers, jokers).
 */
export function resolveTileRef(
  ref: TileRef,
  color: CardColor,
  assignment: ColorAssignment,
): string | null {
  switch (ref.kind) {
    case 'suited': {
      const suit = assignment[color];
      return `${SUIT_TO_PREFIX[suit]}-${ref.number}`;
    }
    case 'wind':
      return `wind-${ref.type}`;
    case 'dragon':
      if ('type' in ref) return `dragon-${ref.type}`;
      if ('match' in ref) {
        const suit = assignment[color];
        if (ref.match === 'color') return `dragon-${DRAGON_SUIT_MAP[suit]}`;
        if (ref.match === 'opposite') {
          // Find a dragon that does NOT match the suit
          const matching = DRAGON_SUIT_MAP[suit];
          const others = (['red', 'green', 'white'] as const).filter(d => d !== matching);
          return `dragon-${others[0]}`; // Pick first non-matching
        }
      }
      return null;
    case 'flower':
      return null; // Matches any flower-1..flower-8
    case 'zero':
      return 'dragon-white';
  }
}

// ═══════════════════════════════════════════════════════════════
// NUMBER CONSTRAINT EXPANSION
// ═══════════════════════════════════════════════════════════════

/**
 * Expand a pattern's number constraint into all valid variations.
 */
export function expandNumberConstraint(
  constraint: NumberConstraint | undefined,
  basePattern: HandPattern,
): HandPattern[] {
  if (!constraint || constraint.type === 'fixed') return [basePattern];

  switch (constraint.type) {
    case 'any_run': {
      const starts = getValidRunStarts(constraint.length);
      const baseStart = Math.min(
        ...basePattern.groups
          .flatMap(g => g.tiles)
          .filter((t): t is Extract<TileRef, { kind: 'suited' }> => t.kind === 'suited')
          .map(t => t.number)
      );
      return starts.map(start => offsetPattern(basePattern, start - baseStart));
    }
    case 'any_like':
      return Array.from({ length: 9 }, (_, i) => i + 1).map(n =>
        substitutePositions(basePattern, constraint.positions, n)
      );
    case 'any_even':
      return [2, 4, 6, 8].map(n => substituteAll(basePattern, n));
    case 'any_odd':
      return [1, 3, 5, 7, 9].map(n => substituteAll(basePattern, n));
    case 'any_369':
      return [3, 6, 9].map(n => substituteAll(basePattern, n));
    case 'any_number': {
      const [min, max] = constraint.range ?? [1, 9];
      return Array.from({ length: max - min + 1 }, (_, i) => min + i)
        .map(n => substituteAll(basePattern, n));
    }
  }
}

function offsetPattern(pattern: HandPattern, offset: number): HandPattern {
  return {
    ...pattern,
    groups: pattern.groups.map(g => ({
      ...g,
      tiles: g.tiles.map(t =>
        t.kind === 'suited' ? { ...t, number: t.number + offset } : t
      ),
    })),
    numberConstraint: { type: 'fixed' },
  };
}

function substitutePositions(pattern: HandPattern, positions: number[], n: number): HandPattern {
  return {
    ...pattern,
    groups: pattern.groups.map((g, idx) => {
      if (!positions.includes(idx)) return g;
      return {
        ...g,
        tiles: g.tiles.map(t => t.kind === 'suited' ? { ...t, number: n } : t),
      };
    }),
    numberConstraint: { type: 'fixed' },
  };
}

function substituteAll(pattern: HandPattern, n: number): HandPattern {
  return {
    ...pattern,
    groups: pattern.groups.map(g => ({
      ...g,
      tiles: g.tiles.map(t => t.kind === 'suited' ? { ...t, number: n } : t),
    })),
    numberConstraint: { type: 'fixed' },
  };
}

// ═══════════════════════════════════════════════════════════════
// GROUP → TILE ID RESOLUTION
// ═══════════════════════════════════════════════════════════════

export function resolveGroupToTileIds(
  group: TileGroup,
  assignment: ColorAssignment,
): string[] {
  const ids: string[] = [];
  if (group.type === 'mixed') {
    for (const ref of group.tiles) {
      const id = resolveTileRef(ref, group.color, assignment);
      ids.push(id ?? specialToken(ref));
    }
  } else {
    const ref = group.tiles[0];
    const id = resolveTileRef(ref, group.color, assignment);
    for (let i = 0; i < group.count; i++) {
      ids.push(id ?? specialToken(ref));
    }
  }
  return ids;
}

function specialToken(ref: TileRef): string {
  if (ref.kind === 'flower') return '__flower__';
  return '__unknown__';
}

// ═══════════════════════════════════════════════════════════════
// MAIN VALIDATION API
// ═══════════════════════════════════════════════════════════════

/**
 * Check if 14 tiles match ANY hand on the card.
 */
export function validateHand(tiles: GameTile[], card: NMJLCard): MatchResult {
  if (tiles.length !== 14) return { matched: false };
  for (const hand of card.hands) {
    const result = matchHandDefinition(tiles, hand);
    if (result.matched) return result;
  }
  return { matched: false };
}

/**
 * Find all matching hands for a set of 14 tiles.
 */
export function findAllMatches(tiles: GameTile[], card: NMJLCard): MatchResult[] {
  return card.hands.map(h => matchHandDefinition(tiles, h)).filter(r => r.matched);
}

/**
 * Find partial matches for hand-building hints.
 * Returns hands sorted by completion percentage (descending).
 */
export function findPartialMatches(
  tiles: GameTile[],
  card: NMJLCard,
  minCompletionPct = 0.3,
): PartialMatchResult[] {
  const results: PartialMatchResult[] = [];
  for (const hand of card.hands) {
    for (let pi = 0; pi < hand.patterns.length; pi++) {
      const pattern = hand.patterns[pi];
      const expanded = expandNumberConstraint(pattern.numberConstraint, pattern);
      for (const ep of expanded) {
        const assignments = enumerateColorAssignments(ep);
        // Try ALL assignments and keep the best one (not just the first that passes)
        let bestPartial: ReturnType<typeof computePartialMatch> | null = null;
        let bestAssignment: ColorAssignment | null = null;
        for (const assignment of assignments) {
          const partial = computePartialMatch(tiles, ep, assignment);
          if (partial.completionPct >= minCompletionPct) {
            if (!bestPartial || partial.matchedCount > bestPartial.matchedCount) {
              bestPartial = partial;
              bestAssignment = assignment;
            }
          }
        }
        if (bestPartial && bestAssignment) {
          results.push({ hand, patternIndex: pi, ...bestPartial, colorAssignment: bestAssignment });
        }
      }
    }
  }
  return results.sort((a, b) => b.completionPct - a.completionPct);
}

// ═══════════════════════════════════════════════════════════════
// INTERNAL MATCHING
// ═══════════════════════════════════════════════════════════════

function matchHandDefinition(tiles: GameTile[], hand: HandDefinition): MatchResult {
  for (let pi = 0; pi < hand.patterns.length; pi++) {
    const pattern = hand.patterns[pi];
    const expanded = expandNumberConstraint(pattern.numberConstraint, pattern);
    for (const ep of expanded) {
      const assignments = enumerateColorAssignments(ep);
      for (const assignment of assignments) {
        const result = matchPattern(tiles, ep, assignment, hand, pi);
        if (result.matched) return result;
      }
    }
  }
  return { matched: false, hand };
}

function matchPattern(
  tiles: GameTile[],
  pattern: HandPattern,
  assignment: ColorAssignment,
  hand: HandDefinition,
  patternIndex: number,
): MatchResult {
  const pool = tiles.map(t => ({ ...t, used: false }));
  const jokerAssignments: MatchResult['jokerAssignments'] = [];

  for (const group of pattern.groups) {
    const needed = resolveGroupToTileIds(group, assignment);
    for (const neededId of needed) {
      // Try natural tile first
      let found = false;

      if (neededId === '__flower__') {
        const idx = pool.findIndex(t => !t.used && t.suit === 'flowers');
        if (idx >= 0) { pool[idx].used = true; found = true; }
      } else if (neededId !== '__unknown__') {
        const idx = pool.findIndex(t => !t.used && t.id === neededId);
        if (idx >= 0) { pool[idx].used = true; found = true; }
      }

      if (!found) {
        // Try joker substitution
        if (hand.jokerPolicy === 'no_jokers') return { matched: false, hand };
        if (group.type === 'single' || group.type === 'pair') return { matched: false, hand };

        const jokerIdx = pool.findIndex(t => !t.used && t.suit === 'jokers');
        if (jokerIdx >= 0) {
          jokerAssignments!.push({ jokerInstanceId: pool[jokerIdx].instanceId, substituteFor: neededId });
          pool[jokerIdx].used = true;
        } else {
          return { matched: false, hand };
        }
      }
    }
  }

  const unused = pool.filter(t => !t.used);
  if (unused.length > 0) return { matched: false, hand };

  return { matched: true, hand, patternIndex, colorAssignment: assignment, jokerAssignments };
}

function computePartialMatch(
  tiles: GameTile[],
  pattern: HandPattern,
  assignment: ColorAssignment,
): { completionPct: number; matchedCount: number; tilesNeeded: string[] } {
  const neededIds = pattern.groups.flatMap(g => resolveGroupToTileIds(g, assignment));
  const available = new Map<string, number>();
  for (const tile of tiles) {
    const key = tile.suit === 'flowers' ? '__flower__' : tile.suit === 'jokers' ? '__joker__' : tile.id;
    available.set(key, (available.get(key) ?? 0) + 1);
  }

  let matched = 0;
  const tilesNeeded: string[] = [];
  const used = new Map<string, number>();

  for (const id of neededIds) {
    const usedCount = used.get(id) ?? 0;
    const availCount = available.get(id) ?? 0;
    if (usedCount < availCount) {
      matched++;
      used.set(id, usedCount + 1);
    } else {
      tilesNeeded.push(id);
    }
  }

  return { completionPct: matched / 14, matchedCount: matched, tilesNeeded };
}

// ═══════════════════════════════════════════════════════════════
// UTILITY EXPORTS
// ═══════════════════════════════════════════════════════════════

/** Get all hands in a specific section */
export function getHandsBySection(card: NMJLCard, section: string): HandDefinition[] {
  return card.hands.filter(h => h.section === section);
}

/** Get hands sorted by point value */
export function getHandsByPoints(card: NMJLCard, ascending = true): HandDefinition[] {
  return [...card.hands].sort((a, b) => ascending ? a.points - b.points : b.points - a.points);
}

/** Get concealed-only hands */
export function getConcealedHands(card: NMJLCard): HandDefinition[] {
  return card.hands.filter(h => h.exposure === 'C');
}

/** Check if a tile could be useful for a specific hand */
export function isTileUsefulForHand(tileId: string, hand: HandDefinition): boolean {
  for (const pattern of hand.patterns) {
    const expanded = expandNumberConstraint(pattern.numberConstraint, pattern);
    for (const ep of expanded) {
      const assignments = enumerateColorAssignments(ep);
      for (const assignment of assignments) {
        const needed = ep.groups.flatMap(g => resolveGroupToTileIds(g, assignment));
        if (needed.includes(tileId) || (tileId.startsWith('flower-') && needed.includes('__flower__'))) {
          return true;
        }
      }
    }
  }
  return false;
}
