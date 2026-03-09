// ═══════════════════════════════════════════════════════════════
// Mahji Game Engine — State Factory & Helpers
// src/engine/state.ts
//
// createInitialState() shuffles & deals, returns a fresh GameState.
// Also exports helper functions: isJoker, sorting, tile lookups.
// ═══════════════════════════════════════════════════════════════

import type { GameTile } from '../data/tileData';
import { getFullDeck, shuffleDeck } from '../data/tileData';
import type {
  GameState, GameConfig, PlayerState, Seat, Difficulty,
} from './types';
import {
  TURN_ORDER, DEAL_COUNTS, DEFAULT_PLAYER_NAMES,
  WIND_ORDER, DRAGON_ORDER,
} from './constants';

// ═══════════════════════════════════════════════════════════════
// TILE HELPERS
// ═══════════════════════════════════════════════════════════════

/** Check if a tile is a joker */
export function isJoker(tile: GameTile): boolean {
  return tile.suit === 'jokers';
}

/** Check if a tile is a flower */
export function isFlower(tile: GameTile): boolean {
  return tile.suit === 'flowers';
}

/** Check if a tile is a suited number tile (dots, bamboo, characters) */
export function isSuited(tile: GameTile): boolean {
  return tile.suit === 'dots' || tile.suit === 'bamboo' || tile.suit === 'characters';
}

/** Check if a tile is a wind */
export function isWind(tile: GameTile): boolean {
  return tile.suit === 'winds';
}

/** Check if a tile is a dragon */
export function isDragon(tile: GameTile): boolean {
  return tile.suit === 'dragons';
}

/** Check if a tile is an honor (wind or dragon) */
export function isHonor(tile: GameTile): boolean {
  return isWind(tile) || isDragon(tile);
}

/** Find a tile in an array by instanceId */
export function findTileByInstanceId(tiles: GameTile[], instanceId: string): GameTile | undefined {
  return tiles.find(t => t.instanceId === instanceId);
}

/** Remove a tile from an array by instanceId (returns new array) */
export function removeTileByInstanceId(tiles: GameTile[], instanceId: string): GameTile[] {
  const idx = tiles.findIndex(t => t.instanceId === instanceId);
  if (idx === -1) return tiles;
  const next = [...tiles];
  next.splice(idx, 1);
  return next;
}

// ═══════════════════════════════════════════════════════════════
// SORTING — extracted from CharlestonDrill.tsx
// ═══════════════════════════════════════════════════════════════

/**
 * Sort by suit grouping:
 * Flowers (far left) → Characters+Red Dragon → Bamboo+Green Dragon →
 * Dots+White Dragon → Winds → Jokers (far right)
 */
export function sortBySuit(hand: GameTile[]): GameTile[] {
  return [...hand].sort((a, b) => {
    const gk = (t: GameTile) => {
      if (t.suit === 'flowers') return -1;   // far left
      if (isJoker(t)) return 99;             // far right
      if (t.suit === 'characters') return 1;
      if (t.suit === 'dragons' && t.type === 'red') return 1.9;
      if (t.suit === 'bamboo') return 2;
      if (t.suit === 'dragons' && t.type === 'green') return 2.9;
      if (t.suit === 'dots') return 3;
      if (t.suit === 'dragons' && t.type === 'white') return 3.9;
      if (t.suit === 'winds') return 4;
      return 9;
    };
    const ga = gk(a), gb = gk(b);
    if (ga !== gb) return ga - gb;
    if (a.suit === 'winds' && b.suit === 'winds') {
      return (WIND_ORDER[a.type || ''] ?? 9) - (WIND_ORDER[b.type || ''] ?? 9);
    }
    if (a.suit === 'flowers' && b.suit === 'flowers') {
      return (a.number ?? 0) - (b.number ?? 0);
    }
    return (a.number ?? 99) - (b.number ?? 99);
  });
}

/**
 * Sort by rank (number value across suits):
 * Flowers (far left) → Numbered tiles grouped by value (chars, bam, dots) →
 * Winds (N→E→W→S) → Dragons (R→G→W) → Jokers (far right)
 */
export function sortByRank(hand: GameTile[]): GameTile[] {
  return [...hand].sort((a, b) => {
    // Flowers always far left
    if (a.suit === 'flowers' && b.suit !== 'flowers') return -1;
    if (a.suit !== 'flowers' && b.suit === 'flowers') return 1;
    if (a.suit === 'flowers' && b.suit === 'flowers') return (a.number ?? 0) - (b.number ?? 0);
    // Jokers always far right
    if (isJoker(a) && !isJoker(b)) return 1;
    if (!isJoker(a) && isJoker(b)) return -1;
    if (isJoker(a) && isJoker(b)) return 0;
    // Main grouping: suited (0), winds (1), dragons (2)
    const mg = (t: GameTile) => {
      if (t.suit === 'dots' || t.suit === 'bamboo' || t.suit === 'characters') return 0;
      if (t.suit === 'winds') return 1;
      if (t.suit === 'dragons') return 2;
      return 4;
    };
    const ma = mg(a), mb = mg(b);
    if (ma !== mb) return ma - mb;
    // Within suited: sort by number first, then by suit
    if (ma === 0) {
      if ((a.number ?? 0) !== (b.number ?? 0)) return (a.number ?? 0) - (b.number ?? 0);
      const so: Record<string, number> = { characters: 0, bamboo: 1, dots: 2 };
      return (so[a.suit] ?? 9) - (so[b.suit] ?? 9);
    }
    // Within winds
    if (a.suit === 'winds' && b.suit === 'winds') {
      return (WIND_ORDER[a.type || ''] ?? 9) - (WIND_ORDER[b.type || ''] ?? 9);
    }
    // Within dragons
    if (a.suit === 'dragons' && b.suit === 'dragons') {
      return (DRAGON_ORDER[a.type || ''] ?? 9) - (DRAGON_ORDER[b.type || ''] ?? 9);
    }
    return 0;
  });
}

