// ═══════════════════════════════════════════════════════════════
// MAHJI — Learn the Hands Practice Drill
// File: src/pages/practice/LearnHandsDrill.tsx
//
// Novice drill: pick a card year, app generates a random hand,
// user drags tiles from a bank to build the hand.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef } from "react";
import { MahjiTile } from "../../components/tiles/MahjiTile";
import { GameTile, getFullDeck, shuffleDeck } from "../../data/tileData";
import { C, getThemeColors } from "../../constants/colors";
import { useTheme } from "../../constants/ThemeContext";
import {
  getCard, getAvailableYears, getCurrentYear,
  expandNumberConstraint, enumerateColorAssignments,
  resolveGroupToTileIds, validateHand,
  SECTION_LABELS, SECTION_ORDER,
} from "../../data/nmjl";
import type {
  NMJLCard, HandDefinition, HandPattern, ColorAssignment, TileGroup, CardColor,
} from "../../data/nmjl";

// ─── COLORED PATTERN ─────────────────────────────────────────

const CARD_COLOR_HEX: Record<CardColor, string> = {
  red: "#C2413B", green: "#2E8B57", blue: "#4A7FA8",
};
const OPERATOR_TOKENS = new Set(["+", "=", "x", "or", "OR", "-or-"]);

function ColoredPattern({ hand, isDark, fontSize = 12 }: { hand: HandDefinition; isDark: boolean; fontSize?: number }) {
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
          {i > 0 && <span style={{ letterSpacing: 2 }}>{" "}</span>}
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
      <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize, fontWeight: 600, letterSpacing: 0.5 }}>
        {orParts.map((part, pi) => (
          <React.Fragment key={`or-${pi}`}>
            {pi > 0 && <div style={{ color: opColor, fontSize: fontSize * 0.7, margin: "2px 0" }}>-or-</div>}
            <div style={{ whiteSpace: "nowrap" }}>{renderHalf(part, hand.patterns[pi], `P${pi}`)}</div>
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize, fontWeight: 600, letterSpacing: 0.5 }}>
      {renderHalf(hand.displayPattern, hand.patterns[0], "S")}
    </span>
  );
}

// ─── TYPES ────────────────────────────────────────────────────

interface LearnHandsDrillProps { onBack: () => void; }

type Phase = "setup" | "building" | "success" | "wrong";

interface GroupSlot {
  groupIdx: number;
  slotIdx: number; // slot within that group
  tile: GameTile | null;
}

// ─── CONSTANTS ────────────────────────────────────────────────

const MATS = [
  { id: "coffee", name: "Coffee", bg: "linear-gradient(145deg,#4A3D32,#3E3228,#352A20)", text: "rgba(158,202,189,0.6)", accent: "rgba(158,202,189,0.18)" },
  { id: "seafoam", name: "Seafoam", bg: "linear-gradient(145deg,#8FBFB2,#7AAD9F,#6B9E90)", text: "rgba(58,46,36,0.5)", accent: "rgba(58,46,36,0.2)" },
  { id: "lavender", name: "Lavender", bg: "linear-gradient(145deg,#B5A8C8,#A496B8,#9688AA)", text: "rgba(58,46,36,0.5)", accent: "rgba(58,46,36,0.2)" },
  { id: "cerulean", name: "Cerulean", bg: "linear-gradient(145deg,#A0C4D6,#8FB5C8,#80A6BA)", text: "rgba(58,46,36,0.5)", accent: "rgba(58,46,36,0.2)" },
];

