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
 * For MVP, AI only calls for mahjong (simple strategy).
 * Returns a CallDeclaration or 'pass'.
 */
export function aiDecideCall(
  _state: GameState,
  _seat: Seat,
  _discardTile: GameTile,
): CallDeclaration | 'pass' {
  // MVP: AI always passes (no calling).
  // Phase 4 will add pung/kong/quint detection.
  // Phase 5 will add mahjong detection.
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
