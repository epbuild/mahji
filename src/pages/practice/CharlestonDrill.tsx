// ═══════════════════════════════════════════════════════════════
// MAHJI — Charleston Practice Drill
// File: src/pages/practice/CharlestonDrill.tsx
//
// Uses your existing tile system: GameTile, getFullDeck(),
// shuffleDeck(), and MahjiTile. Zero duplicate tile art.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef } from "react";
import { MahjiTile } from "../../components/tiles/MahjiTile";
import { GameTile, getFullDeck, shuffleDeck } from "../../data/tileData";
import { C, getThemeColors } from "../../constants/colors";
import { useTheme } from "../../constants/ThemeContext";

// ─── TYPES ────────────────────────────────────────────────────

interface CharlestonDrillProps {
  onBack: () => void;
}

interface PlayerData {
  seat: number;
  name: string;
  hand: GameTile[];
  selectedForPass: GameTile[];
  isHuman: boolean;
}

// ─── CONSTANTS ────────────────────────────────────────────────

const MATS = [
  { id: "coffee", name: "Coffee", bg: "linear-gradient(145deg,#4A3D32,#3E3228,#352A20)", text: "rgba(158,202,189,0.6)", accent: "rgba(158,202,189,0.18)", readyBg: "rgba(109,191,168,0.7)", readyText: "#fff" },
  { id: "seafoam", name: "Seafoam", bg: "linear-gradient(145deg,#8FBFB2,#7AAD9F,#6B9E90)", text: "rgba(58,46,36,0.5)", accent: "rgba(58,46,36,0.2)", readyBg: "rgba(74,61,50,0.65)", readyText: "#fff" },
  { id: "lavender", name: "Lavender", bg: "linear-gradient(145deg,#B5A8C8,#A496B8,#9688AA)", text: "rgba(58,46,36,0.5)", accent: "rgba(58,46,36,0.2)", readyBg: "rgba(74,61,50,0.6)", readyText: "#fff" },
  { id: "cerulean", name: "Cerulean", bg: "linear-gradient(145deg,#A0C4D6,#8FB5C8,#80A6BA)", text: "rgba(58,46,36,0.5)", accent: "rgba(58,46,36,0.2)", readyBg: "rgba(74,61,50,0.6)", readyText: "#fff" },
];

const uiThemes = {
  light: { bg: "#F8F5FB", chrome: "#FFFFFF", cBorder: "rgba(107,63,160,0.1)", text: "#2D1B4E", textMid: "#6B5A82", textLight: "#9688AA", cherry: "#E03050", lavDeep: "#6B3FA0", seafoam: "#6DBFA8", btnBg: "rgba(107,63,160,0.06)", btnBorder: "rgba(107,63,160,0.12)", btnText: "#6B3FA0" },
  dark: { bg: "#1A1225", chrome: "#251545", cBorder: "rgba(180,154,216,0.12)", text: "#F0EAF6", textMid: "#B49AD8", textLight: "#7E6A9A", cherry: "#FF4D6D", lavDeep: "#B49AD8", seafoam: "#7DD4B8", btnBg: "rgba(180,154,216,0.08)", btnBorder: "rgba(180,154,216,0.15)", btnText: "#B49AD8" },
};

const STEPS = [
  { key: "1R", label: "First Right", dir: "right" as const, blind: false },
  { key: "1O", label: "First Over", dir: "across" as const, blind: false },
  { key: "1L", label: "First Left", dir: "left" as const, blind: true },
  { key: "2L", label: "Second Left", dir: "left" as const, blind: false },
  { key: "2O", label: "Second Over", dir: "across" as const, blind: false },
  { key: "2R", label: "Second Right", dir: "right" as const, blind: true },
];

const STEP_TO_ROL: Record<number, number> = { 0: 0, 1: 1, 2: 2, 3: 4, 4: 5, 5: 6 };
const WIND_ORDER: Record<string, number> = { N: 0, E: 1, W: 2, S: 3 };
const DRAGON_ORDER: Record<string, number> = { red: 0, green: 1, white: 2 };

// ─── HELPERS ──────────────────────────────────────────────────

function isJoker(tile: GameTile): boolean { return tile.suit === "jokers"; }

