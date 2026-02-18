import { useState } from 'react';
import { C } from '../constants/colors';
import { BirdIcon, I } from '../components/ui/Icons';
import { PT, SH, Tag, Card, Tabs, Cnt, BamFloat } from '../components/Layout';
import { MiniDot, MiniBam, MiniCrak, MiniWind, MiniDragon, MiniFlower, MiniJoker, WIND_CFG } from '../components/TileComponents';

const BamOverlay = ({ onClose, context }) => {
  const [msgs, setMsgs] = useState([{ from: "bam", text: `Hey! I can see you're in ${context}. Ask me anything!` }]);
  const [input, setInput] = useState("");
  const send = () => { if (!input.trim()) return; setMsgs(p => [...p, { from: "user", text: input }, { from: "bam", text: "Great question! In the live app, I'd give a real answer here." }]); setInput(""); };
  return (
    <div style={{ position: "absolute", bottom: 94, right: 12, left: 12, background: "rgba(243,251,248,0.95)", borderRadius: 20, boxShadow: "0 12px 40px rgba(50,80,70,0.08), 0 0 0 1px rgba(118,195,170,0.08)", zIndex: 30, display: "flex", flexDirection: "column", maxHeight: 300, overflow: "hidden", backdropFilter: "blur(14px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px 8px", borderBottom: "1px solid rgba(118,195,170,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><BirdIcon size={16} color={C.cherry} sw={2.2}/><span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 600, color: C.cherry }}>Bam Bird</span></div>
        <div onClick={onClose} style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(118,195,170,0.04)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, color: "#4A9E88", fontWeight: 600 }}>✕</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
        {msgs.map((m,i) => <div key={i} style={{ maxWidth: "85%", padding: "9px 12px", marginBottom: 6, fontSize: 11, lineHeight: 1.5, borderRadius: 12,
          ...(m.from==="bam"
            ? { background: C.white, border: "0.5px solid rgba(224,48,80,0.2)", color: C.dark, borderBottomLeftRadius: 3, marginRight: "auto" }
            : { background: C.white, border: "0.5px solid rgba(109,191,168,0.3)", color: C.dark, borderBottomRightRadius: 3, marginLeft: "auto" })
        }}>{m.text}</div>)}
      </div>
      <div style={{ display: "flex", gap: 6, padding: "8px 12px 12px" }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything..." style={{ flex: 1, padding: "8px 12px", borderRadius: 18, border: "0.5px solid rgba(224,48,80,0.2)", fontSize: 11, fontFamily: "'Outfit',sans-serif", outline: "none", color: C.dark, background: C.white }}/>
        <button onClick={send} style={{ width: 30, height: 30, borderRadius: "50%", background: C.seafoam, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 12, height: 12, stroke: "white", strokeWidth: 2, fill: "none", display: "flex" }}>{I.send}</div></button>
      </div>
    </div>
  );
};

function MeetTheTiles({ onBack }) {
  const [zoom, setZoom] = useState(null);
  const [dragonNote, setDragonNote] = useState(false);

  const Section = ({ title, color, children, note }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:13, fontWeight:600, color: color||C.cherry, marginBottom: 4, letterSpacing:1 }}>{title}</div>
      {children}
      {note && <div style={{ fontSize:9.5, color:C.light, marginTop:6, lineHeight:1.5, fontStyle:"italic" }}>{note}</div>}
    </div>
  );

  const TileRowWrap = ({ children }) => (
    <div style={{ display:"flex", gap:5, flexWrap:"wrap", alignItems:"center" }}>{children}</div>
  );

  const Label = ({ children }) => (
    <span style={{ fontSize:9, color:C.mid, fontWeight:500, marginLeft:2, marginRight:6 }}>{children}</span>
  );

  const ZoomOverlay = () => {
    if (!zoom) return null;
    return (
      <div onClick={() => setZoom(null)} style={{ position:"fixed", inset:0, background:"rgba(48,32,64,0.6)", backdropFilter:"blur(4px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", animation:"fadeIn 0.2s ease" }}>
        <div style={{ transform:"scale(1)", animation:"zoomIn 0.25s ease", display:"flex", flexDirection:"column", alignItems:"center", gap:10 }} onClick={e => e.stopPropagation()}>
          <div style={{ transform:"scale(1.6)" }}>{zoom.tile}</div>
          <div style={{ marginTop:16, textAlign:"center" }}>
            <div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:16, fontWeight:600, color:"#fff" }}>{zoom.name}</div>
            {zoom.desc && <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:4, maxWidth:220, lineHeight:1.4 }}>{zoom.desc}</div>}
          </div>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", marginTop:8 }}>Tap anywhere to close</div>
        </div>
      </div>
    );
  };

  const zt = (tile, name, desc) => () => setZoom({tile, name, desc});

  return (
    <>
      <ZoomOverlay/>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes zoomIn{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
      <div style={{ padding:"6px 22px 0", display:"flex", alignItems:"center", gap:8 }}>
        <div onClick={onBack} style={{ fontSize:11, color:C.lavDeep, cursor:"pointer", fontWeight:500, display:"flex", alignItems:"center", gap:3 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Learn</div>
      </div>
      <PT>Meet the Tiles</PT>
      <Cnt>
        <p style={{ fontSize:11.5, color:C.mid, lineHeight:1.6, marginBottom:16 }}>American Mahjong uses <strong style={{color:C.dark}}>152 tiles</strong>, divided into several groups. Tap any tile to zoom in.</p>

        <div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:15, fontWeight:600, color:C.cherry, marginBottom:2, letterSpacing:.5 }}>Suits</div>
        <p style={{ fontSize:10.5, color:C.mid, lineHeight:1.5, marginBottom:12 }}>There are three main suits, similar to suits in a card deck. Each has tiles numbered 1–9, and each appears <strong style={{color:C.dark}}>four times</strong> in the set.</p>

        <Section title="Dots" color="#4A3660" note="Tiles with circles — each number has a unique dot pattern.">
          <TileRowWrap>
            {[1,2,3,4,5,6,7,8,9].map(n => <div key={n} onClick={zt(<MiniDot n={n} big/>, n + " Dot", n + " dot" + (n>1?"s":"") + " arranged in a pattern. Four copies in the set.")}><MiniDot n={n}/></div>)}
          </TileRowWrap>
        </Section>

        <Section title="Bams (Bamboo)" color="#2E8B57" note="Tiles with bamboo-shaped sticks. The 1 Bam features a bird — our Bam Bird!">
          <TileRowWrap>
            {[1,2,3,4,5,6,7,8,9].map(n => <div key={n} onClick={zt(<MiniBam n={n} big/>, n===1?"1 Bam — The Bird":(n + " Bam"), n===1?"The bird tile! Also known as Bam Bird. Four copies in the set.":(n + " bamboo stalk" + (n>1?"s":"") + ". Four copies in the set."))}><MiniBam n={n}/></div>)}
          </TileRowWrap>
        </Section>

        <Section title="Craks (Characters)" color="#C2413B" note="Tiles with Chinese characters representing numbers 1–9.">
          <TileRowWrap>
            {[1,2,3,4,5,6,7,8,9].map(n => <div key={n} onClick={zt(<MiniCrak n={n} big/>, n + " Crak", "The Chinese character for " + n + ". Four copies in the set.")}><MiniCrak n={n}/></div>)}
          </TileRowWrap>
        </Section>

        <div style={{ height:1, background:"linear-gradient(90deg,transparent," + C.lavBorder + ",transparent)", margin:"6px 0 14px" }}/>

        <div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:15, fontWeight:600, color:C.cherry, marginBottom:2, letterSpacing:.5 }}>Honor Tiles</div>
        <p style={{ fontSize:10.5, color:C.mid, lineHeight:1.5, marginBottom:12 }}>Special tiles that are not numbered.</p>

        <Section title="Winds" color="#4A7FA8" note="Four directions. Each appears four times in the set.">
          <TileRowWrap>
            {["N","E","W","S"].map(d => <div key={d} onClick={zt(<MiniWind d={d} big/>, WIND_CFG[d].l, "The " + WIND_CFG[d].l.toLowerCase() + " wind. Four copies in the set.")}><MiniWind d={d}/></div>)}
          </TileRowWrap>
        </Section>

        <Section title="Dragons" color="#4A7FA8">
          <TileRowWrap>
            <div onClick={zt(<MiniDragon type="red" big/>, "Red Dragon", "Goes with Craks. Four copies in the set.")}><MiniDragon type="red"/></div><Label>Red</Label>
            <div onClick={zt(<MiniDragon type="green" big/>, "Green Dragon", "Goes with Bams. Four copies in the set.")}><MiniDragon type="green"/></div><Label>Green</Label>
            <div onClick={zt(<MiniDragon type="white" big/>, "White Dragon (Soap)", "Goes with Dots. Has a double life — also used as 0 on the card. Four copies.")}><MiniDragon type="white"/></div><Label>Soap</Label>
          </TileRowWrap>
          <div onClick={() => setDragonNote(!dragonNote)} style={{ marginTop:8, background:"linear-gradient(135deg," + C.paleBlueLt + "," + C.paleBlue + ")", borderRadius: dragonNote?14:10, padding: dragonNote?"10px 12px":"8px 12px", border:"1px solid rgba(173,212,236,0.3)", cursor:"pointer", transition:"all 0.3s ease" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#4A96B8" }}>!</span>
                <span style={{ fontSize:10, fontWeight:400, color:C.dark }}>A Note on Dragons</span>
              </div>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round" style={{ transition:"transform 0.3s", transform:dragonNote?"rotate(180deg)":"rotate(0deg)" }}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            {dragonNote && <div style={{ fontSize:9.5, color:C.mid, lineHeight:1.5, marginTop:8 }}>
              Red dragons go with Craks. Green dragons go with Bams. White dragons go with Dots.<br/><br/>
              White dragons are the only dragons with a double life! They can be used for 0s or for dragons. For example if a line says 2025 — the white dragon is the zero.<br/><br/>
              White dragons look like a box, so they are often called <strong style={{color:C.dark}}>Soap.</strong>
            </div>}
          </div>
        </Section>

        <div style={{ height:1, background:"linear-gradient(90deg,transparent," + C.lavBorder + ",transparent)", margin:"6px 0 14px" }}/>

        <div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:15, fontWeight:600, color:C.cherry, marginBottom:2, letterSpacing:.5 }}>Special Tiles</div>
        <p style={{ fontSize:10.5, color:C.mid, lineHeight:1.5, marginBottom:12 }}>Unique tiles with special roles.</p>

        <Section title="Flowers" color="#8B7355" note="8 unique decorative tiles that appear in specific hands. One copy each.">
          <div style={{ display:"flex", gap:5, marginBottom:5 }}>{[1,2,3,4].map(n => <div key={n} onClick={zt(<MiniFlower n={n} big/>, "Flower " + n, "A unique flower tile. One copy in the set.")}><MiniFlower n={n}/></div>)}</div>
          <div style={{ display:"flex", gap:5 }}>{[5,6,7,8].map(n => <div key={n} onClick={zt(<MiniFlower n={n} big/>, "Flower " + n, "A unique flower tile. One copy in the set.")}><MiniFlower n={n}/></div>)}</div>
        </Section>

        <Section title="Jokers" color="#B8A9C9" note="8 wild tiles that can substitute for other tiles, with restrictions. One copy each.">
          <div style={{ display:"flex", gap:5, marginBottom:5 }}>{[1,2,3,4].map(n => <div key={n} onClick={zt(<MiniJoker n={n} big/>, "Joker " + n, "A wild tile — can substitute for suited or honor tiles in groups of 3 or more.")}><MiniJoker n={n}/></div>)}</div>
          <div style={{ display:"flex", gap:5 }}>{[5,6,7,8].map(n => <div key={n} onClick={zt(<MiniJoker n={n} big/>, "Joker " + n, "A wild tile — can substitute for suited or honor tiles in groups of 3 or more.")}><MiniJoker n={n}/></div>)}</div>
        </Section>

        <div style={{ height:1, background:"linear-gradient(90deg,transparent," + C.lavBorder + ",transparent)", margin:"6px 0 14px" }}/>

      </Cnt>
    </>
  );
}

