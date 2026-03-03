// ═══════════════════════════════════════════════════════════════
// MAHJI — Reading Exposures Practice Drill
// File: src/pages/practice/ReadExposuresDrill.tsx
//
// Examine an opponent's exposed melds and identify ALL possible
// hands they could be pursuing from the NMJL card.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from "react";
import { MahjiTile } from "../../components/tiles/MahjiTile";
import { GameTile, getFullDeck } from "../../data/tileData";
import { useTheme } from "../../constants/ThemeContext";
import {
  getCard, getAvailableYears, getCurrentYear,
  expandNumberConstraint, enumerateColorAssignments,
  resolveGroupToTileIds,
  SECTION_LABELS, SECTION_ORDER,
} from "../../data/nmjl";
import type {
  NMJLCard, HandDefinition, HandPattern, TileGroup,
  ColorAssignment, CardSection, CardColor,
} from "../../data/nmjl";

// ─── TYPES ────────────────────────────────────────────────────

interface Props { onBack: () => void; }

type Phase = "setup" | "playing" | "results";

interface ExposedMeld {
  tiles: GameTile[];
  groupType: string;
}

interface Puzzle {
  melds: ExposedMeld[];
  correctHandIds: Set<string>;
}

interface ScoreResult {
  score: number;
  correct: string[];
  wrong: string[];
  missed: string[];
}

// ─── CONSTANTS ────────────────────────────────────────────────

const CARD_COLOR_HEX: Record<CardColor, string> = {
  red: "#C2413B",
  green: "#2E8B57",
  blue: "#4A7FA8",
};

const OPERATOR_TOKENS = new Set(["+", "=", "or", "OR", "-or-"]);

