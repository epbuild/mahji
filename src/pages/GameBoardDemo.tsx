// src/pages/GameBoardDemo.tsx
// Temporary dev route (#/board-demo) — shows game board states one at a time for visual QA.
// Remove before production.

import { useState } from "react";
import { GAME_MATS, FONT_SERIF, FONT_SANS, C, getThemeColors } from "../constants/colors";
import { useTheme } from "../constants/ThemeContext";
import {
  GameBoard, PlayerHand, SeatLabel,
  WinOverlay, InvalidHandOverlay, WallGameOverlay, ContestedCallOverlay,
  CallTileUI,
} from "../components/GameBoard";
import type { PlayerConfig } from "../components/GameBoard";
import { getFullDeck, shuffleDeck } from "../data/tileData";
import type { GameTile } from "../data/tileData";

// ── Generate mock data ──────────────────────────────────────────

function getMockDeck(): GameTile[] {
  return shuffleDeck(getFullDeck());
}

// Default players for each state
const BASE_PLAYERS: PlayerConfig[] = [
  { seat: "east", name: "East (Dealer)", rackCount: 13 },
  { seat: "north", name: "North", rackCount: 13 },
  { seat: "west", name: "West", rackCount: 13 },
  { seat: "south", name: "South", rackCount: 13 },
];

// State definitions
const STATE_NAMES = [
  "Game Board Setup",
  "Where Discards Go",
  "How Exposures Appear",
  "Call for Discarded Tile",
  "Contested Call",
  "Draw a Tile",
  "Someone Wins",
  "Invalid Hand",
  "Wall Game (Draw)",
];

// ═══════════════════════════════════════════════════════════════════
// DEMO PAGE
// ═══════════════════════════════════════════════════════════════════

