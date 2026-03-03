// ═══════════════════════════════════════════════════════════════
// MAHJI — Reading Exposures Practice Drill
// File: src/pages/practice/ReadExposuresDrill.tsx
//
// Examine an opponent's exposed melds and identify ALL possible
// hands they could be pursuing from the NMJL card.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef } from "react";
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
    cardBg: "rgba(255,255,255,0.85)", cardShadow: "0 4px 20px rgba(107,63,160,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
    meldBg: "rgba(107,63,160,0.04)", amber: "#b8860b", amberBg: "rgba(234,179,8,0.1)",
    exposureBg: "linear-gradient(135deg, rgba(45,27,78,0.04) 0%, rgba(107,63,160,0.06) 100%)",
  },
  dark: {
    bg: "#1A1225", chrome: "#251545", cBorder: "rgba(180,154,216,0.12)",
    text: "#F0EAF6", textMid: "#B49AD8", textLight: "#7E6A9A",
    cherry: "#FF4D6D", lavDeep: "#B49AD8", seafoam: "#7DD4B8",
    btnBg: "rgba(180,154,216,0.08)", btnBorder: "rgba(180,154,216,0.15)", btnText: "#B49AD8",
    cardBg: "rgba(37,21,69,0.8)", cardShadow: "0 4px 20px rgba(0,0,0,0.25), inset 0 0.5px 0 rgba(255,255,255,0.06)",
    meldBg: "rgba(180,154,216,0.08)", amber: "#e5b84a", amberBg: "rgba(234,179,8,0.12)",
    exposureBg: "linear-gradient(135deg, rgba(37,21,69,0.6) 0%, rgba(60,35,100,0.5) 100%)",
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

  const jokerChance = group.type === "quint" ? 0.9 : 0.25;
  const numJokers = Math.random() < jokerChance ? (group.type === "quint" ? (Math.random() < 0.5 ? 2 : 1) : 1) : 0;

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

// ─── CORRECT MATCHING LOGIC ─────────────────────────────────
// All melds must be checked against the SAME expanded pattern
// and SAME color assignment, and each meld must map to a
// DIFFERENT group. This prevents false positives from
// inconsistent number expansions or color assignments.
// ─────────────────────────────────────────────────────────────

/** Try to assign each meld to a distinct exposable group via backtracking */
function tryAssignMelds(
  melds: ExposedMeld[],
  mi: number,
  groups: { group: TileGroup; idx: number }[],
  assignment: ColorAssignment,
  usedIndices: Set<number>,
): boolean {
  if (mi >= melds.length) return true; // All melds assigned

  const meld = melds[mi];
  const natural = meld.tiles.filter(t => t.suit !== "jokers");

  if (natural.length === 0) {
    // All jokers — can match any unused exposable group
    for (const { idx } of groups) {
      if (usedIndices.has(idx)) continue;
      const next = new Set(usedIndices); next.add(idx);
      if (tryAssignMelds(melds, mi + 1, groups, assignment, next)) return true;
    }
    return false;
  }

  const naturalIds = natural.map(t => t.suit === "flowers" ? "__flower__" : t.id);

  for (const { group, idx } of groups) {
    if (usedIndices.has(idx)) continue;
    const groupIds = resolveGroupToTileIds(group, assignment);
    if (naturalIds.every(id => groupIds.includes(id))) {
      const next = new Set(usedIndices); next.add(idx);
      if (tryAssignMelds(melds, mi + 1, groups, assignment, next)) return true;
    }
  }

  return false;
}

/** Check if ALL melds fit a hand using a consistent (expansion, assignment) */
function allMeldsFitHand(melds: ExposedMeld[], hand: HandDefinition): boolean {
  for (const pattern of hand.patterns) {
    const expanded = expandNumberConstraint(pattern.numberConstraint, pattern);
    for (const ep of expanded) {
      const assignments = enumerateColorAssignments(ep);
      for (const assignment of assignments) {
        const exposableGroups = ep.groups
          .map((g, i) => ({ group: g, idx: i }))
          .filter(({ group: g }) =>
            g.type === "pung" || g.type === "kong" || g.type === "quint" || g.type === "sextet"
          );
        if (tryAssignMelds(melds, 0, exposableGroups, assignment, new Set())) {
          return true;
        }
      }
    }
  }
  return false;
}

/** Get all hands that could match ALL exposed melds consistently */
function getPossibleHands(melds: ExposedMeld[], card: NMJLCard): HandDefinition[] {
  if (melds.length === 0) return card.hands.filter(h => h.exposure === "X");
  return card.hands.filter(hand => {
    if (hand.exposure === "C") return false;
    return allMeldsFitHand(melds, hand);
  });
}

/** Generate a puzzle: pick a hand, expose its melds, find all matching hands */
function generateExposures(card: NMJLCard): Puzzle | null {
  const exposable = card.hands.filter(h => h.exposure === "X");

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

  // Prefer hands with 2+ exposable groups for more interesting puzzles
  const good = candidates.filter(c => c.exposableGroups.length >= 2);
  const pool = good.length >= 5 ? good : candidates;
  const picked = pool[Math.floor(Math.random() * pool.length)];

  const expanded = expandNumberConstraint(picked.pattern.numberConstraint, picked.pattern);
  const ep = expanded[Math.floor(Math.random() * expanded.length)];
  const assignments = enumerateColorAssignments(ep);
  const assignment = assignments[Math.floor(Math.random() * assignments.length)];

  const expGroups = ep.groups.filter(g =>
    g.type === "pung" || g.type === "kong" || g.type === "quint" || g.type === "sextet"
  );
  // Expose 2 groups when possible, 1 otherwise
  const numToExpose = Math.min(expGroups.length, Math.max(1, Math.min(2, expGroups.length)));
  const shuffled = shuffleArray(expGroups);
  const groupsToExpose = shuffled.slice(0, numToExpose);

  const melds: ExposedMeld[] = groupsToExpose.map(group => ({
    tiles: resolveGroupToGameTiles(group, assignment),
    groupType: group.type,
  }));

  const correctHands = getPossibleHands(melds, card);
  const correctHandIds = new Set(correctHands.map(h => h.id));

  return { melds, correctHandIds };
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
  const penalty = wrong.length * 15;
  const score = Math.max(0, Math.round(base - penalty));

  return { score, correct, wrong, missed };
}

// ─── COLORED PATTERN SUB-COMPONENT ───────────────────────────

function ColoredPattern({ hand, isDark, fontSize = 13 }: { hand: HandDefinition; isDark: boolean; fontSize?: number }) {
  const pattern = hand.patterns[0];
  const tokens = hand.displayPattern.split(" ");
  const defaultColor = isDark ? "#F0EAF6" : "#2D1B4E";

  if (!pattern) {
    return <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize, fontWeight: 600, color: defaultColor }}>{hand.displayPattern}</span>;
  }

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
        {i > 0 && <span>{" "}</span>}
        <span style={{ color }}>{token}</span>
      </React.Fragment>
    );
  });

  return (
    <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize, fontWeight: 600, letterSpacing: 1 }}>
      {rendered}
    </span>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────

