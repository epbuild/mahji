// ═══════════════════════════════════════════════════════════════
// MAHJI — Stats Page
// File: src/pages/StatsPage.tsx
//
// Sophisticated player intelligence dashboard.
// Mahjong IQ, skill pillars, personality profile, activity.
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { getThemeColors, FONT_SERIF, FONT_SANS } from '../constants/colors';
import { useTheme } from '../constants/ThemeContext';
import { PT, Cnt } from '../components/Layout';

// ─── TYPES ──────────────────────────────────────────────────

interface PillarData {
  label: string;
  abbrev: string;
  score: number;
  weight: string;
  detail: string;
}

interface DimensionData {
  label: string;
  left: string;
  right: string;
  value: number; // 0-100, 50 = center
  tag: string;
}

interface ActivityDay {
  label: string;
  drills: number;
  maxDrills: number;
}

// ─── MOCK DATA ──────────────────────────────────────────────
// Replace with real user data when analytics engine is ready

const MOCK_IQ = 1247;
const MOCK_TIER = "Strategic" as const;
const MOCK_PERCENTILE = 18;

const TIERS: Record<string, { range: string; color: (isDark: boolean) => string }> = {
  "Casual":              { range: "800–1,000",   color: (d) => d ? "rgba(255,255,255,0.35)" : "#9A8DAA" },
  "Confident":           { range: "1,001–1,200", color: (d) => d ? "#A8D8EE" : "#4A96B8" },
  "Strategic":           { range: "1,201–1,400", color: (d) => d ? "#85D4BC" : "#4A9E88" },
  "Advanced":            { range: "1,401–1,700", color: (d) => d ? "#D4C8E8" : "#7E64A4" },
  "Tournament-Caliber":  { range: "1,701–2,000", color: (d) => d ? "#F0C060" : "#B08D3A" },
};

const PILLARS: PillarData[] = [
  { label: "Card Fluency", abbrev: "CF", score: 78, weight: "30%", detail: "Pattern recognition speed & accuracy across all sections" },
  { label: "Flexibility", abbrev: "FL", score: 62, weight: "25%", detail: "Ability to pivot strategies when the deal shifts" },
  { label: "Defensive Discipline", abbrev: "DD", score: 71, weight: "30%", detail: "Discard safety, feed rate awareness, exposure reads" },
];

const TACTICAL_SCORE = 66;
const TACTICAL_WEIGHT = "15%";

const DIMENSIONS: DimensionData[] = [
  { label: "Flexibility", left: "Shape Shifter", right: "Romantic", value: 35, tag: "The Shape Shifter" },
  { label: "Defense", left: "The Lock", right: "The Arsonist", value: 28, tag: "The Lock" },
  { label: "Joker Temperament", left: "Minimalist", right: "Firestarter", value: 55, tag: "Balanced" },
  { label: "Strategic Bias", left: "Architect", right: "High-Roller", value: 40, tag: "The Architect" },
];

const PERSONALITY_LABEL = "The Surgeon";
const PERSONALITY_DESC = "Precise, methodical, and unshakable. You read the table like an operating room — every discard is deliberate.";

const IDENTITY = {
  bestSection: "Consecutive Runs",
  jokerStyle: "Conservative — holds jokers for key melds",
  defenseProfile: "The Lock — rarely feeds, disciplined discards",
  feedRate: "12%",
};

const ACTIVITY: ActivityDay[] = [
  { label: "M", drills: 3, maxDrills: 8 },
  { label: "T", drills: 5, maxDrills: 8 },
  { label: "W", drills: 7, maxDrills: 8 },
  { label: "T", drills: 2, maxDrills: 8 },
  { label: "F", drills: 6, maxDrills: 8 },
  { label: "S", drills: 4, maxDrills: 8 },
  { label: "S", drills: 8, maxDrills: 8 },
];

const STREAK = 12;

// ─── DEEP DIVE MOCK DATA ────────────────────────────────────

const DEEP_SKILL = [
  { label: "Pattern Matching", value: 82 },
  { label: "Section Memory", value: 74 },
  { label: "Exposure Reading", value: 68 },
  { label: "Charleston Strategy", value: 85 },
  { label: "Tile Counting", value: 59 },
];

const DEEP_STRATEGY = [
  { label: "Hand Selection", value: 71 },
  { label: "Pivot Timing", value: 58 },
  { label: "Joker Management", value: 66 },
  { label: "Section Diversity", value: 73 },
  { label: "Risk Assessment", value: 64 },
];