const uiT = {
  light: {
    bg: "#F8F5FB", chrome: "#FFFFFF", cBorder: "rgba(107,63,160,0.1)",
    text: "#2D1B4E", textMid: "#6B5A82", textLight: "#9688AA",
    cherry: "#E03050", lavDeep: "#6B3FA0", seafoam: "#6DBFA8",
    btnBg: "rgba(107,63,160,0.06)", btnBorder: "rgba(107,63,160,0.12)", btnText: "#6B3FA0",
    cardBg: "rgba(255,255,255,0.72)", cardShadow: "0 2px 12px rgba(107,63,160,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
    meldBg: "rgba(107,63,160,0.03)", amber: "#b8860b", amberBg: "rgba(234,179,8,0.12)",
  },
  dark: {
    bg: "#1A1225", chrome: "#251545", cBorder: "rgba(180,154,216,0.12)",
    text: "#F0EAF6", textMid: "#B49AD8", textLight: "#7E6A9A",
    cherry: "#FF4D6D", lavDeep: "#B49AD8", seafoam: "#7DD4B8",
    btnBg: "rgba(180,154,216,0.08)", btnBorder: "rgba(180,154,216,0.15)", btnText: "#B49AD8",
    cardBg: "rgba(37,21,69,0.72)", cardShadow: "0 2px 12px rgba(0,0,0,0.2), inset 0 0.5px 0 rgba(255,255,255,0.04)",
    meldBg: "rgba(180,154,216,0.06)", amber: "#e5b84a", amberBg: "rgba(234,179,8,0.15)",
  },
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

/** Resolve a group to GameTile instances, possibly with joker substitutions */
function resolveGroupToGameTiles(group: TileGroup, assignment: ColorAssignment): GameTile[] {
  const deck = getFullDeck();
  const tileIds = resolveGroupToTileIds(group, assignment);
  const used = new Set<string>();
  const tiles: GameTile[] = [];

  // How many natural tiles of this type exist in the deck?
  const isFlower = group.tiles[0]?.kind === "flower";
  const naturalAvailable = isFlower ? 8 : 4; // 8 flowers, 4 of any other tile
  const minJokers = Math.max(0, group.count - naturalAvailable);

  // Add jokers for realism, but guarantee enough for groups that need them
  const jokerChance = group.count >= 5 ? 0.9 : 0.25;
  let numJokers = Math.random() < jokerChance
    ? (group.count >= 5 ? (Math.random() < 0.5 ? 2 : 1) : 1)
    : 0;
  numJokers = Math.max(numJokers, minJokers);

  for (let i = 0; i < tileIds.length; i++) {
    if (i < numJokers) {
      const joker = deck.find(t => t.suit === "jokers" && !used.has(t.instanceId));
      if (joker) { used.add(joker.instanceId); tiles.push(joker); continue; }
    }
    const id = tileIds[i];
    let found: GameTile | undefined;
    if (id === "__flower__") {
      found = deck.find(t => t.suit === "flowers" && !used.has(t.instanceId));
    } else {
      found = deck.find(t => t.id === id && !used.has(t.instanceId));
    }
    if (found) { used.add(found.instanceId); tiles.push(found); }
  }
  return tiles;
}

/**
 * Backtracking: try to assign each meld to a distinct exposable group
 * within the same (pattern, expansion, colorAssignment).
 * - Each meld maps to exactly one group (no sharing)
 * - Meld size must match group.count (pung=3 can't match kong=4)
 */
function tryAssignMelds(
  melds: ExposedMeld[],
  mi: number,
  groups: { group: TileGroup; idx: number }[],
  assignment: ColorAssignment,
  usedIndices: Set<number>,
): boolean {
  if (mi >= melds.length) return true;
  const meld = melds[mi];
  const natural = meld.tiles.filter(t => t.suit !== "jokers");

  // All jokers — could be any unused group
  if (natural.length === 0) {
    for (const { group, idx } of groups) {
      if (usedIndices.has(idx)) continue;
      if (meld.tiles.length !== group.count) continue;
      const next = new Set(usedIndices); next.add(idx);
      if (tryAssignMelds(melds, mi + 1, groups, assignment, next)) return true;
    }
    return false;
  }

  const naturalIds = natural.map(t => t.suit === "flowers" ? "__flower__" : t.id);

  for (const { group, idx } of groups) {
    if (usedIndices.has(idx)) continue;
    // Meld size must match group size (pung=3 can't match kong=4)
    if (meld.tiles.length !== group.count) continue;
    const groupIds = resolveGroupToTileIds(group, assignment);
    if (naturalIds.every(id => groupIds.includes(id))) {
      const next = new Set(usedIndices); next.add(idx);
      if (tryAssignMelds(melds, mi + 1, groups, assignment, next)) return true;
    }
  }
  return false;
}

/**
 * Check if ALL melds could belong to a hand under the SAME
 * number expansion and color assignment, each assigned to a distinct group.
 */
function allMeldsFitHand(melds: ExposedMeld[], hand: HandDefinition): boolean {
  for (const pattern of hand.patterns) {
    const expanded = expandNumberConstraint(pattern.numberConstraint, pattern);
    for (const ep of expanded) {
      const assignments = enumerateColorAssignments(ep);
      for (const assignment of assignments) {
        const expGroups = ep.groups
          .map((g, i) => ({ group: g, idx: i }))
          .filter(({ group }) =>
            group.type === "pung" || group.type === "kong" || group.type === "quint" || group.type === "sextet"
          );
        if (tryAssignMelds(melds, 0, expGroups, assignment, new Set())) {
          return true;
        }
      }
    }
  }
  return false;
}

/** Get all hands that could match ALL exposed melds */
function getPossibleHands(melds: ExposedMeld[], card: NMJLCard): HandDefinition[] {
  if (melds.length === 0) return card.hands.filter(h => h.exposure === "X");
  return card.hands.filter(hand => {
    if (hand.exposure === "C") return false;
    return allMeldsFitHand(melds, hand);
  });
}

/** Generate a puzzle: pick a hand, expose its melds, find all matching hands.
 *  Includes runtime verification — retries if the source hand isn't in correct answers. */
function generateExposures(card: NMJLCard): Puzzle | null {
  const exposable = card.hands.filter(h => h.exposure === "X");

  // Score hands by exposable group count — prefer 2-3 for interesting puzzles
  const candidates = exposable.map(hand => {
    const pattern = hand.patterns[0];
    if (!pattern) return null;
    const expGroups = pattern.groups.filter(g =>
      g.type === "pung" || g.type === "kong" || g.type === "quint" || g.type === "sextet"
    );
    if (expGroups.length < 1) return null;
    return { hand, pattern, exposableGroups: expGroups };
  }).filter(Boolean) as { hand: HandDefinition; pattern: HandPattern; exposableGroups: TileGroup[] }[];

  if (candidates.length === 0) return null;

  // Try up to 10 times to generate a valid puzzle
  for (let attempt = 0; attempt < 10; attempt++) {
    // Pick a random candidate
    const picked = candidates[Math.floor(Math.random() * candidates.length)];

    // Choose a random color assignment
    const expanded = expandNumberConstraint(picked.pattern.numberConstraint, picked.pattern);
    const ep = expanded[Math.floor(Math.random() * expanded.length)];
    const assignments = enumerateColorAssignments(ep);
    const assignment = assignments[Math.floor(Math.random() * assignments.length)];

    // Pick 1-3 exposable groups from the expanded pattern
    const expGroups = ep.groups.filter(g =>
      g.type === "pung" || g.type === "kong" || g.type === "quint" || g.type === "sextet"
    );
    const numToExpose = Math.min(expGroups.length, 1 + Math.floor(Math.random() * Math.min(3, expGroups.length)));
    const shuffled = shuffleArray(expGroups);
    const groupsToExpose = shuffled.slice(0, numToExpose);

    // Resolve each group to actual GameTile instances
    const melds: ExposedMeld[] = groupsToExpose.map(group => ({
      tiles: resolveGroupToGameTiles(group, assignment),
      groupType: group.type,
    }));

    // VERIFY: every meld has the correct number of tiles
    const allMeldsValid = melds.every((meld, i) => meld.tiles.length === groupsToExpose[i].count);
    if (!allMeldsValid) {
      console.warn(`[ReadExposures] Meld generation produced wrong tile count, retrying (attempt ${attempt + 1})`);
      continue;
    }

    // Compute ALL matching hands from the card
    const correctHands = getPossibleHands(melds, card);
    const correctHandIds = new Set(correctHands.map(h => h.id));

    // VERIFY: the source hand must be in the correct answers
    if (!correctHandIds.has(picked.hand.id)) {
      console.warn(`[ReadExposures] Source hand "${picked.hand.displayPattern}" not in correct answers, retrying (attempt ${attempt + 1})`);
      continue;
    }

    return { melds, correctHandIds };
  }

  // Fallback: should never reach here, but just in case
  console.error("[ReadExposures] Failed to generate valid puzzle after 10 attempts");
  return null;
}

/** Compute score from selections vs correct answers */
function computeScore(selectedIds: Set<string>, correctIds: Set<string>): ScoreResult {
  const correct = [...selectedIds].filter(id => correctIds.has(id));
  const wrong = [...selectedIds].filter(id => !correctIds.has(id));
  const missed = [...correctIds].filter(id => !selectedIds.has(id));

  const totalCorrect = correctIds.size;
  if (totalCorrect === 0) {
    return { score: wrong.length === 0 ? 100 : 0, correct, wrong, missed };
  }

  const base = (correct.length / totalCorrect) * 100;
  const penalty = wrong.length * 10;
  const score = Math.max(0, Math.round(base - penalty));

  return { score, correct, wrong, missed };
}

// ─── COLORED PATTERN SUB-COMPONENT ───────────────────────────

function ColoredPattern({ hand, isDark, fontSize = 12 }: { hand: HandDefinition; isDark: boolean; fontSize?: number }) {
  const pattern = hand.patterns[0];
  const tokens = hand.displayPattern.split(" ");
  const defaultColor = isDark ? "#F0EAF6" : "#2D1B4E";

  if (!pattern) {
    return <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize, fontWeight: 600, color: defaultColor }}>{hand.displayPattern}</span>;
  }

  // Map non-operator tokens to groups
  let groupIdx = 0;
  const rendered = tokens.map((token, i) => {
    const isOp = OPERATOR_TOKENS.has(token);
    let color = defaultColor;

    if (!isOp && groupIdx < pattern.groups.length) {
      const group = pattern.groups[groupIdx];
      color = CARD_COLOR_HEX[group.color] || defaultColor;
      groupIdx++;
    } else if (isOp) {
      color = isDark ? "#7E6A9A" : "#9688AA";
    }

    return (
      <React.Fragment key={i}>
        {i > 0 && <span style={{ letterSpacing: 2 }}>{" "}</span>}
        <span style={{ color }}>{token}</span>
      </React.Fragment>
    );
  });

  return (
    <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize, fontWeight: 600, letterSpacing: 0.5 }}>
      {rendered}
    </span>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────

