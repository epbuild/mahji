// src/components/GameBoard.tsx
// Shared game board component — single source of truth for mat layout across the entire app.
// Used by: PlayPage (game), CharlestonDrill (practice), and eventually Learn (How to Deal).

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { GameMat, FONT_SERIF, FONT_SANS } from "../constants/colors";
import { MahjiTile } from "./tiles/MahjiTile";
import type { GameTile, TileDefinition } from "../data/tileData";

// ─── TYPES ───────────────────────────────────────────────────────

export type Seat = "east" | "north" | "west" | "south";
export type HaloColor = "gold" | "yellow" | "red" | null;

export interface PlayerConfig {
  seat: Seat;
  name: string;
  halo?: HaloColor;
  points?: string;          // "+40 points" or "–10 points"
  isReady?: boolean;
  showReady?: boolean;
  rackCount?: number;       // face-down tiles on rack (0 = no rack shown)
  exposures?: GameTile[][]; // groups of exposed face-up tiles
}

export interface GameBoardProps {
  mat: GameMat;
  players: PlayerConfig[];
  discards?: GameTile[];
  tilesRemaining?: number;
  showDiscardArea?: boolean;  // show the lighter discard rectangle
  children?: React.ReactNode; // center content slot (pass box, call UI, etc.)
  overlay?: React.ReactNode;  // win/invalid/wall overlays
  hideRacks?: boolean;        // hide racks (e.g. during charleston)
  hideExposureLabels?: boolean;
  compact?: boolean;          // tighter spacing for charleston
}

// ─── HELPER: get player by seat ──────────────────────────────────

function getPlayer(players: PlayerConfig[], seat: Seat): PlayerConfig | undefined {
  return players.find(p => p.seat === seat);
}

// ─── Shared Leaderboard button style ─────────────────────────────

const LEADERBOARD_BTN: React.CSSProperties = {
  position: "absolute", top: 6, right: 8, zIndex: 12,
  fontSize: 7, fontWeight: 600, color: "rgba(255,255,255,0.8)",
  background: "rgba(26,82,118,0.7)", border: "none", borderRadius: 5,
  padding: "2px 6px", cursor: "pointer", fontFamily: FONT_SANS,
};

const EXIT_BTN: React.CSSProperties = {
  position: "absolute", top: 6, left: 8, zIndex: 12,
  fontSize: 7, fontWeight: 600, color: "rgba(255,255,255,0.8)",
  background: "rgba(0,0,0,0.25)", border: "none", borderRadius: 5,
  padding: "2px 6px", cursor: "pointer", fontFamily: FONT_SANS,
};

// ─── SEAT LABEL ──────────────────────────────────────────────────
// Reusable pill badge with optional halo, points, and "Ready" text.

export function SeatLabel({
  name,
  halo,
  points,
  isReady,
  showReady,
  seatBg,
  readyColor,
  pointsPosition = "below",
}: {
  name: string;
  halo?: HaloColor;
  points?: string;
  isReady?: boolean;
  showReady?: boolean;
  seatBg: string;
  readyColor: string;
  pointsPosition?: "below" | "right";
}) {
  const haloShadow = halo === "gold"
    ? "0 0 0 2.5px rgba(218,175,65,0.7), 0 0 8px rgba(218,175,65,0.3)"
    : halo === "yellow"
    ? "0 0 0 2.5px rgba(240,200,40,0.7), 0 0 8px rgba(240,200,40,0.3)"
    : halo === "red"
    ? "0 0 0 2.5px rgba(224,48,80,0.7), 0 0 8px rgba(224,48,80,0.3)"
    : "none";

  const pointsColor = "#E03050"; // Always cherry red for points display

  const label = (
    <span style={{
      fontSize: 9, fontWeight: 700, color: "#fff",
      background: seatBg, padding: "2px 8px", borderRadius: 6,
      fontFamily: FONT_SANS, whiteSpace: "nowrap" as const,
      boxShadow: haloShadow, transition: "box-shadow 0.4s ease",
    }}>
      {name}
    </span>
  );

  if (pointsPosition === "right" && points) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ textAlign: "center" }}>
          {label}
          {isReady && showReady && <div style={{ marginTop: 2 }}><span style={{ fontSize: 7, fontWeight: 600, color: readyColor }}> Ready</span></div>}
        </div>
        <span style={{ fontSize: 7, fontWeight: 400, color: pointsColor, fontFamily: FONT_SANS, whiteSpace: "nowrap" as const }}>{points}</span>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      {label}
      {isReady && showReady && <div style={{ marginTop: 2 }}><span style={{ fontSize: 7, fontWeight: 600, color: readyColor }}>Ready</span></div>}
      {points && <div style={{ marginTop: 2 }}><span style={{ fontSize: 7, fontWeight: 400, color: pointsColor, fontFamily: FONT_SANS }}>{points}</span></div>}
    </div>
  );
}