function botSelect(hand: GameTile[], count = 3): GameTile[] {
  const nonJokers = hand.filter(t => !isJoker(t));
  const idCounts: Record<string, number> = {};
  nonJokers.forEach(t => { idCounts[t.id] = (idCounts[t.id] || 0) + 1; });
  return nonJokers.map(t => ({ tile: t, score: idCounts[t.id] || 0 })).sort((a, b) => a.score - b.score).slice(0, count).map(s => s.tile);
}

function resolvePass(players: PlayerData[], step: { dir: "right" | "across" | "left" }): GameTile[][] {
  const off = { right: 1, across: 2, left: 3 }[step.dir];
  const nh = players.map(p => [...p.hand]);
  const pa = players.map(p => [...p.selectedForPass]);
  for (let i = 0; i < 4; i++) { const ids = new Set(pa[i].map(t => t.instanceId)); nh[i] = nh[i].filter(t => !ids.has(t.instanceId)); }
  for (let i = 0; i < 4; i++) { const src = (i - off + 4) % 4; nh[i] = [...nh[i], ...pa[src]]; }
  return nh;
}

// ─── SORTING ──────────────────────────────────────────────────

function sortBySuit(hand: GameTile[]): GameTile[] {
  return [...hand].sort((a, b) => {
    const gk = (t: GameTile) => {
      if (isJoker(t)) return 0; if (t.suit === "characters") return 1;
      if (t.suit === "dragons" && t.type === "red") return 1.9; if (t.suit === "bamboo") return 2;
      if (t.suit === "dragons" && t.type === "green") return 2.9; if (t.suit === "dots") return 3;
      if (t.suit === "dragons" && t.type === "white") return 3.9; if (t.suit === "winds") return 4;
      if (t.suit === "flowers") return 5; return 9;
    };
    const ga = gk(a), gb = gk(b); if (ga !== gb) return ga - gb;
    if (a.suit === "winds" && b.suit === "winds") return (WIND_ORDER[a.type || ""] ?? 9) - (WIND_ORDER[b.type || ""] ?? 9);
    if (a.suit === "flowers" && b.suit === "flowers") return (a.number ?? 0) - (b.number ?? 0);
    return (a.number ?? 99) - (b.number ?? 99);
  });
}

function sortByRank(hand: GameTile[]): GameTile[] {
  return [...hand].sort((a, b) => {
    if (isJoker(a) && !isJoker(b)) return -1; if (!isJoker(a) && isJoker(b)) return 1;
    if (isJoker(a) && isJoker(b)) return 0;
    const mg = (t: GameTile) => { if (t.suit === "dots" || t.suit === "bamboo" || t.suit === "characters") return 0; if (t.suit === "winds") return 1; if (t.suit === "dragons") return 2; if (t.suit === "flowers") return 3; return 4; };
    const ma = mg(a), mb = mg(b); if (ma !== mb) return ma - mb;
    if (ma === 0) { if ((a.number ?? 0) !== (b.number ?? 0)) return (a.number ?? 0) - (b.number ?? 0); const so: Record<string, number> = { characters: 0, bamboo: 1, dots: 2 }; return (so[a.suit] ?? 9) - (so[b.suit] ?? 9); }
    if (a.suit === "winds" && b.suit === "winds") return (WIND_ORDER[a.type || ""] ?? 9) - (WIND_ORDER[b.type || ""] ?? 9);
    if (a.suit === "dragons" && b.suit === "dragons") return (DRAGON_ORDER[a.type || ""] ?? 9) - (DRAGON_ORDER[b.type || ""] ?? 9);
    if (a.suit === "flowers" && b.suit === "flowers") return (a.number ?? 0) - (b.number ?? 0);
    return 0;
  });
}

// ═══════════════════════════════════════════════════════════════
// TILE CARD — wraps MahjiTile with selection/halo/drag UI
// ═══════════════════════════════════════════════════════════════

