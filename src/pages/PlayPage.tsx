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
import { GameBoard, PlayerHand, WinOverlay, WallGameOverlay, CallTileUI } from '../components/GameBoard';
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
  getWallCount,
  aiSelectForPass,
  aiDecideDiscard,
  aiDecideCall,
  canCallPung,
  canCallKong,
  canCallQuint,
  checkMahjongWithDiscard,
} from '../engine';
import type {
  GameState, GameAction, GameConfig, Difficulty, Seat, CallDeclaration,
} from '../engine';

// Sound imports
import {
  playDeselect, playWhoosh, playError,
  playCelebration, playPlace, playCharlestonReceive,
  playTileReceive,
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
// PASS BOX — shows slots for tiles to pass (matches CharlestonDrill)
// ═══════════════════════════════════════════════════════════════

const PASS_ANIM_CSS = `
  @keyframes passSlideRight {
    0% { transform: scale(1) translateX(0); opacity: 1; box-shadow: 0 0 0 rgba(224,48,80,0); filter: blur(0); }
    30% { transform: scale(1.18); opacity: 0.9; box-shadow: 0 0 36px rgba(224,48,80,0.45), 0 0 60px rgba(224,48,80,0.15); filter: blur(0.5px); }
    100% { transform: scale(0.7) translateX(100px); opacity: 0; box-shadow: 0 0 50px rgba(224,48,80,0.25); filter: blur(2px); }
  }
  @keyframes passSlideLeft {
    0% { transform: scale(1) translateX(0); opacity: 1; box-shadow: 0 0 0 rgba(224,48,80,0); filter: blur(0); }
    30% { transform: scale(1.18); opacity: 0.9; box-shadow: 0 0 36px rgba(224,48,80,0.45), 0 0 60px rgba(224,48,80,0.15); filter: blur(0.5px); }
    100% { transform: scale(0.7) translateX(-100px); opacity: 0; box-shadow: 0 0 50px rgba(224,48,80,0.25); filter: blur(2px); }
  }
  @keyframes passSlideUp {
    0% { transform: scale(1) translateY(0); opacity: 1; box-shadow: 0 0 0 rgba(224,48,80,0); filter: blur(0); }
    30% { transform: scale(1.18); opacity: 0.9; box-shadow: 0 0 36px rgba(224,48,80,0.45), 0 0 60px rgba(224,48,80,0.15); filter: blur(0.5px); }
    100% { transform: scale(0.7) translateY(-80px); opacity: 0; box-shadow: 0 0 50px rgba(224,48,80,0.25); filter: blur(2px); }
  }
`;

const DIR_ARROW: Record<string, string> = { right: '→', across: '↑', left: '←' };

function PassBox({
  selected,
  blindSlotCount,
  isBlind,
  maxSlots,
  passDir,
  dirLabel,
  onDeselect,
  onFillBlind,
  onUnfillBlind,
  animating,
}: {
  selected: import('../data/tileData').GameTile[];
  blindSlotCount: number;
  isBlind: boolean;
  maxSlots: number;
  passDir: 'right' | 'across' | 'left' | null;
  dirLabel: string;
  onDeselect: (instanceId: string) => void;
  onFillBlind: () => void;
  onUnfillBlind: () => void;
  animating: boolean;
}) {
  const TILE_S = 0.55; // scale for tiles in pass box
  const TILE_W = Math.ceil(72 * TILE_S);
  const TILE_H = Math.ceil(98 * TILE_S);
  const hasTiles = selected.length > 0 || blindSlotCount > 0;
  const animName = passDir === 'right' ? 'passSlideRight' : passDir === 'left' ? 'passSlideLeft' : 'passSlideUp';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {/* Direction label */}
      <div style={{
        background: 'rgba(255,255,255,0.85)', borderRadius: 6,
        padding: '2px 10px', textAlign: 'center',
      }}>
        <span style={{
          fontFamily: FONT_SERIF, fontSize: 9, fontWeight: 700,
          color: C.cherry, letterSpacing: 0.5,
        }}>
          {dirLabel}
        </span>
        {isBlind && (
          <span style={{
            fontSize: 7, color: '#fff', fontWeight: 700, background: C.seafoam,
            padding: '1px 5px', borderRadius: 4, marginLeft: 5, letterSpacing: 0.3,
          }}>Blind</span>
        )}
      </div>

      {/* Pass box with animation */}
      <div style={{
        display: 'flex', gap: 3, alignItems: 'center', justifyContent: 'center',
        padding: '5px 8px', borderRadius: 8, overflow: 'visible',
        background: hasTiles ? 'rgba(224,48,80,0.06)' : 'rgba(255,255,255,0.08)',
        border: `2px dashed ${hasTiles ? 'rgba(224,48,80,0.5)' : 'rgba(255,255,255,0.25)'}`,
        transition: passDir ? 'none' : 'all 0.2s ease',
        animation: passDir ? `${animName} 0.5s ease-in forwards` : 'none',
      }}>
        {Array.from({ length: maxSlots }, (_, i) => {
          // Selected tile
          if (i < selected.length) {
            const tile = selected[i];
            return (
              <div key={tile.instanceId} onClick={() => !animating && onDeselect(tile.instanceId)} style={{ cursor: 'pointer' }}>
                <div style={{ width: TILE_W, height: TILE_H, overflow: 'hidden', borderRadius: 5 }}>
                  <div style={{ transform: `scale(${TILE_S})`, transformOrigin: 'top left' }}>
                    <MahjiTile tile={tile} size="md" />
                  </div>
                </div>
              </div>
            );
          }
          // Blind slot (tile back)
          const blindIdx = i - selected.length;
          if (isBlind && blindIdx >= 0 && blindIdx < blindSlotCount) {
            return (
              <div key={`blind-${i}`} onClick={() => !animating && onUnfillBlind()} style={{ cursor: 'pointer', opacity: 0.85 }}>
                <div style={{ width: TILE_W, height: TILE_H, overflow: 'hidden', borderRadius: 5 }}>
                  <div style={{ transform: `scale(${TILE_S})`, transformOrigin: 'top left' }}>
                    <MahjiTile faceDown size="md" />
                  </div>
                </div>
              </div>
            );
          }
          // Empty slot / B button
          return (
            <div key={`empty-${i}`} style={{
              width: TILE_W, height: TILE_H, borderRadius: 5,
              border: '2px dashed rgba(224,48,80,0.25)',
              background: 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isBlind ? (
                <div onClick={() => !animating && onFillBlind()} style={{
                  cursor: 'pointer', fontFamily: FONT_SERIF, fontSize: 18,
                  fontWeight: 700, color: 'rgba(224,48,80,0.35)',
                }}>B</div>
              ) : (
                <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>tap tile</span>
              )}
            </div>
          );
        })}
      </div>
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

  // CallTileUI state — whether "Call" was tapped (reveals Pung/Kong/Quint/Mahjong options)
  const [showCallOptions, setShowCallOptions] = useState(false);

  // Charleston pass animation direction
  const [passDir, setPassDir] = useState<'right' | 'across' | 'left' | null>(null);

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

    for (const seat of aiSeats) {
      const player = state.players[seat];
      if (player.selectedForPass.length > 0) continue;

      const count = state.charlestonSubPhase === 'courtesy_pass'
        ? (state.courtesyCount ?? 3)
        : 3;

      // AI selects instantly — no delay
      const tiles = aiSelectForPass(player.hand, count, state.difficulty);
      dispatch({ type: 'AI_CHARLESTON_SELECT', seat, tiles });
    }
  }, [state.phase, state.charlestonSubPhase, state.difficulty, animating, state.courtesyCount]);

  // ── AI gameplay actions (draw/discard) — instant, no sound ──
  useEffect(() => {
    if (state.phase !== 'gameplay') return;
    if (state.currentTurn === 'east') return;
    if (animating) return;

    const seat = state.currentTurn;

    if (state.gameplaySubPhase === 'draw') {
      // Instant draw — tiny delay to let React batch
      const timer = setTimeout(() => dispatch({ type: 'DRAW_TILE' }), 50);
      return () => clearTimeout(timer);
    }

    if (state.gameplaySubPhase === 'discard' || state.gameplaySubPhase === 'exposure_discard') {
      // Instant discard — tiny delay to let React batch
      const timer = setTimeout(() => {
        const instanceId = aiDecideDiscard(state.players[seat].hand, state.difficulty);
        dispatch({ type: 'AI_DISCARD', seat, instanceId });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.currentTurn, state.gameplaySubPhase, state.difficulty, animating]);

  // ── AI call window responses — instant ──
  useEffect(() => {
    if (state.gameplaySubPhase !== 'call_window') return;
    if (!state.callWindowTile) return;

    const discarder = state.currentTurn;
    const aiSeats = TURN_ORDER.filter(s => s !== discarder && s !== 'east');

    // AI responds instantly
    for (const seat of aiSeats) {
      if (state.pendingCalls[seat] !== undefined) continue;
      const decision = aiDecideCall(state, seat, state.callWindowTile!);
      dispatch({ type: 'AI_CALL', seat, call: decision });
    }
  }, [state.gameplaySubPhase, state.callWindowTile, state.pendingCalls, state.currentTurn, state.difficulty]);

  // ── Resolve calls after all have responded ──
  useEffect(() => {
    if (state.gameplaySubPhase !== 'call_window') return;
    if (!state.callWindowTile) return;

    const discarder = state.currentTurn;
    const allResponded = TURN_ORDER
      .filter(s => s !== discarder)
      .every(s => state.pendingCalls[s] !== undefined);

    if (allResponded) {
      // If human hasn't responded yet (east not discarder), wait for human
      if (discarder !== 'east' && state.pendingCalls['east'] === undefined) return;
      const timer = setTimeout(() => {
        setShowCallOptions(false);
        dispatch({ type: 'RESOLVE_CALLS' });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [state.gameplaySubPhase, state.callWindowTile, state.pendingCalls, state.currentTurn]);

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

    // Get pass direction for animation
    const step = getCurrentCharlestonStep(state.charlestonSubPhase);
    const dir = isCourtesy ? 'across' as const : step?.dir ?? 'across';

    setAnimating(true);
    setPassDir(dir);
    playWhoosh();

    setTimeout(() => {
      setPassDir(null);
      dispatch({ type: 'EXECUTE_PASS' });
      setAnimating(false);
      playCharlestonReceive();
      setTouchedTileIds(new Set());
    }, 600);
  }, [state, animating]);

  // (No auto-execute — human clicks Pass button manually)

  // ── Human draws tile ──
  const handleDraw = useCallback(() => {
    if (state.currentTurn !== 'east') return;
    if (state.gameplaySubPhase !== 'draw') return;
    dispatch({ type: 'DRAW_TILE' });
    playTileReceive();
  }, [state.currentTurn, state.gameplaySubPhase]);

  // ── Human passes call ──
  const handlePassCall = useCallback(() => {
    dispatch({ type: 'PASS_CALL', seat: 'east' });
  }, []);

  // ── Human declares mahjong ──
  const handleMahjong = useCallback(() => {
    dispatch({ type: 'DECLARE_MAHJONG', seat: 'east' });
  }, []);

  // ── Call tile UI handlers ──
  const handleIgnoreCall = useCallback(() => {
    setShowCallOptions(false);
    dispatch({ type: 'PASS_CALL', seat: 'east' });
  }, []);

  const handleShowCallOptions = useCallback(() => {
    setShowCallOptions(true);
  }, []);

  const handleCallPung = useCallback(() => {
    if (!state.callWindowTile) return;
    const pung = canCallPung(state.players.east.hand, state.callWindowTile);
    if (!pung.canCall) { playError(); return; }
    setShowCallOptions(false);
    dispatch({ type: 'DECLARE_CALL', call: { seat: 'east', callType: 'pung', tilesFromHand: pung.tilesFromHand } });
  }, [state.callWindowTile, state.players.east.hand]);

  const handleCallKong = useCallback(() => {
    if (!state.callWindowTile) return;
    const kong = canCallKong(state.players.east.hand, state.callWindowTile);
    if (!kong.canCall) { playError(); return; }
    setShowCallOptions(false);
    dispatch({ type: 'DECLARE_CALL', call: { seat: 'east', callType: 'kong', tilesFromHand: kong.tilesFromHand } });
  }, [state.callWindowTile, state.players.east.hand]);

  const handleCallQuint = useCallback(() => {
    if (!state.callWindowTile) return;
    const quint = canCallQuint(state.players.east.hand, state.callWindowTile);
    if (!quint.canCall) { playError(); return; }
    setShowCallOptions(false);
    dispatch({ type: 'DECLARE_CALL', call: { seat: 'east', callType: 'quint', tilesFromHand: quint.tilesFromHand } });
  }, [state.callWindowTile, state.players.east.hand]);

  const handleCallMahjong = useCallback(() => {
    if (!state.callWindowTile) return;
    setShowCallOptions(false);
    dispatch({ type: 'DECLARE_CALL', call: { seat: 'east', callType: 'mahjong', tilesFromHand: [] } });
  }, [state.callWindowTile]);

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
      rackCount: p.hand.length,
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

      // Continue prompt (matches CharlestonDrill white card)
      if (state.charlestonSubPhase === 'continue_prompt') {
        return (
          <div style={{
            background: '#FFFFFF', borderRadius: 14, padding: '18px 22px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)', textAlign: 'center', minWidth: 190,
          }}>
            <h3 style={{ fontFamily: FONT_SERIF, fontSize: 14, color: C.cherry, margin: '0 0 4px', letterSpacing: 1 }}>
              Second Charleston?
            </h3>
            <p style={{ fontSize: 9, color: '#6B5A82', margin: '0 0 14px' }}>Would you like to continue?</p>
            <button onClick={() => dispatch({ type: 'CHARLESTON_CONTINUE', continue: true })} style={{
              display: 'block', width: '100%', padding: '9px 0', marginBottom: 6,
              background: 'rgba(224,48,80,0.06)', border: '1px solid rgba(224,48,80,0.2)', borderRadius: 9,
              cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#E03050', fontFamily: FONT_SANS,
            }}>Continue</button>
            <button onClick={() => dispatch({ type: 'CHARLESTON_CONTINUE', continue: false })} style={{
              display: 'block', width: '100%', padding: '9px 0',
              background: 'rgba(107,63,160,0.06)', border: '1px solid rgba(107,63,160,0.15)', borderRadius: 9,
              cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#6B3FA0', fontFamily: FONT_SANS,
            }}>Stop Charleston!</button>
          </div>
        );
      }

      // Courtesy prompt (matches CharlestonDrill white card)
      if (state.charlestonSubPhase === 'courtesy_prompt') {
        return (
          <div style={{
            background: '#FFFFFF', borderRadius: 14, padding: '18px 22px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)', textAlign: 'center', minWidth: 190,
          }}>
            <h3 style={{ fontFamily: FONT_SERIF, fontSize: 14, color: C.cherry, margin: '0 0 4px', letterSpacing: 1 }}>
              Courtesy Pass
            </h3>
            <p style={{ fontSize: 9, color: '#6B5A82', margin: '0 0 12px' }}>How many tiles to pass across?</p>
            {[0, 1, 2, 3].map(n => (
              <button key={n} onClick={() => dispatch({ type: 'SET_COURTESY_COUNT', count: n })} style={{
                display: 'block', width: '100%', padding: '8px 0', marginBottom: 5,
                background: n === 0 ? '#F5F0FA' : 'rgba(224,48,80,0.06)',
                border: `1px solid ${n === 0 ? 'rgba(107,63,160,0.12)' : 'rgba(224,48,80,0.2)'}`,
                borderRadius: 9, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                color: n === 0 ? '#6B5A82' : '#E03050', fontFamily: FONT_SANS,
              }}>{n === 0 ? 'No Tiles — Skip' : `${n} Tile${n > 1 ? 's' : ''}`}</button>
            ))}
          </div>
        );
      }

      // Pass box + manual Pass button (mirrors CharlestonDrill)
      const isCourtesyPass = state.charlestonSubPhase === 'courtesy_pass';
      const requiredCount2 = isCourtesyPass ? (state.courtesyCount ?? 3) : 3;
      const human2 = state.players.east;
      const totalSelected = human2.selectedForPass.length + state.blindSlotCount;
      const aiReady = (['north', 'west', 'south'] as Seat[]).every(
        s => state.players[s].selectedForPass.length >= requiredCount2
      );
      const passReady = totalSelected >= requiredCount2 && aiReady && !animating;

      // Direction label
      const curStep = getCurrentCharlestonStep(state.charlestonSubPhase);
      const dirLabel = isCourtesyPass
        ? 'Courtesy ↑'
        : curStep
          ? `${curStep.label} ${DIR_ARROW[curStep.dir] || ''}`
          : '';

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <PassBox
            selected={state.players.east.selectedForPass}
            blindSlotCount={state.blindSlotCount}
            isBlind={isBlind}
            maxSlots={maxSlots}
            passDir={passDir}
            dirLabel={dirLabel}
            onDeselect={(id) => {
              dispatch({ type: 'DESELECT_TILE_FOR_PASS', instanceId: id });
              playDeselect();
            }}
            onFillBlind={() => dispatch({ type: 'FILL_BLIND_SLOT' })}
            onUnfillBlind={() => dispatch({ type: 'UNFILL_BLIND_SLOT' })}
            animating={animating}
          />
          <button
            onClick={passReady ? executePass : undefined}
            style={{
              background: passReady ? C.cherry : 'rgba(255,255,255,0.2)',
              color: passReady ? '#fff' : 'rgba(255,255,255,0.4)',
              border: 'none', borderRadius: 10,
              padding: '4px 14px', cursor: passReady ? 'pointer' : 'not-allowed',
              fontSize: 8, fontWeight: 700, fontFamily: FONT_SERIF,
              letterSpacing: 1.5, transition: 'all 0.2s ease',
              opacity: passReady ? 1 : 0.4,
              boxShadow: passReady ? '0 0 10px rgba(224,48,80,0.2)' : 'none',
            }}
          >
            {animating ? '...' : 'PASS'}
          </button>
        </div>
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

      // Call window — show CallTileUI for human (not discarder)
      if (state.gameplaySubPhase === 'call_window' && state.callWindowTile && state.currentTurn !== 'east') {
        // Check what calls are available
        const hand = state.players.east.hand;
        const tile = state.callWindowTile;
        const pungAvail = canCallPung(hand, tile).canCall;
        const kongAvail = canCallKong(hand, tile).canCall;
        const quintAvail = canCallQuint(hand, tile).canCall;
        const discarderName = state.currentTurn.charAt(0).toUpperCase() + state.currentTurn.slice(1);

        return (
          <CallTileUI
            tile={tile}
            discarderName={discarderName}
            onIgnore={handleIgnoreCall}
            onCall={handleShowCallOptions}
            showOptions={showCallOptions}
            onPung={pungAvail ? handleCallPung : undefined}
            onKong={kongAvail ? handleCallKong : undefined}
            onQuint={quintAvail ? handleCallQuint : undefined}
            onMahjong={handleCallMahjong}
            cherry={C.cherry}
          />
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
      {/* Charleston pass animation keyframes */}
      <style>{PASS_ANIM_CSS}</style>

      <GameBoard
        mat={mat}
        players={boardPlayers}
        discards={state.discardPile}
        tilesRemaining={getWallCount(state)}
        overlay={getOverlay()}
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