const uiT = {
  light: { bg: "#F8F5FB", chrome: "#FFFFFF", cBorder: "rgba(107,63,160,0.1)", text: "#2D1B4E", textMid: "#6B5A82", textLight: "#9688AA", cherry: "#E03050", lavDeep: "#6B3FA0", seafoam: "#6DBFA8", btnBg: "rgba(107,63,160,0.06)", btnBorder: "rgba(107,63,160,0.12)", btnText: "#6B3FA0" },
  dark: { bg: "#1A1225", chrome: "#251545", cBorder: "rgba(180,154,216,0.12)", text: "#F0EAF6", textMid: "#B49AD8", textLight: "#7E6A9A", cherry: "#FF4D6D", lavDeep: "#B49AD8", seafoam: "#7DD4B8", btnBg: "rgba(180,154,216,0.08)", btnBorder: "rgba(180,154,216,0.15)", btnText: "#B49AD8" },
};

// ─── HELPERS ──────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── SORTING ──────────────────────────────────────────────────
const WIND_ORDER: Record<string, number> = { N: 0, E: 1, W: 2, S: 3 };
const DRAGON_ORDER: Record<string, number> = { red: 0, green: 1, white: 2 };

function isJoker(tile: GameTile): boolean { return tile.suit === "jokers"; }

