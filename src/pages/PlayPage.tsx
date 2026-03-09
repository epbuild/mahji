// ═══════════════════════════════════════════════════════════════
// MAHJI — Play Page
// src/pages/PlayPage.tsx
//
// Full game: Setup → Charleston → Gameplay → Win/Wall
// Uses the pure TypeScript engine via useReducer.
// ═══════════════════════════════════════════════════════════════

import { useState, useReducer, useEffect, useCallback, useRef } from 'react';
import { C, GAME_MATS, getGameMat, FONT_SERIF, FONT_SANS } from '../constants/colors';
import { useTheme } from '../constants/ThemeContext';
import { PT, SH, Cnt, CardSel } from '../components/Layout';
import { GameBoard, PlayerHand, WinOverlay, WallGameOverlay } from '../components/GameBoard';
import type { PlayerConfig } from '../components/GameBoard';
import { MahjiTile } from '../components/tiles/MahjiTile';
import { getCard, getAvailableYears, getCurrentYear } from '../data/nmjl';
import type { NMJLCard } from '../data/nmjl';

// Engine imports
import {
  createInitialState,
  gameReducer,
  isJoker,
  TURN_ORDER,
  getNextSeat,
  getCurrentCharlestonStep,
  getAIDelay,
  getWallCount,
  aiSelectForPass,
  aiDecideDiscard,
  aiDecideCall,
} from '../engine';
import type {
  GameState, GameAction, GameConfig, Difficulty, Seat,
} from '../engine';

// Sound imports
import {
  playDeselect, playPingE, playWhoosh, playError,
  playCelebration, playPlace, playCharlestonReceive,
} from '../audio/sounds';
import { playVoice } from '../audio/voice';

// ═══════════════════════════════════════════════════════════════
// SETUP SCREEN — difficulty, card, mat pickers + Start button
// ═══════════════════════════════════════════════════════════════

