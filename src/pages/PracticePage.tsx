import { useState } from 'react';
import { C } from '../constants/colors';
import { BirdIcon, I } from '../components/ui/Icons';
import { PT, SH, Tag, Card, Tabs, Cnt, BamFloat } from '../components/Layout';

const BamOverlay = ({ onClose, context }) => {
  const [msgs, setMsgs] = useState([{ from: "bam", text: `Hey! I can see you're in ${context}. Ask me anything!` }]);
  const [input, setInput] = useState("");
  const send = () => { if (!input.trim()) return; setMsgs(p => [...p, { from: "user", text: input }, { from: "bam", text: "Great question! In the live app, I'd give a real answer here." }]); setInput(""); };
  return (
    <div className="bam-overlay">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><BirdIcon size={16} color={C.cherry} sw={2.2}/><span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 14, fontWeight: 600, color: C.cherry }}>Bam Bird</span></div>
        <div onClick={onClose} style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, color: "#4A9E88", fontWeight: 600 }}>✕</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
        {msgs.map((m,i) => <div key={i} style={{ maxWidth: "85%", padding: "10px 13px", marginBottom: 6, fontSize: 12, lineHeight: 1.5, borderRadius: 12,
          ...(m.from==="bam" ? { background: C.white, border: `0.5px solid rgba(224,48,80,0.2)`, color: C.dark, borderBottomLeftRadius: 3, marginRight: "auto" } : { background: C.white, border: `0.5px solid rgba(109,191,168,0.3)`, color: C.dark, borderBottomRightRadius: 3, marginLeft: "auto" })
        }}>{m.text}</div>)}
      </div>
      <div style={{ display: "flex", gap: 6, padding: "8px 14px 14px" }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything..." style={{ flex: 1, padding: "9px 14px", borderRadius: 18, border: `0.5px solid rgba(224,48,80,0.2)`, fontSize: 12, fontFamily: "'Outfit',sans-serif", outline: "none", color: C.dark, background: C.white }}/>
        <button onClick={send} style={{ width: 34, height: 34, borderRadius: "50%", background: C.seafoam, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 14, height: 14, stroke: "white", strokeWidth: 2, fill: "none", display: "flex" }}>{I.send}</div></button>
      </div>
    </div>
  );
};

const drillsData = [
  { t: "Learn the Hands", d: "Match tiles to NMJL card patterns", lvls: ["Beginner"] },
  { t: "How to Deal", d: "Roll dice, break the wall, deal correctly", lvls: ["Beginner"] },
  { t: "Practicing the Charleston", d: "Master R-O-L-★-L-O-R and blind passes", lvls: ["Beginner","Intermediate","Advanced"] },
  { t: "Reading Exposures", d: "Narrow down opponent hands from melds", lvls: ["Intermediate","Advanced"] },
  { t: "Playing Defense", d: "Choose the safest discard, stop feeding", lvls: ["Advanced"] },
];

const lt = { "First Timer": "b", Novice: "n", Beginner: "b", Intermediate: "i", Advanced: "a" };

function PracticePage({ showChat, setShowChat }) {
  const [tab, setTab] = useState("Drills");
  return (<><PT>Practice</PT><Cnt>
    <Tabs items={["Drills","Scenarios","Daily Challenge"]} active={tab} onSelect={setTab}/>
    {tab==="Drills" && drillsData.map(d => <Card key={d.t} title={d.t} desc={d.d} tags={d.lvls.map(l=>({t:lt[l]||"b",l}))}/>)}
    {tab!=="Drills" && <div style={{ textAlign: "center", padding: 30, color: C.light, fontSize: 12 }}>Coming soon</div>}
    {showChat && <BamOverlay onClose={() => setShowChat(false)} context="Practice"/>}
    {!showChat && <BamFloat onClick={() => setShowChat(true)}/>}
  </Cnt></>);
}

export default PracticePage;
