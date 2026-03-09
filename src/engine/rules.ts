// ═══════════════════════════════════════════════════════════════
// Mahji Game Engine — Rules & Validation
// src/engine/rules.ts
//
// Legal move validation: win detection, call eligibility,
// joker swap rules, dead hand detection.
// ═══════════════════════════════════════════════════════════════

import type { GameTile } from '../data/tileData';
import type { NMJLCard, MatchResult } from '../data/nmjl';
import { validateHand, findAllMatches } from '../data/nmjl';
import type {
  GameState, Seat, PlayerState, Exposure, CallType,
} from './types';
import { isJoker, getAllPlayerTiles } from './state';

// ═══════════════════════════════════════════════════════════════
// WIN DETECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Check if a player's full hand (concealed + exposed) matches
 * any NMJL card hand. Returns the match result.
 *
 * The player must have exactly 14 tiles total.
 */
export function checkMahjong(player: PlayerState, card: NMJLCard): MatchResult {
  const allTiles = getAllPlayerTiles(player);
  if (allTiles.length !== 14) {
    return { matched: false };
  }
  return validateHand(allTiles, card);
}

/**
 * Check if a player can declare mahjong with a discard tile.
 * Temporarily adds the discard to their hand for validation.
 */
export function checkMahjongWithDiscard(
  player: PlayerState,
  discardTile: GameTile,
  card: NMJLCard,
): MatchResult {
  // Create a temporary player with the discard added
  const tempPlayer: PlayerState = {
    ...player,
    hand: [...player.hand, discardTile],
  };
  return checkMahjong(tempPlayer, card);
}

/**
 * Check if a player can declare mahjong after drawing (self-drawn).
 * Player should have 14 tiles in hand + exposures.
 */
export function canDeclareMahjong(state: GameState): boolean {
  const player = state.players[state.currentTurn];
  const result = checkMahjong(player, state.card);
  return result.matched;
}

/**
 * Find all winning hands that match a player's tiles.
 */
export function findWinningHands(player: PlayerState, card: NMJLCard): MatchResult[] {
  const allTiles = getAllPlayerTiles(player);
  if (allTiles.length !== 14) return [];
  return findAllMatches(allTiles, card);
}

// ═══════════════════════════════════════════════════════════════
// CALL ELIGIBILITY
// ═══════════════════════════════════════════════════════════════

/**
 * Check if a player can call a discarded tile for a pung (3 of a kind).
 * Needs 2 matching tiles in hand (or 1 + joker, or 2 jokers).
 */
export function canCallPung(
  hand: GameTile[],
  discardTile: GameTile,
): { canCall: boolean; tilesFromHand: GameTile[] } {
  // Find matching tiles in hand (same id)
  const matching = hand.filter(t => t.id === discardTile.id);
  const jokers = hand.filter(t => isJoker(t));

  // Need 2 more tiles to form a pung (matching + jokers >= 2)
  if (matching.length >= 2) {
    return { canCall: true, tilesFromHand: matching.slice(0, 2) };
  }
  if (matching.length === 1 && jokers.length >= 1) {
    return { canCall: true, tilesFromHand: [matching[0], jokers[0]] };
  }
  if (jokers.length >= 2) {
    return { canCall: true, tilesFromHand: jokers.slice(0, 2) };
  }
  return { canCall: false, tilesFromHand: [] };
}

/**
 * Check if a player can call a discarded tile for a kong (4 of a kind).
 * Needs 3 matching tiles in hand (or substitution with jokers).
 */
export function canCallKong(
  hand: GameTile[],
  discardTile: GameTile,
): { canCall: boolean; tilesFromHand: GameTile[] } {
  const matching = hand.filter(t => t.id === discardTile.id);
  const jokers = hand.filter(t => isJoker(t));
  const needed = 3; // Need 3 more to form kong of 4

  if (matching.length + jokers.length >= needed) {
    const tiles: GameTile[] = [];
    // Use naturals first, then jokers
    for (const m of matching) {
      if (tiles.length >= needed) break;
      tiles.push(m);
    }
    for (const j of jokers) {
      if (tiles.length >= needed) break;
      tiles.push(j);
    }
    return { canCall: true, tilesFromHand: tiles };
  }
  return { canCall: false, tilesFromHand: [] };
}