function SetupScreen({ onStart }: {
  onStart: (config: { difficulty: Difficulty; cardYear: number; matId: string }) => void;
}) {
  const currentYear = getCurrentYear();
  const [diff, setDiff] = useState<Difficulty>('intermediate');
  const [card, setCard] = useState(String(currentYear));
  const [matId, setMatId] = useState('coffee');
  const mat = getGameMat(matId);

  const DEFAULT_PLAYERS: PlayerConfig[] = [
    { seat: 'east', name: 'You (East)', rackCount: 13 },
    { seat: 'north', name: 'North', rackCount: 13 },
    { seat: 'west', name: 'West', rackCount: 13 },
    { seat: 'south', name: 'South', rackCount: 13 },
  ];

  return (
    <><PT>Play</PT><Cnt>
      {/* Difficulty picker */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 14, flexWrap: 'wrap' }}>
        {(['novice', 'intermediate', 'advanced'] as Difficulty[]).map(d => (
          <div key={d} onClick={() => setDiff(d)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 11,
            fontWeight: diff === d ? 600 : 400, cursor: 'pointer',
            background: diff === d ? C.seafoam : 'transparent',
            color: diff === d ? C.white : C.mid,
            border: diff === d ? 'none' : `1px solid ${C.lavBorder}`,
            transition: 'all 0.3s', textTransform: 'capitalize',
            fontFamily: FONT_SANS,
          }}>{d}</div>
        ))}
      </div>

      {/* Card year picker */}
      <SH style={{ marginTop: 4 }}>Select Card</SH>
      <CardSel items={[
        ...getAvailableYears().reverse().map((y, i) => ({
          id: String(y),
          name: `NMJL ${y}`,
          sub: i === 0 ? 'Current year' : '',
        })),
      ]} active={card} onSelect={setCard} />

      {/* Mat picker + Start button */}
      <SH>Select Your Game Mat</SH>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 0 }}>
          {GAME_MATS.map(m => (
            <div key={m.id} style={{ textAlign: 'center', flex: '0 0 auto' }}>
              <div onClick={() => setMatId(m.id)} style={{
                width: 44, height: 44, borderRadius: 10, background: m.swatch, cursor: 'pointer',
                border: matId === m.id ? `2px solid ${C.cherry}` : '2px solid transparent',
                boxShadow: matId === m.id ? '0 2px 10px rgba(224,48,80,0.15)' : 'none',
              }} />
              <div style={{ fontSize: 7, color: C.light, marginTop: 3, letterSpacing: 0.5 }}>{m.name}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => onStart({ difficulty: diff, cardYear: Number(card), matId })}
          style={{
            padding: '10px 16px', border: 'none', borderRadius: 12,
            fontFamily: FONT_SERIF, fontSize: 13, fontWeight: 600, letterSpacing: 1,
            color: C.white, cursor: 'pointer',
            background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`,
            boxShadow: '0 4px 14px rgba(224,48,80,0.18)',
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
          }}
        >
          Start
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.cerulean} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3" /></svg>
        </button>
      </div>

      {/* Game Board Preview */}
      <div style={{ marginBottom: 10 }}>
        <GameBoard mat={mat} players={DEFAULT_PLAYERS} tilesRemaining={152} />
      </div>
    </Cnt></>
  );
}

// ═══════════════════════════════════════════════════════════════
// PASS BOX — shows slots for tiles to pass
// ═══════════════════════════════════════════════════════════════

function PassBox({
  selected,
  blindSlotCount,
  isBlind,
  maxSlots,
  onDeselect,
  onFillBlind,
  onUnfillBlind,
}: {
  selected: import('../data/tileData').GameTile[];
  blindSlotCount: number;
  isBlind: boolean;
  maxSlots: number;
  onDeselect: (instanceId: string) => void;
  onFillBlind: () => void;
  onUnfillBlind: () => void;
}) {
  const slots = Array.from({ length: maxSlots });

  return (
    <div style={{
      display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center',
      padding: '6px 8px', borderRadius: 10,
      background: 'rgba(0,0,0,0.15)',
      border: '1px dashed rgba(255,255,255,0.25)',
    }}>
      {slots.map((_, i) => {
        // Show selected tiles first
        if (i < selected.length) {
          const tile = selected[i];
          return (
            <div key={tile.instanceId} onClick={() => onDeselect(tile.instanceId)} style={{ cursor: 'pointer' }}>
              <div style={{ width: 28, height: 38, overflow: 'hidden', borderRadius: 4 }}>
                <div style={{ transform: 'scale(0.39)', transformOrigin: 'top left' }}>
                  <MahjiTile tile={tile} size="md" />
                </div>
              </div>
            </div>
          );
        }
        // Blind slots (tile backs)
        const blindIdx = i - selected.length;
        if (isBlind && blindIdx < blindSlotCount) {
          return (
            <div key={`blind-${i}`} onClick={onUnfillBlind} style={{
              width: 28, height: 38, borderRadius: 4, cursor: 'pointer',
              background: 'linear-gradient(135deg, #8B2E3E, #6B1E2E)',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>B</span>
            </div>
          );
        }
        // Empty slot
        return (
          <div key={`empty-${i}`} style={{
            width: 28, height: 38, borderRadius: 4,
            border: '1px dashed rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isBlind && (
              <div onClick={onFillBlind} style={{
                width: 20, height: 20, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: 700,
              }}>B</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GAME SCREEN — the actual game using the engine
// ═══════════════════════════════════════════════════════════════

function GameScreen({ initialState, matId, onExit }: {
  initialState: GameState;
  matId: string;
  onExit: () => void;
}) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const mat = getGameMat(matId);

  // Track received/touched tiles for NEW badges
  const [touchedTileIds, setTouchedTileIds] = useState<Set<string>>(new Set());

  // Track animating state
  const [animating, setAnimating] = useState(false);

  // Ref to track if voice has been announced for current phase
  const announcedPhaseRef = useRef<string>('');

  // ── Voice announcements for charleston phases ──
  useEffect(() => {
    if (state.phase !== 'charleston') return;
    const sp = state.charlestonSubPhase;
    const key = `${state.phase}-${sp}`;
    if (announcedPhaseRef.current === key) return;
    announcedPhaseRef.current = key;

    if (sp === 'first_right') playVoice('first-charleston');
    else if (sp === 'second_left') playVoice('second-charleston');
    else if (sp === 'courtesy_prompt' || sp === 'courtesy_pass') playVoice('courtesy-pass');
  }, [state.phase, state.charlestonSubPhase]);

  // ── AI charleston tile selection ──
  useEffect(() => {
    if (state.phase !== 'charleston') return;
    if (animating) return;
    const step = getCurrentCharlestonStep(state.charlestonSubPhase);
    if (!step && state.charlestonSubPhase !== 'courtesy_pass') return;

    const aiSeats: Seat[] = ['north', 'west', 'south'];
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (const seat of aiSeats) {
      const player = state.players[seat];
      if (player.selectedForPass.length > 0) continue;

      const count = state.charlestonSubPhase === 'courtesy_pass'
        ? (state.courtesyCount ?? 3)
        : 3;

      const delay = getAIDelay(state.difficulty);
      const timer = setTimeout(() => {
        const tiles = aiSelectForPass(player.hand, count, state.difficulty);
        dispatch({ type: 'AI_CHARLESTON_SELECT', seat, tiles });
      }, delay);
      timers.push(timer);
    }

    return () => timers.forEach(clearTimeout);
  }, [state.phase, state.charlestonSubPhase, state.difficulty, animating, state.courtesyCount]);

  // ── AI gameplay actions (draw/discard) ──
  useEffect(() => {
    if (state.phase !== 'gameplay') return;
    if (state.currentTurn === 'east') return;
    if (animating) return;

    const seat = state.currentTurn;

    if (state.gameplaySubPhase === 'draw') {
      const delay = getAIDelay(state.difficulty);
      const timer = setTimeout(() => {
        dispatch({ type: 'DRAW_TILE' });
      }, delay);
      return () => clearTimeout(timer);
    }

    if (state.gameplaySubPhase === 'discard' || state.gameplaySubPhase === 'exposure_discard') {
      const delay = getAIDelay(state.difficulty);
      const timer = setTimeout(() => {
        const instanceId = aiDecideDiscard(state.players[seat].hand, state.difficulty);
        dispatch({ type: 'AI_DISCARD', seat, instanceId });
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.currentTurn, state.gameplaySubPhase, state.difficulty, animating]);

  // ── AI call window responses ──
  useEffect(() => {
    if (state.gameplaySubPhase !== 'call_window') return;
    if (!state.callWindowTile) return;

    const discarder = state.currentTurn;
    const aiSeats = TURN_ORDER.filter(s => s !== discarder && s !== 'east');
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (const seat of aiSeats) {
      if (state.pendingCalls[seat] !== undefined) continue;

      const delay = getAIDelay(state.difficulty) * 0.5;
      const timer = setTimeout(() => {
        const decision = aiDecideCall(state, seat, state.callWindowTile!);
        dispatch({ type: 'AI_CALL', seat, call: decision });
      }, delay);
      timers.push(timer);
    }

    // Check if all have responded — resolve
    const allResponded = TURN_ORDER
      .filter(s => s !== discarder)
      .every(s => state.pendingCalls[s] !== undefined);

    if (allResponded) {
      const timer = setTimeout(() => dispatch({ type: 'RESOLVE_CALLS' }), 300);
      timers.push(timer);
    }

    return () => timers.forEach(clearTimeout);
  }, [state.gameplaySubPhase, state.callWindowTile, state.pendingCalls, state.currentTurn, state.difficulty]);

  // ── Human tile tap ──
  const handleTileTap = useCallback((tile: import('../data/tileData').GameTile) => {
    if (animating) return;
    setTouchedTileIds(prev => new Set([...prev, tile.instanceId]));

    if (state.phase === 'charleston') {
      const human = state.players.east;
      if (human.selectedForPass.some(t => t.instanceId === tile.instanceId)) {
        dispatch({ type: 'DESELECT_TILE_FOR_PASS', instanceId: tile.instanceId });
        playDeselect();
      } else {
        if (isJoker(tile)) { playError(); return; }
        dispatch({ type: 'SELECT_TILE_FOR_PASS', instanceId: tile.instanceId });
        playPlace();
      }
    } else if (state.phase === 'gameplay') {
      if (state.currentTurn === 'east' &&
          (state.gameplaySubPhase === 'discard' ||
           state.gameplaySubPhase === 'east_first_discard' ||
           state.gameplaySubPhase === 'exposure_discard')) {
        dispatch({ type: 'DISCARD_TILE', instanceId: tile.instanceId });
      }
    }
  }, [state.phase, state.charlestonSubPhase, state.players.east, state.currentTurn, state.gameplaySubPhase, animating]);

  // ── Execute charleston pass ──
  const executePass = useCallback(() => {
    if (animating) return;
    const isCourtesy = state.charlestonSubPhase === 'courtesy_pass';
    const requiredCount = isCourtesy ? (state.courtesyCount ?? 0) : 3;

    const human = state.players.east;
    const totalHumanSelected = human.selectedForPass.length + state.blindSlotCount;
    if (totalHumanSelected < requiredCount) return;

    const aiReady = (['north', 'west', 'south'] as Seat[]).every(
      s => state.players[s].selectedForPass.length >= requiredCount
    );
    if (!aiReady) return;

    setAnimating(true);
    playWhoosh();

    setTimeout(() => {
      dispatch({ type: 'EXECUTE_PASS' });
      setAnimating(false);
      playCharlestonReceive();
      setTouchedTileIds(new Set());
    }, 600);
  }, [state, animating]);

  // ── Auto-execute pass when all ready ──
  useEffect(() => {
    if (state.phase !== 'charleston') return;
    if (animating) return;
    if (state.charlestonSubPhase === 'continue_prompt') return;
    if (state.charlestonSubPhase === 'courtesy_prompt') return;

    const isCourtesy = state.charlestonSubPhase === 'courtesy_pass';
    const requiredCount = isCourtesy ? (state.courtesyCount ?? 0) : 3;

    const human = state.players.east;
    const totalHumanSelected = human.selectedForPass.length + state.blindSlotCount;
    if (totalHumanSelected < requiredCount) return;

    const aiReady = (['north', 'west', 'south'] as Seat[]).every(
      s => state.players[s].selectedForPass.length >= requiredCount
    );
    if (!aiReady) return;

    const timer = setTimeout(executePass, 400);
    return () => clearTimeout(timer);
  }, [state.phase, state.charlestonSubPhase, state.players, state.blindSlotCount, state.courtesyCount, animating, executePass]);

  // ── Human draws tile ──
  const handleDraw = useCallback(() => {
    if (state.currentTurn !== 'east') return;
    if (state.gameplaySubPhase !== 'draw') return;
    dispatch({ type: 'DRAW_TILE' });
    playPingE();
  }, [state.currentTurn, state.gameplaySubPhase]);

  // ── Human passes call ──
  const handlePassCall = useCallback(() => {
    dispatch({ type: 'PASS_CALL', seat: 'east' });
  }, []);

  // ── Human declares mahjong ──
  const handleMahjong = useCallback(() => {
    dispatch({ type: 'DECLARE_MAHJONG', seat: 'east' });
  }, []);

  // ── Sort hand ──
  const handleSortByRank = useCallback(() => dispatch({ type: 'SORT_HAND', mode: 'rank' }), []);
  const handleSortBySuit = useCallback(() => dispatch({ type: 'SORT_HAND', mode: 'suit' }), []);

  // ── Convert engine state → GameBoard PlayerConfig ──
  const boardPlayers: PlayerConfig[] = TURN_ORDER.map(seat => {
    const p = state.players[seat];
    const isReady = state.phase === 'charleston' && p.selectedForPass.length > 0;
    return {
      seat,
      name: p.name,
      isReady,
      showReady: state.phase === 'charleston',
      rackCount: seat === 'east' ? 0 : p.hand.length,
      exposures: p.exposures.map(e => e.tiles),
    };
  });

  // ── Overlay ──
  const getOverlay = () => {
    if (state.phase === 'game_over') {
      if (state.isWallGame) {
        return <WallGameOverlay onNextGame={onExit} onExit={onExit} />;
      }
      if (state.winner) {
        const winner = state.players[state.winner];
        return (
          <WinOverlay
            winnerName={winner.name}
            winningHand={winner.hand}
            onNextGame={onExit}
            onExit={onExit}
          />
        );
      }
    }
    return undefined;
  };

  // ── Center content (pass box, prompts, draw button, call UI) ──
  const getCenterContent = () => {
    if (state.phase === 'charleston') {
      const step = getCurrentCharlestonStep(state.charlestonSubPhase);
      const isCourtesy = state.charlestonSubPhase === 'courtesy_pass';
      const isBlind = step?.blind ?? false;
      const maxSlots = isCourtesy ? (state.courtesyCount ?? 3) : 3;

      // Continue prompt
      if (state.charlestonSubPhase === 'continue_prompt') {
        return (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 6,
            padding: '10px 12px', borderRadius: 10,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          }}>
            <div style={{ fontSize: 10, color: '#fff', fontFamily: FONT_SANS, textAlign: 'center', fontWeight: 600 }}>
              Continue to Second Charleston?
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => dispatch({ type: 'CHARLESTON_CONTINUE', continue: true })} style={{
                flex: 1, padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: C.cherry, color: '#fff', fontSize: 9, fontWeight: 600, fontFamily: FONT_SANS,
              }}>Continue</button>
              <button onClick={() => dispatch({ type: 'CHARLESTON_CONTINUE', continue: false })} style={{
                flex: 1, padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.3)',
                background: 'transparent', color: '#fff', fontSize: 9, fontWeight: 600, fontFamily: FONT_SANS, cursor: 'pointer',
              }}>Stop</button>
            </div>
          </div>
        );
      }

      // Courtesy prompt
      if (state.charlestonSubPhase === 'courtesy_prompt') {
        return (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 6,
            padding: '10px 12px', borderRadius: 10,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          }}>
            <div style={{ fontSize: 10, color: '#fff', fontFamily: FONT_SANS, textAlign: 'center', fontWeight: 600 }}>
              Courtesy pass: how many tiles?
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0, 1, 2, 3].map(n => (
                <button key={n} onClick={() => dispatch({ type: 'SET_COURTESY_COUNT', count: n })} style={{
                  flex: 1, padding: '6px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: n === 0 ? 'rgba(255,255,255,0.15)' : C.cherry,
                  color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: FONT_SANS,
                }}>{n}</button>
              ))}
            </div>
          </div>
        );
      }

      // Pass box
      return (
        <PassBox
          selected={state.players.east.selectedForPass}
          blindSlotCount={state.blindSlotCount}
          isBlind={isBlind}
          maxSlots={maxSlots}
          onDeselect={(id) => {
            dispatch({ type: 'DESELECT_TILE_FOR_PASS', instanceId: id });
            playDeselect();
          }}
          onFillBlind={() => dispatch({ type: 'FILL_BLIND_SLOT' })}
          onUnfillBlind={() => dispatch({ type: 'UNFILL_BLIND_SLOT' })}
        />
      );
    }

    // Gameplay: draw button
    if (state.phase === 'gameplay') {
      if (state.gameplaySubPhase === 'draw' && state.currentTurn === 'east') {
        return (
          <button onClick={handleDraw} style={{
            padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: C.cherry, color: '#fff', fontSize: 11, fontWeight: 600,
            fontFamily: FONT_SANS, boxShadow: '0 2px 8px rgba(224,48,80,0.3)',
          }}>Draw Tile</button>
        );
      }

      if (state.gameplaySubPhase === 'call_window' && state.currentTurn !== 'east') {
        return (
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={handlePassCall} style={{
              padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 9, fontWeight: 600,
              fontFamily: FONT_SANS, cursor: 'pointer',
            }}>Pass</button>
          </div>
        );
      }
    }

    return null;
  };

  const selectedIds = new Set(state.players.east.selectedForPass.map(t => t.instanceId));
  const isDiscardPhase = state.phase === 'gameplay' && state.currentTurn === 'east' &&
    (state.gameplaySubPhase === 'discard' ||
     state.gameplaySubPhase === 'east_first_discard' ||
     state.gameplaySubPhase === 'exposure_discard');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 8px' }}>
      <GameBoard
        mat={mat}
        players={boardPlayers}
        discards={state.discardPile}
        tilesRemaining={getWallCount(state)}
        overlay={getOverlay()}
        compact={state.phase === 'charleston'}
      >
        {getCenterContent()}
      </GameBoard>

      <PlayerHand
        hand={state.players.east.hand}
        onTileTap={handleTileTap}
        selectedIds={selectedIds}
        newTileIds={state.lastReceivedTileIds}
        touchedTileIds={touchedTileIds}
        disabled={animating || (state.phase === 'gameplay' && state.currentTurn !== 'east')}
        showSortButtons
        showMahjongButton={state.phase === 'gameplay'}
        hideMahjongButton={!isDiscardPhase}
        onMahjong={handleMahjong}
        onSortByRank={handleSortByRank}
        onSortBySuit={handleSortBySuit}
        helperText={state.statusMessage}
        helperColor={state.currentTurn === 'east' ? C.cherry : C.lavDeep}
        cherry={C.cherry}
        seafoam={C.seafoam}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PLAY PAGE — orchestrates setup → game
// ═══════════════════════════════════════════════════════════════

function PlayPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [matId, setMatId] = useState('coffee');
  const [loading, setLoading] = useState(false);

  const handleStart = async (config: { difficulty: Difficulty; cardYear: number; matId: string }) => {
    setLoading(true);
    setMatId(config.matId);

    try {
      const card = await getCard(config.cardYear);
      if (!card) {
        console.error('Failed to load card for year', config.cardYear);
        setLoading(false);
        return;
      }

      const gameConfig: GameConfig = {
        difficulty: config.difficulty,
        card,
        playerNames: ['You (East)', 'North', 'West', 'South'],
      };

      const initial = createInitialState(gameConfig);
      setGameState(initial);
    } catch (err) {
      console.error('Failed to start game:', err);
    }
    setLoading(false);
  };

  const handleExit = () => setGameState(null);

  if (loading) {
    return (
      <><PT>Play</PT><Cnt>
        <div style={{ textAlign: 'center', padding: 40, color: C.mid, fontFamily: FONT_SANS }}>
          Dealing tiles...
        </div>
      </Cnt></>
    );
  }

  if (gameState) {
    return <GameScreen initialState={gameState} matId={matId} onExit={handleExit} />;
  }

  return <SetupScreen onStart={handleStart} />;
}

export default PlayPage;
