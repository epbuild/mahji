// ═══════════════════════════════════════════════════════════════
// Mahji Game Engine — Constants
// src/engine/constants.ts
//
// Turn order, charleston step definitions, AI timing, deck size.
// ═══════════════════════════════════════════════════════════════

import type { Seat, PassDirection, CharlestonStep, CharlestonSubPhase, Difficulty } from './types';

// ═══════════════════════════════════════════════════════════════
// SEAT ORDER (counterclockwise: E → N → W → S)
// ═══════════════════════════════════════════════════════════════

/** Turn order around the table */
export const TURN_ORDER: Seat[] = ['east', 'north', 'west', 'south'];

/** Seat after the given seat (counterclockwise) */
export function getNextSeat(seat: Seat): Seat {
  const idx = TURN_ORDER.indexOf(seat);
  return TURN_ORDER[(idx + 1) % 4];
}

/** Seat index (0=east, 1=north, 2=west, 3=south) */
export function getSeatIndex(seat: Seat): number {
  return TURN_ORDER.indexOf(seat);
}

/** Seat from index */
export function seatFromIndex(idx: number): Seat {
  return TURN_ORDER[((idx % 4) + 4) % 4];
}

// ═══════════════════════════════════════════════════════════════
// PASS DIRECTION → OFFSET
// ═══════════════════════════════════════════════════════════════

/**
 * Pass offset: how many seats forward the tiles travel.
 *   right = 1 seat forward (E→N, N→W, W→S, S→E)
 *   across = 2 seats forward
 *   left = 3 seats forward (same as 1 seat backward)
 */
export const PASS_OFFSET: Record<PassDirection, number> = {
  right: 1,
  across: 2,
  left: 3,
};

// ═══════════════════════════════════════════════════════════════
// CHARLESTON STEPS
// ═══════════════════════════════════════════════════════════════

/**
 * The 6 pass steps of the charleston (first 3 + second 3).
 * The continue_prompt and courtesy_prompt are handled as sub-phases,
 * not as pass steps.
 */
export const CHARLESTON_STEPS: CharlestonStep[] = [
  { key: '1R', label: 'First Right',  dir: 'right',  blind: false, subPhase: 'first_right' },
  { key: '1O', label: 'First Over',   dir: 'across', blind: false, subPhase: 'first_over' },
  { key: '1L', label: 'First Left',   dir: 'left',   blind: true,  subPhase: 'first_left_blind' },
  { key: '2L', label: 'Second Left',  dir: 'left',   blind: false, subPhase: 'second_left' },
  { key: '2O', label: 'Second Over',  dir: 'across', blind: false, subPhase: 'second_over' },
  { key: '2R', label: 'Second Right', dir: 'right',  blind: true,  subPhase: 'second_right_blind' },
];

/** Map charleston sub-phase to step index (0–5), or -1 for prompts/courtesy */
export function getCharlestonStepIndex(subPhase: CharlestonSubPhase): number {
  const map: Record<CharlestonSubPhase, number> = {
    first_right: 0,
    first_over: 1,
    first_left_blind: 2,
    continue_prompt: -1,
    second_left: 3,
    second_over: 4,
    second_right_blind: 5,
    courtesy_prompt: -1,
    courtesy_pass: -1,
  };
  return map[subPhase];
}

/** Get the current charleston step config, or null for prompt/courtesy phases */
export function getCurrentCharlestonStep(subPhase: CharlestonSubPhase): CharlestonStep | null {
  const idx = getCharlestonStepIndex(subPhase);
  return idx >= 0 ? CHARLESTON_STEPS[idx] : null;
}

/** Sub-phase progression: what comes after each sub-phase */
export const NEXT_CHARLESTON_SUBPHASE: Record<CharlestonSubPhase, CharlestonSubPhase | 'gameplay'> = {
  first_right: 'first_over',
  first_over: 'first_left_blind',
  first_left_blind: 'continue_prompt',
  continue_prompt: 'second_left',    // only if human continues
  second_left: 'second_over',
  second_over: 'second_right_blind',
  second_right_blind: 'courtesy_prompt',
  courtesy_prompt: 'courtesy_pass',  // or skip to gameplay if 0 tiles
  courtesy_pass: 'gameplay',
};

// ═══════════════════════════════════════════════════════════════
// AI TIMING (milliseconds)
// ═══════════════════════════════════════════════════════════════

export interface AITiming {
  /** Minimum delay before AI acts */
  minDelay: number;
  /** Random additional delay range */
  delayRange: number;
  /** Call window duration for human */
  callWindowMs: number;
}

export const AI_TIMING: Record<Difficulty, AITiming> = {
  novice: {
    minDelay: 2200,
    delayRange: 1200,
    callWindowMs: 8000,
  },
  intermediate: {
    minDelay: 1200,
    delayRange: 800,
    callWindowMs: 6000,
  },
  advanced: {
    minDelay: 500,
    delayRange: 500,
    callWindowMs: 4000,
  },
};

/** Get a randomized delay for AI actions */
export function getAIDelay(difficulty: Difficulty): number {
  const t = AI_TIMING[difficulty];
  return t.minDelay + Math.random() * t.delayRange;
}

// ═══════════════════════════════════════════════════════════════
// DECK & DEALING
// ═══════════════════════════════════════════════════════════════

/** Total tiles in an American Mahjong set */
export const DECK_SIZE = 152;

/** East gets 14, others get 13 */
export const DEAL_COUNTS: Record<Seat, number> = {
  east: 14,
  north: 13,
  west: 13,
  south: 13,
};

// ═══════════════════════════════════════════════════════════════
// SORTING CONSTANTS
// ═══════════════════════════════════════════════════════════════

/** Wind sort order for rank-based sorting */
export const WIND_ORDER: Record<string, number> = { N: 0, E: 1, W: 2, S: 3 };

/** Dragon sort order for rank-based sorting */
export const DRAGON_ORDER: Record<string, number> = { red: 0, green: 1, white: 2 };

// ═══════════════════════════════════════════════════════════════
// DEFAULT NAMES
// ═══════════════════════════════════════════════════════════════

export const DEFAULT_PLAYER_NAMES: [string, string, string, string] = [
  'You',
  'North',
  'West',
  'South',
];