function TileCard({ tile, selected, onTap, disabled, cherry, size = "md" as "sm"|"md", onDragStart, onDragOver, onDrop, isDragOver = false, hasHalo = false }: {
  tile: GameTile; selected: boolean; onTap: () => void; disabled: boolean; cherry: string; size?: "sm"|"md";
  onDragStart?: (e: React.DragEvent) => void; onDragOver?: (e: React.DragEvent) => void; onDrop?: (e: React.DragEvent) => void; isDragOver?: boolean; hasHalo?: boolean;
}) {
  return (
    <div draggable={!disabled && size !== "sm"} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}
      onClick={disabled ? undefined : onTap}
      style={{
        position: "relative", cursor: disabled ? "default" : "grab", transition: "all 0.15s ease",
        transform: selected ? "translateY(-6px) scale(1.05)" : isDragOver ? "scale(1.06)" : "scale(1)",
        boxShadow: hasHalo ? "0 0 12px rgba(180,154,216,0.5), 0 0 4px rgba(180,154,216,0.3)" : selected ? `0 0 14px ${cherry}33` : isDragOver ? "0 0 10px rgba(109,191,168,0.3)" : "none",
        opacity: disabled ? 0.5 : 1, userSelect: "none", marginLeft: isDragOver ? 6 : 0, borderRadius: 10,
        outline: hasHalo ? "2px solid rgba(180,154,216,0.6)" : selected ? `2px solid ${cherry}` : isDragOver ? "2px solid #6DBFA8" : "2px solid transparent",
      }}>
      <div style={{ pointerEvents: "none" }}><MahjiTile tileId={tile.id} size={size} /></div>
      {hasHalo && <div style={{ position: "absolute", top: -3, right: -3, width: 10, height: 10, borderRadius: "50%", background: "#B49AD8", border: "2px solid #fff", zIndex: 2 }} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// R-O-L ★ L-O-R INDICATOR
// ═══════════════════════════════════════════════════════════════

function ROLIndicator({ stepIdx, phase, showStopPrompt, stoppedEarly, cherry, textFaded }: {
  stepIdx: number; phase: string; showStopPrompt: boolean; stoppedEarly: boolean; cherry: string; textFaded: string;
}) {
  let activeIdx: number | null = null; let completedUpTo = -1;
  if (phase === "charleston" && !showStopPrompt) { activeIdx = STEP_TO_ROL[stepIdx]; if (stepIdx > 0) { completedUpTo = STEP_TO_ROL[stepIdx - 1] ?? -1; } if (stepIdx >= 3) completedUpTo = 3; }
  else if (showStopPrompt) { activeIdx = 3; completedUpTo = 2; }
  else if (phase === "courtesy_prompt" || phase === "courtesy") { activeIdx = 3; completedUpTo = stoppedEarly ? 2 : 6; }
  else if (phase === "complete") { completedUpTo = stoppedEarly ? 3 : 6; activeIdx = null; }
  const display = ["R","·","O","·","L"," ","★"," ","L","·","O","·","R"];
  const rolMap: Record<number, number> = { 0:0, 2:1, 4:2, 6:3, 8:4, 10:5, 12:6 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {display.map((ch, i) => {
        const rolIdx = rolMap[i]; const isSep = ch === "·" || ch === " ";
        if (isSep) return <span key={i} style={{ fontSize: ch === "·" ? 6 : 3, color: textFaded, opacity: 0.2, margin: ch === " " ? "0 2px" : "0 1px" }}>{ch}</span>;
        const isActive = rolIdx === activeIdx; const isCompleted = rolIdx !== undefined && rolIdx <= completedUpTo;
        const isHidden = stoppedEarly && phase === "complete" && rolIdx !== undefined && rolIdx > 3;
        return <span key={i} style={{ fontFamily: "'Bodoni Moda',serif", fontSize: ch === "★" ? 13 : 10, fontWeight: isActive ? 700 : 500, color: isActive ? cherry : isCompleted ? cherry : textFaded, opacity: isHidden ? 0.1 : isActive ? 1 : isCompleted ? 0.55 : 0.18, transition: "all 0.3s ease", letterSpacing: 0.5 }}>{ch}</span>;
      })}
    </div>
  );
}

function ReadyBadge({ mat }: { mat: typeof MATS[number] }) {
  return <span style={{ fontSize: 7, background: mat.readyBg, color: mat.readyText, padding: "1px 6px", borderRadius: 8, fontWeight: 600 }}>Ready</span>;
}

// ═══════════════════════════════════════════════════════════════
// MAIN ENGINE
// ═══════════════════════════════════════════════════════════════

export default function CharlestonDrill({ onBack }: CharlestonDrillProps) {
  const { isDark } = useTheme();
  const [ui, setUi] = useState<"light" | "dark">(isDark ? "dark" : "light");
  const [matIdx, setMatIdx] = useState(0);
  const [level, setLevel] = useState<"novice" | "intermediate" | "advanced">("intermediate");
  const U = uiThemes[ui];
  const mat = MATS[matIdx];

  // Sync with app theme
  useEffect(() => { setUi(isDark ? "dark" : "light"); }, [isDark]);

  const [dealerSeat] = useState(0);
  const [phase, setPhase] = useState<string>("charleston");
  const [stepIdx, setStepIdx] = useState(0);
  const [players, setPlayers] = useState<PlayerData[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [botsReady, setBotsReady] = useState(false);
  const [courtesyCount, setCourtesyCount] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [animating, setAnimating] = useState(false);
  const [showStopPrompt, setShowStopPrompt] = useState(false);
  const [stoppedEarly, setStoppedEarly] = useState(false);
  const [showROL, setShowROL] = useState(true);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [receivedTileIds, setReceivedTileIds] = useState<Set<string>>(new Set());
  const [touchedTileIds, setTouchedTileIds] = useState<Set<string>>(new Set());
  const [levelLocked, setLevelLocked] = useState(false);

  // ── Responsive tile scaling ──────────────────────────────────
  // Measures the hand container and computes a CSS scale so all
  // tiles always fit in a single row, shrinking as the window narrows.
  const handRef = useRef<HTMLDivElement>(null);
  const [tileScale, setTileScale] = useState(1);

  // We track hand count separately so recalcScale can run on layout
  const visibleHandCount = (players?.[0]?.hand || []).filter(t => !selectedIds.has(t.instanceId)).length;

  const recalcScale = useCallback(() => {
    if (!handRef.current) return;
    const containerW = handRef.current.offsetWidth - 12; // minus padding
    const tileCount = Math.max(visibleHandCount, 1);
    const GAP = 3;
    const BASE_TILE_W = 48; // MahjiTile "md" width approx
    const totalNeeded = tileCount * BASE_TILE_W + (tileCount - 1) * GAP;
    const scale = Math.min(1, containerW / totalNeeded);
    setTileScale(Math.max(0.45, scale)); // never shrink below 45%
  }, [visibleHandCount]);

  useEffect(() => {
    recalcScale();
    const ro = new ResizeObserver(() => recalcScale());
    if (handRef.current) ro.observe(handRef.current);
    return () => ro.disconnect();
  }, [recalcScale]);

  const dealGame = useCallback(() => {
    const deck = shuffleDeck(getFullDeck());
    let idx = 0;
    const hands = [0,1,2,3].map(s => { const count = s === dealerSeat ? 14 : 13; const h = deck.slice(idx, idx + count); idx += count; return h; });
    setPlayers([0,1,2,3].map(s => ({ seat: s, name: ["You (Dealer)","South","West","North"][s], hand: hands[s], selectedForPass: [], isHuman: s === 0 })));
    setPhase("charleston"); setStepIdx(0); setSelectedIds(new Set()); setBotsReady(false); setCourtesyCount(null);
    setAnimating(false); setMessage("Select 3 tiles to pass"); setShowStopPrompt(false); setStoppedEarly(false);
    setShowROL(true); setReceivedTileIds(new Set()); setTouchedTileIds(new Set()); setLevelLocked(false);
  }, [dealerSeat]);

  useEffect(() => { dealGame(); }, [dealGame]);

  const step = phase === "charleston" ? STEPS[stepIdx] : null;
  const isBlind = step?.blind || false;
  const reqCount = phase === "courtesy" && courtesyCount !== null ? courtesyCount : isBlind ? null : 3;
  const humanHand = players?.[0]?.hand || [];
  const doSort = (fn: (h: GameTile[]) => GameTile[]) => { if (!players) return; setPlayers(p => p!.map((pl, i) => (i === 0 ? { ...pl, hand: fn(pl.hand) } : pl))); };

  const getMsg = () => { if (phase === "courtesy") return `Select ${courtesyCount} tile${courtesyCount !== 1 ? "s" : ""} to pass`; if (isBlind) return "Select 0–3 tiles (blind pass allowed)"; return "Select 3 tiles to pass"; };

  const toggleTile = (tile: GameTile) => {
    if (animating) return; if (!levelLocked) setLevelLocked(true);
    if (receivedTileIds.has(tile.instanceId)) setTouchedTileIds(prev => new Set([...prev, tile.instanceId]));
    if (isJoker(tile)) { setMessage("⚠ Jokers cannot be passed in the Charleston"); setTimeout(() => setMessage(getMsg()), 2500); return; }
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(tile.instanceId)) { next.delete(tile.instanceId); } else { const max = reqCount !== null ? reqCount : 3; if (next.size >= max) return prev; next.add(tile.instanceId); }
      return next;
    });
  };

  useEffect(() => {
    if (!players || phase === "courtesy_prompt" || phase === "complete" || showStopPrompt) return;
    setBotsReady(false);
    const t = setTimeout(() => {
      const c = phase === "courtesy" ? (courtesyCount || 0) : 3;
      if (c === 0) { setBotsReady(true); return; }
      setPlayers(prev => prev!.map((p, i) => i === 0 ? p : { ...p, selectedForPass: botSelect(p.hand, c) }));
      setBotsReady(true);
    }, 1200 + Math.random() * 800);
    return () => clearTimeout(t);
  }, [stepIdx, phase, courtesyCount, players?.[0]?.hand?.length, showStopPrompt]);

  const canPass = () => {
    if (animating || showStopPrompt) return false;
    if (phase === "courtesy" && courtesyCount === 0) return true;
    if (isBlind) return botsReady;
    return selectedIds.size === (reqCount ?? 3) && botsReady;
  };

  const executePass = () => {
    if (!canPass()) return; setAnimating(true);
    const sel = humanHand.filter(t => selectedIds.has(t.instanceId));
    const selIds = new Set(sel.map(t => t.instanceId));
    const up = players!.map((p, i) => i === 0 ? { ...p, selectedForPass: sel } : p);
    const s = phase === "courtesy" ? { dir: "across" as const } : STEPS[stepIdx];
    const nh = resolvePass(up, s);
    const oldIds = new Set(humanHand.filter(t => !selIds.has(t.instanceId)).map(t => t.instanceId));
    const newReceivedIds = new Set(nh[0].filter(t => !oldIds.has(t.instanceId)).map(t => t.instanceId));
    setTimeout(() => {
      const kept = nh[0].filter(t => oldIds.has(t.instanceId)); const received = nh[0].filter(t => newReceivedIds.has(t.instanceId));
      setPlayers(prev => prev!.map((p, i) => ({ ...p, hand: i === 0 ? [...kept, ...received] : nh[i], selectedForPass: [] })));
      setSelectedIds(new Set()); setAnimating(false); setReceivedTileIds(newReceivedIds); setTouchedTileIds(new Set());
      if (phase === "courtesy") { setPhase("complete"); setMessage("Charleston complete!"); }
      else if (stepIdx === 2) { setShowStopPrompt(true); }
      else if (stepIdx < STEPS.length - 1) { setStepIdx(s => s + 1); }
      else { setPhase("courtesy_prompt"); setMessage(""); }
    }, 600);
  };

  const handleStopChoice = (stop: boolean) => { setShowStopPrompt(false); if (stop) { setStoppedEarly(true); setPhase("courtesy_prompt"); setMessage(""); } else { setStepIdx(3); } };
  const handleCourtesyChoice = (count: number) => { setCourtesyCount(count); if (count === 0) { setPhase("complete"); setMessage("Charleston complete!"); } else { setPhase("courtesy"); setSelectedIds(new Set()); setMessage(`Select ${count} tile${count !== 1 ? "s" : ""} to pass across`); } };

  useEffect(() => { if (phase === "charleston" && !showStopPrompt) setMessage(getMsg()); }, [stepIdx, phase, showStopPrompt]);

  // Drag
  const handleDragStart = (e: React.DragEvent, idx: number) => { setDragIdx(idx); e.dataTransfer.effectAllowed = "move"; const tile = visibleHand[idx]; if (tile && receivedTileIds.has(tile.instanceId)) setTouchedTileIds(prev => new Set([...prev, tile.instanceId])); };
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOverIdx(idx); };
  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault(); if (dragIdx === null || dragIdx === targetIdx) { setDragIdx(null); setDragOverIdx(null); return; }
    setPlayers(prev => prev!.map((p, i) => {
      if (i !== 0) return p; const visible = p.hand.filter(t => !selectedIds.has(t.instanceId)); const dragTile = visible[dragIdx!]; if (!dragTile) return p;
      const without = visible.filter((_, idx) => idx !== dragIdx); const insertAt = dragIdx! < targetIdx ? targetIdx - 1 : targetIdx; without.splice(Math.max(0, insertAt), 0, dragTile);
      return { ...p, hand: [...without, ...p.hand.filter(t => selectedIds.has(t.instanceId))] };
    })); setDragIdx(null); setDragOverIdx(null);
  };

  const visibleHand = humanHand.filter(t => !selectedIds.has(t.instanceId));
  const tileHasHalo = (tile: GameTile) => receivedTileIds.has(tile.instanceId) && !touchedTileIds.has(tile.instanceId);
  const dirArrow: Record<string, string> = { right: "→", across: "↑", left: "←" };

  if (!players) return null;

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div style={{ minHeight: "100vh", background: U.bg, fontFamily: "'Outfit',sans-serif", color: U.text, display: "flex", flexDirection: "column" }}>

      {/* Header with Back button */}
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: U.chrome, borderBottom: `1px solid ${U.cBorder}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onBack} style={{ background: U.btnBg, border: `1px solid ${U.btnBorder}`, borderRadius: 12, padding: "3px 10px", cursor: "pointer", fontSize: 10, color: U.btnText, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>← Back</button>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {(["novice","intermediate","advanced"] as const).map(l => (
            <button key={l} onClick={() => !levelLocked && setLevel(l)} style={{ padding: "2px 7px", borderRadius: 10, cursor: levelLocked && level !== l ? "not-allowed" : "pointer", fontSize: 8, fontWeight: 600, background: level === l ? U.cherry : U.btnBg, color: level === l ? "#fff" : U.btnText, border: level === l ? `1px solid ${U.cherry}` : `1px solid ${U.btnBorder}`, fontFamily: "'Outfit',sans-serif", textTransform: "capitalize", transition: "all 0.15s ease", opacity: levelLocked && level !== l ? 0.35 : 1 }}>{l.slice(0,3)}</button>
          ))}
          <div style={{ width: 1, height: 14, background: U.cBorder, margin: "0 2px" }} />
          {MATS.map((m, i) => (
            <div key={m.id} onClick={() => setMatIdx(i)} style={{ width: 14, height: 14, borderRadius: "50%", background: m.bg, cursor: "pointer", border: i === matIdx ? `2px solid ${U.cherry}` : `1px solid ${U.cBorder}` }} />
          ))}
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", padding: "6px 14px 2px" }}>
        <h1 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 17, fontWeight: 700, color: U.cherry, letterSpacing: 3, margin: 0 }}>CHARLESTON</h1>
        <p style={{ fontSize: 9, color: U.textMid, margin: "2px 0 0" }}>
          {phase === "complete" ? "Complete!" : phase === "courtesy_prompt" ? "Courtesy Pass" : showStopPrompt ? "Continue or Stop?" : `${step?.key?.startsWith("1") ? "First" : "Second"} Charleston · ${step?.label}`}
        </p>
      </div>

      {/* Board */}
      <div style={{ flex: 1, margin: "4px 8px", background: mat.bg, borderRadius: 16, position: "relative", minHeight: 280, boxShadow: "inset 0 2px 12px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* West (across from you) */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 0 0" }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: mat.text }}>West</span>
          {botsReady && phase === "charleston" && !showStopPrompt && <ReadyBadge mat={mat} />}
        </div>

        {/* Middle */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0 10px" }}>
          <div style={{ textAlign: "center", minWidth: 40 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: mat.text }}>North</span>
            {botsReady && phase === "charleston" && !showStopPrompt && <div style={{ marginTop: 2 }}><ReadyBadge mat={mat} /></div>}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
            {showStopPrompt ? (
              <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "18px 22px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", textAlign: "center", minWidth: 200 }}>
                <h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 14, color: "#E03050", margin: "0 0 4px", letterSpacing: 1 }}>First Charleston Complete</h3>
                <p style={{ fontSize: 9, color: "#6B5A82", margin: "0 0 14px" }}>Would you like to continue?</p>
                <button onClick={() => handleStopChoice(false)} style={{ display: "block", width: "100%", padding: "9px 0", marginBottom: 6, background: "rgba(224,48,80,0.06)", border: "1px solid rgba(224,48,80,0.2)", borderRadius: 9, cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#E03050", fontFamily: "'Outfit',sans-serif" }}>Continue</button>
                <button onClick={() => handleStopChoice(true)} style={{ display: "block", width: "100%", padding: "9px 0", background: "rgba(107,63,160,0.06)", border: "1px solid rgba(107,63,160,0.15)", borderRadius: 9, cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#6B3FA0", fontFamily: "'Outfit',sans-serif" }}>Stop Charleston!</button>
              </div>
            ) : phase === "courtesy_prompt" ? (
              <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "18px 22px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", textAlign: "center", minWidth: 190 }}>
                <h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 14, color: "#E03050", margin: "0 0 4px", letterSpacing: 1 }}>Courtesy Pass</h3>
                <p style={{ fontSize: 9, color: "#6B5A82", margin: "0 0 12px" }}>How many tiles to pass across?</p>
                {[0,1,2,3].map(n => (
                  <button key={n} onClick={() => handleCourtesyChoice(n)} style={{ display: "block", width: "100%", padding: "8px 0", marginBottom: 5, background: n === 0 ? "#F5F0FA" : "rgba(224,48,80,0.06)", border: `1px solid ${n === 0 ? "rgba(107,63,160,0.12)" : "rgba(224,48,80,0.2)"}`, borderRadius: 9, cursor: "pointer", fontSize: 11, fontWeight: 600, color: n === 0 ? "#6B5A82" : "#E03050", fontFamily: "'Outfit',sans-serif" }}>{n === 0 ? "No Tiles — Skip" : `${n} Tile${n > 1 ? "s" : ""}`}</button>
                ))}
              </div>
            ) : phase === "complete" ? (
              <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "20px 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", textAlign: "center", minWidth: 200 }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>✨</div>
                <h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 15, color: "#E03050", margin: "0 0 4px", letterSpacing: 1 }}>Charleston Complete!</h3>
                <p style={{ fontSize: 10, color: "#6B5A82", margin: "0 0 14px" }}>What would you like to do?</p>
                <button onClick={dealGame} style={{ display: "block", width: "100%", padding: "10px 0", marginBottom: 8, background: "rgba(224,48,80,0.06)", border: "1px solid rgba(224,48,80,0.2)", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#E03050", fontFamily: "'Outfit',sans-serif" }}>🎯 Practice Again</button>
                <button onClick={onBack} style={{ display: "block", width: "100%", padding: "10px 0", background: "rgba(107,63,160,0.06)", border: "1px solid rgba(107,63,160,0.15)", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#6B3FA0", fontFamily: "'Outfit',sans-serif" }}>← Back to Practice</button>
              </div>
            ) : (
              <>
                <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 14, padding: "3px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 11, fontWeight: 700, color: "#E03050", letterSpacing: 1 }}>{step?.label} {step && dirArrow[step.dir]}</span>
                  {isBlind && <span style={{ fontSize: 7, color: "#6DBFA8", fontWeight: 600, marginLeft: 6 }}>BLIND OK</span>}
                </div>
                <div style={{ width: 200, minHeight: 80, background: selectedIds.size > 0 ? "rgba(224,48,80,0.06)" : "rgba(255,255,255,0.08)", border: `2px dashed ${selectedIds.size > 0 ? "rgba(224,48,80,0.5)" : mat.accent}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: 6, transition: "all 0.2s ease" }}>
                  {selectedIds.size === 0 ? (
                    <span style={{ fontSize: 8, color: mat.text, fontStyle: "italic" }}>{isBlind ? "Tap tiles (0–3)" : "Tap 3 tiles below"}</span>
                  ) : (
                    humanHand.filter(t => selectedIds.has(t.instanceId)).map(t => (
                      <TileCard key={t.instanceId} tile={t} selected={false} onTap={() => toggleTile(t)} cherry={U.cherry} size="sm" disabled={false} />
                    ))
                  )}
                </div>
                {(phase === "charleston" || phase === "courtesy") && (
                  <button onClick={executePass} disabled={!canPass()} style={{ background: canPass() ? "#E03050" : "rgba(255,255,255,0.2)", color: canPass() ? "#FFFFFF" : mat.text, border: "none", borderRadius: 18, padding: "7px 28px", cursor: canPass() ? "pointer" : "not-allowed", fontSize: 12, fontWeight: 700, fontFamily: "'Bodoni Moda',serif", letterSpacing: 2, transition: "all 0.2s ease", opacity: canPass() ? 1 : 0.4, boxShadow: canPass() ? "0 0 14px rgba(224,48,80,0.25)" : "none" }}>{animating ? "..." : "PASS"}</button>
                )}
              </>
            )}
          </div>

          <div style={{ textAlign: "center", minWidth: 40 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: mat.text }}>South</span>
            {botsReady && phase === "charleston" && !showStopPrompt && <div style={{ marginTop: 2 }}><ReadyBadge mat={mat} /></div>}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", padding: "0 14px 8px", position: "relative" }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: mat.text }}>👤 You (East · Dealer)</span>
          {showROL && <div style={{ position: "absolute", right: 14, bottom: 8 }}><ROLIndicator stepIdx={stepIdx} phase={phase} showStopPrompt={showStopPrompt} stoppedEarly={stoppedEarly} cherry={U.cherry} textFaded={mat.text} /></div>}
        </div>
      </div>

      {/* Message */}
      <div style={{ textAlign: "center", padding: "3px 10px", minHeight: 16 }}>
        {message && <span style={{ fontSize: 10, fontWeight: 500, color: message.startsWith("⚠") ? U.cherry : U.textMid }}>{message}</span>}
      </div>

      {/* Sort */}
      {phase !== "complete" && phase !== "courtesy_prompt" && !showStopPrompt && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "1px 10px" }}>
          <button onClick={() => doSort(sortByRank)} style={{ background: U.btnBg, border: `1px solid ${U.btnBorder}`, borderRadius: 12, padding: "3px 10px", cursor: "pointer", fontSize: 9, color: U.btnText, fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>Sort by Rank</button>
          <button onClick={() => doSort(sortBySuit)} style={{ background: U.btnBg, border: `1px solid ${U.btnBorder}`, borderRadius: 12, padding: "3px 10px", cursor: "pointer", fontSize: 9, color: U.btnText, fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>Sort by Suit</button>
        </div>
      )}

      {/* Hand */}
      <div ref={handRef} style={{ display: "flex", gap: 3 * tileScale, padding: "5px 6px 16px", flexWrap: "nowrap", justifyContent: "center", alignItems: "flex-end" }}>
        {visibleHand.map((tile, idx) => (
          <div key={tile.instanceId} style={{ transform: `scale(${tileScale})`, transformOrigin: "bottom center", transition: "transform 0.15s ease" }}>
            <TileCard tile={tile} selected={false} onTap={() => toggleTile(tile)}
              disabled={phase === "complete" || phase === "courtesy_prompt" || animating || showStopPrompt}
              cherry={U.cherry} hasHalo={tileHasHalo(tile)} isDragOver={dragOverIdx === idx && dragIdx !== idx}
              onDragStart={e => handleDragStart(e, idx)} onDragOver={e => handleDragOver(e, idx)} onDrop={e => handleDrop(e, idx)} />
          </div>
        ))}
        <div onDragOver={e => { e.preventDefault(); setDragOverIdx(visibleHand.length); }} onDrop={e => handleDrop(e, visibleHand.length)} style={{ width: 8, flexShrink: 0 }} />
      </div>
    </div>
  );
}
