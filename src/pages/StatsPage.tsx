// ═══════════════════════════════════════════════════════════════
// MAHJI — Stats Page
// File: src/pages/StatsPage.tsx
//
// Player statistics dashboard: game overview, speed, points,
// favorite NMJL sections, player style, and activity calendar.
// All data is currently mock — structured for easy swap to real.
// ═══════════════════════════════════════════════════════════════

import { useState, useMemo } from 'react';
import { getThemeColors, FONT_SERIF, FONT_SANS } from '../constants/colors';
import { useTheme } from '../constants/ThemeContext';
import { PT, Cnt } from '../components/Layout';
import { SECTION_ORDER, SECTION_LABELS, getAvailableYears, getCurrentYear } from '../data/nmjl';
import type { CardSection } from '../data/nmjl';

// ─── TYPES ──────────────────────────────────────────────────

type TimePeriod = 'all_time' | 'last_week' | 'last_month' | 'last_year';

interface GameOverviewStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  wallGames: number;
}

interface GameHistoryEntry {
  label: string;
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
  jokersReceived: number;
  jokersSwapped: number;
}

interface SectionWinData {
  section: CardSection;
  wins: number;
}

interface PlayerStyle {
  archetype: string;
  tagline: string;
  traits: { category: string; title: string; desc: string; isElite?: boolean }[];
}

interface CalendarDay {
  date: string;
  gamesPlayed: number;
}

interface StatsData {
  overview: GameOverviewStats;
  history: GameHistoryEntry[];
  speed: SpeedStats;
  points: PointsStats;
  sectionWins: SectionWinData[];
  style: PlayerStyle;
  calendar: CalendarDay[];
  currentStreak: number;
  longestStreak: number;
}

// ─── MOCK DATA ──────────────────────────────────────────────
// Replace with real user data when analytics engine is ready

function generateCalendar(): CalendarDay[] {
  const days: CalendarDay[] = [];
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    // Weighted random: 40% 0, 25% 1, 20% 2, 10% 3, 5% 4+
    const r = Math.random();
    const games = r < 0.4 ? 0 : r < 0.65 ? 1 : r < 0.85 ? 2 : r < 0.95 ? 3 : 4 + Math.floor(Math.random() * 3);
    days.push({ date: iso, gamesPlayed: games });
  }
  // Ensure recent streak
  for (let i = days.length - 7; i < days.length; i++) {
    if (days[i]) days[i].gamesPlayed = Math.max(1, days[i].gamesPlayed);
  }
  return days;
}

const CALENDAR_CACHE = generateCalendar();

const MOCK_ALL_2025: StatsData = {
  overview: { gamesPlayed: 47, wins: 14, losses: 28, wallGames: 5 },
  history: [
    { label: "Sep", wins: 2, losses: 4, wallGames: 1 },
    { label: "Oct", wins: 3, losses: 5, wallGames: 0 },
    { label: "Nov", wins: 2, losses: 6, wallGames: 1 },
    { label: "Dec", wins: 1, losses: 3, wallGames: 1 },
    { label: "Jan", wins: 3, losses: 4, wallGames: 0 },
    { label: "Feb", wins: 3, losses: 6, wallGames: 2 },
  ],
  speed: { avgGameDurationMin: 32, avgCharlestonThinkSec: 4.2, avgGameplayThinkSec: 8.1 },
  points: { overall: 1840, earned: 2450, deducted: 610, avgPerGame: 39.1, deadHands: 3, jokersReceived: 62, jokersSwapped: 18 },
  sectionWins: [
    { section: 'consecutive_run', wins: 4 },
    { section: '2468', wins: 3 },
    { section: 'any_like_numbers', wins: 2 },
    { section: 'winds_dragons', wins: 2 },
    { section: 'year', wins: 1 },
    { section: 'singles_pairs', wins: 1 },
    { section: 'quints', wins: 1 },
    { section: 'addition', wins: 0 },
    { section: '13579', wins: 0 },
    { section: '369', wins: 0 },
  ],
  style: {
    archetype: "The Architect",
    tagline: "Methodical and precise. You build your hand like a blueprint, favoring structure and long-range planning.",
    traits: [
      { category: "Engagement", title: "The Devotee", desc: "Plays almost daily" },
      { category: "Strongest", title: "Run Master", desc: "Dominates Consecutive Runs" },
      { category: "Jokers", title: "The Minimalist", desc: "Holds jokers conservatively" },
      { category: "Exposing", title: "Late Revealer", desc: "Exposes after turn 8 on average" },
      { category: "Line Style", title: "Shadow Player", desc: "Favors concealed hands", isElite: true },
    ],
  },
  calendar: CALENDAR_CACHE,
  currentStreak: 7,
  longestStreak: 14,
};

