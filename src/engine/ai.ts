// ═══════════════════════════════════════════════════════════════
// Mahji Game Engine — AI Decision Module
// src/engine/ai.ts
//
// Pure functions for AI player decisions. No side effects.
// Returns tiles to pass, discard, or call decisions.
// ═══════════════════════════════════════════════════════════════

import type { GameTile } from '../data/tileData';
import type { Difficulty, GameState, Seat, CallDeclaration } from './types';
import { isJoker } from './state';
import { canCallPung, canCallKong, canCallQuint, checkMahjongWithDiscard } from './rules';

// ═══════════════════════════════════════════════════════════════
// CHARLESTON — TILE SELECTION FOR PASS
// ═══════════════════════════════════════════════════════════════

/**
 * AI selects tiles for a charleston pass.
 * Returns exactly `count` non-joker tiles from hand.
 */
export function aiSelectForPass(
  hand: GameTile[],
  count: number,
  difficulty: Difficulty,
): GameTile[] {
  switch (difficulty) {
    case 'novice':
      return botSelectNovice(hand, count);
    case 'intermediate':
      return botSelectIntermediate(hand, count);
    case 'advanced':
      return botSelectAdvanced(hand, count);
  }
}

/** Novice: random non-joker tiles */
function botSelectNovice(hand: GameTile[], count: number): GameTile[] {
  const nonJokers = hand.filter(t => !isJoker(t));
  const shuffled = [...nonJokers].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** Intermediate: pass singletons first (tiles you have fewest of) */
function botSelectIntermediate(hand: GameTile[], count: number): GameTile[] {
  const nonJokers = hand.filter(t => !isJoker(t));
  const idCounts: Record<string, number> = {};
  nonJokers.forEach(t => { idCounts[t.id] = (idCounts[t.id] || 0) + 1; });
  return nonJokers
    .map(t => ({ tile: t, score: idCounts[t.id] || 0 }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map(s => s.tile);
}

/** Advanced: keep pairs/triples and connected tiles, pass isolated ones */
function botSelectAdvanced(hand: GameTile[], count: number): GameTile[] {
  const nonJokers = hand.filter(t => !isJoker(t));
  const idCounts: Record<string, number> = {};
  nonJokers.forEach(t => { idCounts[t.id] = (idCounts[t.id] || 0) + 1; });

  const scored = nonJokers.map(t => {
    let score = 0;
    // Pairs/triples are valuable
    score += (idCounts[t.id] || 1) * 3;
    // Adjacent numbers in same suit (potential sequences)
    if (t.number) {
      const suitTiles = nonJokers.filter(o => o.suit === t.suit && o.instanceId !== t.instanceId);
      if (suitTiles.some(o => o.number === (t.number! - 1) || o.number === (t.number! + 1))) score += 2;
      if (suitTiles.some(o => o.number === (t.number! - 2) || o.number === (t.number! + 2))) score += 1;
    }
    return { tile: t, score };
  });

  // Pass lowest-scored tiles
  return scored.sort((a, b) => a.score - b.score).slice(0, count).map(s => s.tile);
}

// ═══════════════════════════════════════════════════════════════
// GAMEPLAY — DISCARD DECISION
// ═══════════════════════════════════════════════════════════════

/**
 * AI decides which tile to discard.
 * Returns the instanceId of the tile to discard.
 */
export function aiDecideDiscard(
  hand: GameTile[],
  difficulty: Difficulty,
): string {
  switch (difficulty) {
    case 'novice':
      return aiDiscardNovice(hand);
    case 'intermediate':
      return aiDiscardIntermediate(hand);
    case 'advanced':
      return aiDiscardAdvanced(hand);
  }
}

/** Novice: random discard (no strategy) */
function aiDiscardNovice(hand: GameTile[]): string {
  // Never discard jokers if possible
  const nonJokers = hand.filter(t => !isJoker(t));
  const pool = nonJokers.length > 0 ? nonJokers : hand;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx].instanceId;
}

/** Intermediate: discard singletons, keep pairs */
function aiDiscardIntermediate(hand: GameTile[]): string {
  const nonJokers = hand.filter(t => !isJoker(t));
  const pool = nonJokers.length > 0 ? nonJokers : hand;
  const idCounts: Record<string, number> = {};
  pool.forEach(t => { idCounts[t.id] = (idCounts[t.id] || 0) + 1; });
  // Pick a singleton first
  const sorted = [...pool].sort((a, b) => (idCounts[a.id] || 0) - (idCounts[b.id] || 0));
  return sorted[0].instanceId;
}

/** Advanced: more nuanced — keep connected tiles, discard isolated */
function aiDiscardAdvanced(hand: GameTile[]): string {
  const nonJokers = hand.filter(t => !isJoker(t));
  const pool = nonJokers.length > 0 ? nonJokers : hand;
  const idCounts: Record<string, number> = {};
  pool.forEach(t => { idCounts[t.id] = (idCounts[t.id] || 0) + 1; });

  const scored = pool.map(t => {
    let score = 0;
    score += (idCounts[t.id] || 1) * 3;
    if (t.number) {
      const suitTiles = pool.filter(o => o.suit === t.suit && o.instanceId !== t.instanceId);
      if (suitTiles.some(o => o.number === (t.number! - 1) || o.number === (t.number! + 1))) score += 2;
      if (suitTiles.some(o => o.number === (t.number! - 2) || o.number === (t.number! + 2))) score += 1;
    }
    // Jokers are extremely valuable
    if (isJoker(t)) score += 100;
    return { tile: t, score };
  });

  // Discard lowest-scored tile
  scored.sort((a, b) => a.score - b.score);
  return scored[0].tile.instanceId;
}

// ═══════════════════════════════════════════════════════════════
// GAMEPLAY — CALL DECISION
// ═══════════════════════════════════════════════════════════════

/**
 * AI decides whether to call a discarded tile.
 * Checks for mahjong first, then quint, kong, pung.
 * Returns a CallDeclaration or 'pass'.
 */
export function aiDecideCall(
  state: GameState,
  seat: Seat,
  discardTile: GameTile,
): CallDeclaration | 'pass' {
  const player = state.players[seat];
  const hand = player.hand;

  // 1. Check for mahjong (highest priority)
  const mahjongResult = checkMahjongWithDiscard(player, discardTile, state.card);
  if (mahjongResult.matched) {
    return {
      seat,
      callType: 'mahjong',
      tilesFromHand: [], // mahjong uses the whole hand
    };
  }

  // 2. Check for quint (5 of a kind)
  const quint = canCallQuint(hand, discardTile);
  if (quint.canCall) {
    return { seat, callType: 'quint', tilesFromHand: quint.tilesFromHand };
  }

  // 3. Check for kong (4 of a kind)
  const kong = canCallKong(hand, discardTile);
  if (kong.canCall) {
    // Advanced AI: only call kong if it helps their hand
    // Novice/intermediate: always call kong if possible
    if (state.difficulty === 'advanced') {
      // Only call if we have 3+ naturals matching (strong kong)
      const naturalCount = kong.tilesFromHand.filter(t => !isJoker(t)).length;
      if (naturalCount >= 2) {
        return { seat, callType: 'kong', tilesFromHand: kong.tilesFromHand };
      }
    } else {
      return { seat, callType: 'kong', tilesFromHand: kong.tilesFromHand };
    }
  }

  // 4. Check for pung (3 of a kind)
  const pung = canCallPung(hand, discardTile);
  if (pung.canCall) {
    if (state.difficulty === 'advanced') {
      // Only call pung with at least 1 natural matching
      const naturalCount = pung.tilesFromHand.filter(t => !isJoker(t)).length;
      if (naturalCount >= 1) {
        return { seat, callType: 'pung', tilesFromHand: pung.tilesFromHand };
      }
    } else if (state.difficulty === 'intermediate') {
      // 50% chance to call pung
      if (Math.random() > 0.5) {
        return { seat, callType: 'pung', tilesFromHand: pung.tilesFromHand };
      }
    } else {
      // Novice: 30% chance to call pung
      if (Math.random() > 0.7) {
        return { seat, callType: 'pung', tilesFromHand: pung.tilesFromHand };
      }
    }
  }

  return 'pass';
}

// ═══════════════════════════════════════════════════════════════
// COURTESY PASS — AI DECISION
// ═══════════════════════════════════════════════════════════════

/**
 * AI decides how many tiles to courtesy pass (0-3).
 * The across player must match this count.
 */
export function aiDecideCourtesyCount(
  _hand: GameTile[],
  _difficulty: Difficulty,
): number {
  // AI typically wants to pass some tiles
  // Novice: always 3, Intermediate: 1-3, Advanced: 0-3 (strategic)
  return Math.floor(Math.random() * 3) + 1; // 1-3 for now
}
