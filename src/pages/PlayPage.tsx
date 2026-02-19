import { useState } from 'react';
import { C, matsList, matB } from '../constants/colors';
import { PT, SH, Cnt, Tabs, CardSel } from '../components/Layout';
import { MiniTileBack } from '../components/TileComponents';

function PlayPage() {
  const [diff, setDiff] = useState("Intermediate"); const [card, setCard] = useState("2025"); const [mat, setMat] = useState("brn");
  const mb = matB[mat]; const t13 = Array(13).fill(0);
  const Rack = ({ dir, label }) => {
    const isV = dir==="left"||dir==="right";
    const pos = dir==="top"?{top:6,left:"50%",transform:"translateX(-50%)"}:dir==="bottom"?{bottom:6,left:"50%",transform:"translateX(-50%)"}:dir==="left"?{left:4,top:"50%",transform:"translateY(-50%)"}:{right:4,top:"50%",transform:"translateY(-50%)"};
    return (
      <div style={{ position: "absolute", ...pos, display: "flex", flexDirection: isV?"column":"row", alignItems: "center", gap: isV?0:1 }}>
        {!isV && <div style={{ fontSize: 8, color: mb.text, letterSpacing: .5, marginBottom: 2 }}>{label}</div>}
        <div style={{ display: "flex", flexDirection: isV?"column":"row", gap: 1 }}>
          {(dir==="bottom"?[...t13,0]:t13.slice(0,isV?10:13)).map((_,i) => (
            <div key={i} style={{ width: isV?16:11, height: isV?11:16, borderRadius: 2,
              background: dir==="bottom"?"rgba(255,255,255,0.9)":mb.rack,
              border: `0.5px solid ${dir==="bottom"?"rgba(200,190,175,0.35)":mb.rackB}`,
              boxShadow: dir==="bottom"?"0 1px 3px rgba(0,0,0,0.12)":"none" }}/>
          ))}
        </div>
        {isV && <div style={{ fontSize: 8, color: mb.text, letterSpacing: .5, marginTop: 2 }}>{label}</div>}
        {!isV && dir==="bottom" && <div style={{ fontSize: 8, color: mb.you, letterSpacing: .5, marginTop: 3 }}>You — South</div>}
      </div>
    );
  };
  return (<><PT>Play</PT><Cnt>
    <div style={{ display:"flex", gap:5, marginBottom:14, flexWrap:"wrap" }}>
      {["Novice","Intermediate","Advanced"].map(d => (
        <div key={d} onClick={() => setDiff(d)} style={{
          padding:"6px 14px", borderRadius:20, fontSize:11,
          fontWeight: diff===d ? 600 : 400, cursor:"pointer",
          background: diff===d ? C.seafoam : "transparent",
          color: diff===d ? C.white : C.mid,
          border: diff===d ? "none" : `1px solid ${C.lavBorder}`,
          transition:"all 0.3s"
        }}>{d}</div>
      ))}
    </div>
    <SH style={{ marginTop: 4 }}>Select Card</SH>
    <CardSel items={[{id:"2025",name:"NMJL 2025",sub:"Current year"},{id:"2024",name:"NMJL 2024",sub:"Last year"},{id:"big",name:"Big Card",sub:"Mahjong Line"}]} active={card} onSelect={setCard}/>
    <SH>Select Your Game Mat</SH>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <div style={{ display: "flex", gap: 12, flex: 1 }}>
        {matsList.map(m => <div key={m.id} style={{ textAlign: "center" }}>
          <div onClick={() => setMat(m.id)} style={{ width: 52, height: 52, borderRadius: 12, background: m.g, cursor: "pointer", border: mat===m.id?`2px solid ${C.cherry}`:"2px solid transparent", boxShadow: mat===m.id?"0 2px 10px rgba(224,48,80,0.15)":"none" }}/>
          <div style={{ fontSize: 8, color: C.light, marginTop: 4, letterSpacing: .5 }}>{m.name}</div></div>)}
      </div>
      <button style={{ padding: "12px 22px", border: "none", borderRadius: 14, fontFamily: "'Bodoni Moda',serif", fontSize: 14, fontWeight: 600, letterSpacing: 1.5, color: C.white, cursor: "pointer", background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`, boxShadow: "0 4px 14px rgba(224,48,80,0.18)", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        Start Game
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.cerulean} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
      </button>
    </div>
    <div style={{ background: mb.bg, borderRadius: 16, padding: 18, marginBottom: 10, position: "relative", minHeight: 300, border: "1px solid rgba(60,48,35,0.15)", boxShadow: "inset 0 2px 10px rgba(0,0,0,0.1)", transition: "all 0.5s ease" }}>
      <Rack dir="top" label="North"/>
      <Rack dir="left" label="West"/>
      <Rack dir="right" label="East"/>
      <div style={{ width: 150, height: 90, margin: "40px auto 20px", background: mb.area, border: `1px solid ${mb.areaB}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 10, color: mb.areaT, letterSpacing: 1, fontStyle: "italic" }}>Discard area</span></div>
      <Rack dir="bottom" label="You — South"/>
    </div>
    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
      {["Sort by Rank","Sort by Suit"].map(t => <div key={t} style={{ fontSize: 9.5, color: C.mid, padding: "5px 10px", background: C.white, borderRadius: 8, border: `1px solid ${C.lavBorder}`, cursor: "pointer" }}>{t}</div>)}
    </div>
  </Cnt></>);
}

export default PlayPage;
