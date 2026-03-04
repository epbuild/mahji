// ═══════════════════════════════════════════════════════════════
// MAHJI — Stats Page
// File: src/pages/StatsPage.tsx
//
// Player statistics dashboard: game overview, speed, points,
// winning lines by section, player style, and activity calendar.
// All data is currently mock — structured for easy swap to real.
// ═══════════════════════════════════════════════════════════════

import { useState, useMemo } from 'react';
import { getThemeColors, FONT_SERIF, FONT_SANS } from '../constants/colors';
import { useTheme } from '../constants/ThemeContext';
import { PT, Cnt } from '../components/Layout';
import { SECTION_LABELS, getAvailableYears, getCurrentYear } from '../data/nmjl';
import type { CardSection } from '../data/nmjl';

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
  pattern: string;       // e.g. "FF 2222 2222 2222"
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
      { pattern: "FF 1111 2222 3333", points: 25, timesWon: 2 },
      { pattern: "FF 5555 6666 7777", points: 25, timesWon: 1 },
      { pattern: "11 222 3333 4444 55", points: 30, timesWon: 1 },
    ]},
    { section: '2468', wins: 3, lines: [
      { pattern: "FF 2222 4444 66 88", points: 25, timesWon: 2 },
      { pattern: "2222 44 6666 8888", points: 30, timesWon: 1 },
    ]},
    { section: 'any_like_numbers', wins: 2, lines: [
      { pattern: "FF 3333 D 3333 D 33", points: 25, timesWon: 1 },
      { pattern: "FFFF 1111 1111 11", points: 30, timesWon: 1 },
    ]},
    { section: 'winds_dragons', wins: 2, lines: [
      { pattern: "NN EE WW SS DD DD", points: 25, timesWon: 1 },
      { pattern: "NNN SSS EEE WWW DD", points: 30, timesWon: 1 },
    ]},
    { section: 'year', wins: 1, lines: [
      { pattern: "FF 2025 2025 2025", points: 25, timesWon: 1 },
    ]},
    { section: 'singles_pairs', wins: 1, lines: [
      { pattern: "NN EW SS 11 22 33 44", points: 50, timesWon: 1 },
    ]},
    { section: 'quints', wins: 1, lines: [
      { pattern: "FFFFF 33333 6666", points: 35, timesWon: 1 },
    ]},
    { section: 'addition', wins: 0, lines: [] },
    { section: '13579', wins: 0, lines: [] },
    { section: '369', wins: 0, lines: [] },
  ],
  style: {
    archetype: "The Architect",
    tagline: "Methodical and precise. You build your hand like a blueprint, favoring structure and long-range planning.",
    engagement: "Plays almost daily, averaging 1.6 games per session. Consistently active with a strong week-over-week rhythm.",
    favoredSection: "Gravitates toward Consecutive Runs and 2468 hands. Prefers structured, number-based patterns over honor tiles.",
    exposures: "Tends to expose late in the game, typically after turn 8. Keeps the hand concealed as long as possible for flexibility.",
  },
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
      { pattern: "FF 2222 4444 66 88", points: 25, timesWon: 2 },
    ]},
    { section: 'consecutive_run', wins: 1, lines: [
      { pattern: "FF 1111 2222 3333", points: 25, timesWon: 1 },
    ]},
    { section: 'winds_dragons', wins: 1, lines: [
      { pattern: "NN EE WW SS DD DD", points: 25, timesWon: 1 },
    ]},
    { section: 'any_like_numbers', wins: 0, lines: [] },
    { section: 'year', wins: 0, lines: [] },
    { section: 'singles_pairs', wins: 0, lines: [] },
    { section: 'quints', wins: 0, lines: [] },
    { section: 'addition', wins: 0, lines: [] },
    { section: '13579', wins: 0, lines: [] },
    { section: '369', wins: 0, lines: [] },
  ],
  style: MOCK_ALL_2025.style,
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
      { pattern: "FF 3333 D 3333 D 33", points: 25, timesWon: 3 },
      { pattern: "FFFF 1111 1111 11", points: 30, timesWon: 2 },
      { pattern: "FF 5555 55 5555", points: 25, timesWon: 1 },
    ]},
    { section: '2468', wins: 5, lines: [
      { pattern: "FF 2222 4444 66 88", points: 25, timesWon: 3 },
      { pattern: "2222 44 6666 8888", points: 30, timesWon: 2 },
    ]},
    { section: 'year', wins: 4, lines: [
      { pattern: "FF 2024 2024 2024", points: 25, timesWon: 3 },
      { pattern: "20 222 4444 20 24", points: 30, timesWon: 1 },
    ]},
    { section: 'consecutive_run', wins: 4, lines: [
      { pattern: "FF 1111 2222 3333", points: 25, timesWon: 2 },
      { pattern: "11 222 3333 4444 55", points: 30, timesWon: 2 },
    ]},
    { section: '13579', wins: 3, lines: [
      { pattern: "FF 1111 33 5555 77", points: 25, timesWon: 2 },
      { pattern: "111 333 5555 999", points: 30, timesWon: 1 },
    ]},
    { section: 'winds_dragons', wins: 2, lines: [
      { pattern: "NNN SSS EEE WWW DD", points: 30, timesWon: 2 },
    ]},
    { section: 'addition', wins: 2, lines: [
      { pattern: "FF 1111 + 2222 = 3333", points: 25, timesWon: 2 },
    ]},
    { section: 'quints', wins: 1, lines: [
      { pattern: "FFFFF 33333 6666", points: 35, timesWon: 1 },
    ]},
    { section: '369', wins: 1, lines: [
      { pattern: "FF 3333 6666 9999", points: 25, timesWon: 1 },
    ]},
    { section: 'singles_pairs', wins: 0, lines: [] },
  ],
  style: {
    archetype: "The Opportunist",
    tagline: "Agile and instinctive. You read the flow of the game and pivot faster than most players realize.",
    engagement: "Plays 3-4 times per week with bursts of activity around weekends. A steady, committed player.",
    favoredSection: "Draws toward Any Like Numbers and 2468 patterns. Shows versatility across multiple sections.",
    exposures: "Exposes early, typically by turn 5. Commits to a hand direction quickly and builds around it.",
  },
  calendar: CALENDAR_CACHE,
  currentStreak: 7,
  longestStreak: 14,
};

