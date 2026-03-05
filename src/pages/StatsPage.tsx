// ═══════════════════════════════════════════════════════════════
// MAHJI — Stats Page
// File: src/pages/StatsPage.tsx
//
// Player statistics dashboard: game overview, speed, points,
// winning lines by section, mahji style, and activity calendar.
// All data is currently mock — structured for easy swap to real.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useMemo, useEffect } from 'react';
import { getThemeColors, FONT_SERIF, FONT_SANS } from '../constants/colors';
import { useTheme } from '../constants/ThemeContext';
import { PT, Cnt } from '../components/Layout';
import { SECTION_LABELS, SECTION_ORDER, getAvailableYears, getCurrentYear, getCard } from '../data/nmjl';
import type { CardSection, NMJLCard, HandDefinition, HandPattern, CardColor } from '../data/nmjl';

// ─── TYPES ──────────────────────────────────────────────────

type TimePeriod = 'all_time' | 'last_week' | 'last_month' | 'last_year';

interface GameOverviewStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  wallGames: number;
}

interface SpeedStats {
  avgGameDurationMin: number;
  avgCharlestonThinkSec: number;
  avgGameplayThinkSec: number;
}

interface PointsStats {
  overall: number;
  earned: number;
  deducted: number;
  avgPerGame: number;
  deadHands: number;
}

interface HandLineWin {
  pattern: string;       // matches HandDefinition.displayPattern
  points: number;
  timesWon: number;
}

interface SectionWinData {
  section: CardSection;
  wins: number;
  lines: HandLineWin[];
}

interface PlayerStyle {
  archetype: string;
  tagline: string;
  engagement: string;
  favoredSection: string;
  exposures: string;
  speed: string;
}

interface CalendarDay {
  date: string;
  gamesPlayed: number;
}

interface StatsData {
  overview: GameOverviewStats;
  speed: SpeedStats;
  points: PointsStats;
  sectionWins: SectionWinData[];
  style: PlayerStyle;
  calendar: CalendarDay[];
  currentStreak: number;
  longestStreak: number;
}

// ─── COLORED PATTERN (inline, same logic as LearnHandsDrill) ─

const CARD_COLOR_HEX: Record<CardColor, string> = {
  red: "#C2413B", green: "#2E8B57", blue: "#4A7FA8",
};
const OPERATOR_TOKENS = new Set(["+", "=", "x", "or", "OR", "-or-"]);

function ColoredPattern({ hand, isDark, fontSize = 11 }: { hand: HandDefinition; isDark: boolean; fontSize?: number }) {
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
    return <span style={{ fontFamily: FONT_SERIF, fontSize, fontWeight: 600, color: defaultColor }}>{hand.displayPattern}</span>;
  }

  const orParts = hand.displayPattern.split(" -or- ");
  if (orParts.length >= 2 && hand.patterns.length >= orParts.length) {
    return (
      <div style={{ fontFamily: FONT_SERIF, fontSize, fontWeight: 600, letterSpacing: 0.5 }}>
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
    <span style={{ fontFamily: FONT_SERIF, fontSize, fontWeight: 600, letterSpacing: 0.5 }}>
      {renderHalf(hand.displayPattern, hand.patterns[0], "S")}
    </span>
  );
}

// ─── ARCHETYPE SYSTEM ───────────────────────────────────────

const NUMBER_HEAVY: CardSection[] = ['2468', 'consecutive_run', '13579', '369', 'any_like_numbers'];
const HONOR_SECTIONS: CardSection[] = ['winds_dragons'];
const SCHOLAR_SECTIONS: CardSection[] = ['year', 'addition'];

interface ArchetypeDef {
  name: string;
  tagline: string;
  match: (d: { engagement: number; gravitation: string; exposure: number; speed: number }) => number;
}

const ARCHETYPES: ArchetypeDef[] = [
  { name: "The Architect",
    tagline: "Methodical and precise. You build your hand like a blueprint, favoring structure and long-range planning.",
    match: (d) => (d.speed <= 1 ? 2 : 0) + (d.gravitation === 'calculator' ? 2 : 0) + (d.exposure <= 1 ? 1 : 0) },
  { name: "The Strategist",
    tagline: "Balanced and adaptable. You read the table, weigh your options, and play the odds.",
    match: (d) => (d.speed === 2 ? 1 : 0) + (d.exposure === 2 ? 1 : 0) + (d.gravitation === 'chameleon' ? 2 : 0) + (d.engagement >= 2 ? 1 : 0) },
  { name: "The Maverick",
    tagline: "Bold and unpredictable. You keep opponents guessing with sharp pivots and fearless plays.",
    match: (d) => (d.speed >= 3 ? 2 : 0) + (d.exposure >= 3 ? 2 : 0) + (d.gravitation === 'chameleon' ? 1 : 0) },
  { name: "The Scholar",
    tagline: "Studious and deliberate. You favor the card's most intricate patterns and pursue them with patience.",
    match: (d) => (d.engagement >= 2 ? 1 : 0) + (d.gravitation === 'scholar' ? 3 : 0) },
  { name: "The Commander",
    tagline: "Authoritative and direct. Winds and dragons are your domain — you command the table with honor tiles.",
    match: (d) => (d.gravitation === 'commander' ? 4 : 0) },
  { name: "The Calculator",
    tagline: "Analytical and sharp. Patterns with numeric structure are your natural habitat.",
    match: (d) => (d.gravitation === 'calculator' ? 3 : 0) + (d.speed <= 2 ? 1 : 0) },
  { name: "The Phoenix",
    tagline: "Fiery and fearless. You expose early, play fast, and rise from setbacks with renewed energy.",
    match: (d) => (d.exposure >= 3 ? 2 : 0) + (d.speed >= 3 ? 2 : 0) },
  { name: "The Sentinel",
    tagline: "Patient and guarded. You reveal nothing until the final moments, keeping opponents in the dark.",
    match: (d) => (d.exposure <= 1 ? 3 : 0) + (d.speed <= 1 ? 1 : 0) },
  { name: "The Voyager",
    tagline: "Curious and wide-ranging. You explore every section of the card, never settling into a rut.",
    match: (d) => (d.gravitation === 'chameleon' ? 2 : 0) + (d.engagement >= 3 ? 2 : 0) },
  { name: "The Artisan",
    tagline: "Refined and concealed. You craft number-based hands with quiet precision, keeping your strategy hidden.",
    match: (d) => (d.exposure <= 1 ? 2 : 0) + (d.gravitation === 'calculator' ? 2 : 0) },
  { name: "The Tempest",
    tagline: "Relentless and explosive. Lightning speed meets aggressive exposure for a play style that overwhelms.",
    match: (d) => (d.speed >= 4 ? 2 : d.speed >= 3 ? 1 : 0) + (d.exposure >= 3 ? 2 : 0) + (d.engagement >= 3 ? 1 : 0) },
  { name: "The Sage",
    tagline: "Wise and steady. Dedicated play, measured pace, and a conservative approach define your style.",
    match: (d) => (d.engagement >= 3 ? 1 : 0) + (d.speed <= 1 ? 1 : 0) + (d.exposure <= 1 ? 2 : 0) },
];

