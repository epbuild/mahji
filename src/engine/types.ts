// ═══════════════════════════════════════════════════════════════
// Mahji Game Engine — Type Definitions
// src/engine/types.ts
//
// Pure TypeScript types for the entire game state machine.
// No React — consumed by PlayPage via useReducer.
// ═══════════════════════════════════════════════════════════════

import type { GameTile } from '../data/tileData';
import type { NMJLCard, HandDefinition, ColorAssignment } from '../data/nmjl';

// ═══════════════════════════════════════════════════════════════
// SEAT & DIRECTION
// ═══════════════════════════════════════════════════════════════

/** Four seats at the table — counterclockwise: E → N → W → S */
export type Seat = 'east' | 'north' | 'west' | 'south';

/** Pass direction in charleston */
export type PassDirection = 'right' | 'across' | 'left';

// ═══════════════════════════════════════════════════════════════
// DIFFICULTY
// ═══════════════════════════════════════════════════════════════

export type Difficulty = 'novice' | 'intermediate' | 'advanced';

// ═══════════════════════════════════════════════════════════════
// GAME PHASES & SUB-PHASES
// ═══════════════════════════════════════════════════════════════

/**
 * Top-level game phase.
 * setup → charleston → gameplay → game_over
 */
export type GamePhase = 'setup' | 'charleston' | 'gameplay' | 'game_over';

/**
 * Charleston sub-phases track where we are in the pass sequence.
 *
 * First Charleston:  first_right → first_over → first_left_blind
 * Then:              continue_prompt (human chooses to continue or stop)
 * Second Charleston: second_left → second_over → second_right_blind
 * Then:              courtesy_prompt → courtesy_pass
 */
export type CharlestonSubPhase =
  | 'first_right'
  | 'first_over'
  | 'first_left_blind'
  | 'continue_prompt'
  | 'second_left'
  | 'second_over'
  | 'second_right_blind'
  | 'courtesy_prompt'
  | 'courtesy_pass';

/**
 * Gameplay sub-phases within a turn.
 *
 * draw → discard → call_window → (next draw, or caller's exposure_discard)
 * exposure_discard → call_window → ...
 *
 * east_first_discard is special: East starts with 14 tiles, skips draw.
 */
export type GameplaySubPhase =
  | 'east_first_discard'  // East has 14, must discard (no draw)
  | 'draw'                // Active player draws from wall
  | 'discard'             // Active player must discard a tile
  | 'call_window'         // Other players may call the discard
  | 'exposure_discard';   // Caller exposed a meld, must discard

// ═══════════════════════════════════════════════════════════════
// EXPOSURE (face-up melds on the table)
// ═══════════════════════════════════════════════════════════════

/** Type of exposed meld */
export type MeldType = 'pung' | 'kong' | 'quint' | 'sextet';

/**
 * A face-up group of tiles on the table after a call.
 */
export interface Exposure {
  /** The tiles in the meld (natural + jokers) */
  tiles: GameTile[];
  /** Which tile was the called discard */
  calledTile: GameTile;
  /** Who discarded the called tile */
  fromSeat: Seat;
  /** Meld structure */
  meldType: MeldType;
  /** Indices within `tiles` that are jokers */
  jokerPositions: number[];
}

// ═══════════════════════════════════════════════════════════════
// PLAYER STATE
// ═══════════════════════════════════════════════════════════════

export interface PlayerState {
  seat: Seat;
  name: string;
  isHuman: boolean;

  /** Concealed hand tiles */
  hand: GameTile[];

  /** Face-up exposed melds */
  exposures: Exposure[];

  /** Tiles selected for the current charleston pass (0–3) */
  selectedForPass: GameTile[];

  /** Whether this player is dead (wrong tile count, etc.) */
  isDead: boolean;

  /** Tiles discarded by this player (for history) */
  discardHistory: GameTile[];
}

// ═══════════════════════════════════════════════════════════════
// CALL DECLARATION
// ═══════════════════════════════════════════════════════════════

/** What a player is calling for */
export type CallType = 'pung' | 'kong' | 'quint' | 'sextet' | 'mahjong';

/**
 * A pending call from a player during the call window.
 */
export interface CallDeclaration {
  seat: Seat;
  callType: CallType;
  /** The tiles from hand used to form the meld (excluding the discard) */
  tilesFromHand: GameTile[];
}