// ─── RACK ────────────────────────────────────────────────────────
// Subtle bar representing the physical tile rack.

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

// ─── BOARD TILES ─────────────────────────────────────────────────
// Two sizes: BoardTile (18×24) for exposures, DiscardTile (14×18) for discards & overlays.

const BOARD_TILE_W = 18;
const BOARD_TILE_H = 24;
const BOARD_TILE_SCALE = BOARD_TILE_W / 34; // 34px = MahjiTile xs width

const DISCARD_TILE_W = 14;
const DISCARD_TILE_H = 18;
const DISCARD_TILE_SCALE = DISCARD_TILE_W / 34;

function BoardTile({ tile }: { tile: GameTile }) {
  return (
    <div style={{
      width: BOARD_TILE_W,
      height: BOARD_TILE_H,
      overflow: "hidden",
      borderRadius: 3,
      flexShrink: 0,
    }}>
      <div style={{
        transform: `scale(${BOARD_TILE_SCALE})`,
        transformOrigin: "top left",
      }}>
        <MahjiTile tile={tile} size="xs" />
      </div>
    </div>
  );
}

function DiscardTile({ tile }: { tile: GameTile }) {
  return (
    <div style={{
      width: DISCARD_TILE_W,
      height: DISCARD_TILE_H,
      overflow: "hidden",
      borderRadius: 2,
      flexShrink: 0,
    }}>
      <div style={{
        transform: `scale(${DISCARD_TILE_SCALE})`,
        transformOrigin: "top left",
      }}>
        <MahjiTile tile={tile} size="xs" />
      </div>
    </div>
  );
}

// ─── EXPOSURE AREA ───────────────────────────────────────────────
// Groups of face-up tiles near a player's rack.
// "horizontal" = West/East (tiles in a row).
// "vertical-south" / "vertical-north" = side players, tiles ROTATED to face center of board.

