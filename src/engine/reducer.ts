// ═══════════════════════════════════════════════════════════════
// Mahji Game Engine — Game Reducer
// src/engine/reducer.ts
//
// Pure reducer: (state, action) => newState
// No side effects — sound, animation, AI delays handled by React.
// ═══════════════════════════════════════════════════════════════

import type { GameTile } from '../data/tileData';
import type {
  GameState, GameAction, Seat, PlayerState,
  CharlestonSubPhase, GameplaySubPhase,
} from './types';
import {
  TURN_ORDER, getNextSeat, getSeatIndex, seatFromIndex,
  PASS_OFFSET, getCurrentCharlestonStep,
  NEXT_CHARLESTON_SUBPHASE, DEAL_COUNTS,
} from './constants';
import {
  isJoker, removeTileByInstanceId, sortBySuit, sortByRank,
} from './state';

// ═══════════════════════════════════════════════════════════════
// HELPERS — immutable state updates
// ═══════════════════════════════════════════════════════════════

/** Deep clone a player record */
function clonePlayers(players: Record<Seat, PlayerState>): Record<Seat, PlayerState> {
  const result = {} as Record<Seat, PlayerState>;
  for (const seat of TURN_ORDER) {
    const p = players[seat];
    result[seat] = {
      ...p,
      hand: [...p.hand],
      exposures: p.exposures.map(e => ({ ...e, tiles: [...e.tiles] })),
      selectedForPass: [...p.selectedForPass],
      discardHistory: [...p.discardHistory],
    };
  }
  return result;
}

/** Update a single player in the record */
function updatePlayer(
  players: Record<Seat, PlayerState>,
  seat: Seat,
  update: Partial<PlayerState>,
): Record<Seat, PlayerState> {
  return { ...players, [seat]: { ...players[seat], ...update } };
}

// ═══════════════════════════════════════════════════════════════
// CHARLESTON — PASS RESOLUTION
// ═══════════════════════════════════════════════════════════════

/**
 * Resolve a charleston pass: move selected tiles between players.
 * Returns new hands for all 4 players.
 */
function resolvePassExchange(
  players: Record<Seat, PlayerState>,
  dir: 'right' | 'across' | 'left',
): { newHands: Record<Seat, GameTile[]>; receivedIds: Record<Seat, Set<string>> } {
  const offset = PASS_OFFSET[dir];
  const newHands: Record<Seat, GameTile[]> = { east: [], north: [], west: [], south: [] };
  const receivedIds: Record<Seat, Set<string>> = {
    east: new Set(), north: new Set(), west: new Set(), south: new Set(),
  };

  // First: remove selected tiles from each hand
  const remaining: Record<Seat, GameTile[]> = { east: [], north: [], west: [], south: [] };
  const passed: Record<Seat, GameTile[]> = { east: [], north: [], west: [], south: [] };

  for (const seat of TURN_ORDER) {
    const p = players[seat];
    const selIds = new Set(p.selectedForPass.map(t => t.instanceId));
    remaining[seat] = p.hand.filter(t => !selIds.has(t.instanceId));
    passed[seat] = p.selectedForPass;
  }

  // Then: route passed tiles to recipients
  for (let i = 0; i < 4; i++) {
    const receiverSeat = TURN_ORDER[i];
    const senderIdx = ((i - offset) + 4) % 4;
    const senderSeat = TURN_ORDER[senderIdx];
    const incoming = passed[senderSeat];
    newHands[receiverSeat] = [...remaining[receiverSeat], ...incoming];
    receivedIds[receiverSeat] = new Set(incoming.map(t => t.instanceId));
  }

  return { newHands, receivedIds };
}

// ═══════════════════════════════════════════════════════════════
// CHARLESTON STATUS MESSAGES
// ═══════════════════════════════════════════════════════════════