function computeArchetype(stats: StatsData): PlayerStyle {
  const gp = stats.overview.gamesPlayed;
  const engagement = gp <= 5 ? 0 : gp <= 15 ? 1 : gp <= 40 ? 2 : gp <= 80 ? 3 : 4;

  let numberWins = 0, honorWins = 0, scholarWins = 0, totalWins = 0;
  for (const s of stats.sectionWins) {
    totalWins += s.wins;
    if (NUMBER_HEAVY.includes(s.section)) numberWins += s.wins;
    if (HONOR_SECTIONS.includes(s.section)) honorWins += s.wins;
    if (SCHOLAR_SECTIONS.includes(s.section)) scholarWins += s.wins;
  }
  const thresh = totalWins * 0.4;
  let gravitation: string;
  if (honorWins >= thresh && honorWins >= numberWins && honorWins >= scholarWins) gravitation = 'commander';
  else if (scholarWins >= thresh && scholarWins >= numberWins) gravitation = 'scholar';
  else if (numberWins >= thresh) gravitation = 'calculator';
  else gravitation = 'chameleon';

  // Exposure: deterministic from stats (placeholder until real tracking)
  const exposureScore = Math.max(1, Math.min(4, 1 + Math.floor((totalWins % 7) / 2)));

  // Speed: based on avg think time
  const thinkSec = stats.speed.avgGameplayThinkSec;
  const speedScore = thinkSec > 10 ? 1 : thinkSec > 7 ? 2 : thinkSec > 4 ? 3 : 4;

  const dims = { engagement, gravitation, exposure: exposureScore, speed: speedScore };

  let bestScore = -1;
  let bestArch = ARCHETYPES[0];
  for (const arch of ARCHETYPES) {
    const score = arch.match(dims);
    if (score > bestScore) { bestScore = score; bestArch = arch; }
  }

  // Generate descriptive text
  const engLabels = ['Casual', 'Occasional', 'Regular', 'Dedicated', 'Obsessed'];
  const speedLabelsArr = ['', 'Methodical', 'Steady', 'Swift', 'Lightning'];
  const topSections = [...stats.sectionWins].sort((a, b) => b.wins - a.wins).slice(0, 2);
  const topNames = topSections.filter(s => s.wins > 0).map(s => SECTION_LABELS[s.section]);

  const engText = `${engLabels[engagement]} player with ${gp} games played. ${engagement >= 3 ? "You show up consistently and keep improving." : engagement >= 1 ? "A solid rhythm is building." : "Just getting started — every game teaches something new."}`;

  const gravText = topNames.length >= 2
    ? `Gravitates toward ${topNames[0]} and ${topNames[1]}. ${gravitation === 'calculator' ? 'Number-based patterns are your comfort zone.' : gravitation === 'commander' ? 'Honor tiles define your strategy.' : gravitation === 'scholar' ? 'Year and addition hands reward your attention to detail.' : 'A versatile player exploring the full card.'}`
    : topNames.length === 1
    ? `Focused on ${topNames[0]}. ${gravitation === 'calculator' ? 'Numbers are your strength.' : 'Your preferred territory.'}`
    : 'Still exploring — your preferred sections will emerge with more play.';

  const expLabels = ['', 'Conservative', 'Cautious', 'Balanced', 'Aggressive'];
  const expText = `${expLabels[exposureScore]} exposure tendencies. ${exposureScore <= 2 ? 'You keep your hand concealed as long as possible, maximizing flexibility.' : exposureScore === 3 ? 'You balance concealment with timely exposures when the moment is right.' : 'You expose early, committing to your hand direction with confidence.'}`;

  const spdText = `${speedLabelsArr[speedScore]} pace — averaging ${stats.speed.avgGameplayThinkSec}s per turn. ${speedScore >= 3 ? 'Quick decisions keep the table moving.' : 'You take your time to consider every option.'}`;

  return {
    archetype: bestArch.name,
    tagline: bestArch.tagline,
    engagement: engText,
    favoredSection: gravText,
    exposures: expText,
    speed: spdText,
  };
}

// ─── MOCK DATA ──────────────────────────────────────────────

function generateCalendar(): CalendarDay[] {
  const days: CalendarDay[] = [];
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const r = Math.random();
    const games = r < 0.4 ? 0 : r < 0.65 ? 1 : r < 0.85 ? 2 : r < 0.95 ? 3 : 4 + Math.floor(Math.random() * 3);
    days.push({ date: iso, gamesPlayed: games });
  }
  for (let i = days.length - 7; i < days.length; i++) {
    if (days[i]) days[i].gamesPlayed = Math.max(1, days[i].gamesPlayed);
  }
  return days;
}

