// src/pages/DealMockup.tsx
// Temporary mockup page for How to Deal using the real GameBoard.
// Shows dealing progression with wall tiles (19 wide × 2 high per player).
// Access at #/deal-mockup

import { useState, useEffect, useRef } from "react";
import { GAME_MATS, FONT_SERIF, FONT_SANS, C, getThemeColors } from "../constants/colors";
import { useTheme } from "../constants/ThemeContext";
import type { GameMat } from "../constants/colors";

// ── Wall Tile Sizes ──────────────────────────────────────────────
const WALL_TILE_W = 13;
const WALL_TILE_H = 9;
const WALL_GAP = 0.5;
const WALL_BACK = "#A02040";
const WALL_STROKE = "rgba(122,24,48,0.5)";
const WALL_DIM = "rgba(160,32,64,0.25)";
const WALL_DIM_STROKE = "rgba(122,24,48,0.2)";

// ── Dealt tile colors (white/cream) ─────────────────────────────
const DEALT_BG = "#F5F0E8";
const DEALT_STROKE = "rgba(180,170,155,0.5)";
const DEALT_ACTIVE_BG = "#FFFFFF";
const DEALT_ACTIVE_STROKE = "rgba(224,48,80,0.5)";

// ── Final tile player colors ────────────────────────────────────
const PLAYER_COLORS: Record<string, string> = {
  east: C.cherry,
  north: C.seafoam,
  west: C.cerulean,
  south: "#6B3FA0",
};

// ── Small Wall Tile ─────────────────────────────────────────────
function WallTile({ dim = false }: { dim?: boolean }) {
  return (
    <div style={{
      width: WALL_TILE_W,
      height: WALL_TILE_H,
      borderRadius: 1.5,
      background: dim ? WALL_DIM : WALL_BACK,
      border: `0.5px solid ${dim ? WALL_DIM_STROKE : WALL_STROKE}`,
      flexShrink: 0,
    }} />
  );
}

// ── Horizontal Wall (flat, no rotation) ─────────────────────────
function HWall({
  count = 19,
  dimAfter,
  highlight,
}: {
  count?: number;
  dimAfter?: number;
  highlight?: { start: number; end: number; color: string };
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex", gap: WALL_GAP, position: "relative", zIndex: 1 }}>
        {Array.from({ length: count }).map((_, i) => {
          const isDim = dimAfter !== undefined && i >= dimAfter;
          const isHighlight = highlight && i >= highlight.start && i < highlight.end;
          return (
            <div key={`t${i}`} style={{
              width: WALL_TILE_W,
              height: WALL_TILE_H,
              borderRadius: 1.5,
              background: isHighlight ? highlight!.color : isDim ? WALL_DIM : WALL_BACK,
              border: `0.5px solid ${isDim ? WALL_DIM_STROKE : WALL_STROKE}`,
              flexShrink: 0,
              boxShadow: isHighlight ? `0 0 4px ${highlight!.color}` : "none",
            }} />
          );
        })}
      </div>
      <div style={{
        display: "flex", gap: WALL_GAP,
        marginTop: -WALL_TILE_H + 2.5,
        marginLeft: 1.5,
        opacity: 0.55,
      }}>
        {Array.from({ length: count }).map((_, i) => {
          const isDim = dimAfter !== undefined && i >= dimAfter;
          return <WallTile key={`b${i}`} dim={isDim} />;
        })}
      </div>
    </div>
  );
}