export default function ReadExposuresDrill({ onBack }: Props) {
  const { isDark } = useTheme();
  const U = uiT[isDark ? "dark" : "light"];

  const [cardYear, setCardYear] = useState(getCurrentYear());
  const [card, setCard] = useState<NMJLCard | null>(null);
  const [phase, setPhase] = useState<Phase>("setup");

  // Game state
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [activeSection, setActiveSection] = useState<CardSection | null>(null);
  const [selectedHandIds, setSelectedHandIds] = useState<Set<string>>(new Set());
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);

  const years = getAvailableYears();

  useEffect(() => { getCard(cardYear).then(c => { if (c) setCard(c); }); }, [cardYear]);

  // Start a new round
  const startGame = useCallback(() => {
    if (!card) return;
    const p = generateExposures(card);
    if (!p) return;
    setPuzzle(p);
    setActiveSection(null);
    setSelectedHandIds(new Set());
    setScoreResult(null);
    setPhase("playing");
  }, [card]);

  // Next round
  const nextRound = useCallback(() => {
    setRoundNumber(r => r + 1);
    startGame();
  }, [startGame]);

  // Toggle hand selection
  const toggleHand = (handId: string) => {
    setSelectedHandIds(prev => {
      const next = new Set(prev);
      if (next.has(handId)) next.delete(handId);
      else next.add(handId);
      return next;
    });
  };

  // Validate
  const validate = useCallback(() => {
    if (!puzzle) return;
    const result = computeScore(selectedHandIds, puzzle.correctHandIds);
    setScoreResult(result);
    setPhase("results");
  }, [puzzle, selectedHandIds]);

  // Sections that have at least one exposable hand
  const exposableSections = card
    ? [...new Set(card.hands.filter(h => h.exposure === "X").map(h => h.section))]
        .sort((a, b) => SECTION_ORDER.indexOf(a) - SECTION_ORDER.indexOf(b))
    : [];

  // Hands from the active section (exposable only)
  const sectionHands = card && activeSection
    ? card.hands.filter(h => h.section === activeSection && h.exposure === "X")
    : [];

  // ── SETUP SCREEN ──────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div style={{ minHeight: "100vh", background: U.bg, display: "flex", flexDirection: "column", fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", background: U.chrome, borderBottom: `1px solid ${U.cBorder}` }}>
          <button onClick={onBack} style={{ background: U.btnBg, border: `1px solid ${U.btnBorder}`, borderRadius: 12, padding: "3px 10px", cursor: "pointer", fontSize: 10, color: U.btnText, fontWeight: 600 }}>← Back</button>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "0 24px" }}>
          <h1 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 22, color: U.cherry, letterSpacing: 3, textTransform: "uppercase", textAlign: "center", margin: 0 }}>
            READING EXPOSURES
          </h1>
          <p style={{ fontSize: 12, color: U.textMid, textAlign: "center", maxWidth: 300, lineHeight: 1.6, margin: 0 }}>
            Examine an opponent's exposed melds and identify all possible hands they could be pursuing.
          </p>

          {/* Year */}
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

          <button onClick={() => { setRoundNumber(1); startGame(); }} disabled={!card} style={{
            padding: "12px 48px", borderRadius: 24, border: "none",
            cursor: card ? "pointer" : "not-allowed",
            background: card ? U.seafoam : U.btnBg, color: card ? "#fff" : U.textLight,
            fontSize: 14, fontWeight: 600, marginTop: 8, transition: "all 0.2s",
          }}>{card ? "Start" : "Loading Card..."}</button>
        </div>
      </div>
    );
  }

  // ── PLAYING & RESULTS SCREEN ──────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: U.bg, display: "flex", flexDirection: "column", fontFamily: "'Outfit',sans-serif" }}>

      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes entranceFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: U.chrome, borderBottom: `1px solid ${U.cBorder}` }}>
        <button onClick={onBack} style={{ background: U.btnBg, border: `1px solid ${U.btnBorder}`, borderRadius: 12, padding: "3px 10px", cursor: "pointer", fontSize: 10, color: U.btnText, fontWeight: 600 }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, color: U.textLight, fontWeight: 500 }}>{cardYear} Card</span>
          <span style={{ fontSize: 9, color: U.textLight }}>·</span>
          <span style={{ fontSize: 9, color: U.seafoam, fontWeight: 600 }}>Round {roundNumber}</span>
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", padding: "8px 14px 4px" }}>
        <h1 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 17, fontWeight: 700, color: U.cherry, letterSpacing: 3, margin: 0 }}>READING EXPOSURES</h1>
        <p style={{ fontSize: 9, color: U.textMid, margin: "2px 0 0" }}>
          {phase === "playing" ? "What hand could produce these melds?" : "Results"}
        </p>
      </div>

      {/* ── Exposed Melds Card ── */}
      {puzzle && (
        <div style={{
          margin: "4px 12px 8px", padding: "14px 16px", borderRadius: 16,
          background: U.cardBg, border: `1px solid ${U.cBorder}`,
          boxShadow: U.cardShadow,
          animation: "entranceFade 0.3s ease both",
        }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: U.textLight, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
            Opponent's Exposures
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {puzzle.melds.map((meld, mi) => (
              <div key={mi} style={{
                display: "inline-flex", gap: 2, padding: "6px 8px",
                background: U.meldBg, borderRadius: 10,
                border: `1px solid ${U.cBorder}`,
              }}>
                {meld.tiles.map((tile, ti) => (
                  <div key={ti} style={{ pointerEvents: "none" }}>
                    <MahjiTile tileId={tile.id} size="sm" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PLAYING PHASE ── */}
      {phase === "playing" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Section pills */}
          <div style={{ padding: "4px 12px 2px" }}>
            <div style={{ fontSize: 9, color: U.textMid, marginBottom: 6, textAlign: "center" }}>
              {activeSection ? `${SECTION_LABELS[activeSection]} · ${sectionHands.length} hand${sectionHands.length !== 1 ? "s" : ""}` : "Select a section to browse hands"}
            </div>
            <div style={{
              display: "flex", gap: 6, overflowX: "auto", padding: "2px 0 6px",
              WebkitOverflowScrolling: "touch" as any,
              msOverflowStyle: "none", scrollbarWidth: "none",
            }}>
              {exposableSections.map(s => {
                const isActive = activeSection === s;
                return (
                  <div key={s} onClick={() => setActiveSection(s)} style={{
                    padding: "6px 14px", borderRadius: 16, cursor: "pointer",
                    fontSize: 10, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0,
                    background: isActive ? U.cherry : U.btnBg,
                    color: isActive ? "#fff" : U.btnText,
                    border: `1px solid ${isActive ? U.cherry : U.btnBorder}`,
                    transition: "all 0.2s",
                  }}>{SECTION_LABELS[s]}</div>
                );
              })}
            </div>
          </div>

          {/* Two-column body: Hand browser (left) + Selected hands (right) */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden", gap: 0 }}>

            {/* LEFT: Hand browser */}
            <div style={{
              flex: selectedHandIds.size > 0 ? "0 0 58%" : "1 1 100%",
              overflow: "auto", padding: "0 0 8px 12px",
              transition: "flex 0.25s ease",
            }}>
              {activeSection ? (
                <div style={{
                  background: U.cardBg, border: `1px solid ${U.cBorder}`,
                  borderRadius: 14, overflow: "hidden",
                  marginRight: selectedHandIds.size > 0 ? 0 : 12,
                  animation: "entranceFade 0.2s ease both",
                }}>
                  {sectionHands.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 20, fontSize: 11, color: U.textLight }}>No exposable hands in this section</div>
                  ) : (
                    sectionHands.map((hand, i) => {
                      const isSelected = selectedHandIds.has(hand.id);
                      return (
                        <div key={hand.id} onClick={() => toggleHand(hand.id)} style={{
                          display: "flex", alignItems: "center", gap: 6, padding: "10px 10px",
                          cursor: "pointer",
                          background: isSelected ? (isDark ? "rgba(109,191,168,0.1)" : "rgba(109,191,168,0.06)") : "transparent",
                          borderBottom: i < sectionHands.length - 1 ? `0.5px solid ${U.cBorder}` : "none",
                          transition: "background 0.15s",
                        }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <ColoredPattern hand={hand} isDark={isDark} fontSize={11} />
                            <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                              <span style={{ fontSize: 7, color: U.textLight }}>{hand.points}pts</span>
                            </div>
                          </div>
                          <div style={{
                            width: 26, height: 26, borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: isSelected ? U.seafoam : U.btnBg,
                            border: `1.5px solid ${isSelected ? U.seafoam : U.btnBorder}`,
                            color: isSelected ? "#fff" : U.btnText,
                            fontSize: 14, fontWeight: 700, flexShrink: 0,
                            transition: "all 0.15s",
                          }}>
                            {isSelected ? "✓" : "+"}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                    <div style={{ fontSize: 13, color: U.textMid, fontWeight: 500 }}>Pick a section above</div>
                    <div style={{ fontSize: 10, color: U.textLight, marginTop: 4 }}>Find all matching hands</div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Selected hands column — slides in when selections exist */}
            {selectedHandIds.size > 0 && (
              <div style={{
                flex: "0 0 42%", display: "flex", flexDirection: "column",
                borderLeft: `1px solid ${U.cBorder}`,
                background: isDark ? "rgba(37,21,69,0.5)" : "rgba(107,63,160,0.02)",
                animation: "entranceFade 0.2s ease both",
              }}>
                {/* Header */}
                <div style={{
                  padding: "8px 10px 6px", borderBottom: `1px solid ${U.cBorder}`,
                  background: isDark ? "rgba(109,191,168,0.06)" : "rgba(109,191,168,0.03)",
                }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: U.seafoam, textTransform: "uppercase", letterSpacing: 0.8 }}>
                    Selected ({selectedHandIds.size})
                  </div>
                </div>

                {/* Selected hand list */}
                <div style={{ flex: 1, overflow: "auto", padding: "4px 0" }}>
                  {[...selectedHandIds].map(id => {
                    const hand = card?.hands.find(h => h.id === id);
                    if (!hand) return null;
                    return (
                      <div key={id} style={{
                        display: "flex", alignItems: "center", gap: 4, padding: "6px 8px",
                        borderBottom: `0.5px solid ${U.cBorder}`,
                        animation: "entranceFade 0.15s ease both",
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <ColoredPattern hand={hand} isDark={isDark} fontSize={9} />
                          <div style={{ fontSize: 7, color: U.textLight, marginTop: 1 }}>
                            {SECTION_LABELS[hand.section]}
                          </div>
                        </div>
                        <div onClick={(e) => { e.stopPropagation(); toggleHand(id); }} style={{
                          width: 20, height: 20, borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: "rgba(224,48,80,0.08)", border: "1px solid rgba(224,48,80,0.2)",
                          color: U.cherry, fontSize: 11, fontWeight: 700, cursor: "pointer",
                          flexShrink: 0, transition: "all 0.15s",
                        }}>×</div>
                      </div>
                    );
                  })}
                </div>

                {/* Validate button pinned at bottom of right column */}
                <div style={{ padding: "8px 8px 12px", flexShrink: 0 }}>
                  <button onClick={validate} style={{
                    width: "100%", padding: "12px 0", borderRadius: 20, border: "none",
                    background: U.seafoam, color: "#fff",
                    fontSize: 12, fontWeight: 600, letterSpacing: 0.5,
                    cursor: "pointer", transition: "all 0.2s",
                    boxShadow: "0 2px 12px rgba(109,191,168,0.25)",
                  }}>Validate ✓</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── RESULTS PHASE ── */}
      {phase === "results" && scoreResult && (() => {
        // Collect the 3 categories with their hands
        const categories: { key: string; label: string; icon: string; ids: string[]; color: string; bg: string }[] = [];
        if (scoreResult.correct.length > 0)
          categories.push({ key: "correct", label: "Correct", icon: "✅", ids: scoreResult.correct, color: U.seafoam, bg: isDark ? "rgba(109,191,168,0.08)" : "rgba(109,191,168,0.05)" });
        if (scoreResult.wrong.length > 0)
          categories.push({ key: "wrong", label: "Wrong", icon: "❌", ids: scoreResult.wrong, color: U.cherry, bg: isDark ? "rgba(224,48,80,0.08)" : "rgba(224,48,80,0.04)" });
        if (scoreResult.missed.length > 0)
          categories.push({ key: "missed", label: "Missed", icon: "⚠️", ids: scoreResult.missed, color: U.amber, bg: U.amberBg });

        return (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
            animation: "slideUp 0.3s ease both",
          }}>
            {/* Scrollable content area */}
            <div style={{ flex: 1, overflow: "auto", padding: "0 12px" }}>
              {/* Score banner — compact */}
              <div style={{ textAlign: "center", padding: "10px 0 8px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span style={{ fontSize: 28 }}>
                    {scoreResult.score === 100 ? "🎯" : scoreResult.score >= 80 ? "✨" : scoreResult.score >= 50 ? "👍" : "📚"}
                  </span>
                  <div>
                    <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 24, fontWeight: 700, color: scoreResult.score >= 80 ? U.seafoam : scoreResult.score >= 50 ? U.amber : U.cherry, lineHeight: 1 }}>
                      {scoreResult.score}%
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: U.text }}>
                      {scoreResult.score === 100 ? "Perfect!" : scoreResult.score >= 80 ? "Great!" : scoreResult.score >= 50 ? "Good try" : "Keep studying"}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 9, color: U.textLight, marginTop: 4 }}>
                  {puzzle!.correctHandIds.size} possible hand{puzzle!.correctHandIds.size !== 1 ? "s" : ""} for these exposures
                </div>
              </div>

              {/* Horizontal columns: Correct | Wrong | Missed */}
              <div style={{
                display: "grid",
                gridTemplateColumns: categories.map(() => "1fr").join(" "),
                gap: 8,
                marginBottom: 12,
              }}>
                {categories.map(cat => (
                  <div key={cat.key} style={{
                    background: U.cardBg, border: `1px solid ${U.cBorder}`,
                    borderRadius: 12, overflow: "hidden",
                  }}>
                    {/* Column header */}
                    <div style={{
                      padding: "8px 8px 6px", textAlign: "center",
                      borderBottom: `1px solid ${U.cBorder}`,
                      background: cat.bg,
                    }}>
                      <div style={{ fontSize: 14, marginBottom: 2 }}>{cat.icon}</div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: cat.color, textTransform: "uppercase", letterSpacing: 0.8 }}>
                        {cat.label} ({cat.ids.length})
                      </div>
                    </div>
                    {/* Hand list */}
                    <div style={{ padding: "4px 0" }}>
                      {cat.ids.map(id => {
                        const hand = card?.hands.find(h => h.id === id);
                        if (!hand) return null;
                        return (
                          <div key={id} style={{
                            padding: "6px 8px",
                            borderBottom: `0.5px solid ${U.cBorder}`,
                          }}>
                            <ColoredPattern hand={hand} isDark={isDark} fontSize={10} />
                            <div style={{ fontSize: 7, color: U.textLight, marginTop: 2 }}>
                              {SECTION_LABELS[hand.section]} · {hand.points}pts
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pinned action buttons */}
            <div style={{
              padding: "8px 12px 16px", borderTop: `1px solid ${U.cBorder}`,
              background: U.chrome, flexShrink: 0,
              display: "flex", gap: 8,
            }}>
              <button onClick={nextRound} style={{
                flex: 1, padding: "12px 0", borderRadius: 20, border: "none",
                background: U.cherry, color: "#fff", fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s",
              }}>Next Round →</button>
              <button onClick={onBack} style={{
                flex: 1, padding: "12px 0", borderRadius: 20,
                border: `1px solid ${U.btnBorder}`, background: U.btnBg,
                color: U.btnText, fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s",
              }}>← Practice</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