const CALENDAR_CACHE = generateCalendar();

const MOCK_ALL_2025: StatsData = {
  overview: { gamesPlayed: 47, wins: 14, losses: 28, wallGames: 5 },
  speed: { avgGameDurationMin: 32, avgCharlestonThinkSec: 4.2, avgGameplayThinkSec: 8.1 },
  points: { overall: 1840, earned: 2450, deducted: 610, avgPerGame: 39.1, deadHands: 3 },
  sectionWins: [
    { section: 'consecutive_run', wins: 4, lines: [
      { pattern: "111 2222 333 4444 -or- 111 2222 333 4444", points: 25, timesWon: 2 },
      { pattern: "FF 11 222 3333 DDD", points: 25, timesWon: 1 },
      { pattern: "FF 1 22 333 1 22 333", points: 30, timesWon: 1 },
    ]},
    { section: '2468', wins: 3, lines: [
      { pattern: "FFF 22 44 666 8888", points: 25, timesWon: 2 },
      { pattern: "22 44 66 88 222 222", points: 30, timesWon: 1 },
    ]},
    { section: 'any_like_numbers', wins: 2, lines: [
      { pattern: "FF 1111 D 1111 D 11", points: 25, timesWon: 1 },
      { pattern: "FFFF 11 111 111 11", points: 30, timesWon: 1 },
    ]},
    { section: 'winds_dragons', wins: 2, lines: [
      { pattern: "NNNN EEE WWW SSSS -or- NNN EEEE WWWW SSS", points: 25, timesWon: 1 },
      { pattern: "NN EE WWW SSS DDDD", points: 30, timesWon: 1 },
    ]},
    { section: 'year', wins: 1, lines: [
      { pattern: "FF 222 000 222 555", points: 30, timesWon: 1 },
    ]},
    { section: 'singles_pairs', wins: 1, lines: [
      { pattern: "NN E W SS 11 22 33 44", points: 50, timesWon: 1 },
    ]},
    { section: 'quints', wins: 1, lines: [
      { pattern: "FF 111 2222 33333", points: 40, timesWon: 1 },
    ]},
    { section: '13579', wins: 0, lines: [] },
    { section: '369', wins: 0, lines: [] },
  ],
  style: { archetype: "", tagline: "", engagement: "", favoredSection: "", exposures: "", speed: "" },
  calendar: CALENDAR_CACHE,
  currentStreak: 7,
  longestStreak: 14,
};

const MOCK_MONTH_2025: StatsData = {
  overview: { gamesPlayed: 12, wins: 4, losses: 7, wallGames: 1 },
  speed: { avgGameDurationMin: 28, avgCharlestonThinkSec: 3.8, avgGameplayThinkSec: 7.4 },
  points: { overall: 490, earned: 650, deducted: 160, avgPerGame: 40.8, deadHands: 1 },
  sectionWins: [
    { section: '2468', wins: 2, lines: [
      { pattern: "FFF 22 44 666 8888", points: 25, timesWon: 2 },
    ]},
    { section: 'consecutive_run', wins: 1, lines: [
      { pattern: "111 2222 333 4444 -or- 111 2222 333 4444", points: 25, timesWon: 1 },
    ]},
    { section: 'winds_dragons', wins: 1, lines: [
      { pattern: "NNNN EEE WWW SSSS -or- NNN EEEE WWWW SSS", points: 25, timesWon: 1 },
    ]},
    { section: 'any_like_numbers', wins: 0, lines: [] },
    { section: 'year', wins: 0, lines: [] },
    { section: 'singles_pairs', wins: 0, lines: [] },
    { section: 'quints', wins: 0, lines: [] },
    { section: '13579', wins: 0, lines: [] },
    { section: '369', wins: 0, lines: [] },
  ],
  style: { archetype: "", tagline: "", engagement: "", favoredSection: "", exposures: "", speed: "" },
  calendar: CALENDAR_CACHE,
  currentStreak: 7,
  longestStreak: 14,
};

const MOCK_ALL_2024: StatsData = {
  overview: { gamesPlayed: 83, wins: 28, losses: 47, wallGames: 8 },
  speed: { avgGameDurationMin: 36, avgCharlestonThinkSec: 5.1, avgGameplayThinkSec: 9.3 },
  points: { overall: 3280, earned: 4100, deducted: 820, avgPerGame: 39.5, deadHands: 6 },
  sectionWins: [
    { section: 'any_like_numbers', wins: 6, lines: [
      { pattern: "FFFF 111 1111 111", points: 25, timesWon: 3 },
      { pattern: "11 DDD 11 DDD 1111", points: 25, timesWon: 2 },
      { pattern: "FF 1111 NEWS 1111", points: 25, timesWon: 1 },
    ]},
    { section: '2468', wins: 5, lines: [
      { pattern: "FF 2222 44 66 8888 -or- FF 2222 44 66 8888", points: 25, timesWon: 3 },
      { pattern: "22 444 44 666 8888", points: 25, timesWon: 2 },
    ]},
    { section: 'year', wins: 4, lines: [
      { pattern: "FF 2024 2222 2222", points: 25, timesWon: 3 },
      { pattern: "222 000 2222 4444", points: 25, timesWon: 1 },
    ]},
    { section: 'consecutive_run', wins: 4, lines: [
      { pattern: "FF 1111 2222 3333 -or- FF 1111 2222 3333", points: 25, timesWon: 2 },
      { pattern: "111 222 3333 4444 -or- 111 222 3333 4444", points: 25, timesWon: 2 },
    ]},
    { section: '13579', wins: 3, lines: [
      { pattern: "111 33 5555 77 999 -or- 111 33 5555 77 999", points: 25, timesWon: 2 },
      { pattern: "11 33 55 7777 9999", points: 30, timesWon: 1 },
    ]},
    { section: 'winds_dragons', wins: 2, lines: [
      { pattern: "NNNN EEE WWW SSSS -or- NNN EEEE WWWW SSS", points: 25, timesWon: 2 },
    ]},
    { section: 'addition', wins: 2, lines: [
      { pattern: "FF 1111 + 6666 = 7777", points: 25, timesWon: 2 },
    ]},
    { section: 'quints', wins: 1, lines: [
      { pattern: "FF 11111 22 33333", points: 40, timesWon: 1 },
    ]},
    { section: '369', wins: 1, lines: [
      { pattern: "FF 3333 6666 9999 -or- FF 3333 6666 9999", points: 25, timesWon: 1 },
    ]},
    { section: 'singles_pairs', wins: 0, lines: [] },
  ],
  style: { archetype: "", tagline: "", engagement: "", favoredSection: "", exposures: "", speed: "" },
  calendar: CALENDAR_CACHE,
  currentStreak: 7,
  longestStreak: 14,
};