function sortBySuit(hand: GameTile[]): GameTile[] {
  return [...hand].sort((a, b) => {
    const gk = (t: GameTile) => {
      if (t.suit === "flowers") return -1;
      if (isJoker(t)) return 99;
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
    if (isJoker(a) && !isJoker(b)) return 1;
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

/** Resolve a full hand to concrete GameTile instances */
function resolveHandToTiles(
  hand: HandDefinition,
): { tiles: GameTile[]; groupSizes: number[]; pattern: HandPattern; assignment: ColorAssignment } | null {
  const deck = getFullDeck();

  // Try all patterns until one yields valid tiles
  for (const basePattern of hand.patterns) {
    const expanded = expandNumberConstraint(basePattern.numberConstraint, basePattern);
    const picked = expanded[Math.floor(Math.random() * expanded.length)];
    const assignments = enumerateColorAssignments(picked);
    const assignment = assignments[Math.floor(Math.random() * assignments.length)];

    const groupSizes: number[] = [];
    const allTileIds: string[] = [];

    for (const group of picked.groups) {
      const ids = resolveGroupToTileIds(group, assignment);
      groupSizes.push(ids.length);
      allTileIds.push(...ids);
    }

    if (allTileIds.length !== 14) continue;

    // Map IDs to actual GameTile instances from the deck
    const usedInstances = new Set<string>();
    const tiles: GameTile[] = [];
    let valid = true;

    for (const id of allTileIds) {
      let found: GameTile | undefined;
      if (id === "__flower__") {
        found = deck.find(t => t.suit === "flowers" && !usedInstances.has(t.instanceId));
      } else {
        found = deck.find(t => t.id === id && !usedInstances.has(t.instanceId));
      }
      if (!found) {
        // Try jokers for quint/sextet slots where natural tiles are exhausted
        found = deck.find(t => t.suit === "jokers" && !usedInstances.has(t.instanceId));
      }
      if (!found) { valid = false; break; }
      usedInstances.add(found.instanceId);
      tiles.push(found);
    }

    if (valid && tiles.length === 14) {
      return { tiles, groupSizes, pattern: picked, assignment };
    }
  }
  return null;
}

/** Generate distractor tiles that aren't in the target hand */
function generateDistractors(targetTiles: GameTile[], count: number): GameTile[] {
  const deck = getFullDeck();
  const targetIds = new Set(targetTiles.map(t => t.instanceId));
  const available = deck.filter(t => !targetIds.has(t.instanceId) && t.suit !== "jokers");
  return shuffleArray(available).slice(0, count);
}

// ─── TILE CARD ────────────────────────────────────────────────

function TileCard({ tile, selected, onTap, disabled, cherry, isDragging = false, isWrong = false, onDragStart, onDragEnd }: {
  tile: GameTile; selected: boolean; onTap: () => void; disabled: boolean; cherry: string;
  isDragging?: boolean; isWrong?: boolean; onDragStart?: (e: React.DragEvent) => void; onDragEnd?: (e: React.DragEvent) => void;
}) {
  return (
    <div
      draggable={!disabled}
      onDragStart={onDragStart || ((e) => { e.dataTransfer.setData("text/plain", tile.instanceId); e.dataTransfer.setData("source", "bank"); })}
      onDragEnd={onDragEnd}
      onClick={disabled ? undefined : onTap}
      style={{
        position: "relative", cursor: disabled ? "default" : "grab", transition: "all 0.15s ease",
        transform: selected ? "translateY(-4px) scale(1.05)" : isDragging ? "scale(0.95)" : "scale(1)",
        boxShadow: isWrong ? "0 0 12px rgba(224,48,80,0.5)" : selected ? `0 0 12px ${cherry}33` : "none",
        opacity: isDragging ? 0.35 : disabled ? 0.5 : 1, userSelect: "none", borderRadius: 8,
        outline: isWrong ? "2px solid #E03050" : selected ? `2px solid ${cherry}` : "2px solid transparent",
        flexShrink: 0,
      }}
    >
      <div style={{ pointerEvents: "none" }}><MahjiTile tileId={tile.id} size="xs" /></div>
    </div>
  );
}

// ─── EMPTY SLOT ───────────────────────────────────────────────

function EmptySlot({ onDrop, onTap, highlighted }: {
  onDrop: (instanceId: string, source: string) => void; onTap: () => void; highlighted: boolean;
}) {
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); const id = e.dataTransfer.getData("text/plain"); const source = e.dataTransfer.getData("source") || "bank"; if (id) onDrop(id, source); }}
      onClick={onTap}
      style={{
        width: 66, height: 90, borderRadius: 8, flexShrink: 0,
        border: over ? "2px solid #6DBFA8" : highlighted ? "2px dashed rgba(109,191,168,0.5)" : "2px dashed rgba(255,255,255,0.15)",
        background: over ? "rgba(109,191,168,0.1)" : "rgba(255,255,255,0.04)",
        transition: "all 0.15s ease", cursor: "pointer",
      }}
    />
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────

export default function LearnHandsDrill({ onBack }: LearnHandsDrillProps) {
  const { isDark } = useTheme();
  const U = uiT[isDark ? "dark" : "light"];
  const [matIdx, setMatIdx] = useState(0);
  const mat = MATS[matIdx];

  // State
  const [cardYear, setCardYear] = useState(getCurrentYear());
  const [card, setCard] = useState<NMJLCard | null>(null);
  const [phase, setPhase] = useState<Phase>("setup");
  const [targetHand, setTargetHand] = useState<HandDefinition | null>(null);
  const [resolvedTiles, setResolvedTiles] = useState<GameTile[]>([]);
  const [groupSizes, setGroupSizes] = useState<number[]>([]);
  const [bankTiles, setBankTiles] = useState<GameTile[]>([]);
  const [buildSlots, setBuildSlots] = useState<(GameTile | null)[]>([]);
  const [selectedBankTile, setSelectedBankTile] = useState<string | null>(null);
  const [wrongSlots, setWrongSlots] = useState<Set<number>>(new Set());
  const [handCount, setHandCount] = useState(0);
  const [streak, setStreak] = useState(0);

  // Load card
  useEffect(() => {
    getCard(cardYear).then(c => { if (c) setCard(c); });
  }, [cardYear]);

  // Generate a hand
  const generateHand = useCallback(() => {
    if (!card) return;
    // Pick a random hand
    const hand = card.hands[Math.floor(Math.random() * card.hands.length)];
    const result = resolveHandToTiles(hand);
    if (!result) { generateHand(); return; } // retry

    setTargetHand(hand);
    setResolvedTiles(result.tiles);
    setGroupSizes(result.groupSizes);

    // Build slot array (14 nulls)
    setBuildSlots(new Array(14).fill(null));

    // Bank: correct tiles + distractors (24 total = 3 clean rows of 8 on mobile)
    const distractors = generateDistractors(result.tiles, 24 - result.tiles.length);
    setBankTiles(shuffleArray([...result.tiles, ...distractors]));

    setSelectedBankTile(null);
    setWrongSlots(new Set());
    setPhase("building");
    setHandCount(c => c + 1);
  }, [card]);

  // Place a tile from bank into the next empty slot
  const placeTile = useCallback((instanceId: string, targetSlotIdx?: number) => {
    const tile = bankTiles.find(t => t.instanceId === instanceId);
    if (!tile) return;

    setBuildSlots(prev => {
      const next = [...prev];
      if (targetSlotIdx !== undefined && next[targetSlotIdx] === null) {
        next[targetSlotIdx] = tile;
      } else {
        const emptyIdx = next.findIndex(s => s === null);
        if (emptyIdx < 0) return prev;
        next[emptyIdx] = tile;
      }
      return next;
    });

    setBankTiles(prev => prev.filter(t => t.instanceId !== instanceId));
    setSelectedBankTile(null);
    setWrongSlots(new Set());
  }, [bankTiles]);

  // Move a tile from one build slot to an empty build slot
  const moveBuildTile = useCallback((fromInstanceId: string, targetSlotIdx: number) => {
    setBuildSlots(prev => {
      const next = [...prev];
      const fromIdx = next.findIndex(t => t?.instanceId === fromInstanceId);
      if (fromIdx < 0) return prev;
      if (next[targetSlotIdx] !== null) {
        // Swap tiles between slots
        const temp = next[targetSlotIdx];
        next[targetSlotIdx] = next[fromIdx];
        next[fromIdx] = temp;
      } else {
        // Move to empty slot
        next[targetSlotIdx] = next[fromIdx];
        next[fromIdx] = null;
      }
      return next;
    });
    setWrongSlots(new Set());
  }, []);

  // Remove tile from build slot back to bank
  const removeTile = useCallback((slotIdx: number) => {
    setBuildSlots(prev => {
      const tile = prev[slotIdx];
      if (!tile) return prev;
      setBankTiles(bank => [...bank, tile]);
      const next = [...prev];
      next[slotIdx] = null;
      return next;
    });
    setWrongSlots(new Set());
  }, []);

  // Clear all slots
  const clearAll = useCallback(() => {
    const placed = buildSlots.filter(Boolean) as GameTile[];
    setBankTiles(prev => [...prev, ...placed]);
    setBuildSlots(new Array(14).fill(null));
    setWrongSlots(new Set());
    setSelectedBankTile(null);
  }, [buildSlots]);

  // Sort bank tiles
  const doSortBank = (fn: (tiles: GameTile[]) => GameTile[]) => {
    setBankTiles(prev => fn(prev));
  };

  // Drag state for build zone tiles
  const [dragFromSlot, setDragFromSlot] = useState<number | null>(null);

  // Check the hand
  const checkHand = useCallback(() => {
    const placed = buildSlots.filter(Boolean) as GameTile[];
    if (placed.length < 14) return;
    if (!card) return;

    const result = validateHand(placed, card);
    if (result.matched && result.hand?.id === targetHand?.id) {
      setPhase("success");
      setStreak(s => s + 1);
    } else {
      // Mark wrong tiles
      const correctIds = new Set(resolvedTiles.map(t => t.id));
      const wrong = new Set<number>();
      buildSlots.forEach((t, i) => {
        if (t && !correctIds.has(t.id)) wrong.add(i);
      });
      // If no wrong IDs detected (might be ordering issue), check group-by-group
      if (wrong.size === 0) {
        // Simple check: if tiles are right but in wrong slots, show success
        const placedIds = placed.map(t => t.id).sort().join(",");
        const correctSorted = resolvedTiles.map(t => t.id).sort().join(",");
        if (placedIds === correctSorted) {
          setPhase("success");
          setStreak(s => s + 1);
          return;
        }
      }
      setWrongSlots(wrong);
      setPhase("wrong");
      setStreak(0);
    }
  }, [buildSlots, card, targetHand, resolvedTiles]);

  // ── Responsive tile scaling for build zone ──
  const buildRef = useRef<HTMLDivElement>(null);
  const buildInnerRef = useRef<HTMLDivElement>(null);
  const [buildScale, setBuildScale] = useState(1);

  useEffect(() => {
    const recalc = () => {
      const outer = buildRef.current;
      const inner = buildInnerRef.current;
      if (!outer || !inner) return;
      const availW = outer.offsetWidth;
      const naturalW = inner.scrollWidth;
      if (naturalW <= availW) { setBuildScale(1); return; }
      setBuildScale(Math.max(0.5, availW / naturalW));
    };
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  });

  const allPlaced = buildSlots.every(s => s !== null);
  const years = getAvailableYears();

  // ── SETUP SCREEN ──
  if (phase === "setup") {
    return (
      <div style={{ flex: 1, background: U.bg, display: "flex", flexDirection: "column", overflow: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 8px" }}>
          <div onClick={onBack} style={{ cursor: "pointer", fontSize: 13, color: U.textMid, fontWeight: 500 }}>‹ Back</div>
          <div style={{ display: "flex", gap: 4 }}>
            {MATS.map((m, i) => (
              <div key={m.id} onClick={() => setMatIdx(i)} style={{
                width: 20, height: 20, borderRadius: 6, background: m.bg, cursor: "pointer",
                outline: matIdx === i ? `2px solid ${U.seafoam}` : "2px solid transparent",
                outlineOffset: 1, transition: "outline 0.2s",
              }} />
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, padding: "0 24px" }}>
          <h1 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 26, color: U.cherry, letterSpacing: 3, textTransform: "uppercase", textAlign: "center", margin: 0 }}>
            Learn the Hands
          </h1>
          <p style={{ fontSize: 13, color: U.textMid, textAlign: "center", maxWidth: 320, lineHeight: 1.6, margin: 0 }}>
            Pick a card year, and we'll show you a hand. Your job? Build it tile by tile.
          </p>

          {/* Year selector */}
          <div style={{ display: "flex", gap: 10 }}>
            {years.map(y => (
              <div key={y} onClick={() => setCardYear(y)} style={{
                padding: "12px 28px", borderRadius: 14, cursor: "pointer",
                background: cardYear === y ? U.cherry : U.btnBg,
                color: cardYear === y ? "#fff" : U.btnText,
                border: `1px solid ${cardYear === y ? U.cherry : U.btnBorder}`,
                fontFamily: "'Bodoni Moda',serif", fontSize: 16, fontWeight: 600,
                transition: "all 0.2s",
              }}>{y}</div>
            ))}
          </div>

          <button onClick={generateHand} disabled={!card} style={{
            padding: "14px 48px", borderRadius: 24, border: "none", cursor: card ? "pointer" : "not-allowed",
            background: card ? U.seafoam : U.btnBg, color: card ? "#fff" : U.textLight,
            fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: 0.5,
            transition: "all 0.2s",
          }}>
            {card ? "Start" : "Loading..."}
          </button>
        </div>
      </div>
    );
  }

  // ── BUILDING / SUCCESS / WRONG SCREEN ──

  // Group boundaries for visual gaps
  const groupStarts: number[] = [];
  let acc = 0;
  for (const gs of groupSizes) {
    groupStarts.push(acc);
    acc += gs;
  }

  return (
    <div style={{ flex: 1, background: U.bg, display: "flex", flexDirection: "column", overflow: "auto", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 8px" }}>
        <div onClick={onBack} style={{ cursor: "pointer", fontSize: 13, color: U.textMid, fontWeight: 500 }}>‹ Back</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {streak > 0 && <span style={{ fontSize: 10, color: U.seafoam, fontWeight: 600 }}>🔥 {streak}</span>}
          <span style={{ fontSize: 10, color: U.textLight }}>#{handCount}</span>
          <div style={{ display: "flex", gap: 4 }}>
            {MATS.map((m, i) => (
              <div key={m.id} onClick={() => setMatIdx(i)} style={{
                width: 16, height: 16, borderRadius: 5, background: m.bg, cursor: "pointer",
                outline: matIdx === i ? `2px solid ${U.seafoam}` : "2px solid transparent",
                outlineOffset: 1,
              }} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Target hand display */}
        {targetHand && (
          <div style={{
            background: isDark ? "rgba(180,154,216,0.06)" : "rgba(107,63,160,0.04)",
            border: `0.5px solid ${U.cBorder}`, borderRadius: 12, padding: "10px 14px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: U.textLight, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
              {SECTION_LABELS[targetHand.section]} · {targetHand.points} pts · {targetHand.exposure === "C" ? "Concealed" : "Exposed"}
            </div>
            <div style={{ marginBottom: targetHand.description ? 4 : 0 }}>
              <ColoredPattern hand={targetHand} isDark={isDark} fontSize={14} />
            </div>
            {targetHand.description && (
              <div style={{ fontSize: 11, color: U.textMid, fontStyle: "italic" }}>{targetHand.description}</div>
            )}
          </div>
        )}

        {/* BUILD ZONE — always one line, horizontal scroll */}
        <div style={{
          background: mat.bg, borderRadius: 14, padding: "16px 12px",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.2)",
        }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: mat.text, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10, textAlign: "center" }}>
            Build the hand
          </div>
          <div ref={buildRef} style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 4 }}>
            <div ref={buildInnerRef} style={{
              display: "inline-flex", alignItems: "center", gap: 3, whiteSpace: "nowrap",
              transform: `scale(${buildScale})`, transformOrigin: "left center",
            }}>
              {buildSlots.map((slot, i) => {
                const isGroupStart = groupStarts.includes(i) && i > 0;
                return (
                  <React.Fragment key={i}>
                    {isGroupStart && <div style={{ width: 10, flexShrink: 0 }} />}
                    {slot ? (
                      <div
                        draggable={phase !== "success"}
                        onDragStart={(e) => { e.dataTransfer.setData("text/plain", slot.instanceId); e.dataTransfer.setData("source", "build"); setDragFromSlot(i); }}
                        onDragEnd={() => setDragFromSlot(null)}
                        onDragOver={(e) => { e.preventDefault(); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const id = e.dataTransfer.getData("text/plain");
                          const source = e.dataTransfer.getData("source") || "bank";
                          if (source === "build") { moveBuildTile(id, i); }
                          else { /* bank tile onto occupied slot — swap: send current to bank, place new */ removeTile(i); placeTile(id, i); }
                          setDragFromSlot(null);
                        }}
                        style={{ flexShrink: 0 }}
                      >
                        <TileCard
                          tile={slot}
                          selected={false}
                          onTap={() => removeTile(i)}
                          disabled={phase === "success"}
                          cherry={U.cherry}
                          isWrong={wrongSlots.has(i)}
                          isDragging={dragFromSlot === i}
                        />
                      </div>
                    ) : (
                      <EmptySlot
                        onDrop={(id, source) => {
                          if (source === "build") { moveBuildTile(id, i); }
                          else { placeTile(id, i); }
                          setDragFromSlot(null);
                        }}
                        onTap={() => { if (selectedBankTile) placeTile(selectedBankTile, i); }}
                        highlighted={selectedBankTile !== null}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feedback */}
        {phase === "success" && (
          <div style={{
            textAlign: "center", padding: "12px 16px", borderRadius: 12,
            background: "rgba(109,191,168,0.12)", border: "1px solid rgba(109,191,168,0.3)",
            animation: "entranceFade 0.3s ease both",
          }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>🎉</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: U.seafoam }}>Correct!</div>
            <div style={{ fontSize: 11, color: U.textMid, marginTop: 2 }}>
              {targetHand?.displayPattern} — {targetHand?.points} points
            </div>
          </div>
        )}

        {phase === "wrong" && (
          <div style={{
            textAlign: "center", padding: "10px 16px", borderRadius: 12,
            background: "rgba(224,48,80,0.08)", border: "1px solid rgba(224,48,80,0.2)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: U.cherry }}>Not quite!</div>
            <div style={{ fontSize: 11, color: U.textMid, marginTop: 2 }}>
              {wrongSlots.size > 0 ? `${wrongSlots.size} tile${wrongSlots.size > 1 ? "s" : ""} highlighted in red — tap to fix` : "Tiles are correct but may be in wrong groups. Tap tiles to rearrange."}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {phase === "building" && (
            <>
              <button onClick={clearAll} style={{
                padding: "8px 20px", borderRadius: 18, border: `1px solid ${U.btnBorder}`,
                background: U.btnBg, color: U.btnText, fontSize: 11, fontWeight: 500, cursor: "pointer",
              }}>Clear All</button>
              <button onClick={checkHand} disabled={!allPlaced} style={{
                padding: "8px 28px", borderRadius: 18, border: "none",
                background: allPlaced ? U.seafoam : U.btnBg,
                color: allPlaced ? "#fff" : U.textLight,
                fontSize: 12, fontWeight: 600, cursor: allPlaced ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}>Check ✓</button>
            </>
          )}
          {phase === "wrong" && (
            <button onClick={() => setPhase("building")} style={{
              padding: "8px 24px", borderRadius: 18, border: `1px solid ${U.btnBorder}`,
              background: U.btnBg, color: U.btnText, fontSize: 11, fontWeight: 500, cursor: "pointer",
            }}>Keep Trying</button>
          )}
          {(phase === "success" || phase === "wrong") && (
            <button onClick={generateHand} style={{
              padding: "8px 28px", borderRadius: 18, border: "none",
              background: U.cherry, color: "#fff",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>Next Hand →</button>
          )}
        </div>

        {/* Sort buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "2px 0" }}>
          <button onClick={() => doSortBank(sortByRank)} style={{
            background: U.btnBg, border: `1px solid ${U.btnBorder}`, borderRadius: 12,
            padding: "4px 12px", cursor: "pointer", fontSize: 10, color: U.btnText,
            fontWeight: 600, fontFamily: "'Outfit',sans-serif",
          }}>Sort by Rank</button>
          <button onClick={() => doSortBank(sortBySuit)} style={{
            background: U.btnBg, border: `1px solid ${U.btnBorder}`, borderRadius: 12,
            padding: "4px 12px", cursor: "pointer", fontSize: 10, color: U.btnText,
            fontWeight: 600, fontFamily: "'Outfit',sans-serif",
          }}>Sort by Suit</button>
        </div>

        {/* TILE BANK — multi-line wrap */}
        <div
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={(e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData("text/plain");
            const source = e.dataTransfer.getData("source") || "bank";
            if (source === "build" && id) {
              // Drag from build slot back to bank
              const slotIdx = buildSlots.findIndex(t => t?.instanceId === id);
              if (slotIdx >= 0) removeTile(slotIdx);
            }
            setDragFromSlot(null);
          }}
          style={{
            background: isDark ? "rgba(180,154,216,0.04)" : "rgba(107,63,160,0.03)",
            border: `0.5px solid ${U.cBorder}`, borderRadius: 14, padding: "12px",
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 600, color: U.textLight, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
            Tile Bank ({bankTiles.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
            {bankTiles.map(tile => (
              <TileCard
                key={tile.instanceId}
                tile={tile}
                selected={selectedBankTile === tile.instanceId}
                onTap={() => {
                  if (selectedBankTile === tile.instanceId) {
                    setSelectedBankTile(null);
                  } else {
                    setSelectedBankTile(tile.instanceId);
                    const emptyIdx = buildSlots.findIndex(s => s === null);
                    if (emptyIdx >= 0) {
                      placeTile(tile.instanceId);
                    }
                  }
                }}
                disabled={phase === "success"}
                cherry={U.cherry}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: 90, flexShrink: 0 }} />
    </div>
  );
}