// ═══════════════════════════════════════════════════════════════
// PLAYER STATE FACTORY
// ═══════════════════════════════════════════════════════════════

function createPlayer(seat: Seat, name: string, isHuman: boolean, hand: GameTile[]): PlayerState {
  return {
    seat,
    name,
    isHuman,
    hand: isHuman ? sortBySuit(hand) : hand,
    exposures: [],
    selectedForPass: [],
    isDead: false,
    discardHistory: [],
  };
}

// ═══════════════════════════════════════════════════════════════
// DEAL — distribute tiles from shuffled deck
// ═══════════════════════════════════════════════════════════════

/**
 * Deal tiles from a shuffled deck.
 * East gets 14, everyone else gets 13. Total: 53 tiles dealt, 99 in wall.
 */
function dealTiles(deck: GameTile[]): { hands: Record<Seat, GameTile[]>; wall: GameTile[] } {
  const remaining = [...deck];
  const hands: Record<Seat, GameTile[]> = {
    east: [],
    north: [],
    west: [],
    south: [],
  };

  // Deal in rounds of 4 tiles (2 stacks) per player, 3 rounds
  for (let round = 0; round < 3; round++) {
    for (const seat of TURN_ORDER) {
      for (let i = 0; i < 4; i++) {
        const tile = remaining.shift();
        if (tile) hands[seat].push(tile);
      }
    }
  }

  // Final tiles: East gets 2 more (top row 1st & 3rd), others get 1 each
  // Simplified: East gets 2, N/W/S get 1 from remaining wall
  const eastExtra1 = remaining.shift();
  const northExtra = remaining.shift();
  const eastExtra2 = remaining.shift();
  const westExtra = remaining.shift();
  const southExtra = remaining.shift();

  if (eastExtra1) hands.east.push(eastExtra1);
  if (eastExtra2) hands.east.push(eastExtra2);
  if (northExtra) hands.north.push(northExtra);
  if (westExtra) hands.west.push(westExtra);
  if (southExtra) hands.south.push(southExtra);

  return { hands, wall: remaining };
}

// ═══════════════════════════════════════════════════════════════
// CREATE INITIAL STATE
// ═══════════════════════════════════════════════════════════════

/**
 * Create a fresh game state: shuffle, deal, set phase to charleston.
 */
export function createInitialState(config: GameConfig): GameState {
  const deck = shuffleDeck(getFullDeck());
  const { hands, wall } = dealTiles(deck);
  const names = config.playerNames ?? DEFAULT_PLAYER_NAMES;

  const players: Record<Seat, PlayerState> = {
    east:  createPlayer('east',  names[0], true,  hands.east),
    north: createPlayer('north', names[1], false, hands.north),
    west:  createPlayer('west',  names[2], false, hands.west),
    south: createPlayer('south', names[3], false, hands.south),
  };

  return {
    phase: 'charleston',
    charlestonSubPhase: 'first_right',
    gameplaySubPhase: 'east_first_discard',

    players,
    wall,
    discardPile: [],

    currentTurn: 'east',

    callWindowTile: null,
    pendingCalls: {},

    blindSlotCount: 0,
    charlestonContinued: null,
    courtesyCount: null,

    winner: null,
    winningHand: null,
    winningColorAssignment: null,
    isWallGame: false,

    difficulty: config.difficulty,
    card: config.card,

    lastReceivedTileIds: new Set(),
    statusMessage: 'First Charleston: Pass 3 tiles to the right',
  };
}

// ═══════════════════════════════════════════════════════════════
// STATE QUERY HELPERS
// ═══════════════════════════════════════════════════════════════

/** Get all tiles a player has (hand + exposed) */
export function getAllPlayerTiles(player: PlayerState): GameTile[] {
  const exposed = player.exposures.flatMap(e => e.tiles);
  return [...player.hand, ...exposed];
}

/** Count total tiles (hand + exposures) */
export function getPlayerTileCount(player: PlayerState): number {
  return getAllPlayerTiles(player).length;
}

/** Get the human player (always east) */
export function getHumanPlayer(state: GameState): PlayerState {
  return state.players.east;
}

/** Check if it's the human player's turn */
export function isHumanTurn(state: GameState): boolean {
  return state.currentTurn === 'east';
}

/** Get tiles remaining in wall */
export function getWallCount(state: GameState): number {
  return state.wall.length;
}
