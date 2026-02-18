import { useState } from 'react';
import { C } from '../constants/colors';
import { BirdIcon, I } from '../components/ui/Icons';
import { PT, Cnt } from '../components/Layout';

function BamPage() {
  const [msgs, setMsgs] = useState([
    { from: "bam", text: "Hey there! I'm Bam Bird, your Mahjong mentor. Ask me anything about tiles, strategy, rules, or the NMJL card." },
    { from: "user", text: "What's the difference between a pung and a kong?" },
    { from: "bam", text: "A pung is three identical tiles. A kong is four. Both can use jokers and be exposed. Kongs are worth more on many card lines." },
  ]);
  const [input, setInput] = useState("");
  const send = () => { if (!input.trim()) return; setMsgs(p => [...p, { from: "user", text: input }, { from: "bam", text: "In the live app, I'd give you a real answer here." }]); setInput(""); };
  return (<><PT>Ask Bam Bird</PT>
    <div style={{ flex: 1, padding: "0 18px", display: "flex", flexDirection: "column", paddingBottom: 100 }}>
      <div style={{ textAlign: "center", marginBottom: 14 }}><div style={{ width: 30, height: 30, borderRadius: "50%", background: C.lavSoft, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}><BirdIcon size={18} color={C.cherry} sw={1.8}/></div>
        <p style={{ fontSize: 10.5, color: C.mid, fontStyle: "italic", margin: 0 }}>Your AI Mahj mentor. Ask anything.</p></div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {msgs.map((m,i) => <div key={i} style={{ maxWidth: "80%", padding: "11px 13px", marginBottom: 8, fontSize: 11.5, lineHeight: 1.5, borderRadius: 14, ...(m.from==="bam"?{background:C.white,border:`1px solid ${C.lavBorder}`,color:C.dark,borderBottomLeftRadius:4,marginRight:"auto"}:{background:C.cherry,color:C.white,borderBottomRightRadius:4,marginLeft:"auto"}) }}>
          {m.from==="bam" && <strong style={{ fontSize: 10, color: C.lavDeep, display: "block", marginBottom: 2 }}>Bam Bird</strong>}{m.text}</div>)}
      </div>
      <div style={{ marginTop: 10 }}><SH style={{ marginTop: 0 }}>Try asking</SH>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
          {["Charleston strategy","When to expose","Reading the card","Defensive play","Joker rules"].map(t => <div key={t} onClick={() => setInput(t)} style={{ fontSize: 9.5, padding: "5px 11px", borderRadius: 14, border: `1px solid ${C.lavBorder}`, color: C.mid, cursor: "pointer", background: C.white }}>{t}</div>)}</div>
      </div>
      <div style={{ display: "flex", gap: 8, paddingTop: 10 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask Bam Bird anything..." style={{ flex: 1, padding: "9px 13px", borderRadius: 20, border: `1px solid ${C.lavBorder}`, fontSize: 11, fontFamily: "'Outfit',sans-serif", outline: "none", color: C.dark, background: C.white }}/>
        <button onClick={send} style={{ width: 34, height: 34, borderRadius: "50%", background: C.cherry, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 14, height: 14, stroke: "white", strokeWidth: 2, fill: "none", display: "flex" }}>{I.send}</div></button>
      </div>
    </div></>);
}

// Stat ring (SVG donut)
const Ring = ({ val, max, label, color, size = 60 }) => {
  const r = 22; const circ = 2*Math.PI*r; const pct = val/max; const offset = circ*(1-pct);
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox="0 0 54 54" style={{ display: "block", margin: "0 auto" }}>
        <circle cx="27" cy="27" r={r} fill="none" stroke="rgba(200,190,215,0.15)" strokeWidth="4"/>
        <circle cx="27" cy="27" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 27 27)" style={{ transition: "stroke-dashoffset 0.8s ease" }}/>
        <text x="27" y="25" textAnchor="middle" style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 14, fontWeight: 600, fill: C.dark }}>{val}</text>
        <text x="27" y="34" textAnchor="middle" style={{ fontSize: 7, fill: C.light }}>/ {max}</text>
      </svg>
      <div style={{ fontSize: 8, color: C.lavText, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 600, marginTop: 4 }}>{label}</div>
    </div>
  );
};

const Row = ({ icon, label, sub, danger, onClick }) => (
  <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 14, marginBottom: 8, cursor: "pointer", transition: "all 0.3s" }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";}}>
    <div style={{ width: 16, height: 16, stroke: danger?"#D04050":C.lavDeep, strokeWidth: 1.3, fill: "none", display: "flex", flexShrink: 0 }}>{icon}</div>
    <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500, color: danger?"#D04050":C.dark }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: C.light, marginTop: 1 }}>{sub}</div>}</div>
    <div style={{ width: 14, height: 14, stroke: C.lavText, strokeWidth: 1.3, fill: "none", display: "flex" }}>{I.chevR}</div>
  </div>
);


export default BamPage;