// ═══════════════════════════════════════════════════════════════
// GAME STATE — the single source of truth
// ═══════════════════════════════════════════════════════════════

export interface GameState {
  // ── Phase tracking ──
  phase: GamePhase;
  charlestonSubPhase: CharlestonSubPhase;
  gameplaySubPhase: GameplaySubPhase;

  // ── Players ──
  /** Indexed by seat for O(1) lookup */
  players: Record<Seat, PlayerState>;

  // ── Wall & discards ──
  wall: GameTile[];
  discardPile: GameTile[];

  // ── Turn tracking ──
  /** Whose turn it is (or who just discarded in call_window) */
  currentTurn: Seat;

  // ── Call window ──
  /** The tile currently available to call (last discard) */
  callWindowTile: GameTile | null;
  /** Pending calls from each seat (null = hasn't responded yet) */
  pendingCalls: Partial<Record<Seat, CallDeclaration | 'pass'>>;

  // ── Charleston ──
  /** Number of blind slots filled (0–3) during blind passes */
  blindSlotCount: number;
  /** Whether human chose to continue after first charleston */
  charlestonContinued: boolean | null;
  /** Courtesy pass tile count chosen by human (0–3, null if not yet chosen) */
  courtesyCount: number | null;

  // ── Endgame ──
  winner: Seat | null;
  winningHand: HandDefinition | null;
  winningColorAssignment: ColorAssignment | null;
  isWallGame: boolean;

  // ── Config (set once at game start, immutable) ──
  difficulty: Difficulty;
  card: NMJLCard;

  // ── UI hints (reducer sets these for the React layer) ──
  /** Last tiles received from a charleston pass (for NEW badges) */
  lastReceivedTileIds: Set<string>;
  /** Human-readable status message */
  statusMessage: string;
}

// ═══════════════════════════════════════════════════════════════
// GAME CONFIGURATION — passed to createInitialState
// ═══════════════════════════════════════════════════════════════

export interface GameConfig {
  difficulty: Difficulty;
  card: NMJLCard;
  /** Player names (index 0 = east/human, 1 = north, 2 = west, 3 = south) */
  playerNames?: [string, string, string, string];
}

// ═══════════════════════════════════════════════════════════════
// GAME ACTIONS — discriminated union for the reducer
// ═══════════════════════════════════════════════════════════════

export type GameAction =
  // ── Setup ──
  | { type: 'START_GAME' }

  // ── Charleston ──
  | { type: 'SELECT_TILE_FOR_PASS'; instanceId: string }
  | { type: 'DESELECT_TILE_FOR_PASS'; instanceId: string }
  | { type: 'FILL_BLIND_SLOT' }
  | { type: 'UNFILL_BLIND_SLOT' }
  | { type: 'EXECUTE_PASS' }
  | { type: 'CHARLESTON_CONTINUE'; continue: boolean }
  | { type: 'SET_COURTESY_COUNT'; count: number }

  // ── Gameplay ──
  | { type: 'DRAW_TILE' }
  | { type: 'DISCARD_TILE'; instanceId: string }

  // ── Calling ──
  | { type: 'DECLARE_CALL'; call: CallDeclaration }
  | { type: 'PASS_CALL'; seat: Seat }
  | { type: 'RESOLVE_CALLS' }

  // ── Special ──
  | { type: 'JOKER_SWAP'; jokerInstanceId: string; naturalTileInstanceId: string }
  | { type: 'DECLARE_MAHJONG'; seat: Seat }

  // ── Hand management ──
  | { type: 'SORT_HAND'; mode: 'suit' | 'rank' }
  | { type: 'REORDER_HAND'; fromIndex: number; toIndex: number }

  // ── AI ──
  | { type: 'AI_CHARLESTON_SELECT'; seat: Seat; tiles: GameTile[] }
  | { type: 'AI_DISCARD'; seat: Seat; instanceId: string }
  | { type: 'AI_CALL'; seat: Seat; call: CallDeclaration | 'pass' }

  // ── Endgame ──
  | { type: 'WALL_GAME' };

// ═══════════════════════════════════════════════════════════════
// CHARLESTON STEP DEFINITION (used by reducer & UI)
// ═══════════════════════════════════════════════════════════════

export interface CharlestonStep {
  key: string;
  label: string;
  dir: PassDirection;
  blind: boolean;
  subPhase: CharlestonSubPhase;
}