// ── Diagonal Horizontal Wall (curtsy) ───────────────────────────
// Left end stays in place near rack, right end angles toward center.
function DiagonalHWall({ count = 14, angle = -12 }: { count?: number; angle?: number }) {
  return (
    <div style={{
      transformOrigin: "left center",
      transform: `rotate(${angle}deg)`,
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: WALL_GAP, position: "relative", zIndex: 1 }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={`t${i}`} style={{
              width: WALL_TILE_W, height: WALL_TILE_H, borderRadius: 1.5,
              background: WALL_BACK, border: `0.5px solid ${WALL_STROKE}`, flexShrink: 0,
            }} />
          ))}
        </div>
        <div style={{
          display: "flex", gap: WALL_GAP,
          marginTop: -WALL_TILE_H + 2.5, marginLeft: 1.5, opacity: 0.55,
        }}>
          {Array.from({ length: count }).map((_, i) => (
            <WallTile key={`b${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Diagonal Vertical Wall (South curtsy) ───────────────────────
// Top end (near West) stays at rack, bottom end (near East) swings toward center (rightward).
function DiagonalVWall({ count = 14, angle = -12 }: { count?: number; angle?: number }) {
  return (
    <div style={{
      transformOrigin: "center top",
      transform: `rotate(${angle}deg)`,
    }}>
      <div style={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: WALL_GAP }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={`l${i}`} style={{
              width: WALL_TILE_H, height: WALL_TILE_W, borderRadius: 1.5,
              background: WALL_BACK, border: `0.5px solid ${WALL_STROKE}`, flexShrink: 0,
            }} />
          ))}
        </div>
        <div style={{
          display: "flex", flexDirection: "column", gap: WALL_GAP,
          marginLeft: -WALL_TILE_H - 0.5, marginTop: 1.5, opacity: 0.55,
        }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={`r${i}`} style={{
              width: WALL_TILE_H, height: WALL_TILE_W, borderRadius: 1.5,
              background: WALL_BACK, border: `0.5px solid ${WALL_STROKE}`, flexShrink: 0,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Vertical Wall (flat) ────────────────────────────────────────
function VWall({ count = 19 }: { count?: number }) {
  return (
    <div style={{ display: "flex", gap: 1.5, alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: WALL_GAP }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={`l${i}`} style={{
            width: WALL_TILE_H, height: WALL_TILE_W, borderRadius: 1.5,
            background: WALL_BACK, border: `0.5px solid ${WALL_STROKE}`, flexShrink: 0,
          }} />
        ))}
      </div>
      <div style={{
        display: "flex", flexDirection: "column", gap: WALL_GAP,
        marginLeft: -WALL_TILE_H - 0.5, marginTop: 1.5, opacity: 0.55,
      }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={`r${i}`} style={{
            width: WALL_TILE_H, height: WALL_TILE_W, borderRadius: 1.5,
            background: WALL_BACK, border: `0.5px solid ${WALL_STROKE}`, flexShrink: 0,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Seat Badge ──────────────────────────────────────────────────
function SeatBadge({ name, mat, highlight }: { name: string; mat: GameMat; highlight?: boolean }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, color: "#fff",
      background: highlight ? "rgba(224,48,80,0.75)" : mat.seatBg,
      padding: "2px 8px", borderRadius: 6,
      fontFamily: FONT_SANS, whiteSpace: "nowrap" as const,
      boxShadow: highlight ? "0 0 0 2px rgba(224,48,80,0.4), 0 0 8px rgba(224,48,80,0.2)" : "none",
    }}>
      {name}
    </span>
  );
}

// ── Rack Bars ───────────────────────────────────────────────────
function HRack({ mat, width = "85%" }: { mat: GameMat; width?: string }) {
  return (
    <div style={{
      width, height: 10, borderRadius: 3,
      background: mat.rack, border: `0.5px solid ${mat.rackB}`,
      margin: "0 auto",
    }} />
  );
}

function VRack({ mat, height = "75%" }: { mat: GameMat; height?: string }) {
  return (
    <div style={{
      width: 10, height, borderRadius: 3,
      background: mat.rack, border: `0.5px solid ${mat.rackB}`,
    }} />
  );
}

// ── Dealt Stack (WHITE) ─────────────────────────────────────────
function DealtStack({ active = false }: { active?: boolean }) {
  return (
    <div style={{
      width: 14, height: 14, borderRadius: 2,
      background: active ? DEALT_ACTIVE_BG : DEALT_BG,
      border: `0.5px solid ${active ? DEALT_ACTIVE_STROKE : DEALT_STROKE}`,
      boxShadow: active ? "0 0 6px rgba(224,48,80,0.3)" : "0 1px 3px rgba(0,0,0,0.12)",
      position: "relative",
    }}>
      <div style={{
        position: "absolute", top: 1.5, left: 1.5,
        width: 14, height: 14, borderRadius: 2,
        background: "rgba(245,240,232,0.4)",
        zIndex: -1,
      }} />
    </div>
  );
}

function HDealtStacks({ count, active }: { count: number; active?: boolean }) {
  if (count === 0) return null;
  return (
    <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
      {Array.from({ length: count }).map((_, i) => (
        <DealtStack key={i} active={active && i === count - 1} />
      ))}
    </div>
  );
}

function VDealtStacks({ count, active }: { count: number; active?: boolean }) {
  if (count === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
      {Array.from({ length: count }).map((_, i) => (
        <DealtStack key={i} active={active && i === count - 1} />
      ))}
    </div>
  );
}

// ── Final Tile (labeled with player initial + color) ────────────
function FinalTile({ label, color, taken }: { label: string; color: string; taken?: boolean }) {
  return (
    <div style={{
      width: 28, height: 20, borderRadius: 3,
      background: taken ? color : WALL_BACK,
      border: `1px solid ${taken ? color : WALL_STROKE}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: taken ? `0 0 6px ${color}40` : "none",
      opacity: taken ? 1 : 0.7,
    }}>
      <span style={{
        fontSize: 8, fontWeight: 700, color: "#fff", fontFamily: FONT_SANS,
      }}>
        {taken ? label : ""}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DEAL BOARD — GameBoard variant with walls
// ═══════════════════════════════════════════════════════════════════

export interface DealBoardProps {
  mat: GameMat;
  // Wall config per player (number of tiles visible)
  eastWall?: number;
  westWall?: number;
  southWall?: number;
  northWall?: number;
  // Curtsy config
  eastCurtsy?: boolean;   // East's wall is curtsied (diagonal)
  eastKept?: number;      // How many blue "kept" tiles at East's right
  eastCurtsyCount?: number; // How many tiles in the curtsied portion
  southCurtsy?: boolean;  // South's wall is curtsied
  southCurtsyCount?: number; // How many tiles in curtsied wall (entire wall curtsies)
  // Dealt stacks
  dealt?: {
    east?: number;
    west?: number;
    south?: number;
    north?: number;
    active?: "east" | "west" | "south" | "north";
  };
  centerLabel?: string;
}

export function DealBoard({
  mat,
  eastWall = 0, westWall = 0, southWall = 0, northWall = 0,
  eastCurtsy, eastKept = 0, eastCurtsyCount = 0,
  southCurtsy, southCurtsyCount = 0,
  dealt, centerLabel,
}: DealBoardProps) {
  const de = dealt?.east ?? 0;
  const dw = dealt?.west ?? 0;
  const ds = dealt?.south ?? 0;
  const dn = dealt?.north ?? 0;

  return (
    <div style={{
      background: mat.bg,
      borderRadius: 14,
      position: "relative",
      boxShadow: "inset 0 2px 12px rgba(0,0,0,0.08)",
      overflow: "hidden",
      padding: "8px 10px",
      width: "100%",
      maxWidth: 420,
      margin: "0 auto",
      boxSizing: "border-box" as const,
    }}>
      {/* ── WEST (top) ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginBottom: 4 }}>
        <SeatBadge name="West" mat={mat} />
        <HRack mat={mat} width="55%" />
        {westWall > 0 && <HWall count={westWall} />}
        {dw > 0 && <HDealtStacks count={dw} active={dealt?.active === "west"} />}
      </div>

      {/* ── MIDDLE: South | Center | North ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        minHeight: 190,
        gap: 4,
      }}>
        {/* SOUTH (left) */}
        <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <SeatBadge name="South" mat={mat} />
            {ds > 0 && <VDealtStacks count={ds} active={dealt?.active === "south"} />}
          </div>
          <VRack mat={mat} height="180px" />
          {/* South wall: flat or entire wall curtsied */}
          {southCurtsy ? (
            /* Entire South wall curtsied — top (near West) stays at rack,
               bottom (near East) swings rightward toward center */
            southCurtsyCount > 0 && (
              <DiagonalVWall count={southCurtsyCount} angle={-12} />
            )
          ) : (
            southWall > 0 && <VWall count={southWall} />
          )}
        </div>

        {/* CENTER */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          minHeight: 80,
        }}>
          {centerLabel && (
            <div style={{
              fontSize: 9, fontWeight: 600, color: "#fff", textAlign: "center",
              fontFamily: FONT_SANS, padding: "4px 10px",
              background: "rgba(0,0,0,0.45)", borderRadius: 6,
              maxWidth: "70%", lineHeight: 1.3,
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}>
              {centerLabel}
            </div>
          )}
        </div>

        {/* NORTH (right) */}
        <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
          {northWall > 0 && <VWall count={northWall} />}
          <VRack mat={mat} height="180px" />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <SeatBadge name="North" mat={mat} />
            {dn > 0 && <VDealtStacks count={dn} active={dealt?.active === "north"} />}
          </div>
        </div>
      </div>

      {/* ── EAST (bottom — Dealer) ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginTop: 4 }}>
        {de > 0 && <HDealtStacks count={de} active={dealt?.active === "east"} />}

        {/* East wall: curtsied (diagonal + kept) or flat */}
        {eastCurtsy ? (
          <div style={{
            display: "flex", alignItems: "flex-end", gap: 2,
            width: "100%", justifyContent: "center",
            minHeight: 30, marginTop: 6, // room for the angled portion + gap from dealt stacks
          }}>
            {/* Curtsied portion — stays near rack, right end angles up */}
            {eastCurtsyCount > 0 && (
              <div style={{ alignSelf: "flex-end" }}>
                <DiagonalHWall count={eastCurtsyCount} angle={-12} />
              </div>
            )}
            {/* Kept tiles (blue, flat against rack) */}
            {eastKept > 0 && (
              <div style={{ display: "flex", gap: WALL_GAP, alignSelf: "flex-end" }}>
                {Array.from({ length: eastKept }).map((_, i) => (
                  <div key={i} style={{
                    width: WALL_TILE_W, height: WALL_TILE_H, borderRadius: 1.5,
                    background: C.cerulean,
                    border: `0.5px solid rgba(142,199,226,0.6)`,
                    boxShadow: `0 0 4px ${C.cerulean}`,
                    flexShrink: 0,
                  }} />
                ))}
              </div>
            )}
          </div>
        ) : (
          eastWall > 0 && <HWall count={eastWall} />
        )}

        <HRack mat={mat} width="55%" />
        <SeatBadge name="East (Dealer)" mat={mat} highlight />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FINAL TILES BOARD
// ═══════════════════════════════════════════════════════════════════

// Animation steps: 0=empty, 1=East(1st+3rd top), 2=North(1st bottom), 3=West(2nd top), 4=South(2nd bottom), 5=all done
const PICK_STEPS = [
  { label: "Waiting...", desc: "", takenTop: [false, false, false], takenBottom: [false, false] },
  { label: "East", desc: "takes 1st & 3rd from top", takenTop: [true, false, true], takenBottom: [false, false] },
  { label: "North", desc: "takes 1st from bottom", takenTop: [true, false, true], takenBottom: [true, false] },
  { label: "West", desc: "takes 2nd from top", takenTop: [true, true, true], takenBottom: [true, false] },
  { label: "South", desc: "takes 2nd from bottom", takenTop: [true, true, true], takenBottom: [true, true] },
];
const TOP_LABELS = ["E", "W", "E"];
const TOP_COLORS = [PLAYER_COLORS.east, PLAYER_COLORS.west, PLAYER_COLORS.east];
const BOT_LABELS = ["N", "S"];
const BOT_COLORS = [PLAYER_COLORS.north, PLAYER_COLORS.south];

export function FinalTilesBoard({ mat }: { mat: GameMat }) {
  const [step, setStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-advance animation
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setStep(s => (s < PICK_STEPS.length - 1 ? s + 1 : 0));
    }, step === 0 ? 1200 : step === PICK_STEPS.length - 1 ? 2500 : 1500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [step]);

  const cur = PICK_STEPS[step];
  // Which tiles are "active" (just picked this step) vs previously taken
  const prev = step > 0 ? PICK_STEPS[step - 1] : PICK_STEPS[0];

  return (
    <div style={{
      background: mat.bg,
      borderRadius: 14,
      position: "relative",
      boxShadow: "inset 0 2px 12px rgba(0,0,0,0.08)",
      overflow: "hidden",
      padding: "14px 16px",
      width: "100%",
      maxWidth: 420,
      margin: "0 auto",
      boxSizing: "border-box" as const,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: mat.text,
        fontFamily: FONT_SERIF, textAlign: "center",
        letterSpacing: 0.5, marginBottom: 12, opacity: 0.8,
      }}>
        Final Tiles — Top &amp; Bottom Layer
      </div>

      {/* Remaining wall with animated tiles */}
      <div style={{
        background: "rgba(0,0,0,0.2)",
        borderRadius: 10, padding: "16px 20px",
        marginBottom: 12,
      }}>
        <div style={{
          fontSize: 9, fontWeight: 600, color: "#fff",
          fontFamily: FONT_SANS, marginBottom: 10,
          textAlign: "center",
        }}>
          Remaining wall — pick from top &amp; bottom:
        </div>

        <div style={{ marginBottom: 6 }}>
          <div style={{
            fontSize: 7, fontWeight: 600, color: mat.text,
            fontFamily: FONT_SANS, marginBottom: 4, opacity: 0.6,
          }}>
            TOP ROW:
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 1, 2, 3, 4].map(i => {
              const taken = i < 3 && cur.takenTop[i];
              const justPicked = i < 3 && cur.takenTop[i] && !prev.takenTop[i];
              return (
                <div key={`t${i}`} style={{
                  width: 28, height: 20, borderRadius: 3,
                  background: taken ? TOP_COLORS[i] : WALL_BACK,
                  border: `1px solid ${taken ? TOP_COLORS[i] : WALL_STROKE}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: justPicked ? `0 0 10px ${TOP_COLORS[i]}, 0 0 20px ${TOP_COLORS[i]}60` : taken ? `0 0 4px ${TOP_COLORS[i]}40` : "none",
                  opacity: (i >= 3) ? 0.5 : 1,
                  transform: justPicked ? "scale(1.15)" : "scale(1)",
                  transition: "all 0.4s ease",
                }}>
                  <span style={{
                    fontSize: 8, fontWeight: 700, color: "#fff", fontFamily: FONT_SANS,
                  }}>
                    {taken && i < 3 ? TOP_LABELS[i] : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{
            fontSize: 7, fontWeight: 600, color: mat.text,
            fontFamily: FONT_SANS, marginBottom: 4, opacity: 0.6,
          }}>
            BOTTOM ROW:
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 1, 2, 3, 4].map(i => {
              const taken = i < 2 && cur.takenBottom[i];
              const justPicked = i < 2 && cur.takenBottom[i] && !prev.takenBottom[i];
              return (
                <div key={`b${i}`} style={{
                  width: 28, height: 20, borderRadius: 3,
                  background: taken ? BOT_COLORS[i] : WALL_BACK,
                  border: `1px solid ${taken ? BOT_COLORS[i] : WALL_STROKE}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: justPicked ? `0 0 10px ${BOT_COLORS[i]}, 0 0 20px ${BOT_COLORS[i]}60` : taken ? `0 0 4px ${BOT_COLORS[i]}40` : "none",
                  opacity: (i >= 2) ? 0.5 : 1,
                  transform: justPicked ? "scale(1.15)" : "scale(1)",
                  transition: "all 0.4s ease",
                }}>
                  <span style={{
                    fontSize: 8, fontWeight: 700, color: "#fff", fontFamily: FONT_SANS,
                  }}>
                    {taken && i < 2 ? BOT_LABELS[i] : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current step indicator */}
        <div style={{
          marginTop: 12, textAlign: "center", minHeight: 20,
          transition: "all 0.3s ease",
        }}>
          {step > 0 && step < PICK_STEPS.length && (
            <span style={{
              fontSize: 10, fontWeight: 700,
              color: step === 1 ? PLAYER_COLORS.east : step === 2 ? PLAYER_COLORS.north : step === 3 ? PLAYER_COLORS.west : PLAYER_COLORS.south,
              fontFamily: FONT_SANS,
            }}>
              {cur.label} {cur.desc}
            </span>
          )}
          {step === 0 && (
            <span style={{ fontSize: 9, color: mat.text, fontFamily: FONT_SANS, opacity: 0.5 }}>
              Watch the pick order...
            </span>
          )}
        </div>
      </div>

      {/* Pick order list */}
      <div style={{
        background: "rgba(0,0,0,0.15)",
        borderRadius: 10, padding: "12px 16px",
        marginBottom: 12,
      }}>
        <div style={{
          fontSize: 9, fontWeight: 600, color: "#fff",
          fontFamily: FONT_SANS, marginBottom: 8,
          textAlign: "center",
        }}>
          Pick order:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[
            { n: 1, label: "East", sub: "1st & 3rd top (2 tiles)", color: PLAYER_COLORS.east, tile: "E" },
            { n: 2, label: "North", sub: "1st bottom", color: PLAYER_COLORS.north, tile: "N" },
            { n: 3, label: "West", sub: "2nd top", color: PLAYER_COLORS.west, tile: "W" },
            { n: 4, label: "South", sub: "2nd bottom", color: PLAYER_COLORS.south, tile: "S" },
          ].map(item => {
            const isActive = step === item.n;
            return (
              <div key={item.n} style={{
                display: "flex", alignItems: "center", gap: 8,
                opacity: isActive ? 1 : step > item.n ? 0.5 : 0.8,
                transform: isActive ? "translateX(4px)" : "none",
                transition: "all 0.3s ease",
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: "#fff",
                  fontFamily: FONT_SANS, opacity: 0.6, width: 14, textAlign: "right",
                }}>
                  {item.n}.
                </span>
                <div style={{
                  width: 16, height: 16, borderRadius: 3,
                  background: item.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: isActive ? `0 0 8px ${item.color}` : "none",
                }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: "#fff", fontFamily: FONT_SANS }}>
                    {item.tile}
                  </span>
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 600, color: isActive ? item.color : "#fff",
                  fontFamily: FONT_SANS,
                }}>
                  {item.label}
                </span>
                <span style={{
                  fontSize: 8, color: "#fff", fontFamily: FONT_SANS, opacity: 0.5,
                }}>
                  {item.sub}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final counts */}
      <div style={{
        background: "rgba(0,0,0,0.15)",
        borderRadius: 8, padding: "10px 14px",
        textAlign: "center",
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", fontFamily: FONT_SANS, textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
          East: 14 tiles
        </span>
        <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.8)", fontFamily: FONT_SANS, marginLeft: 10 }}>
          North, West, South: 13 tiles each
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MOCKUP PAGE
// ═══════════════════════════════════════════════════════════════════

const STATES = [
  "Walls Built",
  "Break the Wall (Curtsy)",
  "Dealing — Round 1",
  "Dealing — Round 2",
  "South's Wall Curtsied",
  "After 3 Rounds (6 stacks each)",
  "Final Tiles",
];

const NOTES = [
  "Each player has 19 face-down tiles, stacked 2 high, against their rack. The walls form a closed square.",
  "East rolls the dice to get a number and counts that number from the right side of the wall. Let's say that number is 5. The counted stacks stay put (blue). The rest curtsies diagonally — left end stays near the rack, right end angles toward center.",
  "East deals from the curtsied wall, starting from the right end (closest to center). Each player gets 2 stacks (4 tiles): East first, then North, West, South. White squares = dealt tiles.",
  "Round 2: East deals another 2 stacks to each player. East, North, and West each get theirs, but the curtsied wall runs out before South can be dealt. Time to curtsy South's wall.",
  "East's wall is depleted! She curtsies South's entire wall (the wall to her left). The tile closest to West stays at the rack, the tile closest to East swings toward center. South only has 2 stacks — dealing continues from South's East end.",
  "Dealing continued from South's curtsied wall (East end first). 2 more to South to finish Round 2, then a full Round 3: 2 to each player. All have 6 stacks (12 tiles).",
  "East takes the 1st and 3rd tiles from the top row (14 total). North gets the 1st bottom tile. West gets the 2nd top tile. South gets the 2nd bottom tile.",
];

export default function DealMockup() {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const [matIdx, setMatIdx] = useState(0);
  const mat = GAME_MATS[matIdx];
  const [stateIdx, setStateIdx] = useState(0);

  const prev = () => setStateIdx(i => Math.max(0, i - 1));
  const next = () => setStateIdx(i => Math.min(STATES.length - 1, i + 1));

  const navBtn = (label: string, onClick: () => void, disabled: boolean) => (
    <button onClick={onClick} disabled={disabled} style={{
      fontSize: 10, fontWeight: 600, color: disabled ? t.textDim : C.cherry,
      background: disabled ? "transparent" : "rgba(224,48,80,0.06)",
      border: disabled ? `1px solid ${t.textDim}` : `1px solid rgba(224,48,80,0.2)`,
      borderRadius: 6, padding: "5px 14px", cursor: disabled ? "default" : "pointer",
      fontFamily: FONT_SANS, opacity: disabled ? 0.4 : 1,
    }}>{label}</button>
  );

  function renderState() {
    switch (stateIdx) {
      case 0: // Walls Built
        return (
          <DealBoard mat={mat}
            eastWall={19} westWall={19} southWall={19} northWall={19}
            centerLabel="All walls built — 19 tiles × 2 high"
          />
        );
      case 1: // Break the Wall (Curtsy)
        return (
          <DealBoard mat={mat}
            eastCurtsy eastCurtsyCount={14} eastKept={5}
            westWall={19} southWall={19} northWall={19}
            centerLabel="East counts 5 from right, curtsies the rest toward center"
          />
        );
      case 2: // Dealing Round 1
        return (
          <DealBoard mat={mat}
            eastCurtsy eastCurtsyCount={6} eastKept={5}
            westWall={19} southWall={19} northWall={19}
            dealt={{ east: 2, north: 2, west: 2, south: 2, active: "south" }}
            centerLabel="Round 1 done — 8 stacks dealt, 6 remain in East's curtsy"
          />
        );
      case 3: // Dealing Round 2 (East's wall depleting)
        return (
          <DealBoard mat={mat}
            eastCurtsy eastCurtsyCount={0} eastKept={5}
            westWall={19} southWall={19} northWall={19}
            dealt={{ east: 4, north: 4, west: 4, south: 2, active: "west" }}
            centerLabel="Round 2 — East's curtsied wall depleted after dealing E, N, W"
          />
        );
      case 4: // South's Wall Curtsied
        return (
          <DealBoard mat={mat}
            eastCurtsy eastCurtsyCount={0} eastKept={5}
            westWall={19} northWall={19}
            southCurtsy southCurtsyCount={19}
            dealt={{ east: 4, north: 4, west: 4, south: 2, active: "south" }}
            centerLabel="East's wall gone! South's wall curtsied — South still needs 2"
          />
        );
      case 5: // After 3 Rounds (12 each)
        return (
          <DealBoard mat={mat}
            eastCurtsy eastCurtsyCount={0} eastKept={5}
            westWall={19} northWall={19}
            southCurtsy southCurtsyCount={9}
            dealt={{ east: 6, north: 6, west: 6, south: 6 }}
            centerLabel="3 rounds done — each player has 6 stacks (12 tiles)"
          />
        );
      case 6: // Final Tiles
        return <FinalTilesBoard mat={mat} />;
      default:
        return null;
    }
  }

  return (
    <div className="content-scroll">
    <div style={{ padding: "12px 10px 100px", maxWidth: 420, margin: "0 auto" }}>
      <div style={{
        fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 700,
        color: t.textMain, letterSpacing: 2, textTransform: "uppercase" as const,
        textAlign: "center", marginBottom: 4,
      }}>How to Deal — Mockup</div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
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

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 10, gap: 8,
      }}>
        {navBtn("\u2190 Prev", prev, stateIdx === 0)}
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{
            fontFamily: FONT_SERIF, fontSize: 12, fontWeight: 700,
            color: t.textMain, letterSpacing: 0.5,
          }}>
            {stateIdx + 1}. {STATES[stateIdx]}
          </div>
          <div style={{ fontSize: 8, color: t.textDim, fontFamily: FONT_SANS }}>
            {stateIdx + 1} of {STATES.length}
          </div>
        </div>
        {navBtn("Next \u2192", next, stateIdx === STATES.length - 1)}
      </div>

      {renderState()}

      <div style={{
        marginTop: 16, padding: "12px 16px",
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(107,63,160,0.04)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(107,63,160,0.08)"}`,
        borderRadius: 10,
      }}>
        <div style={{
          fontFamily: FONT_SERIF, fontSize: 11, fontWeight: 600,
          color: C.cherry, marginBottom: 4,
        }}>Mockup Notes</div>
        <div style={{
          fontFamily: FONT_SANS, fontSize: 10, color: t.textMid, lineHeight: 1.6,
        }}>
          {NOTES[stateIdx]}
        </div>
      </div>
    </div>
    </div>
  );
}
