import { useState } from 'react';
import { C, GAME_MATS, getGameMat } from '../constants/colors';
import { PT, SH, Cnt, CardSel } from '../components/Layout';
import { GameBoard } from '../components/GameBoard';
import type { PlayerConfig } from '../components/GameBoard';
import { getAvailableYears, getCurrentYear } from '../data/nmjl';

const DEFAULT_PLAYERS: PlayerConfig[] = [
  { seat: "east", name: "East (Dealer)", rackCount: 13 },
  { seat: "north", name: "North", rackCount: 13 },
  { seat: "west", name: "West", rackCount: 13 },
  { seat: "south", name: "South", rackCount: 13 },
];

function PlayPage() {
  const currentYear = getCurrentYear();
  const [diff, setDiff] = useState("Intermediate");
  const [card, setCard] = useState(String(currentYear));
  const [matId, setMatId] = useState("coffee");
  const mat = getGameMat(matId);

  return (<><PT>Play</PT><Cnt>
    <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
      {["Novice", "Intermediate", "Advanced"].map(d => (
        <div key={d} onClick={() => setDiff(d)} style={{
          padding: "6px 14px", borderRadius: 20, fontSize: 11,
          fontWeight: diff === d ? 600 : 400, cursor: "pointer",
          background: diff === d ? C.seafoam : "transparent",
          color: diff === d ? C.white : C.mid,
          border: diff === d ? "none" : `1px solid ${C.lavBorder}`,
          transition: "all 0.3s"
        }}>{d}</div>
      ))}
    </div>
    <SH style={{ marginTop: 4 }}>Select Card</SH>
    <CardSel items={[
      ...getAvailableYears().reverse().map((y, i) => ({
        id: String(y),
        name: `NMJL ${y}`,
        sub: i === 0 ? 'Current year' : '',
      })),
      { id: "big", name: "Big Card", sub: "Mahjong Line" },
    ]} active={card} onSelect={setCard} />
    <SH>Select Your Game Mat</SH>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
      <div style={{ display: "flex", gap: 10, flex: 1, minWidth: 0 }}>
        {GAME_MATS.map(m => <div key={m.id} style={{ textAlign: "center", flex: "0 0 auto" }}>
          <div onClick={() => setMatId(m.id)} style={{ width: 44, height: 44, borderRadius: 10, background: m.swatch, cursor: "pointer", border: matId === m.id ? `2px solid ${C.cherry}` : "2px solid transparent", boxShadow: matId === m.id ? "0 2px 10px rgba(224,48,80,0.15)" : "none" }} />
          <div style={{ fontSize: 7, color: C.light, marginTop: 3, letterSpacing: .5 }}>{m.name}</div></div>)}
      </div>
      <button style={{ padding: "10px 16px", border: "none", borderRadius: 12, fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 600, letterSpacing: 1, color: C.white, cursor: "pointer", background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`, boxShadow: "0 4px 14px rgba(224,48,80,0.18)", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        Start
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.cerulean} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3" /></svg>
      </button>
    </div>

    {/* ─── Game Board Preview (board only, no hand until game starts) ─── */}
    <div style={{ marginBottom: 10 }}>
      <GameBoard mat={mat} players={DEFAULT_PLAYERS} tilesRemaining={152} />
    </div>
  </Cnt></>);
}

export default PlayPage;