function getCharlestonMessage(subPhase: CharlestonSubPhase): string {
  switch (subPhase) {
    case 'first_right':       return 'First Charleston: Pass 3 tiles to the right';
    case 'first_over':        return 'First Charleston: Pass 3 tiles across';
    case 'first_left_blind':  return 'First Charleston: Blind pass left (select tiles or press B)';
    case 'continue_prompt':   return 'Continue to Second Charleston?';
    case 'second_left':       return 'Second Charleston: Pass 3 tiles to the left';
    case 'second_over':       return 'Second Charleston: Pass 3 tiles across';
    case 'second_right_blind':return 'Second Charleston: Blind pass right (select tiles or press B)';
    case 'courtesy_prompt':   return 'How many tiles to courtesy pass? (0-3)';
    case 'courtesy_pass':     return 'Courtesy pass: Select tiles to pass across';
  }
}

function getGameplayMessage(subPhase: GameplaySubPhase, currentTurn: Seat, isHuman: boolean): string {
  if (isHuman) {
    switch (subPhase) {
      case 'east_first_discard': return 'You have 14 tiles. Discard one to begin.';
      case 'draw':               return 'Your turn. Draw a tile from the wall.';
      case 'discard':            return 'Select a tile to discard.';
      case 'call_window':        return 'A tile was discarded. Call it or pass.';
      case 'exposure_discard':   return 'You called a tile. Now discard one.';
    }
  }
  const name = currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1);
  switch (subPhase) {
    case 'draw':             return `${name}'s turn`;
    case 'discard':          return `${name}'s turn`;
    case 'call_window':      return `${name} discarded a tile`;
    case 'exposure_discard': return `${name} called a tile`;
    default:                 return '';
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN REDUCER
// ═══════════════════════════════════════════════════════════════

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    // ─── Charleston: Select tile for pass ─────────────────────
    case 'SELECT_TILE_FOR_PASS': {
      const human = state.players.east;
      const tile = human.hand.find(t => t.instanceId === action.instanceId);
      if (!tile || isJoker(tile)) return state;
      if (human.selectedForPass.length >= 3) return state;
      // For courtesy pass, respect the chosen count
      if (state.charlestonSubPhase === 'courtesy_pass' && state.courtesyCount !== null) {
        if (human.selectedForPass.length >= state.courtesyCount) return state;
      }
      if (human.selectedForPass.some(t => t.instanceId === action.instanceId)) return state;

      return {
        ...state,
        players: updatePlayer(state.players, 'east', {
          selectedForPass: [...human.selectedForPass, tile],
        }),
      };
    }

    // ─── Charleston: Deselect tile from pass ─────────────────
    case 'DESELECT_TILE_FOR_PASS': {
      const human = state.players.east;
      return {
        ...state,
        players: updatePlayer(state.players, 'east', {
          selectedForPass: human.selectedForPass.filter(t => t.instanceId !== action.instanceId),
        }),
      };
    }

    // ─── Charleston: Fill blind slot ─────────────────────────
    case 'FILL_BLIND_SLOT': {
      if (state.blindSlotCount >= 3) return state;
      const totalSelected = state.players.east.selectedForPass.length + state.blindSlotCount;
      if (totalSelected >= 3) return state;
      return { ...state, blindSlotCount: state.blindSlotCount + 1 };
    }

    // ─── Charleston: Unfill blind slot ───────────────────────
    case 'UNFILL_BLIND_SLOT': {
      if (state.blindSlotCount <= 0) return state;
      return { ...state, blindSlotCount: state.blindSlotCount - 1 };
    }

    // ─── Charleston: AI selects tiles ────────────────────────
    case 'AI_CHARLESTON_SELECT': {
      if (action.seat === 'east') return state; // Human is always east
      return {
        ...state,
        players: updatePlayer(state.players, action.seat, {
          selectedForPass: action.tiles,
        }),
      };
    }

    // ─── Charleston: Execute pass ────────────────────────────
    case 'EXECUTE_PASS': {
      const step = getCurrentCharlestonStep(state.charlestonSubPhase);
      const isCourtesy = state.charlestonSubPhase === 'courtesy_pass';

      // Determine pass direction
      const dir = isCourtesy ? 'across' as const : step?.dir;
      if (!dir) return state;

      // For blind passes, fill remaining blind slots with random non-joker tiles
      let players = clonePlayers(state.players);
      const human = players.east;

      if (step?.blind && state.blindSlotCount > 0) {
        const selIds = new Set(human.selectedForPass.map(t => t.instanceId));
        const available = human.hand.filter(t => !selIds.has(t.instanceId) && !isJoker(t));
        const shuffled = [...available].sort(() => Math.random() - 0.5);
        const blindTiles = shuffled.slice(0, state.blindSlotCount);
        players.east = {
          ...human,
          selectedForPass: [...human.selectedForPass, ...blindTiles],
        };
      }

      // Resolve the pass exchange
      const { newHands, receivedIds } = resolvePassExchange(players, dir);

      // Build updated players with new hands, cleared selections
      const newPlayers = {} as Record<Seat, PlayerState>;
      for (const seat of TURN_ORDER) {
        newPlayers[seat] = {
          ...players[seat],
          hand: newHands[seat],
          selectedForPass: [],
        };
      }

      // Determine next sub-phase
      let nextSubPhase: CharlestonSubPhase | 'gameplay';
      let nextPhase = state.phase;
      let nextGameplaySubPhase = state.gameplaySubPhase;
      let statusMessage: string;

      if (isCourtesy) {
        // Courtesy pass done → transition to gameplay
        nextPhase = 'gameplay';
        nextSubPhase = 'courtesy_pass'; // stays but phase changes
        nextGameplaySubPhase = 'east_first_discard';
        statusMessage = 'You have 14 tiles. Discard one to begin.';
      } else {
        nextSubPhase = NEXT_CHARLESTON_SUBPHASE[state.charlestonSubPhase] as CharlestonSubPhase;
        statusMessage = getCharlestonMessage(nextSubPhase);
      }

      return {
        ...state,
        phase: nextPhase as any,
        charlestonSubPhase: nextSubPhase as CharlestonSubPhase,
        gameplaySubPhase: nextGameplaySubPhase,
        players: newPlayers,
        blindSlotCount: 0,
        lastReceivedTileIds: receivedIds.east,
        statusMessage,
      };
    }

    // ─── Charleston: Continue/Stop prompt ────────────────────
    case 'CHARLESTON_CONTINUE': {
      if (action.continue) {
        return {
          ...state,
          charlestonSubPhase: 'second_left',
          charlestonContinued: true,
          statusMessage: getCharlestonMessage('second_left'),
        };
      } else {
        // Stop → go to courtesy prompt
        return {
          ...state,
          charlestonSubPhase: 'courtesy_prompt',
          charlestonContinued: false,
          statusMessage: getCharlestonMessage('courtesy_prompt'),
        };
      }
    }

    // ─── Charleston: Set courtesy count ──────────────────────
    case 'SET_COURTESY_COUNT': {
      const count = action.count;
      if (count === 0) {
        // Skip courtesy → transition to gameplay
        return {
          ...state,
          phase: 'gameplay',
          courtesyCount: 0,
          gameplaySubPhase: 'east_first_discard',
          statusMessage: 'You have 14 tiles. Discard one to begin.',
        };
      }
      return {
        ...state,
        charlestonSubPhase: 'courtesy_pass',
        courtesyCount: count,
        statusMessage: `Courtesy pass: Select ${count} tile${count !== 1 ? 's' : ''} to pass across`,
      };
    }

    // ─── Gameplay: Draw tile ─────────────────────────────────
    case 'DRAW_TILE': {
      if (state.wall.length === 0) {
        return { ...state, phase: 'game_over', isWallGame: true, statusMessage: 'Wall game! No tiles remaining.' };
      }

      const newWall = [...state.wall];
      const drawn = newWall.shift()!;
      const seat = state.currentTurn;
      const player = state.players[seat];

      return {
        ...state,
        wall: newWall,
        players: updatePlayer(state.players, seat, {
          hand: [...player.hand, drawn],
        }),
        gameplaySubPhase: 'discard',
        statusMessage: getGameplayMessage('discard', seat, seat === 'east'),
      };
    }

    // ─── Gameplay: Discard tile ──────────────────────────────
    case 'DISCARD_TILE': {
      const seat = state.currentTurn;
      const player = state.players[seat];
      const tile = player.hand.find(t => t.instanceId === action.instanceId);
      if (!tile) return state;

      return {
        ...state,
        players: updatePlayer(state.players, seat, {
          hand: removeTileByInstanceId(player.hand, action.instanceId),
          discardHistory: [...player.discardHistory, tile],
        }),
        discardPile: [...state.discardPile, tile],
        callWindowTile: tile,
        pendingCalls: {},
        gameplaySubPhase: 'call_window',
        statusMessage: getGameplayMessage('call_window', seat, true),
      };
    }

    // ─── Gameplay: AI discard ────────────────────────────────
    case 'AI_DISCARD': {
      const seat = action.seat;
      if (seat === 'east') return state; // Human discards via DISCARD_TILE
      const player = state.players[seat];
      const tile = player.hand.find(t => t.instanceId === action.instanceId);
      if (!tile) return state;

      return {
        ...state,
        players: updatePlayer(state.players, seat, {
          hand: removeTileByInstanceId(player.hand, action.instanceId),
          discardHistory: [...player.discardHistory, tile],
        }),
        discardPile: [...state.discardPile, tile],
        callWindowTile: tile,
        pendingCalls: {},
        gameplaySubPhase: 'call_window',
        statusMessage: getGameplayMessage('call_window', seat, true),
      };
    }

    // ─── Calling: Declare call ───────────────────────────────
    case 'DECLARE_CALL': {
      return {
        ...state,
        pendingCalls: {
          ...state.pendingCalls,
          [action.call.seat]: action.call,
        },
      };
    }

    // ─── Calling: Pass call ──────────────────────────────────
    case 'PASS_CALL': {
      return {
        ...state,
        pendingCalls: {
          ...state.pendingCalls,
          [action.seat]: 'pass',
        },
      };
    }

    // ─── Calling: Resolve calls ──────────────────────────────
    case 'RESOLVE_CALLS': {
      const discarder = state.currentTurn;
      const tile = state.callWindowTile;

      // Check if all non-discarders have responded
      const otherSeats = TURN_ORDER.filter(s => s !== discarder);
      const allResponded = otherSeats.every(s => state.pendingCalls[s] !== undefined);
      if (!allResponded) return state;

      // Collect actual calls (not 'pass')
      const calls = otherSeats
        .filter(s => state.pendingCalls[s] !== 'pass' && state.pendingCalls[s] !== undefined)
        .map(s => state.pendingCalls[s] as import('./types').CallDeclaration);

      if (calls.length === 0 || !tile) {
        // No calls — next player draws
        const nextSeat = getNextSeat(discarder);
        return {
          ...state,
          callWindowTile: null,
          pendingCalls: {},
          currentTurn: nextSeat,
          gameplaySubPhase: 'draw',
          statusMessage: getGameplayMessage('draw', nextSeat, nextSeat === 'east'),
        };
      }

      // Priority: mahjong > closest counterclockwise
      const mahjongCall = calls.find(c => c.callType === 'mahjong');
      let winner: import('./types').CallDeclaration;

      if (mahjongCall) {
        winner = mahjongCall;
      } else {
        // Closest counterclockwise to discarder
        const discarderIdx = getSeatIndex(discarder);
        winner = calls.reduce((best, call) => {
          const bestDist = ((getSeatIndex(best.seat) - discarderIdx) + 4) % 4;
          const callDist = ((getSeatIndex(call.seat) - discarderIdx) + 4) % 4;
          return callDist < bestDist ? call : best;
        });
      }

      // Process the winning call
      const callerSeat = winner.seat;
      const caller = state.players[callerSeat];

      // Remove tiles from caller's hand
      const tileIds = new Set(winner.tilesFromHand.map(t => t.instanceId));
      const newHand = caller.hand.filter(t => !tileIds.has(t.instanceId));

      // Build the exposure
      const meldTiles = [...winner.tilesFromHand, tile];
      const jokerPositions = meldTiles.map((t, i) => isJoker(t) ? i : -1).filter(i => i >= 0);

      const exposure: import('./types').Exposure = {
        tiles: meldTiles,
        calledTile: tile,
        fromSeat: discarder,
        meldType: winner.callType as import('./types').MeldType,
        jokerPositions,
      };

      // Remove the discard from the pile (it's now in the exposure)
      const newDiscardPile = state.discardPile.filter(t => t.instanceId !== tile.instanceId);

      return {
        ...state,
        players: updatePlayer(state.players, callerSeat, {
          hand: newHand,
          exposures: [...caller.exposures, exposure],
        }),
        discardPile: newDiscardPile,
        callWindowTile: null,
        pendingCalls: {},
        currentTurn: callerSeat,
        gameplaySubPhase: 'exposure_discard',
        statusMessage: getGameplayMessage('exposure_discard', callerSeat, callerSeat === 'east'),
      };
    }

    // ─── Special: Joker swap ─────────────────────────────────
    case 'JOKER_SWAP': {
      // On your turn, swap a natural tile from your hand for an exposed joker
      const humanHand = state.players.east.hand;
      const naturalTile = humanHand.find(t => t.instanceId === action.naturalTileInstanceId);
      if (!naturalTile || isJoker(naturalTile)) return state;

      // Find the joker in any player's exposures
      let foundSeat: Seat | null = null;
      let foundExpIdx = -1;
      let foundTileIdx = -1;

      for (const seat of TURN_ORDER) {
        const player = state.players[seat];
        for (let eIdx = 0; eIdx < player.exposures.length; eIdx++) {
          const exp = player.exposures[eIdx];
          const tIdx = exp.tiles.findIndex(t => t.instanceId === action.jokerInstanceId);
          if (tIdx >= 0) {
            foundSeat = seat;
            foundExpIdx = eIdx;
            foundTileIdx = tIdx;
            break;
          }
        }
        if (foundSeat) break;
      }

      if (!foundSeat || foundExpIdx < 0 || foundTileIdx < 0) return state;

      const newPlayers = clonePlayers(state.players);
      const targetPlayer = newPlayers[foundSeat];
      const jokerTile = targetPlayer.exposures[foundExpIdx].tiles[foundTileIdx];

      // Replace joker with natural tile in exposure
      targetPlayer.exposures[foundExpIdx].tiles[foundTileIdx] = naturalTile;
      targetPlayer.exposures[foundExpIdx].jokerPositions =
        targetPlayer.exposures[foundExpIdx].jokerPositions.filter(i => i !== foundTileIdx);

      // Remove natural tile from human hand, add joker
      newPlayers.east = {
        ...newPlayers.east,
        hand: [
          ...removeTileByInstanceId(newPlayers.east.hand, action.naturalTileInstanceId),
          jokerTile,
        ],
      };

      return { ...state, players: newPlayers };
    }

    // ─── Special: Declare mahjong ────────────────────────────
    case 'DECLARE_MAHJONG': {
      // Win detection will be implemented in Phase 5.
      // For now, just mark the game as over.
      return {
        ...state,
        phase: 'game_over',
        winner: action.seat,
        statusMessage: `${action.seat === 'east' ? 'You' : action.seat.charAt(0).toUpperCase() + action.seat.slice(1)} declared Mahjong!`,
      };
    }

    // ─── Calling: AI call ────────────────────────────────────
    case 'AI_CALL': {
      return {
        ...state,
        pendingCalls: {
          ...state.pendingCalls,
          [action.seat]: action.call,
        },
      };
    }

    // ─── Hand management: Sort ───────────────────────────────
    case 'SORT_HAND': {
      const human = state.players.east;
      const sorted = action.mode === 'suit' ? sortBySuit(human.hand) : sortByRank(human.hand);
      return {
        ...state,
        players: updatePlayer(state.players, 'east', { hand: sorted }),
      };
    }

    // ─── Hand management: Reorder ────────────────────────────
    case 'REORDER_HAND': {
      const human = state.players.east;
      const hand = [...human.hand];
      const [moved] = hand.splice(action.fromIndex, 1);
      if (!moved) return state;
      const toIdx = action.fromIndex < action.toIndex ? action.toIndex - 1 : action.toIndex;
      hand.splice(toIdx, 0, moved);
      return {
        ...state,
        players: updatePlayer(state.players, 'east', { hand }),
      };
    }

    // ─── Endgame: Wall game ──────────────────────────────────
    case 'WALL_GAME': {
      return {
        ...state,
        phase: 'game_over',
        isWallGame: true,
        statusMessage: 'Wall game! No tiles remaining.',
      };
    }

    default:
      return state;
  }
}
