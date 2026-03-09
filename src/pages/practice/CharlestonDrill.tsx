// ═══════════════════════════════════════════════════════════════
// MAHJI — Charleston Practice Drill
// File: src/pages/practice/CharlestonDrill.tsx
//
// Uses your existing tile system: GameTile, getFullDeck(),
// shuffleDeck(), and MahjiTile. Zero duplicate tile art.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { MahjiTile } from "../../components/tiles/MahjiTile";
import { GameTile, getFullDeck, shuffleDeck } from "../../data/tileData";
import { C, getThemeColors, GAME_MATS } from "../../constants/colors";
import { SeatLabel as SharedSeatLabel } from "../../components/GameBoard";
import { useTheme } from "../../constants/ThemeContext";
import { BirdIcon } from "../../components/ui/Icons";
import {
  getCard, getAvailableYears, getCurrentYear,
  findPartialMatches, isTileUsefulForHand,
  expandNumberConstraint, enumerateColorAssignments, resolveGroupToTileIds,
  SECTION_LABELS,
} from "../../data/nmjl";
import type { NMJLCard, PartialMatchResult, ColorAssignment, HandDefinition, HandPattern, CardColor } from "../../data/nmjl";
import { playDeselect, playPingE, playWhoosh, playError, playCelebration, playPlace, playCharlestonReceive } from "../../audio/sounds";
import { playVoice } from "../../audio/voice";

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

// Derive MATS from shared GAME_MATS, adding Charleston-specific fields (readyBg, readyText)
const MATS = GAME_MATS.map(m => ({
  ...m,
  text: m.text,
  readyBg: m.id === "coffee" ? "rgba(109,191,168,0.7)" : "rgba(74,61,50,0.65)",
  readyText: "#fff",
}));

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

// Bot tile selection — difficulty-aware
function botSelectNovice(hand: GameTile[], count = 3): GameTile[] {
  // Novice bots just pick random non-joker tiles (bad strategy)
  const nonJokers = hand.filter(t => !isJoker(t));
  const shuffled = [...nonJokers].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function botSelect(hand: GameTile[], count = 3): GameTile[] {
  // Intermediate: pass tiles you have fewest of (singletons first)
  const nonJokers = hand.filter(t => !isJoker(t));
  const idCounts: Record<string, number> = {};
  nonJokers.forEach(t => { idCounts[t.id] = (idCounts[t.id] || 0) + 1; });
  return nonJokers.map(t => ({ tile: t, score: idCounts[t.id] || 0 })).sort((a, b) => a.score - b.score).slice(0, count).map(s => s.tile);
}

function botSelectAdvanced(hand: GameTile[], count = 3): GameTile[] {
  // Advanced: keep pairs/triples, keep sequences, pass isolated tiles strategically
  const nonJokers = hand.filter(t => !isJoker(t));
  const idCounts: Record<string, number> = {};
  nonJokers.forEach(t => { idCounts[t.id] = (idCounts[t.id] || 0) + 1; });
  // Score each tile: higher = more valuable to keep (lower = better to pass)
  const scored = nonJokers.map(t => {
    let score = 0;
    score += (idCounts[t.id] || 1) * 3; // pairs/triples very valuable
    // Check for adjacent numbers in same suit (potential sequences)
    if (t.number) {
      const suitTiles = nonJokers.filter(o => o.suit === t.suit && o.instanceId !== t.instanceId);
      if (suitTiles.some(o => o.number === (t.number! - 1) || o.number === (t.number! + 1))) score += 2;
      if (suitTiles.some(o => o.number === (t.number! - 2) || o.number === (t.number! + 2))) score += 1;
    }
    return { tile: t, score };
  });
  // Pass the lowest-scored tiles
  return scored.sort((a, b) => a.score - b.score).slice(0, count).map(s => s.tile);
}

/** Compute how many tiles from hand actually match a suggestion's pattern groups.
 *  Tries ALL expanded variants × ALL color assignments and returns the maximum. */
function computeRealMatchCount(
  match: PartialMatchResult,
  hand: GameTile[],
): number {
  const pattern = match.hand.patterns[match.patternIndex];
  if (!pattern) return 0;
  const expanded = expandNumberConstraint(pattern.numberConstraint, pattern);
  let best = 0;
  for (const ep of expanded) {
    const assignments = enumerateColorAssignments(ep);
    for (const assignment of assignments) {
      const usedIds = new Set<string>();
      let count = 0;
      for (const group of ep.groups) {
        const neededIds = resolveGroupToTileIds(group, assignment);
        for (const tileId of neededIds) {
          let found: GameTile | undefined;
          if (tileId === "__flower__") {
            found = hand.find(t => t.suit === "flowers" && !usedIds.has(t.instanceId));
          } else {
            found = hand.find(t => t.id === tileId && !usedIds.has(t.instanceId));
          }
          if (found) { usedIds.add(found.instanceId); count++; }
        }
      }
      if (count > best) best = count;
    }
  }
  return best;
}

// Level config
const LEVEL_CONFIG = {
  novice: { botDelayMin: 2200, botDelayRange: 1200, timerSecs: 0 },
  intermediate: { botDelayMin: 1200, botDelayRange: 800, timerSecs: 0 },
  advanced: { botDelayMin: 500, botDelayRange: 500, timerSecs: 30 },
};

function resolvePass(players: PlayerData[], step: { dir: "right" | "across" | "left" }): GameTile[][] {
  const off = { right: 1, across: 2, left: 3 }[step.dir];
  const nh = players.map(p => [...p.hand]);
  const pa = players.map(p => [...p.selectedForPass]);
  for (let i = 0; i < 4; i++) { const ids = new Set(pa[i].map(t => t.instanceId)); nh[i] = nh[i].filter(t => !ids.has(t.instanceId)); }
  for (let i = 0; i < 4; i++) { const src = (i - off + 4) % 4; nh[i] = [...nh[i], ...pa[src]]; }
  return nh;
}

// ─── SORTING ──────────────────────────────────────────────────
// Flowers always far LEFT, Jokers always far RIGHT in both sort modes.

function sortBySuit(hand: GameTile[]): GameTile[] {
  return [...hand].sort((a, b) => {
    const gk = (t: GameTile) => {
      if (t.suit === "flowers") return -1; // far left
      if (isJoker(t)) return 99;           // far right
      if (t.suit === "characters") return 1;
      if (t.suit === "dragons" && t.type === "red") return 1.9; if (t.suit === "bamboo") return 2;
      if (t.suit === "dragons" && t.type === "green") return 2.9; if (t.suit === "dots") return 3;
      if (t.suit === "dragons" && t.type === "white") return 3.9; if (t.suit === "winds") return 4;
      return 9;
    };
    const ga = gk(a), gb = gk(b); if (ga !== gb) return ga - gb;
    if (a.suit === "winds" && b.suit === "winds") return (WIND_ORDER[a.type || ""] ?? 9) - (WIND_ORDER[b.type || ""] ?? 9);
    if (a.suit === "flowers" && b.suit === "flowers") return (a.number ?? 0) - (b.number ?? 0);
    return (a.number ?? 99) - (b.number ?? 99);
  });
}

function sortByRank(hand: GameTile[]): GameTile[] {
  return [...hand].sort((a, b) => {
    if (a.suit === "flowers" && b.suit !== "flowers") return -1;
    if (a.suit !== "flowers" && b.suit === "flowers") return 1;
    if (a.suit === "flowers" && b.suit === "flowers") return (a.number ?? 0) - (b.number ?? 0);
    if (isJoker(a) && !isJoker(b)) return 1; // far right
    if (!isJoker(a) && isJoker(b)) return -1;
    if (isJoker(a) && isJoker(b)) return 0;
    const mg = (t: GameTile) => { if (t.suit === "dots" || t.suit === "bamboo" || t.suit === "characters") return 0; if (t.suit === "winds") return 1; if (t.suit === "dragons") return 2; return 4; };
    const ma = mg(a), mb = mg(b); if (ma !== mb) return ma - mb;
    if (ma === 0) { if ((a.number ?? 0) !== (b.number ?? 0)) return (a.number ?? 0) - (b.number ?? 0); const so: Record<string, number> = { characters: 0, bamboo: 1, dots: 2 }; return (so[a.suit] ?? 9) - (so[b.suit] ?? 9); }
    if (a.suit === "winds" && b.suit === "winds") return (WIND_ORDER[a.type || ""] ?? 9) - (WIND_ORDER[b.type || ""] ?? 9);
    if (a.suit === "dragons" && b.suit === "dragons") return (DRAGON_ORDER[a.type || ""] ?? 9) - (DRAGON_ORDER[b.type || ""] ?? 9);
    return 0;
  });
}

// ═══════════════════════════════════════════════════════════════
// COLORED PATTERN — renders hand pattern with NMJL card colors
// ═══════════════════════════════════════════════════════════════

const CARD_COLOR_HEX: Record<CardColor, string> = { red: "#C2413B", green: "#2E8B57", blue: "#4A7FA8" };
const OPERATOR_TOKENS = new Set(["+", "=", "x", "or", "OR", "-or-"]);

function ColoredPattern({ hand, isDark, fontSize = 10 }: { hand: HandDefinition; isDark: boolean; fontSize?: number }) {
  const defaultColor = isDark ? "#F0EAF6" : "#2D1B4E";
  const opColor = isDark ? "#7E6A9A" : "#9688AA";
  const renderHalf = (text: string, pattern: HandPattern | undefined, keyPrefix: string) => {
    const tokens = text.split(" ");
    let groupIdx = 0;
    return tokens.map((token, i) => {
      const isOp = OPERATOR_TOKENS.has(token);
      let color = defaultColor;
      if (!isOp && pattern && groupIdx < pattern.groups.length) {
        color = CARD_COLOR_HEX[pattern.groups[groupIdx].color] || defaultColor;
        groupIdx++;
      } else if (isOp) { color = opColor; }
      return (
        <React.Fragment key={`${keyPrefix}-${i}`}>
          {i > 0 && <span style={{ letterSpacing: 1 }}>{" "}</span>}
          <span style={{ color }}>{token}</span>
        </React.Fragment>
      );
    });
  };
  if (!hand.patterns[0]) {
    return <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize, fontWeight: 600, color: defaultColor }}>{hand.displayPattern}</span>;
  }
  const orParts = hand.displayPattern.split(" -or- ");
  if (orParts.length >= 2 && hand.patterns.length >= orParts.length) {
    return (
      <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize, fontWeight: 600, letterSpacing: 0.5 }}>
        {orParts.map((part, pi) => (
          <React.Fragment key={`or-${pi}`}>
            {pi > 0 && <span style={{ color: opColor, fontSize: fontSize * 0.85 }}>{" -or- "}</span>}
            {renderHalf(part, hand.patterns[pi], `P${pi}`)}
          </React.Fragment>
        ))}
      </span>
    );
  }
  return (
    <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize, fontWeight: 600, letterSpacing: 0.5 }}>
      {renderHalf(hand.displayPattern, hand.patterns[0], "S")}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// TILE CARD — wraps MahjiTile with selection/halo/drag UI