const learnData = [
  { s: "Getting Started", items: [
    { t: "What is American Mahjong", d: "The tiles, the card, and the goal", lvl: "First Timer" },
    { t: "Meet the Tiles", d: "Dots, Bams, Craks, Honors, Flowers & Jokers", lvl: "First Timer" },
    { t: "Reading the NMJL Card", d: "Decoding patterns, symbols & hand values", lvl: "First Timer" },
  ]},
  { s: "Setup & Flow", items: [
    { t: "Setting Up & Dealing", d: "Building the wall, breaking, and dealing tiles", lvl: "Novice" },
    { t: "The Charleston", d: "R-O-L passing, blind passes & tile strategy", lvl: "Novice" },
    { t: "Gameplay: Turns, Calls & Exposures", d: "Draw, discard, calling tiles, and Mah Jongg", lvl: "Novice" },
  ]},
  { s: "Strategy", items: [
    { t: "Hand Selection & Commitment", d: "Narrowing sections, locking in, and pivoting", lvl: "Intermediate" },
    { t: "Reading Opponents & Defense", d: "Exposure analysis, hand reading & dogging", lvl: "Advanced" },
    { t: "Scoring & Payment Systems", d: "NMJL scoring, self-picks, jokerless bonuses", lvl: "Advanced" },
  ]},
];

const lt = { "First Timer": "b", Novice: "n", Beginner: "b", Intermediate: "i", Advanced: "a" };

function LearnPage({ showChat, setShowChat }) {
  const [lesson, setLesson] = useState(null);
  if (lesson === "Meet the Tiles") return <MeetTheTiles onBack={() => setLesson(null)}/>;
  return (<><PT>Learn</PT><Cnt>
    {learnData.map(sec => <div key={sec.s}>
      <SH>{sec.s}</SH>
      {sec.items.map((it,i) => <Card key={it.t} title={it.t} desc={it.d} num={i+1}
        tags={[{t:lt[it.lvl]||"b",l:it.lvl}]}
        onClick={it.t === "Meet the Tiles" ? () => setLesson("Meet the Tiles") : undefined}/>)}
    </div>)}
    {showChat && <BamOverlay onClose={() => setShowChat(false)} context="Learn"/>}
    {!showChat && <BamFloat onClick={() => setShowChat(true)}/>}
  </Cnt></>);
}

export default LearnPage;
