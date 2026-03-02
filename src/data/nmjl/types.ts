// ═══════════════════════════════════════════════════════════════
// NMJL Card Data Types
// ═══════════════════════════════════════════════════════════════

/**
 * CardColor represents the color printed on the NMJL card.
 * Same color = same suit, different colors = different suits.
 * 'blue' is also used for inherently unsuiteed tiles (winds, flowers).
 */
export type CardColor = 'red' | 'green' | 'blue';

/** The three numbered suits in Mahjong */
export type SuitedTileSuit = 'dots' | 'bamboo' | 'characters';

/** Maps card colors to actual suits — resolved at validation time */
export type ColorAssignment = Record<CardColor, SuitedTileSuit>;

// ═══════════════════════════════════════════════════════════════
// TILE REFERENCES
// ═══════════════════════════════════════════════════════════════

/**
 * TileRef bridges the card's visual notation to tileData.ts IDs.
 *   suited(3)     → 'dot-3' or 'bam-3' or 'char-3' (per color assignment)
 *   wind('N')     → 'wind-N'
 *   dragon('red') → 'dragon-red'
 *   dragon(match)  → matching dragon for the group's assigned suit
 *   flower        → any flower tile
 *   zero          → 'dragon-white' (Soap used as digit 0)
 */
export type TileRef =
  | { kind: 'suited'; number: number }
  | { kind: 'wind'; type: 'N' | 'E' | 'S' | 'W' }
  | { kind: 'dragon'; type: 'red' | 'green' | 'white' }
  | { kind: 'dragon'; match: 'color' }
  | { kind: 'dragon'; match: 'opposite' }
  | { kind: 'flower' }
  | { kind: 'zero' };

// ═══════════════════════════════════════════════════════════════
// TILE GROUPS
// ═══════════════════════════════════════════════════════════════

/** Structural type of a group — affects joker eligibility */
export type GroupType =
  | 'single'   // 1 tile — no jokers
  | 'pair'     // 2 identical — no jokers
  | 'pung'     // 3 identical — jokers OK
  | 'kong'     // 4 identical — jokers OK
  | 'quint'    // 5 identical — jokers REQUIRED (only 4 naturals exist)
  | 'sextet'   // 6 identical — jokers REQUIRED
  | 'mixed';   // heterogeneous tiles (NEWS, 2024, etc.)

/**
 * TileGroup is one "chunk" within a hand pattern.
 * - Homogeneous groups (pung/kong/quint): tiles has 1 entry, repeated `count` times
 * - Mixed groups (NEWS, year digits): tiles has `count` entries, each different
 */
export interface TileGroup {
  tiles: TileRef[];
  count: number;
  type: GroupType;
  color: CardColor;
}

// ═══════════════════════════════════════════════════════════════
// NUMBER CONSTRAINTS
// ═══════════════════════════════════════════════════════════════

/** Controls which numbers can substitute in a pattern */
export type NumberConstraint =
  | { type: 'fixed' }
  | { type: 'any_run'; length: number }
  | { type: 'any_like'; positions: number[] }
  | { type: 'any_even' }
  | { type: 'any_odd' }
  | { type: 'any_369' }
  | { type: 'any_number'; range?: [number, number] };

// ═══════════════════════════════════════════════════════════════
// HAND PATTERN & DEFINITION
// ═══════════════════════════════════════════════════════════════

/** One concrete pattern (groups summing to 14 tiles) */
export interface HandPattern {
  groups: TileGroup[];
  numberConstraint?: NumberConstraint;
}

/** Exposure type as printed on the card */
export type ExposureType = 'X' | 'C';

/** Section names on the NMJL card */
export type CardSection =
  | 'year' | '2468' | 'any_like_numbers' | 'addition'
  | 'quints' | 'consecutive_run' | '13579'
  | 'winds_dragons' | '369' | 'singles_pairs';

/** Joker policy */
export type JokerPolicy =
  | 'standard'        // Jokers allowed in groups of 3+
  | 'no_jokers'       // No jokers (Singles & Pairs)
  | 'quints_required'; // Jokers required for quints (Quints section)

/**
 * HandDefinition is a single line on the NMJL card.
 * Multiple patterns[] = "-or-" alternatives.
 */
export interface HandDefinition {
  id: string;
  section: CardSection;
  /** Our display label, e.g., "FF 2025 222 222" */
  displayPattern: string;
  patterns: HandPattern[];
  points: number;
  exposure: ExposureType;
  jokerPolicy: JokerPolicy;
  description?: string;
  /** Flag for lines where card text was hard to read */
  needsReview?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// CARD DEFINITION
// ═══════════════════════════════════════════════════════════════

export interface NMJLCard {
  year: number;
  hands: HandDefinition[];
  meta: {
    totalHands: number;
    sections: CardSection[];
    encodedDate: string;
    formatVersion: number;
  };
}

// ═══════════════════════════════════════════════════════════════
// VALIDATION RESULTS
// ═══════════════════════════════════════════════════════════════

export interface MatchResult {
  matched: boolean;
  hand?: HandDefinition;
  patternIndex?: number;
  colorAssignment?: ColorAssignment;
  jokerAssignments?: Array<{
    jokerInstanceId: string;
    substituteFor: string;
  }>;
  unmatchedTiles?: string[];
}

export interface PartialMatchResult {
  hand: HandDefinition;
  patternIndex: number;
  completionPct: number;
  matchedCount: number;
  tilesNeeded: string[];
  colorAssignment?: ColorAssignment;
}
