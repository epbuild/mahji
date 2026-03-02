// ═══════════════════════════════════════════════════════════════
// MAHJI — Reading Exposures Practice Drill
// File: src/pages/practice/ReadExposuresDrill.tsx
//
// The player watches bot opponents expose melds and must
// deduce which hand each bot is pursuing from the NMJL card.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from "react";
import { MahjiTile } from "../../components/tiles/MahjiTile";
import { GameTile, getFullDeck } from "../../data/tileData";
import { C, getThemeColors } from "../../constants/colors";
import { useTheme } from "../../constants/ThemeContext";
import {
  getCard, getAvailableYears, getCurrentYear,
  expandNumberConstraint, enumerateColorAssignments,
  resolveGroupToTileIds,
  SECTION_LABELS, SECTION_ORDER,
} from "../../data/nmjl";
import type {
  NMJLCard, HandDefinition, HandPattern, TileGroup,
  ColorAssignment, CardSection,
} from "../../data/nmjl";

// ─── TYPES ────────────────────────────────────────────────────

interface Props { onBack: () => void; }

type Phase = "setup" | "playing" | "guessing" | "reveal" | "complete";
type Level = "intermediate" | "advanced";

interface ExposedMeld {
  tiles: GameTile[];
  groupType: string;
  round: number;
}

