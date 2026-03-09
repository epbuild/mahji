import { useState } from 'react';
import { C, GAME_MATS, FONT_SERIF, FONT_SANS, getThemeColors } from '../../constants/colors';
import { useTheme } from '../../constants/ThemeContext';
import { PT, Cnt } from '../../components/Layout';
import { DealBoard, FinalTilesBoard } from '../DealMockup';
import type { GameMat } from '../../constants/colors';

/* ─── Step data ─── */
const STEPS: { title: string; description: string }[] = [
  {
    title: "Build the Walls",
    description: "Each player builds a wall of 19 face-down tiles, stacked 2 high, against their rack. The walls form a closed square in the center of the table.",
  },
  {
    title: "Break the Wall (Curtsy)",
    description: "East rolls the dice to get a number and counts that many stacks from the right side of her wall. Let's say that number is 5. Those 5 stacks stay put (shown in blue). The rest of the wall curtsies diagonally — the left end stays near the rack, the right end angles toward the center of the table.",
  },
  {
    title: "Dealing — Round 1",
    description: "East deals from the curtsied wall, starting from the right end (closest to center). Each player gets 2 stacks (4 tiles) in order: East first, then North, West, South. White squares show dealt tiles.",
  },
  {
    title: "Dealing — Round 2",
    description: "Round 2: East deals another 2 stacks to each player. East, North, and West each get theirs, but the curtsied wall runs out before South can be dealt. Time to curtsy the next wall!",
  },
  {
    title: "Curtsy the Next Wall",
    description: "East's wall is depleted! She curtsies South's entire wall (the wall to her left). The tile closest to West stays at the rack, the tile closest to East swings toward center. Dealing continues from South's curtsied wall, starting from the East end.",
  },
  {
    title: "Finish Dealing (3 Rounds)",
    description: "Dealing continues from South's curtsied wall (East end first). 2 more stacks to South to finish Round 2, then a full Round 3 (2 stacks to each player). Everyone now has 6 stacks — that's 12 tiles each.",
  },
  {
    title: "Final Tiles",
    description: "Almost done! From the remaining wall, East takes the 1st and 3rd tiles from the top row. Then North gets the 1st tile from the bottom row. West gets the 2nd tile from the top. South gets the 2nd from the bottom. East ends up with 14 tiles, everyone else has 13.",
  },
];

/* ─── Render the board for each step ─── */
function renderBoard(step: number, mat: GameMat) {
  switch (step) {
    case 0:
      return (
        <DealBoard mat={mat}
          eastWall={19} westWall={19} southWall={19} northWall={19}
          centerLabel="All walls built — 19 tiles × 2 high"
        />
      );
    case 1:
      return (
        <DealBoard mat={mat}
          eastCurtsy eastCurtsyCount={14} eastKept={5}
          westWall={19} southWall={19} northWall={19}
          centerLabel="East counts 5 from right, curtsies the rest toward center"
        />
      );
    case 2:
      return (
        <DealBoard mat={mat}
          eastCurtsy eastCurtsyCount={6} eastKept={5}
          westWall={19} southWall={19} northWall={19}
          dealt={{ east: 2, north: 2, west: 2, south: 2, active: "south" }}
          centerLabel="Round 1 done — 8 stacks dealt, 6 remain"
        />
      );
    case 3:
      return (
        <DealBoard mat={mat}
          eastCurtsy eastCurtsyCount={0} eastKept={5}
          westWall={19} southWall={19} northWall={19}
          dealt={{ east: 4, north: 4, west: 4, south: 2, active: "west" }}
          centerLabel="East's curtsied wall depleted"
        />
      );
    case 4:
      return (
        <DealBoard mat={mat}
          eastCurtsy eastCurtsyCount={0} eastKept={5}
          westWall={19} northWall={19}
          southCurtsy southCurtsyCount={19}
          dealt={{ east: 4, north: 4, west: 4, south: 2, active: "south" }}
          centerLabel="South's wall curtsied"
        />
      );
    case 5:
      return (
        <DealBoard mat={mat}
          eastCurtsy eastCurtsyCount={0} eastKept={5}
          westWall={19} northWall={19}
          southCurtsy southCurtsyCount={9}
          dealt={{ east: 6, north: 6, west: 6, south: 6 }}
          centerLabel="12 tiles each — 3 rounds done"
        />
      );
    case 6:
      return <FinalTilesBoard mat={mat} />;
    default:
      return null;
  }
}