/**
 * Check if a player can call a discarded tile for a quint (5 of a kind).
 * Needs 4 matching tiles in hand (naturals + jokers).
 */
export function canCallQuint(
  hand: GameTile[],
  discardTile: GameTile,
): { canCall: boolean; tilesFromHand: GameTile[] } {
  const matching = hand.filter(t => t.id === discardTile.id);
  const jokers = hand.filter(t => isJoker(t));
  const needed = 4;

  if (matching.length + jokers.length >= needed) {
    const tiles: GameTile[] = [];
    for (const m of matching) {
      if (tiles.length >= needed) break;
      tiles.push(m);
    }
    for (const j of jokers) {
      if (tiles.length >= needed) break;
      tiles.push(j);
    }
    return { canCall: true, tilesFromHand: tiles };
  }
  return { canCall: false, tilesFromHand: [] };
}

/**
 * Get all possible calls a player can make on a discarded tile.
 */
export function getAvailableCalls(
  hand: GameTile[],
  discardTile: GameTile,
): CallType[] {
  const calls: CallType[] = [];

  const pung = canCallPung(hand, discardTile);
  if (pung.canCall) calls.push('pung');

  const kong = canCallKong(hand, discardTile);
  if (kong.canCall) calls.push('kong');

  const quint = canCallQuint(hand, discardTile);
  if (quint.canCall) calls.push('quint');

  // Mahjong can always be attempted (validated separately)
  // We don't include it here — it's checked via checkMahjongWithDiscard

  return calls;
}

// ═══════════════════════════════════════════════════════════════
// JOKER SWAP RULES
// ═══════════════════════════════════════════════════════════════

/**
 * Check if a natural tile can be swapped for an exposed joker.
 * Rules:
 * - Must be the player's turn
 * - The natural tile must match the tile the joker is substituting for
 * - Can swap jokers in ANY player's exposures
 */
export function canSwapJoker(
  state: GameState,
  naturalTileInstanceId: string,
  jokerInstanceId: string,
): boolean {
  // Must be human's turn and in discard phase
  if (state.currentTurn !== 'east') return false;
  if (state.gameplaySubPhase !== 'discard' &&
      state.gameplaySubPhase !== 'east_first_discard') return false;

  const human = state.players.east;
  const naturalTile = human.hand.find(t => t.instanceId === naturalTileInstanceId);
  if (!naturalTile || isJoker(naturalTile)) return false;

  // Find the joker in any player's exposures
  for (const seat of ['east', 'north', 'west', 'south'] as Seat[]) {
    const player = state.players[seat];
    for (const exposure of player.exposures) {
      const jokerIdx = exposure.tiles.findIndex(t => t.instanceId === jokerInstanceId);
      if (jokerIdx >= 0) {
        // The natural tile must match the tile type in the exposure
        // (i.e., the exposure is of the same tile id as the natural)
        const nonJokerTile = exposure.tiles.find(t => !isJoker(t));
        if (nonJokerTile && nonJokerTile.id === naturalTile.id) {
          return true;
        }
        // If all tiles in exposure are jokers, any natural could substitute
        // (edge case — unlikely but possible)
        if (exposure.tiles.every(t => isJoker(t))) {
          return true;
        }
      }
    }
  }

  return false;
}

// ═══════════════════════════════════════════════════════════════
// DEAD HAND DETECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Check if a player has a dead hand (wrong tile count after exposure).
 * A dead hand means the player can still draw/discard but cannot win.
 */
export function isDeadHand(player: PlayerState): boolean {
  const totalTiles = getAllPlayerTiles(player).length;
  // In American Mahjong, you always need exactly 14 tiles total
  // If somehow they have more or fewer, the hand is dead
  return totalTiles !== 13 && totalTiles !== 14;
  // 13 during another player's turn, 14 during your own turn after drawing
}