interface BotPlayer {
  name: string;
  targetHand: HandDefinition;
  targetPattern: HandPattern;
  targetAssignment: ColorAssignment;
  resolvedTileIds: string[];
  exposedMelds: ExposedMeld[];
  exposableGroups: TileGroup[]; // groups that CAN be exposed (pung/kong/quint)
  nextExposeIdx: number; // which group to expose next
  isRevealed: boolean;
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

const BOT_NAMES = ["South", "West", "North"];

// ─── HELPERS ──────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick hands for bots. For intermediate, pick distinctive hands. For advanced, pick ambiguous ones. */
function pickBotHands(card: NMJLCard, level: Level): BotPlayer[] {
  // Only exposable hands
  const exposable = card.hands.filter(h => h.exposure === "X");

  // Group by section for variety
  const bySection = new Map<string, HandDefinition[]>();
  for (const h of exposable) {
    if (!bySection.has(h.section)) bySection.set(h.section, []);
    bySection.get(h.section)!.push(h);
  }

  // For each hand, compute how many exposable groups it has and how distinctive they are
  const scored = exposable.map(hand => {
    let exposableGroupCount = 0;
    const pattern = hand.patterns[0];
    if (!pattern) return { hand, score: 0, exposableGroupCount: 0 };
    for (const g of pattern.groups) {
      if (g.type === "pung" || g.type === "kong" || g.type === "quint" || g.type === "sextet") {
        exposableGroupCount++;
      }
    }
    // For intermediate: prefer hands with distinctive groups (quints, specific dragons, etc.)
    // For advanced: prefer hands with generic groups (common pungs)
    let score = exposableGroupCount;
    if (level === "intermediate") {
      // Boost hands with quints, dragons, winds — they're distinctive
      for (const g of pattern.groups) {
        if (g.type === "quint") score += 3;
        if (g.tiles.some(t => t.kind === "dragon" || t.kind === "wind")) score += 2;
      }
    } else {
      // For advanced: prefer hands with plain suited groups (harder to narrow)
      for (const g of pattern.groups) {
        if (g.tiles.every(t => t.kind === "suited")) score += 2;
      }
    }
    return { hand, score, exposableGroupCount };
  }).filter(s => s.exposableGroupCount >= 1);

  // Sort: intermediate picks highest score, advanced picks lowest
  scored.sort((a, b) => level === "intermediate" ? b.score - a.score : a.score - b.score);

  // Pick 3 from different sections
  const picked: BotPlayer[] = [];
  const usedSections = new Set<string>();

  for (const { hand } of scored) {
    if (picked.length >= 3) break;
    if (usedSections.has(hand.section)) continue;

    const pattern = hand.patterns[0];
    const expanded = expandNumberConstraint(pattern.numberConstraint, pattern);
    const ep = expanded[Math.floor(Math.random() * expanded.length)];
    const assignments = enumerateColorAssignments(ep);
    const assignment = assignments[Math.floor(Math.random() * assignments.length)];

    const resolvedTileIds = ep.groups.flatMap(g => resolveGroupToTileIds(g, assignment));
    const exposableGroups = ep.groups.filter(g =>
      g.type === "pung" || g.type === "kong" || g.type === "quint" || g.type === "sextet"
    );

    // For intermediate: sort distinctive first. For advanced: sort ambiguous first.
    const orderedGroups = level === "intermediate"
      ? [...exposableGroups].sort((a, b) => {
          const aDistinct = a.tiles.some(t => t.kind === "dragon" || t.kind === "wind") ? -1 : a.type === "quint" ? -1 : 0;
          const bDistinct = b.tiles.some(t => t.kind === "dragon" || t.kind === "wind") ? -1 : b.type === "quint" ? -1 : 0;
          return aDistinct - bDistinct;
        })
      : [...exposableGroups].sort((a, b) => {
          const aAmbig = a.tiles.every(t => t.kind === "suited") ? -1 : 0;
          const bAmbig = b.tiles.every(t => t.kind === "suited") ? -1 : 0;
          return aAmbig - bAmbig;
        });

    picked.push({
      name: BOT_NAMES[picked.length],
      targetHand: hand,
      targetPattern: ep,
      targetAssignment: assignment,
      resolvedTileIds,
      exposedMelds: [],
      exposableGroups: orderedGroups,
      nextExposeIdx: 0,
      isRevealed: false,
    });
    usedSections.add(hand.section);
  }

  // If we couldn't get 3 from different sections, fill from any
  if (picked.length < 3) {
    for (const { hand } of scored) {
      if (picked.length >= 3) break;
      if (picked.some(p => p.targetHand.id === hand.id)) continue;

      const pattern = hand.patterns[0];
      const expanded = expandNumberConstraint(pattern.numberConstraint, pattern);
      const ep = expanded[Math.floor(Math.random() * expanded.length)];
      const assignments = enumerateColorAssignments(ep);
      const assignment = assignments[Math.floor(Math.random() * assignments.length)];

      const resolvedTileIds = ep.groups.flatMap(g => resolveGroupToTileIds(g, assignment));
      const exposableGroups = ep.groups.filter(g =>
        g.type === "pung" || g.type === "kong" || g.type === "quint" || g.type === "sextet"
      );

      picked.push({
        name: BOT_NAMES[picked.length],
        targetHand: hand,
        targetPattern: ep,
        targetAssignment: assignment,
        resolvedTileIds,
        exposedMelds: [],
        exposableGroups,
        nextExposeIdx: 0,
        isRevealed: false,
      });
    }
  }

  return picked;
}

/** Resolve a group to GameTile instances, possibly with joker substitutions */
function resolveGroupToGameTiles(group: TileGroup, assignment: ColorAssignment): GameTile[] {
  const deck = getFullDeck();
  const tileIds = resolveGroupToTileIds(group, assignment);
  const used = new Set<string>();
  const tiles: GameTile[] = [];

  // Maybe add jokers for realism
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

/** Check if an exposed meld could belong to a hand */
function meldFitsHand(meld: ExposedMeld, hand: HandDefinition): boolean {
  const naturalTiles = meld.tiles.filter(t => t.suit !== "jokers");
  if (naturalTiles.length === 0) return true; // All jokers — could be anything

  for (const pattern of hand.patterns) {
    const expanded = expandNumberConstraint(pattern.numberConstraint, pattern);
    for (const ep of expanded) {
      const assignments = enumerateColorAssignments(ep);
      for (const assignment of assignments) {
        for (const group of ep.groups) {
          if (group.type !== "pung" && group.type !== "kong" && group.type !== "quint" && group.type !== "sextet") continue;
          const groupIds = resolveGroupToTileIds(group, assignment);
          const naturalIds = naturalTiles.map(t => t.suit === "flowers" ? "__flower__" : t.id);
          if (naturalIds.every(id => groupIds.includes(id))) return true;
        }
      }
    }
  }
  return false;
}

/** Get all hands that could match ALL exposed melds for a bot */
function getPossibleHands(melds: ExposedMeld[], card: NMJLCard): HandDefinition[] {
  if (melds.length === 0) return card.hands.filter(h => h.exposure === "X");
  return card.hands.filter(hand => {
    if (hand.exposure === "C") return false;
    return melds.every(meld => meldFitsHand(meld, hand));
  });
}

// ─── MAIN COMPONENT ───────────────────────────────────────────

export default function ReadExposuresDrill({ onBack }: Props) {
  const { isDark } = useTheme();
  const U = uiT[isDark ? "dark" : "light"];
  const [matIdx, setMatIdx] = useState(0);
  const mat = MATS[matIdx];

  const [cardYear, setCardYear] = useState(getCurrentYear());
  const [card, setCard] = useState<NMJLCard | null>(null);
  const [level, setLevel] = useState<Level>("intermediate");
  const [phase, setPhase] = useState<Phase>("setup");

  const [bots, setBots] = useState<BotPlayer[]>([]);
  const [round, setRound] = useState(0);
  const [maxRounds, setMaxRounds] = useState(5);

  // Guessing state
  const [guessingBotIdx, setGuessingBotIdx] = useState(0);
  const [selectedGuesses, setSelectedGuesses] = useState<Set<string>>(new Set());
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [results, setResults] = useState<Array<{ botIdx: number; correct: boolean; score: number }>>([]);
  const [timer, setTimer] = useState(0);

  const years = getAvailableYears();

  useEffect(() => { getCard(cardYear).then(c => { if (c) setCard(c); }); }, [cardYear]);

  // Start game
  const startGame = useCallback(() => {
    if (!card) return;
    const botPlayers = pickBotHands(card, level);
    setBots(botPlayers);
    setRound(0);
    setMaxRounds(level === "intermediate" ? 5 : 3);
    setPhase("playing");
    setResults([]);
    setGuessingBotIdx(0);
    setSelectedGuesses(new Set());
    setSectionFilter("all");
  }, [card, level]);

  // Expose next meld
  const exposeNext = useCallback(() => {
    if (round >= maxRounds) return;
    const newRound = round + 1;

    setBots(prev => {
      const next = [...prev];
      // Cycle through bots: round 1 → bot 0, round 2 → bot 1, etc.
      const botIdx = (newRound - 1) % next.length;
      const bot = { ...next[botIdx] };

      if (bot.nextExposeIdx < bot.exposableGroups.length) {
        const group = bot.exposableGroups[bot.nextExposeIdx];
        const tiles = resolveGroupToGameTiles(group, bot.targetAssignment);
        bot.exposedMelds = [...bot.exposedMelds, { tiles, groupType: group.type, round: newRound }];
        bot.nextExposeIdx++;
      }

      next[botIdx] = bot;
      return next;
    });

    setRound(newRound);
  }, [round, maxRounds]);

  // Start guessing
  const startGuessing = useCallback(() => {
    setPhase("guessing");
    setGuessingBotIdx(0);
    setSelectedGuesses(new Set());
    setSectionFilter("all");
    if (level === "advanced") setTimer(60);
  }, [level]);

  // Submit guess for current bot
  const submitGuess = useCallback(() => {
    const bot = bots[guessingBotIdx];
    const correct = selectedGuesses.has(bot.targetHand.id);
    const speedBonus = Math.max(0, (maxRounds - round) * 15);
    const precisionBonus = selectedGuesses.size === 1 ? 50 : selectedGuesses.size <= 3 ? 25 : 10;
    const score = correct ? 100 + speedBonus + precisionBonus : 0;

    setResults(prev => [...prev, { botIdx: guessingBotIdx, correct, score }]);

    // Reveal this bot
    setBots(prev => prev.map((b, i) => i === guessingBotIdx ? { ...b, isRevealed: true } : b));

    if (guessingBotIdx < bots.length - 1) {
      // Next bot
      setGuessingBotIdx(guessingBotIdx + 1);
      setSelectedGuesses(new Set());
      setSectionFilter("all");
      if (level === "advanced") setTimer(60);
    } else {
      setPhase("complete");
    }
  }, [bots, guessingBotIdx, selectedGuesses, maxRounds, round, level]);

  // Advanced timer
  useEffect(() => {
    if (level !== "advanced" || phase !== "guessing") return;
    if (timer <= 0) { submitGuess(); return; }
    const iv = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(iv);
  }, [timer, phase, level]);

  // Toggle hand selection
  const toggleGuess = (handId: string) => {
    setSelectedGuesses(prev => {
      const next = new Set(prev);
      if (next.has(handId)) next.delete(handId);
      else next.add(handId);
      return next;
    });
  };

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);

  // ── SETUP SCREEN ──
  if (phase === "setup") {
    return (
      <div style={{ minHeight: "100vh", background: U.bg, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", background: U.chrome, borderBottom: `1px solid ${U.cBorder}` }}>
          <button onClick={onBack} style={{ background: U.btnBg, border: `1px solid ${U.btnBorder}`, borderRadius: 12, padding: "3px 10px", cursor: "pointer", fontSize: 10, color: U.btnText, fontWeight: 600 }}>← Back</button>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "0 24px" }}>
          <h1 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 22, color: U.cherry, letterSpacing: 3, textTransform: "uppercase", textAlign: "center", margin: 0 }}>
            READING EXPOSURES
          </h1>
          <p style={{ fontSize: 12, color: U.textMid, textAlign: "center", maxWidth: 300, lineHeight: 1.6, margin: 0 }}>
            Watch your opponents expose melds and figure out which hand they're going for.
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

          {/* Level */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: U.textLight, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, textAlign: "center" }}>Difficulty</div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["intermediate", "advanced"] as const).map(l => (
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

          {/* Mat */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: U.textLight, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, textAlign: "center" }}>Mat Color</div>
            <div style={{ display: "flex", gap: 8 }}>
              {MATS.map((m, i) => (
                <div key={m.id} onClick={() => setMatIdx(i)} style={{
                  width: 28, height: 28, borderRadius: 8, background: m.bg, cursor: "pointer",
                  outline: matIdx === i ? `2px solid ${U.seafoam}` : "2px solid transparent",
                  outlineOffset: 2,
                }} />
              ))}
            </div>
          </div>

          <button onClick={startGame} disabled={!card} style={{
            padding: "12px 48px", borderRadius: 24, border: "none",
            cursor: card ? "pointer" : "not-allowed",
            background: card ? U.seafoam : U.btnBg, color: card ? "#fff" : U.textLight,
            fontSize: 14, fontWeight: 600, marginTop: 8, transition: "all 0.2s",
          }}>{card ? "Start Game" : "Loading Card..."}</button>
        </div>
      </div>
    );
  }

  // ── Possible hands for current bot being guessed ──
  const currentBot = bots[guessingBotIdx];
  const possibleHands = phase === "guessing" && card && currentBot
    ? getPossibleHands(currentBot.exposedMelds, card)
    : [];

  const filteredHands = sectionFilter === "all"
    ? possibleHands
    : possibleHands.filter(h => h.section === sectionFilter);

  const activeSections = [...new Set(possibleHands.map(h => h.section))];

  // ── PLAYING / GUESSING / COMPLETE SCREEN ──
  return (
    <div style={{ minHeight: "100vh", background: U.bg, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: U.chrome, borderBottom: `1px solid ${U.cBorder}` }}>
        <button onClick={onBack} style={{ background: U.btnBg, border: `1px solid ${U.btnBorder}`, borderRadius: 12, padding: "3px 10px", cursor: "pointer", fontSize: 10, color: U.btnText, fontWeight: 600 }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, color: U.textLight }}>{cardYear} · {level === "intermediate" ? "Int" : "Adv"}</span>
          {MATS.map((m, i) => (
            <div key={m.id} onClick={() => setMatIdx(i)} style={{
              width: 14, height: 14, borderRadius: "50%", background: m.bg, cursor: "pointer",
              border: i === matIdx ? `2px solid ${U.cherry}` : `1px solid ${U.cBorder}`,
            }} />
          ))}
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", padding: "8px 14px 4px" }}>
        <h1 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 17, fontWeight: 700, color: U.cherry, letterSpacing: 3, margin: 0 }}>READING EXPOSURES</h1>
        <p style={{ fontSize: 9, color: U.textMid, margin: "2px 0 0" }}>
          {phase === "playing" ? `Round ${round}/${maxRounds}` : phase === "guessing" ? `Guessing: ${currentBot?.name}` : "Results"}
        </p>
      </div>

      {/* ── Opponents Board ── */}
      <div style={{ margin: "4px 8px", background: mat.bg, borderRadius: 14, padding: "12px", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.15)" }}>
        {bots.map((bot, bi) => (
          <div key={bi} style={{
            marginBottom: bi < bots.length - 1 ? 10 : 0,
            opacity: phase === "guessing" && bi !== guessingBotIdx && !bot.isRevealed ? 0.4 : 1,
            transition: "opacity 0.3s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: "rgba(109,191,168,0.35)", padding: "2px 8px", borderRadius: 6 }}>{bot.name}</span>
              {bot.isRevealed && (
                <span style={{ fontSize: 8, color: results[bi]?.correct ? "#6DBFA8" : "#E03050", fontWeight: 600 }}>
                  {results[bi]?.correct ? "✓ Correct!" : "✗ Wrong"}
                </span>
              )}
              {bot.isRevealed && (
                <span style={{ fontSize: 8, color: mat.text, fontStyle: "italic" }}>
                  {bot.targetHand.displayPattern} ({SECTION_LABELS[bot.targetHand.section]})
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {bot.exposedMelds.length === 0 ? (
                <span style={{ fontSize: 9, color: mat.text, fontStyle: "italic" }}>No exposures yet</span>
              ) : (
                bot.exposedMelds.map((meld, mi) => (
                  <div key={mi} style={{
                    display: "inline-flex", gap: 2, padding: "3px 4px",
                    background: "rgba(255,255,255,0.08)", borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}>
                    {meld.tiles.map((tile, ti) => (
                      <div key={ti} style={{ pointerEvents: "none" }}>
                        <MahjiTile tileId={tile.id} size="sm" />
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Playing Controls ── */}
      {phase === "playing" && (
        <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: "10px 14px" }}>
          {round < maxRounds && (
            <button onClick={exposeNext} style={{
              padding: "8px 24px", borderRadius: 18, border: "none",
              background: U.cherry, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>Next Exposure →</button>
          )}
          <button onClick={startGuessing} disabled={round === 0} style={{
            padding: "8px 24px", borderRadius: 18, border: `1px solid ${U.btnBorder}`,
            background: round === 0 ? U.btnBg : U.seafoam,
            color: round === 0 ? U.textLight : "#fff",
            fontSize: 12, fontWeight: 600, cursor: round === 0 ? "not-allowed" : "pointer",
          }}>Make Your Guesses</button>
        </div>
      )}

      {/* ── Guessing Panel ── */}
      {phase === "guessing" && card && currentBot && (
        <div style={{ flex: 1, padding: "6px 10px", overflow: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: U.text }}>What is {currentBot.name} going for?</span>
            {level === "advanced" && timer > 0 && (
              <span style={{ fontSize: 10, fontWeight: 700, color: timer <= 10 ? U.cherry : U.seafoam }}>⏱ {timer}s</span>
            )}
          </div>

          {/* Section filter */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
            <div onClick={() => setSectionFilter("all")} style={{
              padding: "3px 8px", borderRadius: 10, cursor: "pointer", fontSize: 8, fontWeight: 600,
              background: sectionFilter === "all" ? U.cherry : U.btnBg,
              color: sectionFilter === "all" ? "#fff" : U.btnText,
              border: `1px solid ${sectionFilter === "all" ? U.cherry : U.btnBorder}`,
            }}>All ({possibleHands.length})</div>
            {activeSections.map(s => (
              <div key={s} onClick={() => setSectionFilter(s)} style={{
                padding: "3px 8px", borderRadius: 10, cursor: "pointer", fontSize: 8, fontWeight: 600,
                background: sectionFilter === s ? U.cherry : U.btnBg,
                color: sectionFilter === s ? "#fff" : U.btnText,
                border: `1px solid ${sectionFilter === s ? U.cherry : U.btnBorder}`,
              }}>{SECTION_LABELS[s as CardSection] || s}</div>
            ))}
          </div>

          {/* Hand list */}
          <div style={{
            background: isDark ? "rgba(180,154,216,0.04)" : "rgba(107,63,160,0.02)",
            border: `0.5px solid ${U.cBorder}`, borderRadius: 12, overflow: "hidden",
          }}>
            {filteredHands.map((hand, i) => {
              const checked = selectedGuesses.has(hand.id);
              return (
                <div key={hand.id} onClick={() => toggleGuess(hand.id)} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                  cursor: "pointer", background: checked ? (isDark ? "rgba(109,191,168,0.1)" : "rgba(109,191,168,0.06)") : "transparent",
                  borderBottom: i < filteredHands.length - 1 ? `0.5px solid ${U.cBorder}` : "none",
                  transition: "background 0.15s",
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                    border: checked ? `2px solid ${U.seafoam}` : `1.5px solid ${U.cBorder}`,
                    background: checked ? U.seafoam : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}>
                    {checked && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 11, color: U.text, fontWeight: 500 }}>{hand.displayPattern}</div>
                    {level === "intermediate" && (
                      <div style={{ fontSize: 8, color: U.textLight }}>{SECTION_LABELS[hand.section]}</div>
                    )}
                  </div>
                  <span style={{ fontSize: 8, color: U.textLight }}>{hand.points}pts</span>
                  {hand.exposure === "C" && <span style={{ fontSize: 7, color: U.cherry, fontWeight: 600 }}>C</span>}
                </div>
              );
            })}
            {filteredHands.length === 0 && (
              <div style={{ textAlign: "center", padding: 16, fontSize: 11, color: U.textLight }}>No hands match this filter</div>
            )}
          </div>

          {/* Elimination hint (intermediate only) */}
          {level === "intermediate" && currentBot.exposedMelds.length > 0 && (
            <div style={{ fontSize: 9, color: U.textMid, fontStyle: "italic", textAlign: "center", padding: "6px 0" }}>
              {card.hands.filter(h => h.exposure === "X").length - possibleHands.length} hands eliminated based on exposures
            </div>
          )}

          {/* Submit */}
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
            <button onClick={submitGuess} disabled={selectedGuesses.size === 0} style={{
              padding: "10px 32px", borderRadius: 20, border: "none",
              background: selectedGuesses.size > 0 ? U.seafoam : U.btnBg,
              color: selectedGuesses.size > 0 ? "#fff" : U.textLight,
              fontSize: 12, fontWeight: 600, cursor: selectedGuesses.size > 0 ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}>Submit Guess for {currentBot.name}</button>
          </div>
        </div>
      )}

      {/* ── Complete Screen ── */}
      {phase === "complete" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", gap: 16 }}>
          <div style={{ fontSize: 36 }}>🎯</div>
          <h2 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 20, color: U.cherry, letterSpacing: 2, margin: 0 }}>
            {results.every(r => r.correct) ? "Perfect!" : results.some(r => r.correct) ? "Nice Work!" : "Keep Practicing!"}
          </h2>

          <div style={{
            background: isDark ? "rgba(180,154,216,0.06)" : "rgba(107,63,160,0.04)",
            border: `0.5px solid ${U.cBorder}`, borderRadius: 14, padding: "16px 20px", width: "100%", maxWidth: 300,
          }}>
            {results.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: i < results.length - 1 ? `0.5px solid ${U.cBorder}` : "none" }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: U.text }}>{bots[r.botIdx]?.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10, color: r.correct ? U.seafoam : U.cherry, fontWeight: 600 }}>{r.correct ? "✓" : "✗"}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: U.text }}>{r.score}</span>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, marginTop: 6, borderTop: `1px solid ${U.cBorder}` }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: U.text }}>Total</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: U.cherry }}>{totalScore}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setPhase("setup")} style={{
              padding: "10px 24px", borderRadius: 20, border: "none",
              background: U.cherry, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>Play Again</button>
            <button onClick={onBack} style={{
              padding: "10px 24px", borderRadius: 20, border: `1px solid ${U.btnBorder}`,
              background: U.btnBg, color: U.btnText, fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>← Practice</button>
          </div>
        </div>
      )}
    </div>
  );
}