const DEEP_DISCIPLINE = [
  { label: "Safe Discards", value: 76 },
  { label: "Feed Avoidance", value: 82 },
  { label: "Late-Game Reads", value: 61 },
  { label: "Exposure Awareness", value: 69 },
  { label: "Wall Tracking", value: 55 },
];

// ─── COMPONENT ──────────────────────────────────────────────

export default function StatsPage() {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const [deepTab, setDeepTab] = useState<"skill" | "strategy" | "discipline">("skill");

  const tierData = TIERS[MOCK_TIER];
  const tierColor = tierData?.color(isDark) || t.textMain;

  // Glass card styling helper
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

  const sectionLabel = (text: string): React.CSSProperties => ({
    fontFamily: FONT_SANS,
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: 1.5,
    textTransform: "uppercase" as const,
    color: t.textDim,
    marginBottom: 12,
  });

  // ── Render ─────────────────────────────────────────────

  return (
    <>
      <PT>Stats</PT>
      <Cnt>
        {/* ═══ HERO: MAHJONG IQ ═══ */}
        <div style={{ ...glassCard({ marginBottom: 16, textAlign: "center" as const, padding: "28px 20px 24px" }) }}>
          <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0, background: t.cardGloss, pointerEvents: "none" as const, borderRadius: 16 }} />

          <div style={{ ...sectionLabel(""), marginBottom: 8 }}>Mahjong IQ</div>

          {/* IQ Number */}
          <div style={{
            fontFamily: FONT_SERIF, fontSize: 56, fontWeight: 700,
            color: tierColor, lineHeight: 1, letterSpacing: -1,
            position: "relative" as const,
          }}>
            {MOCK_IQ.toLocaleString()}
          </div>

          {/* Tier badge */}
          <div style={{
            display: "inline-block", marginTop: 8,
            padding: "4px 16px", borderRadius: 20,
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(126,100,164,0.04)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(126,100,164,0.08)"}`,
          }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: 600, color: tierColor, letterSpacing: 0.5 }}>
              {MOCK_TIER}
            </span>
            <span style={{ fontFamily: FONT_SANS, fontSize: 9, color: t.textDim, marginLeft: 8 }}>
              {tierData?.range}
            </span>
          </div>

          {/* Percentile */}
          <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: t.textDim, marginTop: 10, fontStyle: "italic" }}>
            Top {MOCK_PERCENTILE}% of players
          </div>
        </div>

        {/* ═══ THREE PILLARS ═══ */}
        <div style={{ ...sectionLabel("") }}>Performance Pillars</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {PILLARS.map(p => (
            <div key={p.abbrev} style={glassCard({ padding: "14px 12px", textAlign: "center" as const })}>
              <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0, background: t.cardGloss, pointerEvents: "none" as const, borderRadius: 16 }} />
              <div style={{ fontFamily: FONT_SANS, fontSize: 8, fontWeight: 600, color: t.textDim, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 6 }}>
                {p.label}
              </div>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 28, fontWeight: 700, color: t.statNumColor, lineHeight: 1 }}>
                {p.score}
              </div>
              {/* Mini progress bar */}
              <div style={{
                height: 3, borderRadius: 2, marginTop: 8,
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(126,100,164,0.06)",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: 2,
                  width: `${p.score}%`,
                  background: `linear-gradient(90deg, ${t.seafoam}, ${t.cerulean})`,
                  transition: "width 0.8s ease",
                }} />
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 7, color: t.textDim, marginTop: 4 }}>
                {p.weight} of IQ
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Judgment — smaller inline row */}
        <div style={{
          ...glassCard({ padding: "10px 16px", marginBottom: 20, display: "flex" as const, alignItems: "center" as const, gap: 12 }),
        }}>
          <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0, background: t.cardGloss, pointerEvents: "none" as const, borderRadius: 16 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, fontWeight: 600, color: t.textDim, letterSpacing: 0.5, textTransform: "uppercase" as const }}>
              Tactical Judgment
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 8, color: t.textDim, marginTop: 2 }}>
              {TACTICAL_WEIGHT} of IQ · Intuition & timing
            </div>
          </div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 22, fontWeight: 700, color: t.statNumColor }}>
            {TACTICAL_SCORE}
          </div>
        </div>

        {/* ═══ PERSONALITY PROFILE ═══ */}
        <div style={{ ...sectionLabel("") }}>Your Profile</div>
        <div style={glassCard({ marginBottom: 16, padding: "22px 20px" })}>
          <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0, background: t.cardGloss, pointerEvents: "none" as const, borderRadius: 16 }} />

          {/* Personality label */}
          <div style={{
            fontFamily: FONT_SERIF, fontSize: 22, fontWeight: 700,
            color: isDark ? "#A8D8EE" : "#E03050",
            letterSpacing: 1, marginBottom: 4,
          }}>
            {PERSONALITY_LABEL}
          </div>
          <div style={{
            fontFamily: FONT_SANS, fontSize: 11, color: t.textMid,
            lineHeight: 1.6, marginBottom: 16, maxWidth: 320, fontStyle: "italic",
          }}>
            {PERSONALITY_DESC}
          </div>

          {/* Identity rows */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
            {[
              { label: "Strongest Section", value: IDENTITY.bestSection },
              { label: "Joker Style", value: IDENTITY.jokerStyle },
              { label: "Defensive Profile", value: IDENTITY.defenseProfile },
              { label: "Feed Rate", value: IDENTITY.feedRate },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", alignItems: "baseline" as const, gap: 8 }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 8, fontWeight: 600, color: t.textDim, letterSpacing: 0.8, textTransform: "uppercase" as const, minWidth: 90, flexShrink: 0 }}>
                  {row.label}
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: t.textMain, fontWeight: 500 }}>
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ PERSONALITY DIMENSIONS ═══ */}
        <div style={{ ...sectionLabel("") }}>Personality Dimensions</div>
        <div style={glassCard({ marginBottom: 20, padding: "18px 16px" })}>
          <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0, background: t.cardGloss, pointerEvents: "none" as const, borderRadius: 16 }} />

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
            {DIMENSIONS.map(dim => (
              <div key={dim.label}>
                {/* Label row */}
                <div style={{ display: "flex", justifyContent: "space-between" as const, alignItems: "center" as const, marginBottom: 6 }}>
                  <span style={{ fontFamily: FONT_SANS, fontSize: 9, fontWeight: 600, color: t.textDim, letterSpacing: 0.5, textTransform: "uppercase" as const }}>
                    {dim.label}
                  </span>
                  <span style={{
                    fontFamily: FONT_SANS, fontSize: 9, fontWeight: 600,
                    color: isDark ? "#A8D8EE" : "#7E64A4",
                    padding: "2px 8px", borderRadius: 8,
                    background: isDark ? "rgba(168,216,238,0.08)" : "rgba(126,100,164,0.05)",
                  }}>
                    {dim.tag}
                  </span>
                </div>

                {/* Spectrum bar */}
                <div style={{ position: "relative" as const, height: 6, borderRadius: 3, overflow: "hidden", background: isDark ? "rgba(255,255,255,0.04)" : "rgba(126,100,164,0.04)" }}>
                  <div style={{
                    position: "absolute" as const, top: 0, bottom: 0,
                    left: `${Math.max(0, dim.value - 2)}%`,
                    width: 8, borderRadius: 3,
                    background: isDark ? "#A8D8EE" : "#7E64A4",
                  }} />
                </div>

                {/* Left/Right labels */}
                <div style={{ display: "flex", justifyContent: "space-between" as const, marginTop: 3 }}>
                  <span style={{ fontFamily: FONT_SANS, fontSize: 7, color: t.textDim }}>{dim.left}</span>
                  <span style={{ fontFamily: FONT_SANS, fontSize: 7, color: t.textDim }}>{dim.right}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ ACTIVITY ═══ */}
        <div style={{ ...sectionLabel("") }}>This Week</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, marginBottom: 20 }}>
          {/* 7-day bar chart */}
          <div style={glassCard({ padding: "14px 16px" })}>
            <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0, background: t.cardGloss, pointerEvents: "none" as const, borderRadius: 16 }} />
            <div style={{ display: "flex", alignItems: "flex-end" as const, gap: 6, height: 52, justifyContent: "space-between" as const }}>
              {ACTIVITY.map((day, i) => {
                const pct = day.maxDrills > 0 ? (day.drills / day.maxDrills) * 100 : 0;
                const isToday = i === ACTIVITY.length - 1;
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center" as const, gap: 3, flex: 1 }}>
                    <div style={{
                      width: "100%", maxWidth: 18, borderRadius: 3,
                      height: Math.max(4, (pct / 100) * 44),
                      background: isToday
                        ? (isDark ? "#A8D8EE" : "#E03050")
                        : (isDark ? "rgba(168,216,238,0.2)" : "rgba(126,100,164,0.12)"),
                      transition: "height 0.5s ease",
                    }} />
                    <span style={{
                      fontFamily: FONT_SANS, fontSize: 7,
                      color: isToday ? (isDark ? "#A8D8EE" : "#E03050") : t.textDim,
                      fontWeight: isToday ? 700 : 400,
                    }}>
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Streak */}
          <div style={glassCard({ padding: "14px 18px", textAlign: "center" as const, minWidth: 80, display: "flex" as const, flexDirection: "column" as const, alignItems: "center" as const, justifyContent: "center" as const })}>
            <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0, background: t.cardGloss, pointerEvents: "none" as const, borderRadius: 16 }} />
            <div style={{ fontFamily: FONT_SERIF, fontSize: 28, fontWeight: 700, color: isDark ? "#F0C060" : "#B08D3A", lineHeight: 1 }}>
              {STREAK}
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 8, fontWeight: 600, color: t.textDim, letterSpacing: 0.8, textTransform: "uppercase" as const, marginTop: 4 }}>
              day streak
            </div>
          </div>
        </div>

        {/* ═══ DEEP DIVE ═══ */}
        <div style={{ ...sectionLabel("") }}>Deep Dive</div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {([
            { id: "skill" as const, label: "Skill" },
            { id: "strategy" as const, label: "Strategy" },
            { id: "discipline" as const, label: "Discipline" },
          ]).map(tab => {
            const isActive = deepTab === tab.id;
            return (
              <div key={tab.id} onClick={() => setDeepTab(tab.id)} style={{
                padding: "6px 16px", borderRadius: 20, cursor: "pointer",
                fontSize: 10, fontWeight: isActive ? 600 : 400,
                fontFamily: FONT_SANS, letterSpacing: 0.3,
                background: isActive ? (isDark ? "rgba(168,216,238,0.12)" : "rgba(224,48,80,0.06)") : "transparent",
                color: isActive ? (isDark ? "#A8D8EE" : "#E03050") : t.textMid,
                border: isActive ? `1px solid ${isDark ? "rgba(168,216,238,0.2)" : "rgba(224,48,80,0.12)"}` : `1px solid ${t.btnBorder}`,
                transition: "all 0.2s",
              }}>
                {tab.label}
              </div>
            );
          })}
        </div>

        {/* Tab content */}
        <div style={glassCard({ marginBottom: 24, padding: "16px 18px" })}>
          <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0, background: t.cardGloss, pointerEvents: "none" as const, borderRadius: 16 }} />

          {(deepTab === "skill" ? DEEP_SKILL : deepTab === "strategy" ? DEEP_STRATEGY : DEEP_DISCIPLINE).map((item, i) => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center" as const, gap: 10,
              padding: "8px 0",
              borderBottom: i < 4 ? `0.5px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(126,100,164,0.06)"}` : "none",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: 500, color: t.textMain }}>
                  {item.label}
                </div>
                {/* Horizontal bar */}
                <div style={{
                  height: 3, borderRadius: 2, marginTop: 4,
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(126,100,164,0.04)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 2,
                    width: `${item.value}%`,
                    background: item.value >= 75
                      ? (isDark ? "#85D4BC" : "#4A9E88")
                      : item.value >= 60
                        ? (isDark ? "#A8D8EE" : "#4A96B8")
                        : (isDark ? "rgba(255,255,255,0.15)" : "rgba(126,100,164,0.2)"),
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 16, fontWeight: 600, color: t.statNumColor, minWidth: 28, textAlign: "right" as const }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* ═══ TIER REFERENCE ═══ */}
        <div style={{ ...sectionLabel(""), marginTop: 4 }}>IQ Tiers</div>
        <div style={{ marginBottom: 30 }}>
          {Object.entries(TIERS).map(([name, data]) => {
            const isActive = name === MOCK_TIER;
            return (
              <div key={name} style={{
                display: "flex", alignItems: "center" as const, gap: 10,
                padding: "6px 0",
                opacity: isActive ? 1 : 0.5,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: data.color(isDark),
                  flexShrink: 0,
                }} />
                <div style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: isActive ? 600 : 400, color: isActive ? data.color(isDark) : t.textDim, flex: 1 }}>
                  {name}
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 9, color: t.textDim }}>
                  {data.range}
                </div>
              </div>
            );
          })}
        </div>

      </Cnt>
    </>
  );
}
