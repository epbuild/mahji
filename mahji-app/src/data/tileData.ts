// src/data/tileData.ts
// Complete American Mahjong tile data system — 152 tiles

export type TileSuit = 'dots' | 'bamboo' | 'characters' | 'winds' | 'dragons' | 'flowers' | 'jokers';

export interface TileDefinition {
  id: string;
  suit: TileSuit;
  number?: number;        // 1-9 for suited tiles
  type?: string;          // wind direction, dragon type, etc.
  displayName: string;
  copies: number;         // how many in a full set
}

// ── All unique tile definitions ──
export const TILE_DEFINITIONS: TileDefinition[] = [
  // Dots 1-9 (4 copies each)
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `dot-${i + 1}`,
    suit: 'dots' as TileSuit,
    number: i + 1,
    displayName: `${i + 1} Dot`,
    copies: 4,
  })),
  // Bamboo 1-9 (4 copies each)
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `bam-${i + 1}`,
    suit: 'bamboo' as TileSuit,
    number: i + 1,
    displayName: i === 0 ? '1 Bam (Bird)' : `${i + 1} Bam`,
    copies: 4,
  })),
  // Characters 1-9 (4 copies each)
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `char-${i + 1}`,
    suit: 'characters' as TileSuit,
    number: i + 1,
    displayName: `${i + 1} Crak`,
    copies: 4,
  })),
  // Winds (4 copies each)
  { id: 'wind-E', suit: 'winds', type: 'E', displayName: 'East', copies: 4 },
  { id: 'wind-S', suit: 'winds', type: 'S', displayName: 'South', copies: 4 },
  { id: 'wind-W', suit: 'winds', type: 'W', displayName: 'West', copies: 4 },
  { id: 'wind-N', suit: 'winds', type: 'N', displayName: 'North', copies: 4 },
  // Dragons (4 copies each)
  { id: 'dragon-red', suit: 'dragons', type: 'red', displayName: 'Red Dragon', copies: 4 },
  { id: 'dragon-green', suit: 'dragons', type: 'green', displayName: 'Green Dragon', copies: 4 },
  { id: 'dragon-white', suit: 'dragons', type: 'white', displayName: 'Soap (White)', copies: 4 },
  // Flowers (1 copy each, 8 unique)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `flower-${i + 1}`,
    suit: 'flowers' as TileSuit,
    number: i + 1,
    displayName: `Flower ${i + 1}`,
    copies: 1,
  })),
  // Jokers (1 copy each, 8 total)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `joker-${i + 1}`,
    suit: 'jokers' as TileSuit,
    number: i + 1,
    displayName: `Joker ${i + 1}`,
    copies: 1,
  })),
];

export interface GameTile extends TileDefinition {
  instanceId: string; // unique per copy in deck (e.g. "dot-1-copy-2")
}

/** Returns a full 152-tile deck */
export function getFullDeck(): GameTile[] {
  const deck: GameTile[] = [];
  for (const def of TILE_DEFINITIONS) {
    for (let copy = 1; copy <= def.copies; copy++) {
      deck.push({
        ...def,
        instanceId: `${def.id}-copy-${copy}`,
      });
    }
  }
  return deck; // 152 tiles
}

/** Fisher-Yates shuffle */
export function shuffleDeck(deck: GameTile[]): GameTile[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Get unique tiles for a suit (for gallery display) */
export function getTilesBySuit(suit: TileSuit): TileDefinition[] {
  return TILE_DEFINITIONS.filter(t => t.suit === suit);
}

/** Suit display info */
export const SUIT_INFO: Record<TileSuit, { label: string; count: number; note: string }> = {
  dots:       { label: 'Dots',       count: 36, note: '4 copies of each (1-9)' },
  bamboo:     { label: 'Bamboo',     count: 36, note: '4 copies of each (1-9). 1-Bam features the bird.' },
  characters: { label: 'Characters', count: 36, note: '4 copies of each (1-9)' },
  winds:      { label: 'Winds',      count: 16, note: '4 copies of each direction' },
  dragons:    { label: 'Dragons',    count: 12, note: '4 copies each of Red, Green, and Soap' },
  flowers:    { label: 'Flowers',    count: 8,  note: '8 unique flower tiles' },
  jokers:     { label: 'Jokers',     count: 8,  note: '8 joker tiles' },
};
