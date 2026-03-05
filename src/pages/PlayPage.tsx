import { useState } from 'react';
import { C, matsList, matB } from '../constants/colors';
import { PT, SH, Cnt, CardSel } from '../components/Layout';

/* Seat badge backgrounds per mat — seafoam on coffee, brown on lighter mats */
const SEAT_BG: Record<string, string> = {
  brn: "rgba(109,191,168,0.6)",
  sfm: "rgba(58,46,36,0.55)",
  prp: "rgba(58,46,36,0.55)",
  blu: "rgba(58,46,36,0.55)",
};

function PlayPage() {
  const [diff, setDiff] = useState("Intermediate");
  const [card, setCard] = useState("2025");
  const [mat, setMat] = useState("brn");
  const mb = matB[mat];
  const seatBg = SEAT_BG[mat];

  /* ── Charleston-style seat tag ── */
  const Tag = ({ name }: { name: string }) => (
    <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: seatBg, padding: "2px 8px", borderRadius: 6, fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap" as const }}>{name}</span>
  );

  /* ── Horizontal mini-tile row (face-down or face-up) ── */
  const HTiles = ({ n, up = false }: { n: number; up?: boolean }) => (
    <div style={{ display: "flex", gap: 1, justifyContent: "center" }}>
      {Array(n).fill(0).map((_, i) => (
        <div key={i} style={{ width: 11, height: 16, borderRadius: 2, background: up ? "rgba(255,255,255,0.9)" : mb.rack, border: `0.5px solid ${up ? "rgba(200,190,175,0.35)" : mb.rackB}`, boxShadow: up ? "0 1px 3px rgba(0,0,0,0.12)" : "none" }} />
      ))}
    </div>
  );

  /* ── Vertical mini-tile column (face-down) ── */
  const VTiles = ({ n }: { n: number }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {Array(n).fill(0).map((_, i) => (
        <div key={i} style={{ width: 16, height: 11, borderRadius: 2, background: mb.rack, border: `0.5px solid ${mb.rackB}` }} />
      ))}
    </div>
  );

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
    <CardSel items={[{ id: "2025", name: "NMJL 2025", sub: "Current year" }, { id: "2024", name: "NMJL 2024", sub: "Last year" }, { id: "big", name: "Big Card", sub: "Mahjong Line" }]} active={card} onSelect={setCard} />
    <SH>Select Your Game Mat</SH>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
      <div style={{ display: "flex", gap: 10, flex: 1, minWidth: 0 }}>
        {matsList.map(m => <div key={m.id} style={{ textAlign: "center", flex: "0 0 auto" }}>
          <div onClick={() => setMat(m.id)} style={{ width: 44, height: 44, borderRadius: 10, background: m.g, cursor: "pointer", border: mat === m.id ? `2px solid ${C.cherry}` : "2px solid transparent", boxShadow: mat === m.id ? "0 2px 10px rgba(224,48,80,0.15)" : "none" }} />
          <div style={{ fontSize: 7, color: C.light, marginTop: 3, letterSpacing: .5 }}>{m.name}</div></div>)}
      </div>
      <button style={{ padding: "10px 16px", border: "none", borderRadius: 12, fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 600, letterSpacing: 1, color: C.white, cursor: "pointer", background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`, boxShadow: "0 4px 14px rgba(224,48,80,0.18)", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        Start
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.cerulean} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3" /></svg>
      </button>
    </div>

    {/* ─── Game Mat (Charleston-style flex layout) ─── */}
    <div style={{ background: mb.bg, borderRadius: 14, marginBottom: 10, boxShadow: "inset 0 2px 12px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden", transition: "all 0.5s ease" }}>
      {/* West (top): tag → rack toward center */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 0 4px" }}>
        <Tag name="West" />
        <HTiles n={13} />
      </div>

      {/* Middle section: South (left) | empty center | North (right) */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0 6px", minHeight: 120 }}>
        {/* South — tag then rack toward center */}
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Tag name="South" />
          <VTiles n={10} />
        </div>
        {/* Center — empty (tiles appear here during gameplay) */}
        <div style={{ flex: 1 }} />
        {/* North — rack then tag toward outside */}
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <VTiles n={10} />
          <Tag name="North" />
        </div>
      </div>

      {/* East / You (bottom): rack (face-up) → tag */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 0 8px" }}>
        <HTiles n={14} up />
        <Tag name="East (Dealer)" />
      </div>
    </div>
  </Cnt></>);
}

export default PlayPage;
