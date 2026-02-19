import { useState } from 'react';
import { C } from '../constants/colors';
import { BirdIcon, I } from '../components/ui/Icons';
import { PT, SH, Cnt } from '../components/Layout';

function BamPage() {
  const [msgs, setMsgs] = useState([
    { from: "bam", text: "Hey there! I'm Bam Bird, your Mahjong mentor. Ask me anything about tiles, strategy, rules, or the NMJL card." },
    { from: "user", text: "What's the difference between a pung and a kong?" },
    { from: "bam", text: "A pung is three identical tiles. A kong is four. Both can use jokers and be exposed. Kongs are worth more on many card lines." },
  ]);
  const [input, setInput] = useState("");
  const send = () => { if (!input.trim()) return; setMsgs(p => [...p, { from: "user", text: input }, { from: "bam", text: "In the live app, I'd give you a real answer here." }]); setInput(""); };
  return (<><PT>Ask Bam Bird</PT>
    <div style={{ flex: 1, padding: "0 20px", display: "flex", flexDirection: "column", paddingBottom: 90 }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}><div style={{ width: 34, height: 34, borderRadius: "50%", background: C.lavSoft, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}><BirdIcon size={20} color={C.cherry} sw={1.8}/></div>
        <p style={{ fontSize: 12, color: C.mid, fontStyle: "italic", margin: 0 }}>Your AI Mahj mentor. Ask away!</p></div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {msgs.map((m,i) => <div key={i} style={{ maxWidth: "80%", padding: "12px 14px", marginBottom: 8, fontSize: 13, lineHeight: 1.5, borderRadius: 14, ...(m.from==="bam"?{background:C.white,border:`1px solid ${C.lavBorder}`,color:C.dark,borderBottomLeftRadius:4,marginRight:"auto"}:{background:C.cherry,color:C.white,borderBottomRightRadius:4,marginLeft:"auto"}) }}>
          {m.from==="bam" && <strong style={{ fontSize: 11, color: C.lavDeep, display: "block", marginBottom: 2 }}>Bam Bird</strong>}{m.text}</div>)}
      </div>
      <div style={{ marginTop: 10 }}><SH style={{ marginTop: 0 }}>Try asking</SH>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {["Charleston strategy","When to expose","Reading the card","Defensive play","Joker rules"].map(t => <div key={t} onClick={() => setInput(t)} style={{ fontSize: 10.5, padding: "6px 12px", borderRadius: 14, border: `1px solid ${C.lavBorder}`, color: C.mid, cursor: "pointer", background: C.white }}>{t}</div>)}</div>
      </div>
      <div style={{ display: "flex", gap: 8, paddingTop: 12 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask Bam Bird anything..." style={{ flex: 1, padding: "10px 14px", borderRadius: 20, border: `1px solid ${C.lavBorder}`, fontSize: 12, fontFamily: "'Outfit',sans-serif", outline: "none", color: C.dark, background: C.white }}/>
        <button onClick={send} style={{ width: 38, height: 38, borderRadius: "50%", background: C.cherry, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 14, height: 14, stroke: "white", strokeWidth: 2, fill: "none", display: "flex" }}>{I.send}</div></button>
      </div>
    </div></>);
}

export default BamPage;