function getFilteredStats(period: TimePeriod, year: number): StatsData {
  if (year === 2024) return MOCK_ALL_2024;
  if (period === 'last_month' || period === 'last_week') return MOCK_MONTH_2025;
  return MOCK_ALL_2025;
}

// ─── DAY LABELS ─────────────────────────────────────────────

const DOW_LABELS = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'];

// ─── CARD VIEW LAYOUT COMPONENT ─────────────────────────────
// Renders the NMJL card in multi-column layout on desktop, single column on mobile.
// Desktop columns mirror the physical card layout:
//   Col 1: Year, 2468, Any Like Numbers
//   Col 2: Quints, Consecutive Run
//   Col 3: 13579
//   Col 4: Winds & Dragons, 369, Singles & Pairs

const CARD_COLUMNS: CardSection[][] = [
  ['year', '2468', 'any_like_numbers'],
  ['quints', 'consecutive_run'],
  ['13579'],
  ['winds_dragons', '369', 'singles_pairs', 'addition'],
];

function CardSectionBlock({
  section, hands, wonPatternsMap, isDark, t, divider, seafoam,
}: {
  section: CardSection;
  hands: HandDefinition[];
  wonPatternsMap: Map<string, { timesWon: number; points: number }>;
  isDark: boolean;
  t: ReturnType<typeof getThemeColors>;
  divider: string;
  seafoam: string;
}) {
  const sectionTotalWins = hands.reduce((sum, h) => {
    const won = wonPatternsMap.get(h.displayPattern);
    return sum + (won ? won.timesWon : 0);
  }, 0);

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: FONT_SANS, fontSize: 10, fontWeight: 700,
        color: sectionTotalWins > 0 ? t.textMain : t.textDim,
        letterSpacing: 0.8, textTransform: "uppercase" as const,
        paddingBottom: 6,
        borderBottom: `0.5px solid ${divider}`,
        marginBottom: 6,
        display: "flex", justifyContent: "space-between" as const,
      }}>
        <span>{SECTION_LABELS[section]}</span>
        {sectionTotalWins > 0 && (
          <span style={{ fontFamily: FONT_SERIF, fontSize: 11, color: seafoam }}>
            {sectionTotalWins} win{sectionTotalWins !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {hands.map((hand, hi) => {
        const won = wonPatternsMap.get(hand.displayPattern);
        const isWon = !!won;
        return (
          <div key={hand.id} style={{
            display: "flex", alignItems: "center" as const, justifyContent: "space-between" as const,
            padding: "4px 0",
            borderBottom: hi < hands.length - 1 ? `0.5px solid ${isDark ? "rgba(255,255,255,0.02)" : "rgba(126,100,164,0.03)"}` : "none",
            opacity: isWon ? 1 : 0.35,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <ColoredPattern hand={hand} isDark={isDark} fontSize={10} />
            </div>
            <div style={{ display: "flex", alignItems: "center" as const, gap: 5, flexShrink: 0, marginLeft: 6 }}>
              <span style={{
                fontFamily: FONT_SANS, fontSize: 7, fontWeight: 600,
                color: hand.exposure === 'C' ? (isDark ? "#85D4BC" : "#4A9E88") : t.textDim,
                padding: "1px 3px", borderRadius: 3,
                background: hand.exposure === 'C'
                  ? (isDark ? "rgba(133,212,188,0.1)" : "rgba(74,158,136,0.08)")
                  : (isDark ? "rgba(255,255,255,0.03)" : "rgba(126,100,164,0.04)"),
              }}>
                {hand.exposure === 'C' ? 'C' : 'X'}
              </span>
              <span style={{ fontFamily: FONT_SANS, fontSize: 7, color: t.textDim, minWidth: 18, textAlign: "right" as const }}>
                {hand.points}pt
              </span>
              {isWon && (
                <span style={{ fontFamily: FONT_SERIF, fontSize: 11, fontWeight: 600, color: seafoam, minWidth: 18, textAlign: "right" as const }}>
                  {won!.timesWon}x
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CardViewLayout({
  nmjlCard, cardSections, wonPatternsMap, isDark, t, divider, seafoam, isDesktop,
}: {
  nmjlCard: NMJLCard;
  cardSections: CardSection[];
  wonPatternsMap: Map<string, { timesWon: number; points: number }>;
  isDark: boolean;
  t: ReturnType<typeof getThemeColors>;
  divider: string;
  seafoam: string;
  isDesktop: boolean;
}) {
  if (!isDesktop) {
    // Mobile: single column scroll
    return (
      <div>
        {cardSections.map((section) => {
          const sectionHands = nmjlCard.hands.filter(h => h.section === section);
          if (sectionHands.length === 0) return null;
          return (
            <CardSectionBlock
              key={section} section={section} hands={sectionHands}
              wonPatternsMap={wonPatternsMap} isDark={isDark} t={t} divider={divider} seafoam={seafoam}
            />
          );
        })}
      </div>
    );
  }

  // Desktop: multi-column card layout mirroring the physical NMJL card
  const availableSections = new Set(cardSections);
  const columns = CARD_COLUMNS.map(col => col.filter(s => availableSections.has(s)));

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16,
      alignItems: "start" as const,
    }}>
      {columns.map((col, ci) => (
        <div key={ci}>
          {col.map(section => {
            const sectionHands = nmjlCard.hands.filter(h => h.section === section);
            if (sectionHands.length === 0) return null;
            return (
              <CardSectionBlock
                key={section} section={section} hands={sectionHands}
                wonPatternsMap={wonPatternsMap} isDark={isDark} t={t} divider={divider} seafoam={seafoam}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── COMPONENT ──────────────────────────────────────────────

export default function StatsPage() {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const availableYears = getAvailableYears();

  const [period, setPeriod] = useState<TimePeriod>('all_time');
  const [cardYear, setCardYear] = useState(getCurrentYear());
  const [expandedSection, setExpandedSection] = useState<CardSection | null>(null);
  const [winLinesView, setWinLinesView] = useState<'ranked' | 'card'>('ranked');
  const [nmjlCard, setNmjlCard] = useState<NMJLCard | null>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stats = useMemo(() => getFilteredStats(period, cardYear), [period, cardYear]);
  const computedStyle = useMemo(() => computeArchetype(stats), [stats]);

  // Load NMJL card for card-view
  useEffect(() => {
    let cancelled = false;
    getCard(cardYear).then(card => {
      if (!cancelled && card) setNmjlCard(card);
    });
    return () => { cancelled = true; };
  }, [cardYear]);

  // Won patterns lookup for card view
  const wonPatternsMap = useMemo(() => {
    const map = new Map<string, { timesWon: number; points: number }>();
    for (const sec of stats.sectionWins) {
      for (const line of sec.lines) {
        map.set(line.pattern, { timesWon: line.timesWon, points: line.points });
      }
    }
    return map;
  }, [stats]);

  // ── Style helpers ────────────────────────────────────────

  const glassCard = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    background: t.cardBg,
    border: `0.5px solid ${t.cardBorder}`,
    borderRadius: 16,
    padding: "18px 20px",
    boxShadow: t.cardShadow,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    position: "relative" as const,
    overflow: "hidden" as const,
    ...extra,
  });

  const gloss = <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, height: "55%", background: `linear-gradient(165deg, ${isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)"} 0%, ${isDark ? "rgba(255,255,255,0.005)" : "rgba(255,255,255,0.2)"} 35%, transparent 60%)`, pointerEvents: "none" as const, borderRadius: 16 }} />;

  const sectionLabel = (text: string) => (
    <div style={{ fontFamily: FONT_SANS, fontSize: 9, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" as const, color: t.textDim, marginBottom: 12 }}>{text}</div>
  );

  const divider = isDark ? "rgba(255,255,255,0.04)" : "rgba(126,100,164,0.06)";
  const trackBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(126,100,164,0.04)";

  const cherry = isDark ? "rgba(224,48,80,0.7)" : "#E03050";
  const seafoam = isDark ? "#85D4BC" : "#4A9E88";
  const cerulean = isDark ? "#A8D8EE" : "#4A96B8";
  const lavender = isDark ? "#D4C8E8" : "#7E64A4";
  const gold = isDark ? "#F0C060" : "#B08D3A";

  // ── Filters ─────────────────────────────────────────────

  const PERIODS: { id: TimePeriod; label: string }[] = [
    { id: 'last_week', label: 'Week' },
    { id: 'last_month', label: 'Month' },
    { id: 'last_year', label: 'Year' },
    { id: 'all_time', label: 'All Time' },
  ];

  const filterLabel = (text: string): React.CSSProperties => ({
    fontFamily: FONT_SANS, fontSize: 7, fontWeight: 600,
    letterSpacing: 1.2, textTransform: "uppercase" as const,
    color: t.textDim, paddingLeft: 6, marginBottom: 2,
  });

  // ── Win rate donut ──────────────────────────────────────

  const ov = stats.overview;
  const winPct = ov.gamesPlayed > 0 ? Math.round((ov.wins / ov.gamesPlayed) * 100) : 0;
  const lossPct = ov.gamesPlayed > 0 ? Math.round((ov.losses / ov.gamesPlayed) * 100) : 0;
  const wallPct = ov.gamesPlayed > 0 ? 100 - winPct - lossPct : 0;

  const donutR = 40;
  const donutStroke = 10;
  const donutCirc = 2 * Math.PI * donutR;
  const winArc = (winPct / 100) * donutCirc;
  const lossArc = (lossPct / 100) * donutCirc;
  const wallArc = (wallPct / 100) * donutCirc;

  // ── Winning Lines ───────────────────────────────────────

  const sortedSections = [...stats.sectionWins].sort((a, b) => b.wins - a.wins);
  const maxWins = Math.max(...sortedSections.map(s => s.wins), 1);

  const BAR_COLORS = [
    seafoam, cerulean, lavender, gold,
    isDark ? "#E88A70" : "#D06040",
    isDark ? "#D4A0D0" : "#A868A0",
    isDark ? "#A8C890" : "#6B9858",
    isDark ? "#D0B888" : "#9A8458",
    isDark ? "#90B8D0" : "#5A8AA0",
    isDark ? "#C0A8C8" : "#8868A0",
  ];

  // ── Calendar ────────────────────────────────────────────

  const cal = stats.calendar;
  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];
  cal.forEach((day) => {
    const dow = new Date(day.date).getDay();
    if (dow === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  if (currentWeek.length) weeks.push(currentWeek);

  const calColor = isDark ? [24, 190, 155] : [74, 158, 136];

  function calOpacity(games: number): number {
    if (games === 0) return 0;
    if (games === 1) return 0.25;
    if (games <= 2) return 0.5;
    if (games <= 3) return 0.75;
    return 1;
  }

  const monthLabels: { text: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstDay = week[0];
    if (firstDay) {
      const m = new Date(firstDay.date).getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ text: new Date(firstDay.date).toLocaleString('default', { month: 'short' }), col: wi });
        lastMonth = m;
      }
    }
  });

  // ── Card view sections ────────────────────────────────

  // Determine which sections the current card year supports
  const cardSections = useMemo(() => {
    if (!nmjlCard) return SECTION_ORDER;
    const available = new Set(nmjlCard.hands.map(h => h.section));
    return SECTION_ORDER.filter(s => available.has(s));
  }, [nmjlCard]);

  // ── Render ─────────────────────────────────────────────

  return (
    <>
      <PT>Stats</PT>
      <Cnt>
        {/* ═══ FILTERS ═══ */}
        <div style={{ marginBottom: 20 }}>
          {/* Labels row */}
          <div style={{ display: "flex", justifyContent: "space-between" as const, marginBottom: 4 }}>
            <div style={filterLabel("Time Frame")}>Time Frame</div>
            <div style={filterLabel("NMJL Card")}>NMJL Card</div>
          </div>
          {/* Pills row */}
          <div style={{ display: "flex", justifyContent: "space-between" as const, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 3, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(126,100,164,0.03)", borderRadius: 20, padding: 3 }}>
              {PERIODS.map(p => {
                const isActive = period === p.id;
                return (
                  <div key={p.id} onClick={() => setPeriod(p.id)} style={{
                    padding: "5px 10px", borderRadius: 18, cursor: "pointer",
                    fontSize: 9, fontWeight: isActive ? 600 : 400, fontFamily: FONT_SANS,
                    background: isActive ? (isDark ? "rgba(168,216,238,0.12)" : "#E03050") : "transparent",
                    color: isActive ? (isDark ? "#A8D8EE" : "#fff") : t.textMid,
                    transition: "all 0.2s",
                  }}>
                    {p.label}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 3, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(126,100,164,0.03)", borderRadius: 20, padding: 3 }}>
              {availableYears.map(yr => {
                const isActive = cardYear === yr;
                return (
                  <div key={yr} onClick={() => setCardYear(yr)} style={{
                    padding: "5px 10px", borderRadius: 18, cursor: "pointer",
                    fontSize: 9, fontWeight: isActive ? 600 : 400, fontFamily: FONT_SANS,
                    background: isActive ? (isDark ? "rgba(133,212,188,0.12)" : lavender) : "transparent",
                    color: isActive ? (isDark ? "#85D4BC" : "#fff") : t.textMid,
                    transition: "all 0.2s",
                  }}>
                    {yr}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══ PLAY RATE ═══ */}
        {sectionLabel("Play Rate")}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "stretch", flexWrap: "wrap" as const }}>
          {/* 2x2 stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flex: "1 1 200px", minWidth: 0 }}>
            {[
              { label: "Games Played", value: ov.gamesPlayed, color: t.statNumColor },
              { label: "Wins", value: ov.wins, color: seafoam },
              { label: "Losses", value: ov.losses, color: cherry },
              { label: "Wall Games", value: ov.wallGames, color: cerulean },
            ].map(card => (
              <div key={card.label} style={glassCard({ padding: "12px 10px", textAlign: "center" as const })}>
                {gloss}
                <div style={{ fontFamily: FONT_SANS, fontSize: 8, fontWeight: 600, color: t.textDim, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 4 }}>
                  {card.label}
                </div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 26, fontWeight: 700, color: card.color, lineHeight: 1 }}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* Win Rate Donut */}
          <div style={glassCard({ padding: "14px 14px", display: "flex" as const, flexDirection: "column" as const, alignItems: "center" as const, justifyContent: "center" as const, flex: "0 0 auto", minWidth: 130 })}>
            {gloss}
            <svg viewBox="0 0 100 100" style={{ width: 80, height: 80 }}>
              <circle cx={50} cy={50} r={donutR} fill="none" stroke={trackBg} strokeWidth={donutStroke} />
              <circle cx={50} cy={50} r={donutR} fill="none" stroke={seafoam}
                strokeWidth={donutStroke} strokeLinecap="round"
                strokeDasharray={`${winArc} ${donutCirc}`}
                strokeDashoffset={0}
                transform="rotate(-90 50 50)"
                style={{ transition: "stroke-dasharray 0.8s ease" }} />
              <circle cx={50} cy={50} r={donutR} fill="none" stroke={cherry} opacity={0.65}
                strokeWidth={donutStroke}
                strokeDasharray={`${lossArc} ${donutCirc}`}
                strokeDashoffset={-winArc}
                transform="rotate(-90 50 50)"
                style={{ transition: "stroke-dasharray 0.8s ease" }} />
              {wallPct > 0 && <circle cx={50} cy={50} r={donutR} fill="none" stroke={cerulean} opacity={0.7}
                strokeWidth={donutStroke}
                strokeDasharray={`${wallArc} ${donutCirc}`}
                strokeDashoffset={-(winArc + lossArc)}
                transform="rotate(-90 50 50)"
                style={{ transition: "stroke-dasharray 0.8s ease" }} />}
              <text x={50} y={47} textAnchor="middle" style={{ fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 700, fill: seafoam }}>{winPct}%</text>
              <text x={50} y={59} textAnchor="middle" style={{ fontFamily: FONT_SANS, fontSize: 6, fill: t.textDim, letterSpacing: 0.5 }}>WIN RATE</text>
            </svg>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 4, marginTop: 6 }}>
              {[{ c: seafoam, l: "W", v: `${winPct}%` }, { c: cherry, l: "L", v: `${lossPct}%`, o: 0.65 }, { c: cerulean, l: "Wall", v: `${wallPct}%`, o: 0.7 }].map(item => (
                <div key={item.l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 2, background: item.c, opacity: item.o || 1 }} />
                  <span style={{ fontFamily: FONT_SANS, fontSize: 9, color: t.textMain, fontWeight: 500 }}>{item.l}</span>
                  <span style={{ fontFamily: FONT_SERIF, fontSize: 11, fontWeight: 600, color: item.c, opacity: item.o || 1 }}>{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ EXECUTION ═══ */}
        {sectionLabel("Execution")}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <div style={glassCard({ padding: "14px 16px", flex: "1 1 0", minWidth: 0 })}>
            {gloss}
            <div style={{ fontFamily: FONT_SANS, fontSize: 8, fontWeight: 600, color: t.textDim, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 10 }}>Speed</div>
            {[
              { label: "Avg Game", value: `${stats.speed.avgGameDurationMin} min` },
              { label: "Charleston", value: `${stats.speed.avgCharlestonThinkSec}s` },
              { label: "Gameplay", value: `${stats.speed.avgGameplayThinkSec}s` },
            ].map((row, i) => (
              <div key={row.label} style={{
                display: "flex", justifyContent: "space-between" as const, alignItems: "center" as const,
                padding: "7px 0",
                borderBottom: i < 2 ? `0.5px solid ${divider}` : "none",
              }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: 10, color: t.textMain }}>{row.label}</span>
                <span style={{ fontFamily: FONT_SERIF, fontSize: 16, fontWeight: 700, color: t.statNumColor }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div style={glassCard({ padding: "14px 16px", flex: "1 1 0", minWidth: 0 })}>
            {gloss}
            <div style={{ fontFamily: FONT_SANS, fontSize: 8, fontWeight: 600, color: t.textDim, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 10 }}>Points</div>
            {[
              { label: "Overall", value: stats.points.overall.toLocaleString(), color: t.statNumColor },
              { label: "Earned", value: `+${stats.points.earned.toLocaleString()}`, color: seafoam },
              { label: "Deducted", value: `-${stats.points.deducted.toLocaleString()}`, color: cherry },
              { label: "Avg / Game", value: stats.points.avgPerGame.toFixed(1), color: t.statNumColor },
              { label: "Dead Hands", value: String(stats.points.deadHands), color: t.textMain },
            ].map((row, i) => (
              <div key={row.label} style={{
                display: "flex", justifyContent: "space-between" as const, alignItems: "center" as const,
                padding: "5px 0",
                borderBottom: i < 4 ? `0.5px solid ${divider}` : "none",
              }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: 10, color: t.textMain }}>{row.label}</span>
                <span style={{ fontFamily: FONT_SERIF, fontSize: 14, fontWeight: 700, color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ WINNING LINES ═══ */}
        {sectionLabel(`Winning Lines — ${cardYear} Card`)}
        <div style={glassCard({ marginBottom: 20, padding: "14px 16px 10px" })}>
          {gloss}

          {/* Toggle button */}
          <div style={{ display: "flex", justifyContent: "flex-end" as const, marginBottom: 10, position: "relative" as const, zIndex: 1 }}>
            <div
              onClick={() => setWinLinesView(winLinesView === 'ranked' ? 'card' : 'ranked')}
              style={{
                fontFamily: FONT_SANS, fontSize: 9, fontWeight: 600,
                color: winLinesView === 'ranked'
                  ? (isDark ? cerulean : lavender)
                  : "#fff",
                cursor: "pointer", padding: "5px 12px",
                borderRadius: 12,
                background: winLinesView === 'ranked'
                  ? (isDark ? "rgba(168,216,238,0.08)" : "rgba(126,100,164,0.06)")
                  : (isDark ? cerulean : "#E03050"),
                border: `1px solid ${winLinesView === 'ranked'
                  ? (isDark ? "rgba(168,216,238,0.15)" : "rgba(126,100,164,0.12)")
                  : "transparent"}`,
                transition: "all 0.2s",
              }}
            >
              {winLinesView === 'ranked' ? 'See it on the Card' : 'Back to Ranked View'}
            </div>
          </div>

          {winLinesView === 'ranked' ? (
            <div style={{ position: "relative" as const, zIndex: 1 }}>
              {sortedSections.map((sec, i) => {
                const isExpanded = expandedSection === sec.section;
                const hasLines = sec.lines.length > 0;
                const barColor = BAR_COLORS[Math.min(i, BAR_COLORS.length - 1)];
                return (
                  <div key={sec.section}>
                    <div
                      onClick={() => hasLines && setExpandedSection(isExpanded ? null : sec.section)}
                      style={{
                        display: "flex", alignItems: "center" as const, gap: 8,
                        padding: "8px 0",
                        borderBottom: (!isExpanded && i < sortedSections.length - 1) ? `0.5px solid ${divider}` : "none",
                        cursor: hasLines ? "pointer" : "default",
                      }}
                    >
                      <div style={{ fontFamily: FONT_SANS, fontSize: 9, fontWeight: 700, color: i < 3 ? barColor : t.textDim, width: 14, textAlign: "right" as const, flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: 500, color: t.textMain, marginBottom: 3 }}>
                          {SECTION_LABELS[sec.section]}
                        </div>
                        <div style={{ height: 4, borderRadius: 2, background: trackBg, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", borderRadius: 2,
                            width: sec.wins > 0 ? `${Math.max(4, (sec.wins / maxWins) * 100)}%` : "0%",
                            background: barColor,
                            transition: "width 0.8s ease",
                          }} />
                        </div>
                      </div>
                      <div style={{ fontFamily: FONT_SERIF, fontSize: 14, fontWeight: 600, color: i < 3 ? barColor : t.textDim, minWidth: 18, textAlign: "right" as const, flexShrink: 0 }}>
                        {sec.wins}
                      </div>
                      {hasLines && (
                        <div style={{ fontSize: 10, color: t.textDim, flexShrink: 0, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                          &#x25BC;
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <div style={{
                        padding: "4px 0 8px 24px",
                        borderBottom: i < sortedSections.length - 1 ? `0.5px solid ${divider}` : "none",
                      }}>
                        {sec.lines.map((line, li) => (
                          <div key={li} style={{
                            display: "flex", justifyContent: "space-between" as const, alignItems: "center" as const,
                            padding: "5px 0",
                            borderBottom: li < sec.lines.length - 1 ? `0.5px solid ${isDark ? "rgba(255,255,255,0.02)" : "rgba(126,100,164,0.03)"}` : "none",
                          }}>
                            <div>
                              <div style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: 600, color: t.textMain, letterSpacing: 0.5 }}>
                                {line.pattern.includes(' -or- ') ? line.pattern.split(' -or- ')[0] : line.pattern}
                              </div>
                              <div style={{ fontFamily: FONT_SANS, fontSize: 8, color: t.textDim, marginTop: 1 }}>
                                {line.points} pts
                              </div>
                            </div>
                            <div style={{ fontFamily: FONT_SERIF, fontSize: 13, fontWeight: 600, color: barColor, flexShrink: 0 }}>
                              {line.timesWon}x
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── Card View ── */
            nmjlCard ? (
              <div style={{ position: "relative" as const, zIndex: 1 }}>
              <CardViewLayout
                nmjlCard={nmjlCard}
                cardSections={cardSections}
                wonPatternsMap={wonPatternsMap}
                isDark={isDark}
                t={t}
                divider={divider}
                seafoam={seafoam}
                isDesktop={isDesktop}
              />
              </div>
            ) : (
              <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: t.textDim, textAlign: "center" as const, padding: 20, position: "relative" as const, zIndex: 1 }}>
                Loading card data...
              </div>
            )
          )}
        </div>

        {/* ═══ YOUR MAHJI STYLE ═══ */}
        {sectionLabel("Your Mahji Style")}
        <div style={glassCard({ marginBottom: 20, padding: "22px 20px" })}>
          {gloss}

          <div style={{
            fontFamily: FONT_SERIF, fontSize: 24, fontWeight: 700,
            color: isDark ? cerulean : "#E03050",
            letterSpacing: 1, marginBottom: 4,
            position: "relative" as const, zIndex: 1,
          }}>
            {computedStyle.archetype}
          </div>
          <div style={{
            fontFamily: FONT_SANS, fontSize: 11, color: t.textMid,
            lineHeight: 1.6, marginBottom: 18, fontStyle: "italic",
            position: "relative" as const, zIndex: 1,
          }}>
            {computedStyle.tagline}
          </div>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 14, position: "relative" as const, zIndex: 1 }}>
            {[
              { title: "Engagement", text: computedStyle.engagement },
              { title: "Gravitation", text: computedStyle.favoredSection },
              { title: "Exposures", text: computedStyle.exposures },
              { title: "Speed", text: computedStyle.speed },
            ].map((attr, i) => (
              <div key={attr.title} style={{
                paddingBottom: i < 3 ? 14 : 0,
                borderBottom: i < 3 ? `0.5px solid ${divider}` : "none",
              }}>
                <div style={{
                  fontFamily: FONT_SANS, fontSize: 8, fontWeight: 700,
                  letterSpacing: 1.2, textTransform: "uppercase" as const,
                  color: t.textDim, marginBottom: 4,
                }}>
                  {attr.title}
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: t.textMain, lineHeight: 1.6 }}>
                  {attr.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ ACTIVITY & STREAK ═══ */}
        {sectionLabel("Activity")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 80, alignItems: "start" as const }}>
          <div style={glassCard({ padding: "14px 14px 10px" })}>
            {gloss}
            <div style={{ display: "grid", gridTemplateColumns: `18px repeat(${weeks.length}, 10px)`, gap: 2, marginBottom: 4 }}>
              <div />
              {weeks.map((_, wi) => {
                const ml = monthLabels.find(m => m.col === wi);
                return (
                  <div key={wi} style={{ fontFamily: FONT_SANS, fontSize: 7, color: t.textDim, textAlign: "center" as const, lineHeight: "10px" }}>
                    {ml ? ml.text : ""}
                  </div>
                );
              })}
            </div>
            {[0, 1, 2, 3, 4, 5, 6].map(dow => (
              <div key={dow} style={{ display: "grid", gridTemplateColumns: `18px repeat(${weeks.length}, 10px)`, gap: 2 }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 7, color: t.textDim, lineHeight: "10px", textAlign: "right" as const, paddingRight: 3 }}>
                  {DOW_LABELS[dow]}
                </div>
                {weeks.map((week, wi) => {
                  const day = week.find(d => new Date(d.date).getDay() === dow);
                  const games = day ? day.gamesPlayed : -1;
                  const opacity = games < 0 ? 0 : calOpacity(games);
                  return (
                    <div key={wi} style={{
                      width: 10, height: 10, borderRadius: 2,
                      background: games < 0
                        ? "transparent"
                        : games === 0
                          ? (isDark ? "rgba(255,255,255,0.03)" : "rgba(126,100,164,0.04)")
                          : `rgba(${calColor[0]},${calColor[1]},${calColor[2]},${opacity})`,
                    }} />
                  );
                })}
              </div>
            ))}
          </div>

          <div style={glassCard({ padding: "16px 18px", textAlign: "center" as const, minWidth: 88, display: "flex" as const, flexDirection: "column" as const, alignItems: "center" as const, justifyContent: "center" as const })}>
            {gloss}
            <div style={{ fontFamily: FONT_SERIF, fontSize: 32, fontWeight: 700, color: gold, lineHeight: 1 }}>
              {stats.currentStreak}
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 8, fontWeight: 600, color: t.textDim, letterSpacing: 0.8, textTransform: "uppercase" as const, marginTop: 4 }}>
              day streak
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, color: seafoam, marginTop: 6, fontWeight: 600 }}>
              Keep it going!
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 7, color: t.textDim, marginTop: 8 }}>
              Longest: {stats.longestStreak}d
            </div>
          </div>
        </div>

      </Cnt>
    </>
  );
}