export default function HowToDeal({ onBack, onNavigate }: { onBack: () => void; onNavigate: (lesson: string) => void }) {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const [matIdx, setMatIdx] = useState(0);
  const mat = GAME_MATS[matIdx];

  return (
    <>
      <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center' }}>
        <div onClick={onBack} style={{ fontSize: 12, color: t.lavDeep, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Learn
        </div>
      </div>
      <PT>How to Deal</PT>
      <Cnt>
        <p className="body-text" style={{ color: t.mid, marginBottom: 16, lineHeight: 1.65 }}>
          Dealing in American Mahjong follows a specific ritual. It may seem like a lot at first, but after a few games it becomes second nature.
        </p>

        {/* ── Mat color picker ── */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
          {GAME_MATS.map((m, i) => (
            <div key={m.id} onClick={() => setMatIdx(i)} style={{ textAlign: "center", cursor: "pointer" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: m.swatch,
                border: matIdx === i ? `2px solid ${C.cherry}` : "2px solid transparent",
                boxShadow: matIdx === i ? "0 2px 8px rgba(224,48,80,0.15)" : "none",
              }} />
              <div style={{ fontSize: 7, color: t.textDim, marginTop: 2, fontFamily: FONT_SANS }}>{m.name}</div>
            </div>
          ))}
        </div>

        {/* ── Vertical step-by-step ── */}
        {STEPS.map((s, i) => (
          <div key={i} style={{ marginBottom: i < STEPS.length - 1 ? 32 : 20 }}>
            {/* Step number + title */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 10,
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: C.cherry, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, fontFamily: FONT_SANS,
                flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <div style={{
                fontFamily: FONT_SERIF, fontSize: 15, fontWeight: 700,
                color: t.textMain, letterSpacing: 0.3,
              }}>
                {s.title}
              </div>
            </div>

            {/* Board diagram */}
            <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 10 }}>
              {renderBoard(i, mat)}
            </div>

            {/* A Closer Look — description */}
            <div style={{
              padding: "12px 16px",
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(107,63,160,0.04)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(107,63,160,0.08)"}`,
              borderRadius: 10,
            }}>
              <div style={{
                fontFamily: FONT_SERIF, fontSize: 11, fontWeight: 600,
                color: C.cherry, marginBottom: 4, letterSpacing: 0.3,
              }}>
                A Closer Look
              </div>
              <div style={{
                fontFamily: FONT_SANS, fontSize: 12, color: t.textMid, lineHeight: 1.65,
              }}>
                {s.description}
              </div>
            </div>

            {/* Connector line between steps */}
            {i < STEPS.length - 1 && (
              <div style={{
                display: "flex", justifyContent: "center", marginTop: 16,
              }}>
                <div style={{
                  width: 2, height: 20,
                  background: isDark
                    ? "linear-gradient(to bottom, rgba(224,48,80,0.3), rgba(224,48,80,0.08))"
                    : "linear-gradient(to bottom, rgba(224,48,80,0.2), rgba(224,48,80,0.05))",
                  borderRadius: 1,
                }} />
              </div>
            )}
          </div>
        ))}

        {/* ── Encouragement block ── */}
        <div style={{
          background: t.lavCard, border: `1px solid ${t.lavBorder}`,
          borderRadius: 14, padding: '18px 20px', marginBottom: 24,
        }}>
          <div style={{
            fontFamily: FONT_SERIF, fontSize: 14, fontWeight: 600,
            color: C.cherry, marginBottom: 6,
          }}>
            You've got this!
          </div>
          <div style={{
            fontFamily: FONT_SANS, fontSize: 12, color: t.mid, lineHeight: 1.6,
          }}>
            It looks like a lot of steps, but dealing becomes automatic after just a few games. The key is remembering the order: East, North, West, South — three rounds of 2 stacks each, then the final top-layer tiles.
          </div>
        </div>

        {/* ── Next lesson button ── */}
        <div
          onClick={() => onNavigate("Gameplay: Turns, Calls & Exposures")}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px 24px', borderRadius: 14,
            background: C.cherry, color: '#fff', cursor: 'pointer',
            fontFamily: FONT_SANS, fontSize: 13, fontWeight: 600,
            marginBottom: 20,
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(224,48,80,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
        >
          Start Playing!
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </Cnt>
    </>
  );
}