export default function GameBoardDemo() {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const [matIdx, setMatIdx] = useState(0); // default coffee
  const mat = GAME_MATS[matIdx];
  const [stateIdx, setStateIdx] = useState(0);

  // Mock deck for all demos
  const [deck] = useState(() => getMockDeck());

  // Slices of the deck for various demos
  const eastHand = deck.slice(0, 13);
  const eastHandWith14 = deck.slice(0, 14);
  const discardTiles = deck.slice(14, 22);
  const exposureGroup1 = deck.slice(22, 25); // 3 tiles (pung)
  const exposureGroup2 = deck.slice(25, 28); // 3 tiles (pung)
  const northExposure = deck.slice(28, 32);  // 4 tiles (kong)
  const westExposure = deck.slice(32, 36);   // 4 tiles (kong)
  const calledTile = deck.slice(36, 37)[0];
  const winningHand = deck.slice(37, 51);    // 14 tiles

  // 7-tile hand (after 6 exposed: 13 - 6 = 7)
  const eastShortHand = deck.slice(0, 7);
  // 8-tile hand (after 6 exposed + 1 drawn: 13 - 6 + 1 = 8)
  const eastHandWith8 = deck.slice(0, 8);

  // State for call flow demo
  const [showCallOptions, setShowCallOptions] = useState(false);

  const prev = () => setStateIdx(i => Math.max(0, i - 1));
  const next = () => setStateIdx(i => Math.min(STATE_NAMES.length - 1, i + 1));

  const navBtn = (label: string, onClick: () => void, disabled: boolean) => (
    <button onClick={onClick} disabled={disabled} style={{
      fontSize: 10, fontWeight: 600, color: disabled ? t.textDim : C.cherry,
      background: disabled ? "transparent" : "rgba(224,48,80,0.06)",
      border: disabled ? `1px solid ${t.textDim}` : `1px solid rgba(224,48,80,0.2)`,
      borderRadius: 6, padding: "5px 14px", cursor: disabled ? "default" : "pointer",
      fontFamily: FONT_SANS, opacity: disabled ? 0.4 : 1,
    }}>{label}</button>
  );

  // ── Render current state ──
  function renderState() {
    switch (stateIdx) {
      case 0: // Game Board Setup
        return (
          <>
            <GameBoard mat={mat} players={BASE_PLAYERS} tilesRemaining={152} />
            <PlayerHand hand={eastHand} showSortButtons showMahjongButton cherry={C.cherry} />
          </>
        );
      case 1: // Where Discards Go
        return (
          <>
            <GameBoard mat={mat} players={BASE_PLAYERS} discards={discardTiles} tilesRemaining={144} />
            <PlayerHand hand={eastHand} showSortButtons showMahjongButton cherry={C.cherry} />
          </>
        );
      case 2: // How Exposures Appear
        return (
          <>
            <GameBoard
              mat={mat}
              players={[
                { seat: "east", name: "East (Dealer)", rackCount: 7, exposures: [exposureGroup1, exposureGroup2] },
                { seat: "north", name: "North", rackCount: 9, exposures: [northExposure] },
                { seat: "west", name: "West", rackCount: 9, exposures: [westExposure] },
                { seat: "south", name: "South", rackCount: 13 },
              ]}
              discards={discardTiles}
              tilesRemaining={120}
            />
            <PlayerHand hand={eastShortHand} showSortButtons showMahjongButton cherry={C.cherry} />
          </>
        );
      case 3: // Call for Discarded Tile
        return (
          <>
            <GameBoard
              mat={mat}
              players={[
                { seat: "east", name: "East (Dealer)", rackCount: 7, exposures: [exposureGroup1, exposureGroup2] },
                { seat: "north", name: "North", rackCount: 13, halo: "gold" },
                { seat: "west", name: "West", rackCount: 9, exposures: [westExposure] },
                { seat: "south", name: "South", rackCount: 13 },
              ]}
              discards={discardTiles.slice(0, 4)}
              tilesRemaining={130}
            >
              <CallTileUI
                tile={calledTile}
                discarderName="North"
                showOptions={showCallOptions}
                onCall={() => setShowCallOptions(true)}
                onIgnore={() => setShowCallOptions(false)}
                onPung={() => {}}
                onKong={() => {}}
                onQuint={() => {}}
                onMahjong={() => {}}
                cherry={C.cherry}
              />
            </GameBoard>
            <PlayerHand
              hand={eastShortHand}
              showSortButtons
              showMahjongButton
              helperText="North discarded a tile."
              helperColor="#6B3FA0"
              cherry={C.cherry}
            />
            <div style={{ textAlign: "center", marginTop: 6 }}>
              <button
                onClick={() => setShowCallOptions(!showCallOptions)}
                style={{
                  fontSize: 9, color: C.cherry, background: "rgba(224,48,80,0.06)",
                  border: `1px solid rgba(224,48,80,0.2)`, borderRadius: 6,
                  padding: "4px 12px", cursor: "pointer", fontFamily: FONT_SANS,
                }}
              >
                Toggle: {showCallOptions ? "Hide" : "Show"} call options
              </button>
            </div>
          </>
        );
      case 4: // Contested Call
        return (
          <>
            <GameBoard
              mat={mat}
              players={[
                { seat: "east", name: "East (Dealer)", rackCount: 7, exposures: [exposureGroup1, exposureGroup2] },
                { seat: "north", name: "North", rackCount: 13, halo: "gold" },
                { seat: "west", name: "West", rackCount: 9, exposures: [westExposure] },
                { seat: "south", name: "South", rackCount: 13 },
              ]}
              discards={discardTiles}
              tilesRemaining={120}
              overlay={
                <ContestedCallOverlay
                  playerA="East"
                  playerB="South"
                  winner="East"
                />
              }
            />
            <PlayerHand hand={eastShortHand} showSortButtons showMahjongButton cherry={C.cherry} />
          </>
        );
      case 5: // Draw a Tile (East has 6 exposed, drew 1 → 8 tiles in hand)
        return (
          <>
            <GameBoard
              mat={mat}
              players={[
                { seat: "east", name: "East (Dealer)", rackCount: 8, halo: "gold", exposures: [exposureGroup1, exposureGroup2] },
                { seat: "north", name: "North", rackCount: 13 },
                { seat: "west", name: "West", rackCount: 9, exposures: [westExposure] },
                { seat: "south", name: "South", rackCount: 13 },
              ]}
              discards={discardTiles}
              tilesRemaining={118}
            />
            <PlayerHand
              hand={eastHandWith8}
              showSortButtons
              showMahjongButton
              newTileIds={new Set([eastHandWith8[7]?.instanceId])}
              touchedTileIds={new Set()}
              helperText="Please drag or double tap to discard."
              helperColor={C.cherry}
              cherry={C.cherry}
            />
          </>
        );
      case 6: // Someone Wins
        return (
          <>
            <GameBoard
              mat={mat}
              players={[
                { seat: "east", name: "East (Dealer)", rackCount: 7, exposures: [exposureGroup1, exposureGroup2] },
                { seat: "north", name: "North", rackCount: 0, halo: "yellow", points: "+40 points" },
                { seat: "west", name: "West", rackCount: 13, points: "\u201310 points" },
                { seat: "south", name: "South", rackCount: 13, points: "\u201310 points" },
              ]}
              discards={discardTiles}
              overlay={
                <WinOverlay
                  winnerName="North"
                  winningHand={winningHand}
                  cardLine="Quints - Line 1: SSSSS 1111 WWWWW (any odd number)"
                  onNextGame={() => {}}
                  onExit={() => {}}
                  onLeaderboard={() => {}}
                />
              }
            />
            <PlayerHand hand={eastShortHand} showSortButtons showMahjongButton={false} cherry={C.cherry} disabled />
          </>
        );
      case 7: // Invalid Hand
        return (
          <GameBoard
            mat={mat}
            players={[
              { seat: "east", name: "East (Dealer)", rackCount: 0, halo: "red", points: "\u201310 points", exposures: [exposureGroup1, exposureGroup2, northExposure, westExposure] },
              { seat: "north", name: "North", rackCount: 13 },
              { seat: "west", name: "West", rackCount: 13 },
              { seat: "south", name: "South", rackCount: 13 },
            ]}
            discards={discardTiles}
            overlay={
              <InvalidHandOverlay
                attemptedHand={winningHand}
                cardLine="Quints - Line 1: SSSSS 1111 WWWWW (any odd number)"
                errorMessage="Quints Line 1 calls for a kong of odd numbers. You used even numbers."
                onTryAgain={() => {}}
                onExit={() => {}}
                onLeaderboard={() => {}}
              />
            }
          />
        );
      case 8: // Wall Game
        return (
          <>
            <GameBoard
              mat={mat}
              players={[
                { seat: "east", name: "East (Dealer)", rackCount: 13, points: "+10 points" },
                { seat: "north", name: "North", rackCount: 13, points: "+10 points" },
                { seat: "west", name: "West", rackCount: 13, points: "+10 points" },
                { seat: "south", name: "South", rackCount: 13, points: "+10 points" },
              ]}
              discards={discardTiles}
              tilesRemaining={0}
              overlay={
                <WallGameOverlay
                  onNextGame={() => {}}
                  onExit={() => {}}
                  onLeaderboard={() => {}}
                />
              }
            />
            <PlayerHand hand={eastHand} showSortButtons showMahjongButton={false} cherry={C.cherry} disabled />
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="content-scroll">
    <div style={{ padding: "12px 10px 100px", maxWidth: 420, margin: "0 auto" }}>
      {/* Page title */}
      <div style={{
        fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 700,
        color: t.textMain, letterSpacing: 2, textTransform: "uppercase" as const,
        textAlign: "center", marginBottom: 4,
      }}>Game Board Demo</div>

      {/* Mat selector */}
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

      {/* State nav */}
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
            {stateIdx + 1}. {STATE_NAMES[stateIdx]}
          </div>
          <div style={{ fontSize: 8, color: t.textDim, fontFamily: FONT_SANS }}>
            {stateIdx + 1} of {STATE_NAMES.length}
          </div>
        </div>
        {navBtn("Next \u2192", next, stateIdx === STATE_NAMES.length - 1)}
      </div>

      {/* Current state */}
      {renderState()}
    </div>
    </div>
  );
}