function ExposureRow({
  groups,
  orientation = "horizontal",
}: {
  groups: GameTile[][];
  orientation?: "horizontal" | "vertical-south" | "vertical-north";
}) {
  if (!groups || groups.length === 0) return null;

  if (orientation === "vertical-south") {
    // South (left side): tiles rotated 90° clockwise so faces point RIGHT (toward center)
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
        {groups.map((group, gi) => (
          <div key={gi} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {group.map((tile, ti) => (
              <div key={tile.instanceId || `${gi}-${ti}`} style={{
                width: BOARD_TILE_H, height: BOARD_TILE_W,
                transform: "rotate(90deg)",
                transformOrigin: "center center",
              }}>
                <BoardTile tile={tile} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (orientation === "vertical-north") {
    // North (right side): tiles rotated 90° counter-clockwise so faces point LEFT (toward center)
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
        {groups.map((group, gi) => (
          <div key={gi} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {group.map((tile, ti) => (
              <div key={tile.instanceId || `${gi}-${ti}`} style={{
                width: BOARD_TILE_H, height: BOARD_TILE_W,
                transform: "rotate(-90deg)",
                transformOrigin: "center center",
              }}>
                <BoardTile tile={tile} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Horizontal (West/East)
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "center" }}>
      {groups.map((group, gi) => (
        <div key={gi} style={{ display: "flex", gap: 1 }}>
          {group.map((tile, ti) => (
            <BoardTile key={tile.instanceId || `${gi}-${ti}`} tile={tile} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── DISCARD PILE ────────────────────────────────────────────────
// Center area with face-up discarded tiles, filling left-to-right, wrapping.

function DiscardPile({
  mat,
  discards = [],
  tilesRemaining,
  showArea = true,
}: {
  mat: GameMat;
  discards?: GameTile[];
  tilesRemaining?: number;
  showArea?: boolean;
}) {
  return (
    <div style={{
      flex: 1,
      minHeight: 42,
      background: showArea ? mat.area : "transparent",
      border: showArea ? `0.5px solid ${mat.areaB}` : "none",
      borderRadius: 6,
      padding: "3px 5px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* DISCARDS label */}
      {showArea && (
        <span style={{
          fontSize: 5, fontWeight: 600, color: mat.areaT,
          letterSpacing: 1, textTransform: "uppercase" as const,
          fontFamily: FONT_SANS, marginBottom: 2,
        }}>
          Discards
        </span>
      )}

      {/* Tile grid — uses smaller DiscardTile */}
      {discards.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 2, flex: 1, alignContent: "flex-start" }}>
          {discards.map((tile, i) => (
            <DiscardTile key={tile.instanceId || i} tile={tile} />
          ))}
        </div>
      )}

      {/* TILES REMAINING */}
      {tilesRemaining != null && (
        <span style={{
          fontSize: 5, fontWeight: 500, color: mat.areaT,
          letterSpacing: 0.8, fontFamily: FONT_SANS,
          position: "absolute", bottom: 2, right: 5,
          textTransform: "uppercase" as const,
        }}>
          Tiles Remaining: {tilesRemaining}
        </span>
      )}
    </div>
  );
}

// ─── MINI TILES (face-down placeholders for other players) ───────

function HMiniTiles({ n, mat, faceUp = false }: { n: number; mat: GameMat; faceUp?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 1, justifyContent: "center" }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{
          width: 11, height: 16, borderRadius: 2,
          background: faceUp ? "rgba(255,255,255,0.9)" : mat.rack,
          border: `0.5px solid ${faceUp ? "rgba(200,190,175,0.35)" : mat.rackB}`,
          boxShadow: faceUp ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
        }} />
      ))}
    </div>
  );
}

function VMiniTiles({ n, mat }: { n: number; mat: GameMat }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{
          width: 16, height: 11, borderRadius: 2,
          background: mat.rack,
          border: `0.5px solid ${mat.rackB}`,
        }} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GAMEBOARD — Main shared component
// ═══════════════════════════════════════════════════════════════════

export function GameBoard({
  mat,
  players,
  discards = [],
  tilesRemaining,
  showDiscardArea = true,
  children,
  overlay,
  hideRacks = false,
  hideExposureLabels = false,
  compact = false,
}: GameBoardProps) {
  const west = getPlayer(players, "west");
  const south = getPlayer(players, "south");
  const north = getPlayer(players, "north");
  const east = getPlayer(players, "east");

  const westHasExp = !!west?.exposures?.length;
  const eastHasExp = !!east?.exposures?.length;
  const southHasExp = !!south?.exposures?.length;
  const northHasExp = !!north?.exposures?.length;

  return (
    <div style={{
      background: mat.bg,
      borderRadius: 14,
      position: "relative",
      boxShadow: "inset 0 2px 12px rgba(0,0,0,0.08)",
      overflow: "hidden",
      transition: "all 0.5s ease",
      padding: compact ? "5px 6px" : "6px 8px",
      width: "100%",
      maxWidth: 420,
      margin: "0 auto",
      boxSizing: "border-box" as const,
    }}>
      {/* ── WEST (top) ── Label → Rack with exposures ON it */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, marginBottom: 2 }}>
        {west && (
          <SeatLabel
            name={west.name}
            halo={west.halo}
            points={west.points}
            isReady={west.isReady}
            showReady={west.showReady}
            seatBg={mat.seatBg}
            readyColor={mat.readyColor}
            pointsPosition="right"
          />
        )}
        {/* Rack with exposures layered ON TOP of it */}
        <div style={{ position: "relative", width: "45%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {!hideRacks && west && (west.rackCount ?? 13) > 0 && <HRack mat={mat} width="100%" />}
          {westHasExp && (
            <div style={{ marginTop: -8, position: "relative", zIndex: 1 }}>
              <ExposureRow groups={west!.exposures!} orientation="horizontal" />
            </div>
          )}
        </div>
      </div>

      {/* ── MIDDLE: South | Center | North ── */}
      <div style={{
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        minHeight: compact ? 100 : 160,
        gap: 3,
      }}>
        {/* SOUTH (left) — Label → VRack with exposures ON it, facing center */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            {south && (
              <SeatLabel
                name={south.name}
                halo={south.halo}
                points={south.points}
                isReady={south.isReady}
                showReady={south.showReady}
                seatBg={mat.seatBg}
                readyColor={mat.readyColor}
                pointsPosition="below"
              />
            )}
          </div>
          {/* Rack + exposures layered ON TOP */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", height: "90%" }}>
            {!hideRacks && south && (south.rackCount ?? 13) > 0 && <VRack mat={mat} height="100%" />}
            {southHasExp && (
              <div style={{ marginLeft: -6, position: "relative", zIndex: 1 }}>
                <ExposureRow groups={south!.exposures!} orientation="vertical-south" />
              </div>
            )}
          </div>
        </div>

        {/* CENTER: discard pile + children slot (relative for overlay) */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 3,
          position: "relative",
          minWidth: 0,
        }}>
          {showDiscardArea && (
            <DiscardPile mat={mat} discards={discards} tilesRemaining={tilesRemaining} />
          )}
          {/* Children (call UI) overlaid on center area */}
          {children && (
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5,
            }}>
              {children}
            </div>
          )}
        </div>

        {/* NORTH (right) — Exposures ON rack, facing center → VRack → Label */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
          {/* Rack + exposures layered ON TOP */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", height: "90%" }}>
            {northHasExp && (
              <div style={{ marginRight: -6, position: "relative", zIndex: 1 }}>
                <ExposureRow groups={north!.exposures!} orientation="vertical-north" />
              </div>
            )}
            {!hideRacks && north && (north.rackCount ?? 13) > 0 && <VRack mat={mat} height="100%" />}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            {north && (
              <SeatLabel
                name={north.name}
                halo={north.halo}
                points={north.points}
                isReady={north.isReady}
                showReady={north.showReady}
                seatBg={mat.seatBg}
                readyColor={mat.readyColor}
                pointsPosition="below"
              />
            )}
          </div>
        </div>
      </div>

      {/* ── EAST (bottom — You / Dealer) ── Exposures ON rack → Label */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, marginTop: 2, width: "100%" }}>
        {/* Rack with exposures layered ON TOP of it */}
        <div style={{ position: "relative", width: "45%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {eastHasExp && (
            <div style={{ marginBottom: -8, position: "relative", zIndex: 1 }}>
              <ExposureRow groups={east!.exposures!} orientation="horizontal" />
            </div>
          )}
          {!hideRacks && east && (east.rackCount ?? 13) > 0 && <HRack mat={mat} width="100%" />}
        </div>
        {east && (
          <SeatLabel
            name={east.name}
            halo={east.halo}
            points={east.points}
            isReady={east.isReady}
            showReady={east.showReady}
            seatBg={mat.seatBg}
            readyColor={mat.readyColor}
            pointsPosition="right"
          />
        )}
      </div>

      {/* ── OVERLAY (win/invalid/wall/contested) ── */}
      {overlay && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 10,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(1px)",
        }}>
          {overlay}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PLAYER HAND — Below the board, responsive tile row
// ═══════════════════════════════════════════════════════════════════

export interface PlayerHandProps {
  hand: GameTile[];
  onTileTap?: (tile: GameTile, index: number) => void;
  onTileDoubleTap?: (tile: GameTile, index: number) => void;
  selectedIds?: Set<string>;
  newTileIds?: Set<string>;
  touchedTileIds?: Set<string>;
  disabled?: boolean;
  showSortButtons?: boolean;
  showMahjongButton?: boolean;
  hideMahjongButton?: boolean;
  onMahjong?: () => void;
  onSortByRank?: () => void;
  onSortBySuit?: () => void;
  helperText?: string;
  helperColor?: string; // purple for other-player actions, cherry for East actions
  cherry: string;
  seafoam?: string;
}

export function PlayerHand({
  hand,
  onTileTap,
  onTileDoubleTap,
  selectedIds,
  newTileIds,
  touchedTileIds,
  disabled = false,
  showSortButtons = false,
  showMahjongButton = false,
  hideMahjongButton = false,
  onMahjong,
  onSortByRank,
  onSortBySuit,
  helperText,
  helperColor,
  cherry,
  seafoam = "#6DBFA8",
}: PlayerHandProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [tileScale, setTileScale] = useState(1);

  // Whether the Mahjong button is actually visible
  const showBtn = showMahjongButton && !hideMahjongButton;
  // Reserve space for button so tiles don't go behind it
  const BTN_RESERVE = showBtn ? 58 : 0;

  // Tile sizing constants (md = 72w × 98h)
  const TILE_MD_W = 72;
  const TILE_GAP = 3;
  const REF_HAND_SIZE = 13; // Always scale as if 13 tiles so size stays consistent

  const recalcScale = useCallback(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    // Reset scale to 1 to measure natural width accurately
    inner.style.transform = "scale(1)";
    const availW = outer.offsetWidth - BTN_RESERVE;
    const naturalW = inner.scrollWidth;
    // Use 13-tile reference width as floor so tiles never grow bigger with fewer tiles
    const refNaturalW = REF_HAND_SIZE * TILE_MD_W + (REF_HAND_SIZE - 1) * TILE_GAP + 8;
    const effectiveW = Math.max(naturalW, refNaturalW);
    const s = effectiveW <= availW ? 1 : Math.max(0.3, availW / effectiveW);
    setTileScale(s);
    inner.style.transform = `scale(${s})`;
  }, [BTN_RESERVE]);

  useLayoutEffect(() => {
    recalcScale();
  }, [recalcScale, hand.length]);

  useEffect(() => {
    window.addEventListener("resize", recalcScale);
    return () => window.removeEventListener("resize", recalcScale);
  }, [recalcScale]);

  // Natural tile height at md size (MahjiTile md = 72w × 98h)
  const rowNaturalH = 98;
  const textColor = helperColor || cherry;

  return (
    <div style={{ width: "100%", flexShrink: 0, maxWidth: 420, margin: "0 auto" }}>
      {/* Sort buttons (centered) + helper text (right) */}
      {(showSortButtons || helperText) && (
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: helperText ? "space-between" : "center",
          padding: "2px 8px 3px", gap: 6,
        }}>
          {showSortButtons ? (
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={onSortByRank} style={{
                fontSize: 8, fontWeight: 500, color: cherry,
                background: "rgba(255,255,255,0.7)", border: `1px solid rgba(224,48,80,0.15)`,
                borderRadius: 6, padding: "2px 8px", cursor: "pointer",
                fontFamily: FONT_SANS, letterSpacing: 0.3,
              }}>Sort by Rank</button>
              <button onClick={onSortBySuit} style={{
                fontSize: 8, fontWeight: 500, color: cherry,
                background: "rgba(255,255,255,0.7)", border: `1px solid rgba(224,48,80,0.15)`,
                borderRadius: 6, padding: "2px 8px", cursor: "pointer",
                fontFamily: FONT_SANS, letterSpacing: 0.3,
              }}>Sort by Suit</button>
            </div>
          ) : <div />}
          {helperText && (
            <span style={{
              fontSize: 8, fontStyle: "italic", color: textColor,
              fontFamily: FONT_SANS, opacity: 0.85,
              textAlign: "right",
            }}>
              {helperText}
            </span>
          )}
        </div>
      )}

      {/* Tile row with absolutely-positioned Mahjong button */}
      <div style={{ position: "relative", padding: "0 4px" }}>
        {/* Responsive scaled tile row */}
        <div ref={outerRef} style={{
          overflow: "hidden",
          height: Math.ceil(rowNaturalH * tileScale),
          minHeight: 30,
        }}>
          <div ref={innerRef} style={{
            display: "flex",
            gap: 3,
            flexWrap: "nowrap",
            alignItems: "flex-end",
            transformOrigin: "top left",
            transform: `scale(${tileScale})`,
            width: "max-content",
            padding: "0 4px",
          }}>
            {hand.map((tile, idx) => {
              const isSelected = selectedIds?.has(tile.instanceId);
              const isNew = newTileIds?.has(tile.instanceId) && !touchedTileIds?.has(tile.instanceId);

              return (
                <div
                  key={tile.instanceId}
                  onClick={() => !disabled && onTileTap?.(tile, idx)}
                  onDoubleClick={() => !disabled && onTileDoubleTap?.(tile, idx)}
                  style={{
                    position: "relative",
                    cursor: disabled ? "default" : "pointer",
                    transition: "transform 0.15s ease, opacity 0.15s",
                    transform: isSelected ? "translateY(-6px) scale(1.05)" : "none",
                    opacity: disabled ? 0.6 : 1,
                  }}
                >
                  {/* Selection / New outline */}
                  {(isSelected || isNew) && (
                    <div style={{
                      position: "absolute", inset: -2, borderRadius: 12, zIndex: 0,
                      border: `2px solid ${isSelected ? cherry : seafoam}`,
                      boxShadow: `0 0 6px ${isSelected ? "rgba(224,48,80,0.3)" : "rgba(109,191,168,0.3)"}`,
                    }} />
                  )}
                  {/* NEW badge */}
                  {isNew && (
                    <span style={{
                      position: "absolute", top: -4, right: -4, zIndex: 2,
                      fontSize: 6, fontWeight: 700, color: "#fff",
                      background: seafoam, padding: "1px 3px",
                      borderRadius: 3, lineHeight: 1, fontFamily: FONT_SANS,
                    }}>NEW</span>
                  )}
                  <MahjiTile tile={tile} size="md" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Mahjong! button — absolutely positioned center-right, inline with tiles */}
        {showBtn && (
          <button onClick={onMahjong} style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            right: 4,
            background: `linear-gradient(135deg, ${cherry}, #C42844)`,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "4px 7px",
            fontSize: 8,
            fontWeight: 700,
            fontFamily: FONT_SERIF,
            letterSpacing: 0.5,
            cursor: "pointer",
            whiteSpace: "nowrap" as const,
            boxShadow: "0 2px 6px rgba(224,48,80,0.3)",
            zIndex: 2,
          }}>
            Mahjong!
          </button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GAME OVERLAYS — Win, Invalid Hand, Wall Game, Contested Call
// ═══════════════════════════════════════════════════════════════════

// ── Win Overlay ── compact, uses tiny DiscardTile-sized tiles
export function WinOverlay({
  winnerName,
  winningHand,
  cardLine,
  onNextGame,
  onExit,
  onLeaderboard,
}: {
  winnerName: string;
  winningHand: GameTile[];
  cardLine?: string;
  onNextGame?: () => void;
  onExit?: () => void;
  onLeaderboard?: () => void;
}) {
  return (
    <>
      {onExit && (
        <button onClick={onExit} style={EXIT_BTN}>Exit</button>
      )}
      {onLeaderboard && (
        <button onClick={onLeaderboard} style={LEADERBOARD_BTN}>See Leaderboard</button>
      )}
      {/* Main popup — compact with tiny tiles */}
      <div style={{
        background: "linear-gradient(145deg, #E03050, #C42844)",
        borderRadius: 12, padding: "8px 10px",
        textAlign: "center", maxWidth: "80%",
        boxShadow: "0 6px 24px rgba(224,48,80,0.4)",
        zIndex: 11,
      }}>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: 1.5 }}>
          {"\u2728"} Mahjong {"\u2728"}
        </div>
        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.85)", fontFamily: FONT_SANS, marginTop: 1 }}>Well done, {winnerName}!</div>
        {/* Winning hand tiles — tiny DiscardTile size */}
        <div style={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap", margin: "5px 0 3px" }}>
          {winningHand.map((tile, i) => (
            <DiscardTile key={tile.instanceId || i} tile={tile} />
          ))}
        </div>
        {/* Card line — single line, no wrap */}
        {cardLine && (
          <div style={{
            fontSize: 6, color: "rgba(255,255,255,0.7)", fontFamily: FONT_SANS,
            marginBottom: 5, fontStyle: "italic",
            whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {cardLine}
          </div>
        )}
        {onNextGame && (
          <button onClick={onNextGame} style={{
            background: "#fff", color: "#E03050",
            border: "none", borderRadius: 6, padding: "4px 12px",
            fontSize: 9, fontWeight: 700, fontFamily: FONT_SERIF,
            cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}>Next Game</button>
        )}
      </div>
    </>
  );
}

// ── Invalid Hand Overlay ── compact with tiny tiles
export function InvalidHandOverlay({
  attemptedHand,
  cardLine,
  errorMessage,
  onTryAgain,
  onExit,
  onLeaderboard,
}: {
  attemptedHand: GameTile[];
  cardLine?: string;
  errorMessage?: string;
  onTryAgain?: () => void;
  onExit?: () => void;
  onLeaderboard?: () => void;
}) {
  return (
    <>
      {onExit && (
        <button onClick={onExit} style={EXIT_BTN}>Exit</button>
      )}
      {onLeaderboard && (
        <button onClick={onLeaderboard} style={LEADERBOARD_BTN}>See Leaderboard</button>
      )}
      <div style={{
        background: "linear-gradient(145deg, #3E2A50, #2D1B4E)",
        borderRadius: 12, padding: "8px 10px",
        textAlign: "center", maxWidth: "80%",
        boxShadow: "0 6px 24px rgba(45,27,78,0.5)",
        zIndex: 11,
      }}>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>Invalid Hand</div>
        {/* Attempted hand tiles — tiny DiscardTile size */}
        <div style={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap", margin: "4px 0 2px" }}>
          {attemptedHand.map((tile, i) => (
            <DiscardTile key={tile.instanceId || i} tile={tile} />
          ))}
        </div>
        {cardLine && (
          <div style={{
            fontSize: 6, color: "rgba(255,255,255,0.6)", fontFamily: FONT_SANS,
            marginBottom: 2, fontStyle: "italic",
            whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis",
          }}>{cardLine}</div>
        )}
        {errorMessage && (
          <div style={{ fontSize: 7, color: "rgba(255,255,255,0.8)", fontFamily: FONT_SANS, marginBottom: 4, lineHeight: 1.3 }}>{errorMessage}</div>
        )}
        {onTryAgain && (
          <button onClick={onTryAgain} style={{
            background: "#6DBFA8", color: "#fff",
            border: "none", borderRadius: 6, padding: "4px 12px",
            fontSize: 9, fontWeight: 700, fontFamily: FONT_SERIF,
            cursor: "pointer", boxShadow: "0 2px 8px rgba(109,191,168,0.3)",
          }}>Try Again!</button>
        )}
      </div>
    </>
  );
}

// ── Wall Game (Draw) Overlay ──
export function WallGameOverlay({
  onNextGame,
  onExit,
  onLeaderboard,
}: {
  onNextGame?: () => void;
  onExit?: () => void;
  onLeaderboard?: () => void;
}) {
  return (
    <>
      {onExit && (
        <button onClick={onExit} style={EXIT_BTN}>Exit</button>
      )}
      {onLeaderboard && (
        <button onClick={onLeaderboard} style={LEADERBOARD_BTN}>See Leaderboard</button>
      )}
      <div style={{
        background: "linear-gradient(145deg, #D8B4E2, #C8A0D6)",
        borderRadius: 14, padding: "12px 16px",
        textAlign: "center", maxWidth: "70%",
        boxShadow: "0 8px 32px rgba(200,160,214,0.4)",
        zIndex: 11,
      }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 8, fontWeight: 400, color: "#2D1B4E", letterSpacing: 0.5, marginBottom: 2 }}>Wall Game</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 700, color: "#2D1B4E", letterSpacing: 1 }}>It's a Draw!</div>
        <div style={{ fontSize: 10, color: "#E03050", fontFamily: FONT_SANS, fontWeight: 600, marginTop: 4 }}>+10 points for all</div>
        {onNextGame && (
          <button onClick={onNextGame} style={{
            background: "#E03050", color: "#fff",
            border: "none", borderRadius: 8, padding: "6px 16px",
            fontSize: 10, fontWeight: 700, fontFamily: FONT_SERIF,
            cursor: "pointer", marginTop: 8,
            boxShadow: "0 2px 8px rgba(224,48,80,0.3)",
          }}>Next Game</button>
        )}
      </div>
    </>
  );
}

// ── Contested Call Overlay ──
export function ContestedCallOverlay({
  playerA,
  playerB,
  winner,
}: {
  playerA: string;
  playerB: string;
  winner: string;
}) {
  return (
    <div style={{
      background: "rgba(80,80,80,0.85)",
      borderRadius: 10, padding: "12px 16px",
      textAlign: "center", maxWidth: "80%",
      backdropFilter: "blur(4px)",
      zIndex: 11,
    }}>
      <div style={{ fontSize: 10, color: "#fff", fontFamily: FONT_SANS, lineHeight: 1.5 }}>
        Both <strong>{playerA}</strong> and <strong>{playerB}</strong> called for the tile.
        In accordance with NMJL rules, <strong>{winner}</strong> was awarded the tile.
      </div>
    </div>
  );
}

// ── Call Tile UI (discarded tile + action buttons) ──
// Desktop: Ignore button on left, tile in center, Call button on right.
// Mobile: swipe tile right to call, left to ignore.
// After calling: options appear (Pung, Kong, Quint, "To Win Mahjong!").

export function CallTileUI({
  tile,
  discarderName,
  onIgnore,
  onCall,
  onPung,
  onKong,
  onQuint,
  onMahjong,
  showOptions = false,
  cherry,
}: {
  tile: GameTile;
  discarderName: string;
  onIgnore?: () => void;
  onCall?: () => void;           // triggers option reveal
  onPung?: () => void;
  onKong?: () => void;
  onQuint?: () => void;
  onMahjong?: () => void;
  showOptions?: boolean;
  cherry: string;
}) {
  // ── Swipe handling for mobile ──
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const SWIPE_THRESHOLD = 40;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setSwipeOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (showOptions) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    // Only horizontal swipes
    if (dy > Math.abs(dx)) return;
    setSwipeOffset(dx);
  };

  const handleTouchEnd = () => {
    if (showOptions) { setSwipeOffset(0); return; }
    if (swipeOffset > SWIPE_THRESHOLD && onCall) {
      onCall(); // swipe right = call
    } else if (swipeOffset < -SWIPE_THRESHOLD && onIgnore) {
      onIgnore(); // swipe left = ignore
    }
    setSwipeOffset(0);
  };

  // ── Before calling: Ignore ← [Tile] → Call ──
  if (!showOptions) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
        }}>
          {/* Ignore button (left) — desktop */}
          {onIgnore && (
            <button onClick={onIgnore} style={{
              fontSize: 7, fontWeight: 600, color: "#fff",
              background: "rgba(128,128,128,0.55)", border: "none",
              borderRadius: 5, padding: "3px 8px", cursor: "pointer",
              fontFamily: FONT_SANS, display: "flex", alignItems: "center", gap: 3,
            }}>
              <span style={{ fontSize: 9 }}>{"\u2190"}</span> Ignore
            </button>
          )}

          {/* Swipeable tile */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: `translateX(${swipeOffset * 0.4}px)`,
              transition: swipeOffset === 0 ? "transform 0.25s ease" : "none",
              cursor: "grab",
            }}
          >
            <div style={{
              padding: 3, borderRadius: 6,
              background: "rgba(255,255,255,0.12)",
              border: `1.5px solid rgba(224,48,80,0.35)`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}>
              <MahjiTile tile={tile} size="xs" />
            </div>
          </div>

          {/* Call button (right) — desktop */}
          {onCall && (
            <button onClick={onCall} style={{
              fontSize: 7, fontWeight: 600, color: "#fff",
              background: cherry, border: "none",
              borderRadius: 5, padding: "3px 8px", cursor: "pointer",
              fontFamily: FONT_SANS, display: "flex", alignItems: "center", gap: 3,
              boxShadow: "0 1px 4px rgba(224,48,80,0.25)",
            }}>
              Call <span style={{ fontSize: 9 }}>{"\u2192"}</span>
            </button>
          )}
        </div>

        {/* Swipe hint for mobile */}
        <div style={{
          fontSize: 6, color: "rgba(255,255,255,0.45)", fontFamily: FONT_SANS,
          textAlign: "center", letterSpacing: 0.3,
        }}>
          {"\u2190"} swipe to ignore · swipe to call {"\u2192"}
        </div>
      </div>
    );
  }

  // ── After calling: large tile in dark card + option buttons below ──
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      background: "rgba(60,50,55,0.92)",
      borderRadius: 14, padding: "14px 18px 12px",
      boxShadow: "0 6px 24px rgba(0,0,0,0.3)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}>
      {/* Tile — larger (sm size), centered in card */}
      <div style={{
        padding: 6, borderRadius: 10,
        background: "rgba(255,255,255,0.08)",
        border: `2px solid rgba(255,255,255,0.12)`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      }}>
        <MahjiTile tile={tile} size="sm" />
      </div>

      {/* Call options row */}
      <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
        {onPung && <CallOptionBtn label="Pung" onClick={onPung} bg="#6B3FA0" />}
        {onKong && <CallOptionBtn label="Kong" onClick={onKong} bg="#6B3FA0" />}
        {onQuint && <CallOptionBtn label="Quint" onClick={onQuint} bg="#6B3FA0" />}
        {onMahjong && (
          <CallOptionBtn label="To Win Mahjong!" onClick={onMahjong} bg={cherry} />
        )}
      </div>
    </div>
  );
}

function CallOptionBtn({ label, onClick, bg }: { label: string; onClick: () => void; bg: string }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 9, fontWeight: 600, color: "#fff",
      background: bg, border: "none",
      borderRadius: 8, padding: "5px 10px",
      cursor: "pointer", fontFamily: FONT_SANS,
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      whiteSpace: "nowrap" as const,
    }}>{label}</button>
  );
}