// ═══════════════════════════════════════════════════════════════

function TileCard({ tile, selected, onTap, onDoubleTap, disabled, cherry, size = "md" as "sm"|"md", onDragStart, onDragOver, onDrop, onDragEnd, showInsertLeft = false, isNew = false, isHint = false, isYellowHint = false, isDragging = false }: {
  tile: GameTile; selected: boolean; onTap: () => void; onDoubleTap?: () => void; disabled: boolean; cherry: string; size?: "sm"|"md";
  onDragStart?: (e: React.DragEvent) => void; onDragOver?: (e: React.DragEvent) => void; onDrop?: (e: React.DragEvent) => void; onDragEnd?: (e: React.DragEvent) => void; showInsertLeft?: boolean; isNew?: boolean; isHint?: boolean; isYellowHint?: boolean; isDragging?: boolean;
}) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "stretch", marginLeft: showInsertLeft ? 6 : 0, transition: "margin 0.1s ease" }}>
      {showInsertLeft && <div style={{ position: "absolute", left: -5, top: 0, bottom: 0, width: 4, background: "#6DBFA8", borderRadius: 2, zIndex: 3, boxShadow: "0 0 8px rgba(109,191,168,0.6), 0 0 3px rgba(109,191,168,0.4)" }} />}
      <div draggable={!disabled && size !== "sm"} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} onDragEnd={onDragEnd}
        onClick={disabled ? undefined : onTap}
        onDoubleClick={disabled || !onDoubleTap ? undefined : onDoubleTap}
        style={{
          position: "relative", cursor: disabled ? "default" : "grab", transition: "all 0.15s ease",
          transform: selected ? "translateY(-6px) scale(1.05)" : isDragging ? "scale(0.95)" : "scale(1)",
          boxShadow: isYellowHint ? "0 0 10px rgba(234,179,8,0.45), 0 0 4px rgba(234,179,8,0.2)" : isNew ? "0 0 10px rgba(109,191,168,0.4), 0 0 4px rgba(109,191,168,0.2)" : isHint ? "0 0 8px rgba(180,154,216,0.4)" : selected ? `0 0 14px ${cherry}33` : "none",
          opacity: isDragging ? 0.35 : disabled ? 0.5 : 1, userSelect: "none", borderRadius: 10,
          outline: isYellowHint ? "2.5px solid rgba(234,179,8,0.7)" : isNew ? "2px solid rgba(109,191,168,0.6)" : isHint ? "2px solid rgba(180,154,216,0.5)" : selected ? `2px solid ${cherry}` : "2px solid transparent",
        }}>
        <div style={{ pointerEvents: "none" }}><MahjiTile tileId={tile.id} size={size} /></div>
        {isNew && <div style={{ position: "absolute", top: -4, right: -4, fontSize: 7, fontWeight: 700, color: "#fff", background: "#6DBFA8", borderRadius: 6, padding: "1px 4px", zIndex: 2 }}>NEW</div>}
        {isHint && !isYellowHint && <div style={{ position: "absolute", bottom: -3, left: "50%", transform: "translateX(-50%)", fontSize: 6, fontWeight: 700, color: "#fff", background: "rgba(180,154,216,0.7)", borderRadius: 4, padding: "0px 3px", zIndex: 2, whiteSpace: "nowrap" }}>HINT</div>}
      </div>
    </div>
  );
}

// Empty placeholder for missing tiles (shows 14 slots always)
// When isBlind=true, shows face-down tile backs instead of dashed outlines
function EmptySlot({ isBlind = false }: { isBlind?: boolean }) {
  if (isBlind) {
    return (
      <div style={{ flexShrink: 0, opacity: 0.7 }}>
        <MahjiTile faceDown size="md" />
      </div>
    );
  }
  return (
    <div style={{ width: 52, height: 72, borderRadius: 10, border: "2px dashed rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", flexShrink: 0 }} />
  );
}