const MOCK_MONTH_2025: StatsData = {
  overview: { gamesPlayed: 12, wins: 4, losses: 7, wallGames: 1 },
  history: [
    { label: "W1", wins: 1, losses: 2, wallGames: 0 },
    { label: "W2", wins: 1, losses: 1, wallGames: 1 },
    { label: "W3", wins: 0, losses: 3, wallGames: 0 },
    { label: "W4", wins: 2, losses: 1, wallGames: 0 },
  ],
  speed: { avgGameDurationMin: 28, avgCharlestonThinkSec: 3.8, avgGameplayThinkSec: 7.4 },
  points: { overall: 490, earned: 650, deducted: 160, avgPerGame: 40.8, deadHands: 1, jokersReceived: 16, jokersSwapped: 5 },
  sectionWins: [
    { section: '2468', wins: 2 },
    { section: 'consecutive_run', wins: 1 },
    { section: 'winds_dragons', wins: 1 },
    { section: 'any_like_numbers', wins: 0 },
    { section: 'year', wins: 0 },
    { section: 'singles_pairs', wins: 0 },
    { section: 'quints', wins: 0 },
    { section: 'addition', wins: 0 },
    { section: '13579', wins: 0 },
    { section: '369', wins: 0 },
  ],
  style: MOCK_ALL_2025.style,
  calendar: CALENDAR_CACHE,
  currentStreak: 7,
  longestStreak: 14,
};