export default function ReadExposuresDrill({ onBack }: Props) {
  const { isDark } = useTheme();
  const U = uiT[isDark ? "dark" : "light"];
  const scrollRef = useRef<HTMLDivElement>(null);

  const [cardYear, setCardYear] = useState(getCurrentYear());
  const [card, setCard] = useState<NMJLCard | null>(null);
  const [phase, setPhase] = useState<Phase>("setup");

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [activeSection, setActiveSection] = useState<CardSection | null>(null);
  const [selectedHandIds, setSelectedHandIds] = useState<Set<string>>(new Set());
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);

  const years = getAvailableYears();

  useEffect(() => { getCard(cardYear).then(c => { if (c) setCard(c); }); }, [cardYear]);

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

  const nextRound = useCallback(() => {
    setRoundNumber(r => r + 1);
    startGame();
  }, [startGame]);

  const toggleHand = (handId: string) => {
    setSelectedHandIds(prev => {
      const next = new Set(prev);
      if (next.has(handId)) next.delete(handId);
      else next.add(handId);
      return next;
    });
  };

  const validate = useCallback(() => {
    if (!puzzle) return;
    const result = computeScore(selectedHandIds, puzzle.correctHandIds);
    setScoreResult(result);
    setPhase("results");
    // Scroll to top of results
    setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 100);
  }, [puzzle, selectedHandIds]);

  const exposableSections = card
    ? [...new Set(card.hands.filter(h => h.exposure === "X").map(h => h.section))]
        .sort((a, b) => SECTION_ORDER.indexOf(a) - SECTION_ORDER.indexOf(b))
    : [];

  const sectionHands = card && activeSection
    ? card.hands.filter(h => h.section === activeSection && h.exposure === "X")
    : [];

  // ── SETUP SCREEN ──────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div style={{ minHeight: "100dvh", background: U.bg, display: "flex", flexDirection: "column", fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", background: U.chrome, borderBottom: `1px solid ${U.cBorder}` }}>
          <button onClick={onBack} style={{ background: U.btnBg, border: `1px solid ${U.btnBorder}`, borderRadius: 12, padding: "3px 10px", cursor: "pointer", fontSize: 10, color: U.btnText, fontWeight: 600 }}>← Back</button>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, padding: "0 24px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
            <h1 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 24, color: U.cherry, letterSpacing: 3, textTransform: "uppercase", margin: "0 0 8px" }}>
              READING EXPOSURES
            </h1>
            <p style={{ fontSize: 13, color: U.textMid, maxWidth: 300, lineHeight: 1.6, margin: 0 }}>
              Examine an opponent's exposed melds and identify all possible hands they could be pursuing.
            </p>
          </div>

          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: U.textLight, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, textAlign: "center" }}>Card Year</div>
            <div style={{ display: "flex", gap: 8 }}>
              {years.map(y => (
                <div key={y} onClick={() => setCardYear(y)} style={{
                  padding: "10px 28px", borderRadius: 14, cursor: "pointer",
                  background: cardYear === y ? U.cherry : U.btnBg,
                  color: cardYear === y ? "#fff" : U.btnText,
                  border: `1.5px solid ${cardYear === y ? U.cherry : U.btnBorder}`,
                  fontFamily: "'Bodoni Moda',serif", fontSize: 16, fontWeight: 600, transition: "all 0.2s",
                }}>{y}</div>
              ))}
            </div>
          </div>

          <button onClick={() => { setRoundNumber(1); startGame(); }} disabled={!card} style={{
            padding: "14px 56px", borderRadius: 28, border: "none",
            cursor: card ? "pointer" : "not-allowed",
            background: card ? U.seafoam : U.btnBg, color: card ? "#fff" : U.textLight,
            fontSize: 15, fontWeight: 600, transition: "all 0.2s",
            boxShadow: card ? "0 4px 16px rgba(109,191,168,0.3)" : "none",
          }}>{card ? "Start" : "Loading Card..."}</button>
        </div>
      </div>
    );
  }

  // ── PLAYING & RESULTS SCREEN ──────────────────────────────
  return (
    <div style={{ height: "100dvh", background: U.bg, display: "flex", flexDirection: "column", fontFamily: "'Outfit',sans-serif", overflow: "hidden" }}>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: U.chrome, borderBottom: `1px solid ${U.cBorder}`, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: U.btnBg, border: `1px solid ${U.btnBorder}`, borderRadius: 12, padding: "3px 10px", cursor: "pointer", fontSize: 10, color: U.btnText, fontWeight: 600 }}>← Back</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 700, color: U.cherry, letterSpacing: 2 }}>READING EXPOSURES</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9, color: U.textLight }}>{cardYear}</span>
          <span style={{ fontSize: 9, color: U.seafoam, fontWeight: 600 }}>R{roundNumber}</span>
        </div>
      </div>

      {/* Scrollable content area */}
      <div ref={scrollRef} style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>

        {/* ── Exposed Melds ── */}
        {puzzle && (
          <div style={{
            margin: "10px 14px 6px", padding: "16px 18px", borderRadius: 18,
            background: U.exposureBg, border: `1px solid ${U.cBorder}`,
            boxShadow: U.cardShadow,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: U.textLight, textTransform: "uppercase", letterSpacing: 1.5 }}>
                Opponent's Exposures
              </div>
              {puzzle.correctHandIds.size > 0 && phase === "playing" && (
                <div style={{ fontSize: 8, color: U.textLight, fontStyle: "italic" }}>
                  {puzzle.correctHandIds.size} possible hand{puzzle.correctHandIds.size !== 1 ? "s" : ""}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              {puzzle.melds.map((meld, mi) => (
                <div key={mi} style={{
                  display: "inline-flex", gap: 3, padding: "8px 10px",
                  background: U.meldBg, borderRadius: 12,
                  border: `1px solid ${U.cBorder}`,
                  boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.15)" : "0 2px 8px rgba(107,63,160,0.06)",
                }}>
                  {meld.tiles.map((tile, ti) => (
                    <div key={ti} style={{ pointerEvents: "none" }}>
                      <MahjiTile tileId={tile.id} size="md" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PLAYING PHASE ── */}
        {phase === "playing" && (
          <>
            {/* Section pills */}
            <div style={{ padding: "8px 14px 4px", flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: U.textMid, marginBottom: 6, fontWeight: 500 }}>
                {activeSection ? SECTION_LABELS[activeSection] : "Select a section to browse hands"}
              </div>
              <div className="hide-scrollbar" style={{
                display: "flex", gap: 6, overflowX: "auto", padding: "2px 0 8px",
              }}>
                {exposableSections.map(s => {
                  const isActive = activeSection === s;
                  return (
                    <div key={s} onClick={() => setActiveSection(s)} style={{
                      padding: "7px 16px", borderRadius: 20, cursor: "pointer",
                      fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0,
                      background: isActive ? U.cherry : U.btnBg,
                      color: isActive ? "#fff" : U.btnText,
                      border: `1.5px solid ${isActive ? U.cherry : U.btnBorder}`,
                      transition: "all 0.2s",
                      boxShadow: isActive ? "0 2px 8px rgba(224,48,80,0.2)" : "none",
                    }}>{SECTION_LABELS[s]}</div>
                  );
                })}
              </div>
            </div>

            {/* Hand list */}
            {activeSection ? (
              <div style={{ padding: "0 14px 12px", animation: "fadeIn 0.2s ease both" }}>
                <div style={{
                  background: U.cardBg, border: `1px solid ${U.cBorder}`,
                  borderRadius: 16, overflow: "hidden", boxShadow: U.cardShadow,
                }}>
                  {sectionHands.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 24, fontSize: 12, color: U.textLight }}>No exposable hands in this section</div>
                  ) : (
                    sectionHands.map((hand, i) => {
                      const isSelected = selectedHandIds.has(hand.id);
                      return (
                        <div key={hand.id} onClick={() => toggleHand(hand.id)} style={{
                          display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                          cursor: "pointer",
                          background: isSelected ? (isDark ? "rgba(109,191,168,0.1)" : "rgba(109,191,168,0.06)") : "transparent",
                          borderBottom: i < sectionHands.length - 1 ? `0.5px solid ${U.cBorder}` : "none",
                          transition: "background 0.15s",
                        }}>
                          <div style={{ flex: 1 }}>
                            <ColoredPattern hand={hand} isDark={isDark} />
                            <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
                              <span style={{ fontSize: 9, color: U.textLight }}>{hand.points} pts</span>
                              <span style={{ fontSize: 9, color: U.textLight }}>·</span>
                              <span style={{ fontSize: 8, color: U.seafoam, fontWeight: 600 }}>
                                {hand.exposure === "X" ? "Exposed" : "Concealed"}
                              </span>
                            </div>
                          </div>
                          <div style={{
                            width: 34, height: 34, borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: isSelected ? U.seafoam : "transparent",
                            border: `2px solid ${isSelected ? U.seafoam : U.btnBorder}`,
                            color: isSelected ? "#fff" : U.btnText,
                            fontSize: 18, fontWeight: 700, flexShrink: 0,
                            transition: "all 0.15s",
                          }}>
                            {isSelected ? "✓" : "+"}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", minHeight: 120 }}>
                <div style={{ textAlign: "center", opacity: 0.6 }}>
                  <div style={{ fontSize: 11, color: U.textMid }}>Choose a section above to see hands</div>
                </div>
              </div>
            )}

            {/* Selected hands tray */}
            {selectedHandIds.size > 0 && (
              <div style={{ padding: "0 14px 8px", animation: "fadeIn 0.15s ease both" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: U.text, marginBottom: 6 }}>
                  Your Selections ({selectedHandIds.size})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {[...selectedHandIds].map(id => {
                    const hand = card?.hands.find(h => h.id === id);
                    if (!hand) return null;
                    return (
                      <div key={id} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                        background: isDark ? "rgba(109,191,168,0.08)" : "rgba(109,191,168,0.05)",
                        borderRadius: 12, border: `1px solid ${isDark ? "rgba(109,191,168,0.18)" : "rgba(109,191,168,0.12)"}`,
                      }}>
                        <span style={{ fontSize: 14, flexShrink: 0 }}>✓</span>
                        <div style={{ flex: 1 }}>
                          <ColoredPattern hand={hand} isDark={isDark} fontSize={11} />
                        </div>
                        <span style={{ fontSize: 8, color: U.textLight }}>{SECTION_LABELS[hand.section]}</span>
                        <div onClick={(e) => { e.stopPropagation(); toggleHand(id); }} style={{
                          width: 24, height: 24, borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: "rgba(224,48,80,0.08)", border: "1px solid rgba(224,48,80,0.2)",
                          color: U.cherry, fontSize: 14, fontWeight: 700, cursor: "pointer",
                        }}>×</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Spacer to ensure bottom button is reachable */}
            <div style={{ minHeight: 80 }} />
          </>
        )}

        {/* ── RESULTS PHASE ── */}
        {phase === "results" && scoreResult && (
          <div style={{ padding: "0 14px 24px", animation: "slideUp 0.3s ease both" }}>
            {/* Score */}
            <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
              <div style={{ fontSize: 40, marginBottom: 6 }}>
                {scoreResult.score === 100 ? "🎯" : scoreResult.score >= 80 ? "✨" : scoreResult.score >= 50 ? "👍" : "📚"}
              </div>
              <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 32, fontWeight: 700, color: scoreResult.score >= 80 ? U.seafoam : scoreResult.score >= 50 ? U.amber : U.cherry }}>
                {scoreResult.score}%
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: U.text, marginTop: 4 }}>
                {scoreResult.score === 100 ? "Perfect!" : scoreResult.score >= 80 ? "Great!" : scoreResult.score >= 50 ? "Good try" : "Keep studying"}
              </div>
              <div style={{ fontSize: 10, color: U.textLight, marginTop: 6 }}>
                {puzzle!.correctHandIds.size} possible hand{puzzle!.correctHandIds.size !== 1 ? "s" : ""} for these exposures
              </div>
            </div>

            {/* Results breakdown */}
            <div style={{
              background: U.cardBg, border: `1px solid ${U.cBorder}`,
              borderRadius: 16, overflow: "hidden", marginBottom: 16, boxShadow: U.cardShadow,
            }}>
              {/* Correct */}
              {scoreResult.correct.length > 0 && (
                <>
                  <div style={{ fontSize: 9, fontWeight: 600, color: U.seafoam, padding: "12px 16px 6px", textTransform: "uppercase", letterSpacing: 1 }}>
                    ✅ Correct ({scoreResult.correct.length})
                  </div>
                  {scoreResult.correct.map(id => {
                    const hand = card?.hands.find(h => h.id === id);
                    if (!hand) return null;
                    return (
                      <div key={id} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                        background: isDark ? "rgba(109,191,168,0.06)" : "rgba(109,191,168,0.04)",
                        borderBottom: `0.5px solid ${U.cBorder}`,
                      }}>
                        <div style={{ flex: 1 }}><ColoredPattern hand={hand} isDark={isDark} fontSize={12} /></div>
                        <span style={{ fontSize: 9, color: U.textLight }}>{SECTION_LABELS[hand.section]}</span>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Wrong */}
              {scoreResult.wrong.length > 0 && (
                <>
                  <div style={{ fontSize: 9, fontWeight: 600, color: U.cherry, padding: "12px 16px 6px", textTransform: "uppercase", letterSpacing: 1 }}>
                    ❌ Wrong ({scoreResult.wrong.length})
                  </div>
                  {scoreResult.wrong.map(id => {
                    const hand = card?.hands.find(h => h.id === id);
                    if (!hand) return null;
                    return (
                      <div key={id} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                        background: isDark ? "rgba(224,48,80,0.06)" : "rgba(224,48,80,0.03)",
                        borderBottom: `0.5px solid ${U.cBorder}`,
                      }}>
                        <div style={{ flex: 1 }}><ColoredPattern hand={hand} isDark={isDark} fontSize={12} /></div>
                        <span style={{ fontSize: 9, color: U.textLight }}>{SECTION_LABELS[hand.section]}</span>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Missed */}
              {scoreResult.missed.length > 0 && (
                <>
                  <div style={{ fontSize: 9, fontWeight: 600, color: U.amber, padding: "12px 16px 6px", textTransform: "uppercase", letterSpacing: 1 }}>
                    ⚠️ Missed ({scoreResult.missed.length})
                  </div>
                  {scoreResult.missed.map(id => {
                    const hand = card?.hands.find(h => h.id === id);
                    if (!hand) return null;
                    return (
                      <div key={id} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                        background: U.amberBg,
                        borderBottom: `0.5px solid ${U.cBorder}`,
                      }}>
                        <div style={{ flex: 1 }}><ColoredPattern hand={hand} isDark={isDark} fontSize={12} /></div>
                        <span style={{ fontSize: 9, color: U.textLight }}>{SECTION_LABELS[hand.section]}</span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={nextRound} style={{
                flex: 1, padding: "14px 0", borderRadius: 24, border: "none",
                background: U.cherry, color: "#fff", fontSize: 14, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: "0 4px 16px rgba(224,48,80,0.25)",
              }}>Next Round →</button>
              <button onClick={onBack} style={{
                padding: "14px 20px", borderRadius: 24,
                border: `1.5px solid ${U.btnBorder}`, background: U.btnBg,
                color: U.btnText, fontSize: 14, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s",
              }}>←</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky Validate Button (playing phase only) ── */}
      {phase === "playing" && (
        <div style={{
          padding: "10px 14px 16px", borderTop: `1px solid ${U.cBorder}`,
          background: U.chrome, flexShrink: 0,
          boxShadow: isDark ? "0 -4px 16px rgba(0,0,0,0.2)" : "0 -4px 16px rgba(107,63,160,0.06)",
        }}>
          <button onClick={validate} disabled={selectedHandIds.size === 0} style={{
            width: "100%", padding: "14px 0", borderRadius: 24, border: "none",
            background: selectedHandIds.size > 0 ? U.seafoam : U.btnBg,
            color: selectedHandIds.size > 0 ? "#fff" : U.textLight,
            fontSize: 15, fontWeight: 600, letterSpacing: 0.5,
            cursor: selectedHandIds.size > 0 ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            boxShadow: selectedHandIds.size > 0 ? "0 4px 16px rgba(109,191,168,0.3)" : "none",
          }}>
            {selectedHandIds.size > 0 ? `Validate ${selectedHandIds.size} Selection${selectedHandIds.size !== 1 ? "s" : ""} ✓` : "Select hands to validate"}
          </button>
        </div>
      )}
    </div>
  );
}