function getFilteredStats(period: TimePeriod, year: number): StatsData {
  if (year === 2024) return MOCK_ALL_2024;
  if (period === 'last_month' || period === 'last_week') return MOCK_MONTH_2025;
  return MOCK_ALL_2025;
}

// ─── COMPONENT ──────────────────────────────────────────────

export default function StatsPage() {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const availableYears = getAvailableYears();

  const [period, setPeriod] = useState<TimePeriod>('all_time');
  const [cardYear, setCardYear] = useState(getCurrentYear());
  const [expandedSection, setExpandedSection] = useState<CardSection | null>(null);

  const stats = useMemo(() => getFilteredStats(period, cardYear), [period, cardYear]);

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
    { id: 'all_time', label: 'All Time' },
    { id: 'last_week', label: 'Week' },
    { id: 'last_month', label: 'Month' },
    { id: 'last_year', label: 'Year' },
  ];

  // ── Win rate donut ──────────────────────────────────────

  const ov = stats.overview;
  const winPct = ov.gamesPlayed > 0 ? Math.round((ov.wins / ov.gamesPlayed) * 100) : 0;
  const lossPct = ov.gamesPlayed > 0 ? Math.round((ov.losses / ov.gamesPlayed) * 100) : 0;
  const wallPct = ov.gamesPlayed > 0 ? 100 - winPct - lossPct : 0;

  // SVG donut chart
  const donutR = 40;
  const donutStroke = 10;
  const donutCirc = 2 * Math.PI * donutR;
  const winArc = (winPct / 100) * donutCirc;
  const lossArc = (lossPct / 100) * donutCirc;
  const wallArc = (wallPct / 100) * donutCirc;

  // ── Winning Lines ───────────────────────────────────────

  const sortedSections = [...stats.sectionWins].sort((a, b) => b.wins - a.wins);
  const maxWins = Math.max(...sortedSections.map(s => s.wins), 1);

  const BAR_COLORS = [seafoam, cerulean, lavender, gold,
    isDark ? "rgba(168,216,238,0.4)" : "rgba(126,100,164,0.3)",
    isDark ? "rgba(168,216,238,0.3)" : "rgba(126,100,164,0.2)",
    isDark ? "rgba(168,216,238,0.2)" : "rgba(126,100,164,0.15)",
    isDark ? "rgba(168,216,238,0.15)" : "rgba(126,100,164,0.1)",
    isDark ? "rgba(168,216,238,0.1)" : "rgba(126,100,164,0.08)",
    isDark ? "rgba(168,216,238,0.08)" : "rgba(126,100,164,0.06)",
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

  // ── Render ─────────────────────────────────────────────

  return (
    <>
      <PT>Stats</PT>
      <Cnt>
        {/* ═══ FILTERS ═══ */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center", flexWrap: "wrap" as const }}>
          <div style={{ display: "flex", gap: 4, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(126,100,164,0.03)", borderRadius: 20, padding: 3 }}>
            {PERIODS.map(p => {
              const isActive = period === p.id;
              return (
                <div key={p.id} onClick={() => setPeriod(p.id)} style={{
                  padding: "5px 12px", borderRadius: 18, cursor: "pointer",
                  fontSize: 10, fontWeight: isActive ? 600 : 400, fontFamily: FONT_SANS,
                  background: isActive ? (isDark ? "rgba(168,216,238,0.12)" : "#E03050") : "transparent",
                  color: isActive ? (isDark ? "#A8D8EE" : "#fff") : t.textMid,
                  transition: "all 0.2s",
                }}>
                  {p.label}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 4, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(126,100,164,0.03)", borderRadius: 20, padding: 3 }}>
            {availableYears.map(yr => {
              const isActive = cardYear === yr;
              return (
                <div key={yr} onClick={() => setCardYear(yr)} style={{
                  padding: "5px 12px", borderRadius: 18, cursor: "pointer",
                  fontSize: 10, fontWeight: isActive ? 600 : 400, fontFamily: FONT_SANS,
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

        {/* ═══ GAME OVERVIEW ═══ */}
        {sectionLabel("Game Overview")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            { label: "Games Played", value: ov.gamesPlayed, color: t.statNumColor },
            { label: "Wins", value: ov.wins, color: seafoam },
            { label: "Losses", value: ov.losses, color: cherry },
            { label: "Wall Games", value: ov.wallGames, color: cerulean },
          ].map(card => (
            <div key={card.label} style={glassCard({ padding: "14px 14px", textAlign: "center" as const })}>
              {gloss}
              <div style={{ fontFamily: FONT_SANS, fontSize: 8, fontWeight: 600, color: t.textDim, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 4 }}>
                {card.label}
              </div>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 28, fontWeight: 700, color: card.color, lineHeight: 1 }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Win Rate Donut */}
        <div style={glassCard({ marginBottom: 20, padding: "16px 16px", display: "flex" as const, alignItems: "center" as const, gap: 20 })}>
          {gloss}
          <svg viewBox="0 0 100 100" style={{ width: 90, height: 90, flexShrink: 0 }}>
            {/* Track */}
            <circle cx={50} cy={50} r={donutR} fill="none" stroke={trackBg} strokeWidth={donutStroke} />
            {/* Win arc */}
            <circle cx={50} cy={50} r={donutR} fill="none" stroke={seafoam}
              strokeWidth={donutStroke} strokeLinecap="round"
              strokeDasharray={`${winArc} ${donutCirc}`}
              strokeDashoffset={0}
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dasharray 0.8s ease" }} />
            {/* Loss arc */}
            <circle cx={50} cy={50} r={donutR} fill="none" stroke={cherry} opacity={0.65}
              strokeWidth={donutStroke}
              strokeDasharray={`${lossArc} ${donutCirc}`}
              strokeDashoffset={-winArc}
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dasharray 0.8s ease" }} />
            {/* Wall arc */}
            {wallPct > 0 && <circle cx={50} cy={50} r={donutR} fill="none" stroke={cerulean} opacity={0.7}
              strokeWidth={donutStroke}
              strokeDasharray={`${wallArc} ${donutCirc}`}
              strokeDashoffset={-(winArc + lossArc)}
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dasharray 0.8s ease" }} />}
            {/* Center text */}
            <text x={50} y={47} textAnchor="middle" style={{ fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 700, fill: t.statNumColor }}>{winPct}%</text>
            <text x={50} y={59} textAnchor="middle" style={{ fontFamily: FONT_SANS, fontSize: 6, fill: t.textDim, letterSpacing: 0.5 }}>WIN RATE</text>
          </svg>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {[{ c: seafoam, l: "Wins", v: `${winPct}%` }, { c: cherry, l: "Losses", v: `${lossPct}%`, o: 0.65 }, { c: cerulean, l: "Wall", v: `${wallPct}%`, o: 0.7 }].map(item => (
              <div key={item.l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: item.c, opacity: item.o || 1 }} />
                <span style={{ fontFamily: FONT_SANS, fontSize: 10, color: t.textMain, fontWeight: 500 }}>{item.l}</span>
                <span style={{ fontFamily: FONT_SERIF, fontSize: 13, fontWeight: 600, color: item.c, opacity: item.o || 1, marginLeft: 2 }}>{item.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SPEED & POINTS (horizontal scroll) ═══ */}
        {sectionLabel("Speed & Points")}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {/* Speed card */}
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

          {/* Points card */}
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

                {/* Expanded lines */}
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
                            {line.pattern}
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

        {/* ═══ PLAYER STYLE ═══ */}
        {sectionLabel("Player Style")}
        <div style={glassCard({ marginBottom: 20, padding: "22px 20px" })}>
          {gloss}

          {/* Archetype hero */}
          <div style={{
            fontFamily: FONT_SERIF, fontSize: 24, fontWeight: 700,
            color: isDark ? cerulean : "#E03050",
            letterSpacing: 1, marginBottom: 4,
          }}>
            {stats.style.archetype}
          </div>
          <div style={{
            fontFamily: FONT_SANS, fontSize: 11, color: t.textMid,
            lineHeight: 1.6, marginBottom: 18, maxWidth: 340, fontStyle: "italic",
          }}>
            {stats.style.tagline}
          </div>

          {/* Attributes — no titles, just descriptive text */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
            {[stats.style.engagement, stats.style.favoredSection, stats.style.exposures].map((text, i) => (
              <div key={i} style={{
                fontFamily: FONT_SANS, fontSize: 11, color: t.textMain, lineHeight: 1.6,
                paddingBottom: i < 2 ? 14 : 0,
                borderBottom: i < 2 ? `0.5px solid ${divider}` : "none",
              }}>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ═══ ACTIVITY & STREAK ═══ */}
        {sectionLabel("Activity")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 50, alignItems: "start" as const }}>
          {/* Heat map calendar */}
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
                  {dow === 1 ? "M" : dow === 3 ? "W" : dow === 5 ? "F" : ""}
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

          {/* Streak card */}
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