// Empty slot for pass box (same size as md tile: 72×98)
function EmptyPassSlot() {
  return (
    <div style={{ width: 72, height: 98, borderRadius: 10, border: "2px dashed rgba(224,48,80,0.2)", background: "rgba(255,255,255,0.04)", flexShrink: 0 }} />
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

// Use shared SeatLabel from GameBoard.tsx
function SeatLabel({ name, isReady, showReady, seatBg, readyColor }: { name: string; isReady: boolean; showReady: boolean; seatBg: string; readyColor: string }) {
  return <SharedSeatLabel name={name} isReady={isReady} showReady={showReady} seatBg={seatBg} readyColor={readyColor} />;
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

  // ── Card year & suggestions ──
  const [cardYear, setCardYear] = useState(getCurrentYear());
  const [card, setCard] = useState<NMJLCard | null>(null);
  const [showSetup, setShowSetup] = useState(true);
  const [suggestions, setSuggestions] = useState<PartialMatchResult[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [bamAdvice, setBamAdvice] = useState<{ tiles: Set<string>; message: string } | null>(null);
  // Bam Bird first-time UX: show "Ask Bam what to pass!" on first charleston per day
  const [bamShowMessage, setBamShowMessage] = useState(() => {
    try {
      const last = localStorage.getItem("mahji_bam_seen_date");
      const today = new Date().toISOString().slice(0, 10);
      return last !== today; // Show message if not seen today
    } catch { return true; }
  });
  const [bamSessionUsed, setBamSessionUsed] = useState(false); // tracks if used in this practice session
  const [activeHintHand, setActiveHintHand] = useState<string | null>(null); // hand id
  const [hintTileIds, setHintTileIds] = useState<Set<string>>(new Set()); // instanceIds highlighted yellow

  // Load card when year changes
  useEffect(() => { getCard(cardYear).then(c => { if (c) setCard(c); }); }, [cardYear]);

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
  const [timer, setTimer] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const [totalPassed, setTotalPassed] = useState(0);
  const [passDir, setPassDir] = useState<"right" | "across" | "left" | null>(null);
  const [blindSlotCount, setBlindSlotCount] = useState(0);
  const initialHandsRef = useRef<GameTile[][] | null>(null);

  // ── Responsive tile scaling ──────────────────────────────────
  // Strategy: render tiles at full size inside an inner row, measure
  // the row's natural scrollWidth vs the viewport width, then apply
  // transform:scale() to the row. The OUTER wrapper clips its height
  // to the scaled height so no blank space remains.
  const outerRef = useRef<HTMLDivElement>(null);   // the fixed-width viewport
  const innerRef = useRef<HTMLDivElement>(null);    // the flex row of tiles (may be wider)
  const [tileScale, setTileScale] = useState(1);
  const [rowNaturalH, setRowNaturalH] = useState(80); // measured natural height of tile row
  const [rowMarginLeft, setRowMarginLeft] = useState(0); // offset to center scaled row

  const recalcScale = useCallback(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const availW = outer.offsetWidth;
    const naturalW = inner.scrollWidth;
    const naturalH = inner.scrollHeight;
    if (naturalH > 0) setRowNaturalH(naturalH);
    if (naturalW <= availW) { setTileScale(1); setRowMarginLeft(0); return; }
    const s = Math.max(0.3, availW / naturalW);
    setTileScale(s);
    // The scaled visual width = naturalW * s. Center it in availW.
    setRowMarginLeft(Math.max(0, (availW - naturalW * s) / 2));
  }, []);

  useEffect(() => {
    // Run on every render (hand changes, selection changes, etc.)
    recalcScale();
  });

  useEffect(() => {
    // Also run on window resize
    const onResize = () => recalcScale();
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    if (outerRef.current) ro.observe(outerRef.current);
    return () => { window.removeEventListener("resize", onResize); ro.disconnect(); };
  }, [recalcScale]);

  const resetCharlestonState = useCallback((hands: GameTile[][]) => {
    setPlayers([0,1,2,3].map(s => ({ seat: s, name: ["You (East)","South","West","North"][s], hand: [...hands[s]], selectedForPass: [], isHuman: s === 0 })));
    setPhase("charleston"); setStepIdx(0); setSelectedIds(new Set()); setBotsReady(false); setCourtesyCount(null);
    playVoice("first-charleston");
    setAnimating(false); setBlindSlotCount(0); setMessage("Select 3 tiles to pass"); setShowStopPrompt(false); setStoppedEarly(false);
    setShowROL(true); setReceivedTileIds(new Set()); setTouchedTileIds(new Set()); setLevelLocked(false);
    setTimer(0); setPassCount(0); setTotalPassed(0); setShowSetup(false);
    setSuggestions([]); setSuggestionsOpen(false); setBamAdvice(null);
    if (bamSessionUsed) setBamShowMessage(false);
    setActiveHintHand(null); setHintTileIds(new Set());
  }, []);

  const dealGame = useCallback(() => {
    const deck = shuffleDeck(getFullDeck());
    let idx = 0;
    const hands = [0,1,2,3].map(s => { const count = s === dealerSeat ? 14 : 13; const h = deck.slice(idx, idx + count); idx += count; return h; });
    initialHandsRef.current = hands.map(h => [...h]);
    resetCharlestonState(hands);
  }, [dealerSeat, resetCharlestonState]);

  const restartSameHand = useCallback(() => {
    if (!initialHandsRef.current) return;
    resetCharlestonState(initialHandsRef.current);
  }, [resetCharlestonState]);

  // Don't auto-deal on mount — show setup screen first
  useEffect(() => { if (!showSetup) return; /* setup handles deal */ }, []);

  const step = phase === "charleston" ? STEPS[stepIdx] : null;
  const isBlind = step?.blind || false;
  const reqCount = phase === "courtesy" && courtesyCount !== null ? courtesyCount : isBlind ? null : 3;
  const humanHand = players?.[0]?.hand || [];

  // Clear hint highlight when user manually rearranges tiles
  const clearHintHighlight = useCallback(() => {
    if (activeHintHand) {
      setActiveHintHand(null);
      setHintTileIds(new Set());
    }
  }, [activeHintHand]);

  const doSort = (fn: (h: GameTile[]) => GameTile[]) => { if (!players) return; setPlayers(p => p!.map((pl, i) => (i === 0 ? { ...pl, hand: fn(pl.hand) } : pl))); clearHintHighlight(); };

  // ── Recompute hand suggestions when hand changes ──
  useEffect(() => {
    if (!card || !humanHand.length || level === "advanced") { setSuggestions([]); return; }
    // Low threshold so we find all possible matches
    const matches = findPartialMatches(humanHand, card, 0.05);
    // Deduplicate by hand id — only keep the best match per unique hand
    const seen = new Set<string>();
    const unique: PartialMatchResult[] = [];
    for (const m of matches) {
      if (!seen.has(m.hand.id)) {
        seen.add(m.hand.id);
        unique.push(m);
      }
    }
    // Compute real match counts, filter out ≤1 tile matches, sort by most tiles descending
    const withCounts = unique.map(m => ({ match: m, count: computeRealMatchCount(m, humanHand) }));
    const filtered = withCounts.filter(x => x.count >= 2);
    filtered.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count; // most tiles first
      // Tie-break: exposed hands are easier to complete
      const aExp = a.match.hand.exposure === "X" ? 1 : 0;
      const bExp = b.match.hand.exposure === "X" ? 1 : 0;
      if (bExp !== aExp) return bExp - aExp;
      // Tie-break: fewer points = easier
      return a.match.hand.points - b.match.hand.points;
    });
    setSuggestions(filtered.slice(0, 5).map(x => x.match));
  }, [card, humanHand.length, humanHand.map(t => t.instanceId).join(","), level]);

  // Compute real match counts for each suggestion (matches actual highlight count)
  const realMatchCounts = useMemo(() => {
    return suggestions.map(s => computeRealMatchCount(s, humanHand));
  }, [suggestions, humanHand]);

  // ── Best tile count towards Mahjong (shown at completion) ──
  const bestTileCount = useMemo(() => {
    if (!card || !humanHand.length) return 0;
    const matches = findPartialMatches(humanHand, card, 0.05);
    if (matches.length === 0) return 0;
    // Deduplicate by hand id — keep only the best per hand
    const seen = new Set<string>();
    let best = 0;
    for (const m of matches) {
      if (seen.has(m.hand.id)) continue;
      seen.add(m.hand.id);
      const count = computeRealMatchCount(m, humanHand);
      if (count > best) best = count;
    }
    return best;
  }, [card, humanHand]);

  // ── Bam Bird advice generator (novice only) ──
  const generateBamAdvice = useCallback(() => {
    if (!card || !humanHand.length || level !== "novice") return;
    const matches = findPartialMatches(humanHand, card, 0.15);
    if (matches.length === 0) {
      const nonJokers = humanHand.filter(t => t.suit !== "jokers");
      const idCounts: Record<string, number> = {};
      nonJokers.forEach(t => { idCounts[t.id] = (idCounts[t.id] || 0) + 1; });
      const singletons = nonJokers.filter(t => idCounts[t.id] === 1).slice(0, 3);
      setBamAdvice({
        tiles: new Set(singletons.map(t => t.instanceId)),
        message: "Your hand is tricky! Pass tiles you only have one of — they're harder to use.",
      });
      return;
    }
    const top = matches[0];
    // Find tiles NOT useful for the best match
    const nonJokers = humanHand.filter(t => t.suit !== "jokers");
    const passable = nonJokers.filter(t => !isTileUsefulForHand(t.id, top.hand));
    const toPass = passable.slice(0, 3);

    let message = "";
    const tileNames = toPass.map(t => t.displayName).join(", ");
    const count = top.matchedCount;
    const sectionName = SECTION_LABELS[top.hand.section] || top.hand.section;

    if (matches.length >= 2) {
      const second = matches[1];
      const secondSection = SECTION_LABELS[second.hand.section] || second.hand.section;
      if (top.matchedCount > second.matchedCount + 1) {
        message = `You have ${count}/14 tiles for "${top.hand.displayPattern}" (${sectionName}). I'd go for this over the ${secondSection} hand since you're further along. Pass the ${tileNames}.`;
      } else if (top.hand.exposure === "X" && second.hand.exposure === "C") {
        message = `Between these options, go for "${top.hand.displayPattern}" — it's exposable, which is easier! You have ${count}/14 tiles. Pass the ${tileNames}.`;
      } else {
        message = `You have ${count}/14 tiles for "${top.hand.displayPattern}". The ${tileNames} don't help this hand — pass them!`;
      }
    } else {
      if (top.hand.exposure === "C") {
        message = `You're building toward "${top.hand.displayPattern}" (${count}/14 tiles). It's concealed, so hold your singles and pairs! Pass the ${tileNames}.`;
      } else {
        message = `You have ${count}/14 tiles for "${top.hand.displayPattern}". Pass the ${tileNames} — they don't fit this hand.`;
      }
    }

    setBamAdvice({ tiles: new Set(toPass.map(t => t.instanceId)), message });
    setBamShowMessage(false);
    setBamSessionUsed(true);
    try { localStorage.setItem("mahji_bam_seen_date", new Date().toISOString().slice(0, 10)); } catch {}
  }, [card, humanHand, level]);

  // ── Click a hint hand: rearrange tiles grouped by pattern, highlight in yellow ──
  const activateHintHand = useCallback((match: PartialMatchResult) => {
    if (activeHintHand === match.hand.id) {
      setActiveHintHand(null);
      setHintTileIds(new Set());
      return;
    }
    setActiveHintHand(match.hand.id);

    const hand = match.hand;
    const pattern = hand.patterns[match.patternIndex];
    if (!pattern) return;

    // Try ALL expanded variants × ALL color assignments to find the best match
    const expanded = expandNumberConstraint(pattern.numberConstraint, pattern);
    let bestArranged: GameTile[] = [];
    let bestHighlightIds = new Set<string>();
    let bestCount = 0;

    for (const ep of expanded) {
      const assignments = enumerateColorAssignments(ep);
      for (const assignment of assignments) {
        const arranged: GameTile[] = [];
        const usedInstanceIds = new Set<string>();
        const highlightIds = new Set<string>();
        for (const group of ep.groups) {
          const neededIds = resolveGroupToTileIds(group, assignment);
          for (const tileId of neededIds) {
            let found: GameTile | undefined;
            if (tileId === "__flower__") {
              found = humanHand.find(t => t.suit === "flowers" && !usedInstanceIds.has(t.instanceId));
            } else {
              found = humanHand.find(t => t.id === tileId && !usedInstanceIds.has(t.instanceId));
            }
            if (found) { arranged.push(found); usedInstanceIds.add(found.instanceId); highlightIds.add(found.instanceId); }
          }
        }
        if (highlightIds.size > bestCount) { bestCount = highlightIds.size; bestArranged = arranged; bestHighlightIds = highlightIds; }
      }
    }

    const usedIds = new Set(bestArranged.map(t => t.instanceId));
    const remaining = humanHand.filter(t => !usedIds.has(t.instanceId));
    const rearranged = [...bestArranged, ...remaining];

    setHintTileIds(bestHighlightIds);
    setPlayers(prev => prev!.map((p, i) => i === 0 ? { ...p, hand: rearranged } : p));
  }, [activeHintHand, humanHand, card]);

  const dirName: Record<string, string> = { right: "RIGHT", across: "ACROSS (West)", left: "LEFT" };
  const getMsg = () => {
    if (phase === "courtesy") return level === "novice" ? `Courtesy: choose ${courtesyCount} tile${courtesyCount !== 1 ? "s" : ""} to pass across to West` : `Select ${courtesyCount} tile${courtesyCount !== 1 ? "s" : ""} to pass`;
    if (level === "novice") {
      if (isBlind) return `Blind pass! Pick 0–3 tiles — you won't see what you receive until after`;
      return `Pass 3 tiles to the ${dirName[step?.dir || "right"]} player`;
    }
    if (isBlind) return "Select 0–3 tiles (blind pass allowed)";
    return "Select 3 tiles to pass";
  };

  const toggleTile = (tile: GameTile) => {
    if (animating) return; if (!levelLocked) setLevelLocked(true);
    if (receivedTileIds.has(tile.instanceId)) setTouchedTileIds(prev => new Set([...prev, tile.instanceId]));
    if (isJoker(tile)) { playError(); setMessage("⚠ Jokers cannot be passed in the Charleston"); setTimeout(() => setMessage(getMsg()), 2500); return; }
    if (selectedIds.has(tile.instanceId)) {
      playDeselect();
      setSelectedIds(prev => { const next = new Set(prev); next.delete(tile.instanceId); return next; });
    } else {
      const max = reqCount !== null ? reqCount : 3;
      const totalFilled = selectedIds.size + (isBlind ? blindSlotCount : 0);
      if (totalFilled >= max) {
        if (isBlind && blindSlotCount > 0) { setBlindSlotCount(c => c - 1); }
        else return;
      }
      playPlace();
      setSelectedIds(prev => { const next = new Set(prev); next.add(tile.instanceId); return next; });
    }
  };

  useEffect(() => {
    if (!players || phase === "courtesy_prompt" || phase === "complete" || showStopPrompt) return;
    setBotsReady(false);
    const cfg = LEVEL_CONFIG[level];
    const t = setTimeout(() => {
      const c = phase === "courtesy" ? (courtesyCount || 0) : 3;
      if (c === 0) { setBotsReady(true); return; }
      const selectFn = level === "novice" ? botSelectNovice : level === "advanced" ? botSelectAdvanced : botSelect;
      setPlayers(prev => prev!.map((p, i) => i === 0 ? p : { ...p, selectedForPass: selectFn(p.hand, c) }));
      setBotsReady(true);
    }, cfg.botDelayMin + Math.random() * cfg.botDelayRange);
    return () => clearTimeout(t);
  }, [stepIdx, phase, courtesyCount, players?.[0]?.hand?.length, showStopPrompt, level]);

  const canPass = () => {
    if (animating || showStopPrompt) return false;
    if (phase === "courtesy" && courtesyCount === 0) return true;
    if (isBlind) return botsReady;
    return selectedIds.size === (reqCount ?? 3) && botsReady;
  };

  const executePass = () => {
    if (!canPass()) return; setAnimating(true);
    let sel = humanHand.filter(t => selectedIds.has(t.instanceId));
    // For blind passes, auto-select random tiles for blind slots
    if (isBlind && blindSlotCount > 0) {
      const selIds = new Set(sel.map(t => t.instanceId));
      const available = humanHand.filter(t => !selIds.has(t.instanceId) && !isJoker(t));
      const shuffled = [...available].sort(() => Math.random() - 0.5);
      sel = [...sel, ...shuffled.slice(0, blindSlotCount)];
    }
    const selIds = new Set(sel.map(t => t.instanceId));
    setPassCount(c => c + 1); setTotalPassed(c => c + sel.length);
    const up = players!.map((p, i) => i === 0 ? { ...p, selectedForPass: sel } : p);
    const s = phase === "courtesy" ? { dir: "across" as const } : STEPS[stepIdx];
    const nh = resolvePass(up, s);
    const oldIds = new Set(humanHand.filter(t => !selIds.has(t.instanceId)).map(t => t.instanceId));
    const newReceivedIds = new Set(nh[0].filter(t => !oldIds.has(t.instanceId)).map(t => t.instanceId));
    const doResolve = () => {
      setPassDir(null); setBlindSlotCount(0);
      const kept = nh[0].filter(t => oldIds.has(t.instanceId)); const received = nh[0].filter(t => newReceivedIds.has(t.instanceId));
      setPlayers(prev => prev!.map((p, i) => ({ ...p, hand: i === 0 ? [...kept, ...received] : nh[i], selectedForPass: [] })));
      setSelectedIds(new Set()); setAnimating(false); setReceivedTileIds(newReceivedIds); setTouchedTileIds(new Set()); setBamAdvice(null);
      if (newReceivedIds.size > 0) playCharlestonReceive();
      if (phase === "courtesy") { setPhase("complete"); setMessage("Charleston complete!"); playCelebration(); }
      else if (stepIdx === 2) { setShowStopPrompt(true); }
      else if (stepIdx < STEPS.length - 1) { setStepIdx(s => s + 1); }
      else { setPhase("courtesy_prompt"); setMessage(""); playVoice("courtesy-pass"); }
    };
    playWhoosh(); setPassDir(s.dir); setTimeout(doResolve, 600);
  };

  const handleStopChoice = (stop: boolean) => { setShowStopPrompt(false); if (stop) { playVoice("stop"); setStoppedEarly(true); setPhase("courtesy_prompt"); setMessage(""); } else { setStepIdx(3); playVoice("second-charleston"); } };
  const handleCourtesyChoice = (count: number) => { setCourtesyCount(count); if (count === 0) { setPhase("complete"); setMessage("Charleston complete!"); playCelebration(); } else { setPhase("courtesy"); setSelectedIds(new Set()); setMessage(`Select ${count} tile${count !== 1 ? "s" : ""} to pass across`); } };

  useEffect(() => { if (phase === "charleston" && !showStopPrompt) setMessage(getMsg()); }, [stepIdx, phase, showStopPrompt]);

  // Advanced timer countdown
  useEffect(() => {
    if (level !== "advanced" || phase === "complete" || phase === "courtesy_prompt" || showStopPrompt || animating) { setTimer(0); return; }
    setTimer(LEVEL_CONFIG.advanced.timerSecs);
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, [stepIdx, phase, showStopPrompt, animating, level]);

  // Drag — insertion line appears BETWEEN tiles
  const handleDragStart = (e: React.DragEvent, idx: number) => { setDragIdx(idx); e.dataTransfer.effectAllowed = "all"; e.dataTransfer.setData("text/plain", String(idx)); e.dataTransfer.setData("source", "hand"); e.dataTransfer.setData("instanceId", visibleHand[idx]?.instanceId || ""); const tile = visibleHand[idx]; if (tile && receivedTileIds.has(tile.instanceId)) setTouchedTileIds(prev => new Set([...prev, tile.instanceId])); clearHintHighlight(); };
  // Always clear drag state when drag ends (regardless of whether drop succeeded)
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault(); e.dataTransfer.dropEffect = "move";
    // Determine which side of the tile we're closer to (left or right)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    const insertAt = e.clientX < midX ? idx : idx + 1;
    setDragOverIdx(insertAt);
  };
  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    // Recalculate insertion from mouse position
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    const insertAt = e.clientX < midX ? targetIdx : targetIdx + 1;
    if (dragIdx === null || dragIdx === insertAt || dragIdx + 1 === insertAt) { setDragIdx(null); setDragOverIdx(null); return; }
    setPlayers(prev => prev!.map((p, i) => {
      if (i !== 0) return p; const visible = p.hand.filter(t => !selectedIds.has(t.instanceId)); const dragTile = visible[dragIdx!]; if (!dragTile) return p;
      const without = visible.filter((_, idx) => idx !== dragIdx);
      const adj = dragIdx! < insertAt ? insertAt - 1 : insertAt;
      without.splice(Math.max(0, adj), 0, dragTile);
      return { ...p, hand: [...without, ...p.hand.filter(t => selectedIds.has(t.instanceId))] };
    })); setDragIdx(null); setDragOverIdx(null);
  };
  const handleDropEnd = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragIdx === null) { setDragOverIdx(null); return; }
    const insertAt = visibleHand.length;
    if (dragIdx === insertAt || dragIdx + 1 === insertAt) { setDragIdx(null); setDragOverIdx(null); return; }
    setPlayers(prev => prev!.map((p, i) => {
      if (i !== 0) return p; const visible = p.hand.filter(t => !selectedIds.has(t.instanceId)); const dragTile = visible[dragIdx!]; if (!dragTile) return p;
      const without = visible.filter((_, idx) => idx !== dragIdx);
      without.push(dragTile);
      return { ...p, hand: [...without, ...p.hand.filter(t => selectedIds.has(t.instanceId))] };
    })); setDragIdx(null); setDragOverIdx(null);
  };

  const visibleHand = humanHand.filter(t => !selectedIds.has(t.instanceId));
  const tileIsNew = (tile: GameTile) => receivedTileIds.has(tile.instanceId) && !touchedTileIds.has(tile.instanceId);
  const totalSlots = dealerSeat === 0 ? 14 : 13;
  const emptySlots = Math.max(0, totalSlots - visibleHand.length);
  const dirArrow: Record<string, string> = { right: "→", across: "↑", left: "←" };
  // Only show pass hints when Bam Bird is actively giving advice (not singletons by default)
  const passHints = bamAdvice ? bamAdvice.tiles : new Set<string>();

  const years = getAvailableYears();

  // ═══════════════════════════════════════════════════════════
  // SETUP SCREEN (card year + level + deal)
  // ═══════════════════════════════════════════════════════════

  if (showSetup) {
    return (
      <div style={{ flex: 1, background: U.bg, fontFamily: "'Outfit',sans-serif", color: U.text, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", background: U.chrome, borderBottom: `1px solid ${U.cBorder}` }}>
          <button onClick={onBack} style={{ background: U.btnBg, border: `1px solid ${U.btnBorder}`, borderRadius: 12, padding: "3px 10px", cursor: "pointer", fontSize: 10, color: U.btnText, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>← Back</button>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "0 24px" }}>
          <h1 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 22, color: U.cherry, letterSpacing: 3, textTransform: "uppercase", textAlign: "center", margin: 0 }}>CHARLESTON</h1>
          <p style={{ fontSize: 12, color: U.textMid, textAlign: "center", maxWidth: 300, lineHeight: 1.6, margin: 0 }}>Practice the tile-passing ritual before the game begins.</p>

          {/* Year selector */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: U.textLight, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, textAlign: "center" }}>Card Year</div>
            <div style={{ display: "flex", gap: 8 }}>
              {years.map(y => (
                <div key={y} onClick={() => setCardYear(y)} style={{
                  padding: "10px 24px", borderRadius: 12, cursor: "pointer",
                  background: cardYear === y ? U.cherry : U.btnBg,
                  color: cardYear === y ? "#fff" : U.btnText,
                  border: `1px solid ${cardYear === y ? U.cherry : U.btnBorder}`,
                  fontFamily: "'Bodoni Moda',serif", fontSize: 15, fontWeight: 600, transition: "all 0.2s",
                }}>{y}</div>
              ))}
            </div>
          </div>

          {/* Level selector */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: U.textLight, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, textAlign: "center" }}>Difficulty</div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["novice", "intermediate", "advanced"] as const).map(l => (
                <div key={l} onClick={() => setLevel(l)} style={{
                  padding: "8px 18px", borderRadius: 12, cursor: "pointer",
                  background: level === l ? U.cherry : U.btnBg,
                  color: level === l ? "#fff" : U.btnText,
                  border: `1px solid ${level === l ? U.cherry : U.btnBorder}`,
                  fontSize: 11, fontWeight: 600, textTransform: "capitalize", transition: "all 0.2s",
                }}>{l}</div>
              ))}
            </div>
          </div>

          {/* Mat colors */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: U.textLight, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, textAlign: "center" }}>Mat Color</div>
            <div style={{ display: "flex", gap: 8 }}>
              {MATS.map((m, i) => (
                <div key={m.id} onClick={() => setMatIdx(i)} style={{
                  width: 28, height: 28, borderRadius: 8, background: m.bg, cursor: "pointer",
                  outline: matIdx === i ? `2px solid ${U.seafoam}` : "2px solid transparent",
                  outlineOffset: 2, transition: "outline 0.2s",
                }} />
              ))}
            </div>
          </div>

          <button onClick={dealGame} disabled={!card} style={{
            padding: "12px 48px", borderRadius: 24, border: "none", cursor: card ? "pointer" : "not-allowed",
            background: card ? U.seafoam : U.btnBg, color: card ? "#fff" : U.textLight,
            fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: 0.5, transition: "all 0.2s",
            marginTop: 8,
          }}>{card ? "Deal & Start" : "Loading Card..."}</button>
        </div>
      </div>
    );
  }

  if (!players) return null;

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div style={{ flex: 1, background: U.bg, fontFamily: "'Outfit',sans-serif", color: U.text, display: "flex", flexDirection: "column", overflow: "hidden", paddingBottom: 80 }}>

      {/* Header — single row: Back, year, difficulty, mat colors */}
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: U.chrome, borderBottom: `1px solid ${U.cBorder}` }}>
        <button onClick={onBack} style={{ background: U.btnBg, border: `1px solid ${U.btnBorder}`, borderRadius: 12, padding: "3px 10px", cursor: "pointer", fontSize: 10, color: U.btnText, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>← Back</button>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 10, fontWeight: 700, color: U.cherry }}>{cardYear}</span>
          <div style={{ width: 1, height: 14, background: U.cBorder, margin: "0 2px" }} />
          {(["novice","intermediate","advanced"] as const).map(l => (
            <button key={l} onClick={() => !levelLocked && setLevel(l)} style={{ padding: "2px 7px", borderRadius: 10, cursor: levelLocked && level !== l ? "not-allowed" : "pointer", fontSize: 8, fontWeight: 600, background: level === l ? U.cherry : U.btnBg, color: level === l ? "#fff" : U.btnText, border: level === l ? `1px solid ${U.cherry}` : `1px solid ${U.btnBorder}`, fontFamily: "'Outfit',sans-serif", textTransform: "capitalize", transition: "all 0.15s ease", opacity: levelLocked && level !== l ? 0.35 : 1 }}>{l.slice(0,3)}</button>
          ))}
          <div style={{ width: 1, height: 14, background: U.cBorder, margin: "0 2px" }} />
          {MATS.map((m, i) => (
            <div key={m.id} onClick={() => setMatIdx(i)} style={{ width: 14, height: 14, borderRadius: "50%", background: m.bg, cursor: "pointer", border: i === matIdx ? `2px solid ${U.cherry}` : `1px solid ${U.cBorder}` }} />
          ))}
        </div>
      </div>

      {/* Title + step info */}
      <div style={{ textAlign: "center", padding: "4px 14px 2px" }}>
        <h1 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 15, fontWeight: 700, color: U.cherry, letterSpacing: 3, margin: 0 }}>CHARLESTON</h1>
        <p style={{ fontSize: 9, color: U.textMid, margin: "1px 0 0", fontWeight: 500 }}>
          {phase === "complete" ? "Complete!" : phase === "courtesy_prompt" ? "Courtesy Pass" : phase === "courtesy" ? `Courtesy Pass · ${courtesyCount} Tile${courtesyCount !== 1 ? "s" : ""}` : showStopPrompt ? "Continue or Stop?" : `${step?.key?.startsWith("1") ? "First" : "Second"} Charleston · ${step?.label}`}
        </p>
      </div>

      {/* Board */}
      <div style={{ flex: 1, margin: "2px 8px", background: mat.bg, borderRadius: 14, position: "relative", minHeight: 0, boxShadow: "inset 0 2px 12px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" }}>
        {/* West (across from East/you) */}
        <div style={{ padding: "6px 0 0" }}>
          <SeatLabel name="West" isReady={botsReady} showReady={phase === "charleston" && !showStopPrompt} seatBg={mat.seatBg} readyColor={mat.readyColor} />
        </div>

        {/* Middle */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0 10px" }}>
          <div style={{ minWidth: 40 }}>
            <SeatLabel name="South" isReady={botsReady} showReady={phase === "charleston" && !showStopPrompt} seatBg={mat.seatBg} readyColor={mat.readyColor} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
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
              <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "20px 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", textAlign: "center", minWidth: 220 }}>
                <h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 15, color: "#E03050", margin: "0 0 10px", letterSpacing: 1 }}>Charleston Complete!</h3>

                <div style={{ margin: "0 0 14px", padding: "10px 14px", background: "rgba(107,63,160,0.04)", borderRadius: 10, border: "1px solid rgba(107,63,160,0.1)" }}>
                  <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 22, fontWeight: 700, color: "#E03050" }}>
                    {bestTileCount} / 14
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#2D1B4E", marginTop: 2 }}>
                    tiles toward Mahjong
                  </div>
                </div>

                <button onClick={onBack} style={{ display: "flex", width: "100%", padding: "10px 0", marginBottom: 8, background: "#E03050", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: "'Outfit',sans-serif", alignItems: "center", justifyContent: "center", gap: 6 }}>Continue this match <span style={{ fontSize: 14 }}>&rarr;</span></button>
                <button onClick={dealGame} style={{ display: "flex", width: "100%", padding: "10px 0", marginBottom: 8, background: "#6B3FA0", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: "'Outfit',sans-serif", alignItems: "center", justifyContent: "center", gap: 6 }}>Practice new tiles</button>
                <button onClick={restartSameHand} style={{ display: "flex", width: "100%", padding: "10px 0", background: "rgba(107,63,160,0.06)", border: "1px solid rgba(107,63,160,0.15)", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#6B3FA0", fontFamily: "'Outfit',sans-serif", alignItems: "center", justifyContent: "center", gap: 6 }}>Practice these tiles again <span style={{ fontSize: 14, display: "inline-block", transform: "scaleX(-1) rotate(90deg)" }}>&#x21BB;</span></button>
              </div>
            ) : (() => {
              const bScale = Math.max(0.45, Math.min(0.85, tileScale));
              const passSlotCount = phase === "courtesy" ? (courtesyCount ?? 3) : 3;
              const passBoxW = Math.ceil((72 * passSlotCount + 3 * Math.max(0, passSlotCount - 1)) * bScale) + 10;
              const passBoxH = Math.ceil(98 * bScale) + 10;
              const selectedTiles = humanHand.filter(t => selectedIds.has(t.instanceId));
              return (
              <>
                <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: Math.round(8 * bScale), padding: `${Math.round(3 * bScale)}px ${Math.round(10 * bScale)}px`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", textAlign: "center", maxWidth: Math.round(220 * bScale) }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: Math.round(10 * bScale), fontWeight: 700, color: "#E03050", letterSpacing: 0.5 }}>{phase === "courtesy" ? "Courtesy ↑" : `${step?.label} ${step ? dirArrow[step.dir] : ""}`}</span>
                    {isBlind && <span style={{ fontSize: Math.round(8 * bScale), color: "#fff", fontWeight: 700, background: "#6DBFA8", padding: "1px 6px", borderRadius: 6, letterSpacing: 0.5 }}>Blind</span>}
                  </div>
                  {level === "novice" && step && (
                    <div style={{ fontSize: Math.round(6 * bScale), color: "#6B5A82", marginTop: 1, lineHeight: 1.2 }}>
                      {step.dir === "right" ? "Pass tiles to South (your right)" : step.dir === "across" ? "Pass tiles to West (across)" : "Pass tiles to North (your left)"}
                      {isBlind ? " · You won't see what comes back!" : ""}
                    </div>
                  )}
                </div>
                <div
                  onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                  onDrop={e => {
                    e.preventDefault(); e.stopPropagation();
                    const source = e.dataTransfer.getData("source") || "";
                    const data = e.dataTransfer.getData("text/plain");
                    if (source === "passbox") { setDragIdx(null); setDragOverIdx(null); return; }
                    let tile: GameTile | undefined;
                    const idx = parseInt(data, 10);
                    if (source === "hand" && !isNaN(idx) && visibleHand[idx]) { tile = visibleHand[idx]; }
                    else { tile = humanHand.find(t => t.instanceId === data) || visibleHand.find(t => t.instanceId === data); }
                    if (!tile && !isNaN(idx)) { tile = visibleHand[idx]; }
                    if (tile && !selectedIds.has(tile.instanceId) && !isJoker(tile)) {
                      playPlace();
                      toggleTile(tile);
                    }
                    setDragIdx(null); setDragOverIdx(null);
                  }}
                  style={{ width: passBoxW, height: passBoxH, background: (selectedIds.size > 0 || blindSlotCount > 0) ? "rgba(224,48,80,0.06)" : "rgba(255,255,255,0.08)", border: `2px dashed ${(selectedIds.size > 0 || blindSlotCount > 0) ? "rgba(224,48,80,0.5)" : mat.accent}`, borderRadius: Math.round(10 * bScale), display: "flex", alignItems: "center", justifyContent: "center", transition: passDir ? "none" : "all 0.2s ease", overflow: "visible", position: "relative", animation: passDir ? `${passDir === "right" ? "passSlideRight" : passDir === "left" ? "passSlideLeft" : "passSlideUp"} 0.5s ease-in forwards` : "none" }}>
                  <div style={{ width: Math.ceil((72 * passSlotCount + 3 * Math.max(0, passSlotCount - 1)) * bScale), height: Math.ceil(98 * bScale), position: "relative" }}>
                    <div style={{ display: "flex", gap: 3, flexWrap: "nowrap", transform: `scale(${bScale})`, transformOrigin: "top left", position: "absolute", top: 0, left: 0 }}>
                      {Array.from({ length: passSlotCount }, (_, i) => {
                        const tile = selectedTiles[i];
                        if (tile) return (
                          <div key={tile.instanceId}
                            draggable
                            onDragStart={(e) => { e.dataTransfer.setData("text/plain", tile.instanceId); e.dataTransfer.setData("source", "passbox"); }}
                          >
                            <TileCard tile={tile} selected={false} onTap={() => toggleTile(tile)} cherry={U.cherry} size="md" disabled={animating} />
                          </div>
                        );
                        // Blind pass: show tile back (clickable to remove) or B button
                        if (isBlind) {
                          const blindIdx = i - selectedTiles.length;
                          if (blindIdx >= 0 && blindIdx < blindSlotCount) {
                            return (
                              <div key={`pass-blind-${i}`} onClick={() => { if (!animating) { playDeselect(); setBlindSlotCount(c => c - 1); } }} style={{ cursor: "pointer", opacity: 0.85, transition: "opacity 0.15s" }}>
                                <MahjiTile faceDown size="md" />
                              </div>
                            );
                          }
                          return (
                            <div key={`pass-b-${i}`} onClick={() => { if (!animating && selectedIds.size + blindSlotCount < 3) { playPlace(); setBlindSlotCount(c => c + 1); } }} style={{ width: 72, height: 98, borderRadius: 10, border: "2px dashed rgba(224,48,80,0.25)", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.15s ease" }}>
                              <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 24, fontWeight: 700, color: "rgba(224,48,80,0.35)" }}>B</span>
                            </div>
                          );
                        }
                        return <EmptyPassSlot key={`pass-empty-${i}`} />;
                      })}
                    </div>
                  </div>
                  {!isBlind && selectedIds.size === 0 && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: Math.round(8 * bScale), color: mat.text, fontStyle: "italic" }}>Tap or drag tiles here</span>
                    </div>
                  )}
                </div>
                {(phase === "charleston" || phase === "courtesy") && (
                  <button onClick={executePass} disabled={!canPass()} style={{ background: canPass() ? "#E03050" : "rgba(255,255,255,0.2)", color: canPass() ? "#FFFFFF" : mat.text, border: "none", borderRadius: Math.round(14 * bScale), padding: `${Math.round(4 * bScale)}px ${Math.round(16 * bScale)}px`, cursor: canPass() ? "pointer" : "not-allowed", fontSize: Math.round(9 * bScale), fontWeight: 700, fontFamily: "'Bodoni Moda',serif", letterSpacing: 1.5, transition: "all 0.2s ease", opacity: canPass() ? 1 : 0.4, boxShadow: canPass() ? "0 0 10px rgba(224,48,80,0.2)" : "none" }}>{animating ? "..." : "PASS"}</button>
                )}
              </>
              );
            })()}
          </div>

          <div style={{ minWidth: 40 }}>
            <SeatLabel name="North" isReady={botsReady} showReady={phase === "charleston" && !showStopPrompt} seatBg={mat.seatBg} readyColor={mat.readyColor} />
          </div>
        </div>

        {/* Bottom — You (East · Dealer) */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", padding: "0 14px 8px", position: "relative" }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: mat.seatBg, padding: "2px 8px", borderRadius: 6 }}>You (East · Dealer)</span>
          {showROL && <div style={{ position: "absolute", right: 14, bottom: 8 }}><ROLIndicator stepIdx={stepIdx} phase={phase} showStopPrompt={showStopPrompt} stoppedEarly={stoppedEarly} cherry={U.cherry} textFaded={mat.text} /></div>}
        </div>
      </div>

      {/* Message + Timer */}
      <div style={{ textAlign: "center", padding: "3px 10px", minHeight: 16, flexShrink: 0 }}>
        {message && <span style={{ fontSize: 10, fontWeight: 500, color: message.startsWith("⚠") ? U.cherry : U.textMid }}>{message}</span>}
        {level === "advanced" && timer > 0 && phase !== "complete" && !showStopPrompt && (
          <span style={{ fontSize: 9, fontWeight: 700, color: timer <= 10 ? U.cherry : U.seafoam, marginLeft: 8 }}>⏱ {timer}s</span>
        )}
      </div>

      {/* ── Suggestions Panel (Novice & Intermediate only) ── */}
      {level !== "advanced" && suggestions.length > 0 && phase !== "complete" && phase !== "courtesy_prompt" && !showStopPrompt && (
        <div style={{ margin: "0 10px", flexShrink: 0 }}>
          <div onClick={() => setSuggestionsOpen(!suggestionsOpen)} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer",
            padding: "3px 0", fontSize: 9, fontWeight: 600, color: U.textLight,
          }}>
            <span>{suggestionsOpen ? "Hide Possible Hands" : "👀 Peep Possible Hands!"}</span>
            <span style={{ fontSize: 7, transition: "transform 0.2s", transform: suggestionsOpen ? "rotate(0)" : "rotate(0)" }}>{suggestionsOpen ? "▾" : "▸"}</span>
          </div>
          {suggestionsOpen && (
            <div style={{
              background: isDark ? "rgba(180,154,216,0.05)" : "rgba(107,63,160,0.03)",
              border: `0.5px solid ${U.cBorder}`, borderRadius: 10, padding: "6px 10px", marginBottom: 2,
              animation: "entranceFade 0.2s ease both",
            }}>
              {suggestions.map((s, i) => {
                const isActive = activeHintHand === s.hand.id;
                const realCount = realMatchCounts[i] ?? s.matchedCount;
                // Show only first variant for -or- patterns; description explains the rest
                const firstVariant = s.hand.displayPattern.split(" -or- ")[0];
                const displayHand = firstVariant !== s.hand.displayPattern
                  ? { ...s.hand, displayPattern: firstVariant, patterns: [s.hand.patterns[0]] }
                  : s.hand;
                return (
                  <div key={s.hand.id + i} onClick={() => activateHintHand(s)} style={{
                    padding: "5px 6px", borderRadius: 8, cursor: "pointer",
                    borderBottom: i < suggestions.length - 1 ? `0.5px solid ${U.cBorder}` : "none",
                    background: isActive ? "rgba(234,179,8,0.1)" : "transparent",
                    outline: isActive ? "1.5px solid rgba(234,179,8,0.4)" : "1.5px solid transparent",
                    transition: "all 0.15s ease",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <ColoredPattern hand={displayHand} isDark={isDark} fontSize={10} />
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 700, color: isActive ? "#b8860b" : U.seafoam, minWidth: 30, textAlign: "right" }}>{realCount}/14</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 7, color: U.textLight }}>{SECTION_LABELS[s.hand.section]}</span>
                      <span style={{ fontSize: 7, color: U.textLight }}>·</span>
                      <span style={{ fontSize: 7, color: U.textLight }}>{s.hand.points}pts</span>
                      <span style={{ fontSize: 7, color: U.textLight }}>·</span>
                      <span style={{ fontSize: 7, color: U.textLight }}>{s.hand.exposure === "C" ? "Concealed" : "Exposed"}</span>
                      {s.hand.description && <>
                        <span style={{ fontSize: 7, color: U.textLight }}>·</span>
                        <span style={{ fontSize: 7, color: U.textLight, fontStyle: "italic" }}>{s.hand.description}</span>
                      </>}
                    </div>
                  </div>
                );
              })}
              {activeHintHand && <div style={{ fontSize: 8, color: U.textLight, textAlign: "center", marginTop: 3, fontStyle: "italic" }}>Matching tiles highlighted in yellow · Drag to rearrange</div>}
            </div>
          )}
        </div>
      )}

      {/* ── Pass animations — soft red zoom with directional drift ── */}
      <style>{`
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
      `}</style>

      {/* ── Bam Bird Advice (Novice only) — floats right ── */}
      {level === "novice" && phase === "charleston" && !showStopPrompt && (
        <>
          <style>{`
            @keyframes bamShake {
              0%, 100% { transform: rotate(0deg); }
              15% { transform: rotate(-6deg); }
              30% { transform: rotate(6deg); }
              45% { transform: rotate(-4deg); }
              60% { transform: rotate(4deg); }
              75% { transform: rotate(-2deg); }
              90% { transform: rotate(2deg); }
            }
          `}</style>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", gap: 6, padding: "0 10px 2px", flexShrink: 0 }}>
            {bamAdvice && (
              <div style={{
                maxWidth: 300, background: isDark ? "rgba(109,191,168,0.08)" : "rgba(109,191,168,0.06)",
                border: "1.5px solid rgba(107,63,160,0.25)", borderRadius: 12, padding: "8px 10px",
                display: "flex", gap: 6, alignItems: "flex-start", animation: "entranceFade 0.3s ease both",
              }}>
                <BirdIcon size={14} color={C.seafoam} sw={2} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, lineHeight: 1.4, color: U.textMid }}>{bamAdvice.message}</div>
                  <div onClick={() => setBamAdvice(null)} style={{ fontSize: 8, color: U.seafoam, fontWeight: 600, cursor: "pointer", marginTop: 3 }}>Got it</div>
                </div>
              </div>
            )}
            {!bamAdvice && (
              <div onClick={generateBamAdvice} style={{
                display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
                padding: "5px 12px", borderRadius: 16,
                background: "rgba(109,191,168,0.1)", border: "1.5px solid rgba(107,63,160,0.35)",
                transition: "all 0.2s",
                animation: bamShowMessage ? "bamShake 0.8s ease-in-out 0.5s" : "none",
              }}>
                <BirdIcon size={13} color={C.seafoam} sw={2} />
                {bamShowMessage && <span style={{ fontSize: 9, fontWeight: 600, color: U.seafoam }}>Ask Bam what to pass!</span>}
              </div>
            )}
          </div>
        </>
      )}

      {/* Sort */}
      {phase !== "complete" && phase !== "courtesy_prompt" && !showStopPrompt && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "1px 10px", flexShrink: 0 }}>
          <button onClick={() => doSort(sortByRank)} style={{ background: U.btnBg, border: `1px solid ${U.btnBorder}`, borderRadius: 12, padding: "3px 10px", cursor: "pointer", fontSize: 9, color: U.btnText, fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>Sort by Rank</button>
          <button onClick={() => doSort(sortBySuit)} style={{ background: U.btnBg, border: `1px solid ${U.btnBorder}`, borderRadius: 12, padding: "3px 10px", cursor: "pointer", fontSize: 9, color: U.btnText, fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>Sort by Suit</button>
        </div>
      )}

      {/* Hand — two-div structure: outer clips to scaled height, inner holds tiles at natural size */}
      <div ref={outerRef}
        onDragOver={(e) => { const source = e.dataTransfer.types.includes("source") ? "" : ""; e.preventDefault(); }}
        onDrop={(e) => {
          e.preventDefault();
          const source = e.dataTransfer.getData("source") || "";
          const instanceId = e.dataTransfer.getData("text/plain");
          if (source === "passbox" && instanceId) {
            // Remove from pass selection (deselect)
            const tile = humanHand.find(t => t.instanceId === instanceId);
            if (tile) { playDeselect(); setSelectedIds(prev => { const next = new Set(prev); next.delete(tile.instanceId); return next; }); }
          }
          setDragIdx(null); setDragOverIdx(null);
        }}
        style={{
          width: "100%",
          overflow: "hidden",
          height: Math.ceil(rowNaturalH * tileScale) + 22,
          minHeight: 60,
          flexShrink: 0,
          padding: "5px 0 16px",
        }}>
        <div ref={innerRef} style={{
          display: "flex",
          gap: 3,
          flexWrap: "nowrap",
          alignItems: "flex-end",
          whiteSpace: "nowrap",
          transformOrigin: "top left",
          transform: `scale(${tileScale})`,
          width: "max-content",
          marginLeft: rowMarginLeft,
          padding: "0 6px",
        }}>
          {visibleHand.map((tile, idx) => (
            <TileCard key={tile.instanceId} tile={tile} selected={false}
              onTap={() => { if (receivedTileIds.has(tile.instanceId)) setTouchedTileIds(prev => new Set([...prev, tile.instanceId])); toggleTile(tile); }}
              onDoubleTap={() => toggleTile(tile)}
              disabled={phase === "complete" || phase === "courtesy_prompt" || animating || showStopPrompt}
              cherry={U.cherry} isNew={tileIsNew(tile)} isHint={passHints.has(tile.instanceId)} isYellowHint={hintTileIds.has(tile.instanceId)} isDragging={dragIdx === idx}
              showInsertLeft={dragOverIdx === idx && dragIdx !== null && dragIdx !== idx && dragIdx + 1 !== idx}
              onDragStart={e => handleDragStart(e, idx)} onDragOver={e => handleDragOver(e, idx)} onDrop={e => handleDrop(e, idx)} onDragEnd={handleDragEnd} />
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => <EmptySlot key={`empty-${i}`} />)}
          <div onDragOver={e => { e.preventDefault(); setDragOverIdx(visibleHand.length); }} onDrop={handleDropEnd} style={{ width: 8, flexShrink: 0 }} />
        </div>
      </div>
    </div>
  );
}