const MOCK_ALL_2024: StatsData = {
  overview: { gamesPlayed: 83, wins: 28, losses: 47, wallGames: 8 },
  history: [
    { label: "Jul", wins: 3, losses: 5, wallGames: 1 },
    { label: "Aug", wins: 4, losses: 7, wallGames: 2 },
    { label: "Sep", wins: 5, losses: 8, wallGames: 1 },
    { label: "Oct", wins: 6, losses: 9, wallGames: 1 },
    { label: "Nov", wins: 5, losses: 10, wallGames: 2 },
    { label: "Dec", wins: 5, losses: 8, wallGames: 1 },
  ],
  speed: { avgGameDurationMin: 36, avgCharlestonThinkSec: 5.1, avgGameplayThinkSec: 9.3 },
  points: { overall: 3280, earned: 4100, deducted: 820, avgPerGame: 39.5, deadHands: 6, jokersReceived: 108, jokersSwapped: 34 },
  sectionWins: [
    { section: 'any_like_numbers', wins: 6 },
    { section: '2468', wins: 5 },
    { section: 'year', wins: 4 },
    { section: 'consecutive_run', wins: 4 },
    { section: '13579', wins: 3 },
    { section: 'winds_dragons', wins: 2 },
    { section: 'addition', wins: 2 },
    { section: 'quints', wins: 1 },
    { section: '369', wins: 1 },
    { section: 'singles_pairs', wins: 0 },
  ],
  style: {
    archetype: "The Opportunist",
    tagline: "Agile and instinctive. You read the flow of the game and pivot faster than most players realize.",
    traits: [
      { category: "Engagement", title: "Regular", desc: "Plays 3-4 times per week" },
      { category: "Strongest", title: "Pattern Spotter", desc: "Excels at Any Like Numbers" },
      { category: "Jokers", title: "The Trader", desc: "Actively swaps jokers for flexibility" },
      { category: "Exposing", title: "Early Exposer", desc: "Exposes by turn 5 on average" },
      { category: "Line Style", title: "Power Player", desc: "Favors hands with pungs and kongs" },
    ],
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

  // ── SECTION 1: Filters ──────────────────────────────────

  const PERIODS: { id: TimePeriod; label: string }[] = [
    { id: 'all_time', label: 'All Time' },
    { id: 'last_week', label: 'Week' },
    { id: 'last_month', label: 'Month' },
    { id: 'last_year', label: 'Year' },
  ];

  const FilterBar = (
    <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center", flexWrap: "wrap" as const }}>
      {/* Time Period */}
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

      {/* Card Year */}
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
  );

  // ── SECTION 2: Game Overview ────────────────────────────

  const ov = stats.overview;
  const overviewCards: { label: string; value: number; color: string }[] = [
    { label: "Games Played", value: ov.gamesPlayed, color: t.statNumColor },
    { label: "Wins", value: ov.wins, color: seafoam },
    { label: "Losses", value: ov.losses, color: cherry },
    { label: "Wall Games", value: ov.wallGames, color: cerulean },
  ];

  // SVG stacked bar chart
  const chartH = 120;
  const chartW = 300;
  const barW = 28;
  const hist = stats.history;
  const maxTotal = Math.max(...hist.map(h => h.wins + h.losses + h.wallGames), 1);
  const barGap = hist.length > 1 ? (chartW - hist.length * barW) / (hist.length - 1) : 0;

  const StackedChart = (
    <svg viewBox={`0 0 ${chartW} ${chartH + 18}`} style={{ width: "100%", height: "auto", display: "block", marginTop: 12 }}>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map(pct => (
        <line key={pct} x1={0} x2={chartW} y1={chartH - pct * chartH} y2={chartH - pct * chartH} stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(126,100,164,0.08)"} strokeWidth={0.5} />
      ))}
      {/* Bars */}
      {hist.map((entry, i) => {
        const total = entry.wins + entry.losses + entry.wallGames;
        const x = i * (barW + barGap);
        const winH = (entry.wins / maxTotal) * chartH;
        const lossH = (entry.losses / maxTotal) * chartH;
        const wallH = (entry.wallGames / maxTotal) * chartH;
        const r = 3;
        return (
          <g key={i}>
            {/* Wall (top) */}
            {entry.wallGames > 0 && <rect x={x} y={chartH - winH - lossH - wallH} width={barW} height={wallH} rx={total === entry.wallGames ? r : 0} fill={cerulean} opacity={0.7} />}
            {/* Loss (middle) */}
            {entry.losses > 0 && <rect x={x} y={chartH - winH - lossH} width={barW} height={lossH} fill={cherry} opacity={0.65} />}
            {/* Win (bottom) */}
            {entry.wins > 0 && <rect x={x} y={chartH - winH} width={barW} height={winH} rx={r} fill={seafoam} />}
            {/* Top cap radius */}
            {total > 0 && <rect x={x} y={chartH - winH - lossH - wallH} width={barW} height={Math.min(r * 2, (total / maxTotal) * chartH)} rx={r} fill={entry.wallGames > 0 ? cerulean : entry.losses > 0 ? cherry : seafoam} opacity={entry.wallGames > 0 ? 0.7 : entry.losses > 0 ? 0.65 : 1} />}
            {/* Label */}
            <text x={x + barW / 2} y={chartH + 12} textAnchor="middle" style={{ fontSize: 8, fontFamily: FONT_SANS, fill: t.textDim }}>{entry.label}</text>
          </g>
        );
      })}
    </svg>
  );

  // Legend
  const Legend = (
    <div style={{ display: "flex", gap: 14, marginTop: 8, justifyContent: "center" }}>
      {[{ c: seafoam, l: "Wins" }, { c: cherry, l: "Losses" }, { c: cerulean, l: "Wall" }].map(item => (
        <div key={item.l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: item.c, opacity: item.l === "Losses" ? 0.65 : item.l === "Wall" ? 0.7 : 1 }} />
          <span style={{ fontFamily: FONT_SANS, fontSize: 8, color: t.textDim }}>{item.l}</span>
        </div>
      ))}
    </div>
  );

  // ── SECTION 5: Favorite Sections ────────────────────────

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

  // ── SECTION 7: Calendar ─────────────────────────────────

  const cal = stats.calendar;
  // Build 12-week grid (columns = weeks, rows = day of week 0-6)
  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];
  cal.forEach((day, i) => {
    const dow = new Date(day.date).getDay(); // 0=Sun
    if (dow === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  if (currentWeek.length) weeks.push(currentWeek);

  const calMaxGames = Math.max(...cal.map(d => d.gamesPlayed), 1);
  const calColor = isDark ? [24, 190, 155] : [74, 158, 136]; // seafoam RGB

  function calOpacity(games: number): number {
    if (games === 0) return 0;
    if (games === 1) return 0.25;
    if (games <= 2) return 0.5;
    if (games <= 3) return 0.75;
    return 1;
  }

  // Month labels for calendar
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
        {FilterBar}

        {/* ═══ GAME OVERVIEW ═══ */}
        {sectionLabel("Game Overview")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {overviewCards.map(card => (
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

        {/* Chart */}
        <div style={glassCard({ marginBottom: 20, padding: "16px 16px 10px" })}>
          {gloss}
          {StackedChart}
          {Legend}
        </div>

        {/* ═══ SPEED ═══ */}
        {sectionLabel("Speed")}
        <div style={glassCard({ marginBottom: 20, padding: "16px 18px" })}>
          {gloss}
          {[
            { label: "Average Game Duration", value: `${stats.speed.avgGameDurationMin} min` },
            { label: "Avg Think Time — Charleston", value: `${stats.speed.avgCharlestonThinkSec}s` },
            { label: "Avg Think Time — Gameplay", value: `${stats.speed.avgGameplayThinkSec}s` },
          ].map((row, i) => (
            <div key={row.label} style={{
              display: "flex", justifyContent: "space-between" as const, alignItems: "center" as const,
              padding: "10px 0",
              borderBottom: i < 2 ? `0.5px solid ${divider}` : "none",
            }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: 500, color: t.textMain }}>{row.label}</span>
              <span style={{ fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 700, color: t.statNumColor }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* ═══ POINTS ═══ */}
        {sectionLabel("Points")}
        <div style={glassCard({ marginBottom: 20, padding: "20px 18px" })}>
          {gloss}

          {/* Overall hero */}
          <div style={{ textAlign: "center" as const, marginBottom: 16 }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 8, fontWeight: 600, color: t.textDim, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 4 }}>Overall Points</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 42, fontWeight: 700, color: t.statNumColor, lineHeight: 1 }}>
              {stats.points.overall.toLocaleString()}
            </div>
          </div>

          {/* Earned vs Deducted ratio bar */}
          <div style={{ height: 4, borderRadius: 2, overflow: "hidden", display: "flex", marginBottom: 16 }}>
            <div style={{ height: "100%", width: `${(stats.points.earned / (stats.points.earned + stats.points.deducted)) * 100}%`, background: seafoam, borderRadius: "2px 0 0 2px" }} />
            <div style={{ height: "100%", flex: 1, background: cherry, opacity: 0.6, borderRadius: "0 2px 2px 0" }} />
          </div>

          {/* Sub-stat grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            {[
              { label: "Earned", value: `+${stats.points.earned.toLocaleString()}`, color: seafoam },
              { label: "Deducted", value: `-${stats.points.deducted.toLocaleString()}`, color: cherry },
              { label: "Avg / Game", value: stats.points.avgPerGame.toFixed(1), color: t.statNumColor },
              { label: "Dead Hands", value: String(stats.points.deadHands), color: t.textMain },
            ].map(item => (
              <div key={item.label} style={{ textAlign: "center" as const }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 7, fontWeight: 600, color: t.textDim, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 700, color: item.color, lineHeight: 1 }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Joker row */}
          <div style={{ borderTop: `0.5px solid ${divider}`, paddingTop: 14, display: "flex", justifyContent: "center" as const, gap: 24 }}>
            <div style={{ textAlign: "center" as const }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: 7, fontWeight: 600, color: t.textDim, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 3 }}>Jokers Received</div>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 700, color: lavender, lineHeight: 1 }}>{stats.points.jokersReceived}</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 8, color: t.textDim, marginTop: 2 }}>per game: {(stats.points.jokersReceived / Math.max(stats.overview.gamesPlayed, 1)).toFixed(1)}</div>
            </div>
            <div style={{ width: 1, background: divider }} />
            <div style={{ textAlign: "center" as const }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: 7, fontWeight: 600, color: t.textDim, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 3 }}>Jokers Swapped</div>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 700, color: lavender, lineHeight: 1 }}>{stats.points.jokersSwapped}</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 8, color: t.textDim, marginTop: 2 }}>per game: {(stats.points.jokersSwapped / Math.max(stats.overview.gamesPlayed, 1)).toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* ═══ FAVORITE SECTIONS ═══ */}
        {sectionLabel(`Winning Lines — ${cardYear} Card`)}
        <div style={glassCard({ marginBottom: 20, padding: "18px 18px 14px" })}>
          {gloss}

          {sortedSections.map((sec, i) => (
            <div key={sec.section} style={{
              display: "flex", alignItems: "center" as const, gap: 10,
              padding: "8px 0",
              borderBottom: i < sortedSections.length - 1 ? `0.5px solid ${divider}` : "none",
            }}>
              {/* Rank */}
              <div style={{ fontFamily: FONT_SANS, fontSize: 9, fontWeight: 700, color: i < 3 ? BAR_COLORS[i] : t.textDim, width: 14, textAlign: "right" as const, flexShrink: 0 }}>
                {i + 1}
              </div>
              {/* Label + bar */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: 500, color: t.textMain, marginBottom: 4 }}>
                  {SECTION_LABELS[sec.section]}
                </div>
                <div style={{ height: 5, borderRadius: 3, background: trackBg, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    width: sec.wins > 0 ? `${Math.max(4, (sec.wins / maxWins) * 100)}%` : "0%",
                    background: BAR_COLORS[Math.min(i, BAR_COLORS.length - 1)],
                    transition: "width 0.8s ease",
                  }} />
                </div>
              </div>
              {/* Count */}
              <div style={{ fontFamily: FONT_SERIF, fontSize: 14, fontWeight: 600, color: i < 3 ? BAR_COLORS[i] : t.textDim, minWidth: 22, textAlign: "right" as const, flexShrink: 0 }}>
                {sec.wins}
              </div>
            </div>
          ))}

          {/* Placeholder link */}
          <div style={{ textAlign: "center" as const, marginTop: 12 }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: 9, color: t.textDim, cursor: "pointer", fontStyle: "italic" }}>
              View section details (coming soon)
            </span>
          </div>
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

          {/* Trait rows */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {stats.style.traits.map(trait => (
              <div key={trait.category} style={{ display: "flex", alignItems: "flex-start" as const, gap: 10 }}>
                <div style={{
                  fontFamily: FONT_SANS, fontSize: 7, fontWeight: 600, color: t.textDim,
                  letterSpacing: 0.8, textTransform: "uppercase" as const,
                  minWidth: 72, flexShrink: 0, paddingTop: 2,
                }}>
                  {trait.category}
                </div>
                <div>
                  <span style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: 600, color: t.textMain }}>
                    {trait.title}
                  </span>
                  {trait.isElite && (
                    <span style={{
                      fontFamily: FONT_SANS, fontSize: 7, fontWeight: 700,
                      color: gold, letterSpacing: 0.5, textTransform: "uppercase" as const,
                      marginLeft: 6, padding: "2px 6px", borderRadius: 8,
                      background: isDark ? "rgba(240,192,96,0.1)" : "rgba(176,141,58,0.08)",
                      border: `1px solid ${isDark ? "rgba(240,192,96,0.2)" : "rgba(176,141,58,0.15)"}`,
                    }}>
                      Elite
                    </span>
                  )}
                  <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: t.textMid, marginTop: 1 }}>
                    {trait.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ ACTIVITY & STREAK ═══ */}
        {sectionLabel("Activity")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 30, alignItems: "start" as const }}>
          {/* Heat map calendar */}
          <div style={glassCard({ padding: "14px 14px 10px" })}>
            {gloss}
            {/* Month labels */}
            <div style={{ display: "grid", gridTemplateColumns: `18px repeat(${weeks.length}, 10px)`, gap: 2, marginBottom: 4 }}>
              <div /> {/* spacer for day labels column */}
              {weeks.map((_, wi) => {
                const ml = monthLabels.find(m => m.col === wi);
                return (
                  <div key={wi} style={{ fontFamily: FONT_SANS, fontSize: 7, color: t.textDim, textAlign: "center" as const, lineHeight: "10px" }}>
                    {ml ? ml.text : ""}
                  </div>
                );
              })}
            </div>
            {/* Grid rows (7 days) */}
            {[0, 1, 2, 3, 4, 5, 6].map(dow => (
              <div key={dow} style={{ display: "grid", gridTemplateColumns: `18px repeat(${weeks.length}, 10px)`, gap: 2 }}>
                {/* Day label */}
                <div style={{ fontFamily: FONT_SANS, fontSize: 7, color: t.textDim, lineHeight: "10px", textAlign: "right" as const, paddingRight: 3 }}>
                  {dow === 1 ? "M" : dow === 3 ? "W" : dow === 5 ? "F" : ""}
                </div>
                {/* Cells */}
                {weeks.map((week, wi) => {
                  const day = week.find(d => new Date(d.date).getDay() === dow);
                  const games = day ? day.gamesPlayed : -1; // -1 = no data
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

        {/* ═══ FUTURE: POST-GAME FEEDBACK ═══ */}
        {/* Placeholder for post-game feedback engine that will analyze
            game replay and suggest improvements. Stats and tendencies
            from that engine will surface here once built. */}

      </Cnt>
    </>
  );
}
