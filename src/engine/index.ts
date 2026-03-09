// ═══════════════════════════════════════════════════════════════
// Mahji Game Engine — Public API
// src/engine/index.ts
//
// Re-exports everything consumers need.
// Usage: import { createInitialState, gameReducer, ... } from '../engine';
// ═══════════════════════════════════════════════════════════════

// ── Types ──
export type {
  Seat,
  PassDirection,
  Difficulty,
  GamePhase,
  CharlestonSubPhase,
  GameplaySubPhase,
  MeldType,
  Exposure,
  PlayerState,
  CallType,
  CallDeclaration,
  GameState,
  GameConfig,
  GameAction,
  CharlestonStep,
} from './types';

// ── Constants ──
export {
  TURN_ORDER,
  getNextSeat,
  getSeatIndex,
  seatFromIndex,
  PASS_OFFSET,
  CHARLESTON_STEPS,
  getCharlestonStepIndex,
  getCurrentCharlestonStep,
  NEXT_CHARLESTON_SUBPHASE,
  AI_TIMING,
  getAIDelay,
  DECK_SIZE,
  DEAL_COUNTS,
  WIND_ORDER,
  DRAGON_ORDER,
  DEFAULT_PLAYER_NAMES,
} from './constants';

// ── State Factory & Helpers ──
export {
  isJoker,
  isFlower,
  isSuited,
  isWind,
  isDragon,
  isHonor,
  findTileByInstanceId,
  removeTileByInstanceId,
  sortBySuit,
  sortByRank,
  createInitialState,
  getAllPlayerTiles,
  getPlayerTileCount,
  getHumanPlayer,
  isHumanTurn,
  getWallCount,
} from './state';

// ── Reducer ──
export { gameReducer } from './reducer';

// ── AI ──
export {
  aiSelectForPass,
  aiDecideDiscard,
  aiDecideCall,
  aiDecideCourtesyCount,
} from './ai';

// ── Rules ──
export {
  checkMahjong,
  checkMahjongWithDiscard,
  canDeclareMahjong,
  findWinningHands,
  canCallPung,
  canCallKong,
  canCallQuint,
  getAvailableCalls,
  canSwapJoker,
  isDeadHand,
} from './rules';
