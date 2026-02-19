import { useState } from 'react';
import { C } from '../constants/colors';
import { BirdIcon, I } from '../components/ui/Icons';
import { PT, SH, Tag, Card, Cnt, BamFloat } from '../components/Layout';
import { MiniDot, MiniBam, MiniCrak, MiniWind, MiniDragon, MiniFlower, MiniJoker, WIND_CFG } from '../components/TileComponents';

const BamOverlay = ({ onClose, context }) => {
  const [msgs, setMsgs] = useState([{ from: "bam", text: `Hey! I can see you're in ${context}. Ask me anything!` }]);
  const [input, setInput] = useState("");
  const send = () => { if (!input.trim()) return; setMsgs(p => [...p, { from: "user", text: input }, { from: "bam", text: "Great question! In the live app, I'd give a real answer here." }]); setInput(""); };
  return (
    <div className="bam-overlay">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px 8px", borderBottom: "1px solid rgba(118,195,170,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><BirdIcon size={16} color={C.cherry} sw={2.2}/><span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 14, fontWeight: 600, color: C.cherry }}>Bam Bird</span></div>
        <div onClick={onClose} style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(118,195,170,0.04)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, color: "#4A9E88", fontWeight: 600 }}>✕</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
        {msgs.map((m,i) => <div key={i} style={{ maxWidth: "85%", padding: "10px 13px", marginBottom: 6, fontSize: 12, lineHeight: 1.5, borderRadius: 12,
          ...(m.from==="bam" ? { background: C.white, border: "0.5px solid rgba(224,48,80,0.2)", color: C.dark, borderBottomLeftRadius: 3, marginRight: "auto" } : { background: C.white, border: "0.5px solid rgba(109,191,168,0.3)", color: C.dark, borderBottomRightRadius: 3, marginLeft: "auto" })
        }}>{m.text}</div>)}
      </div>
      <div style={{ display: "flex", gap: 6, padding: "8px 14px 14px" }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything..." style={{ flex: 1, padding: "9px 14px", borderRadius: 18, border: "0.5px solid rgba(224,48,80,0.2)", fontSize: 12, fontFamily: "'Outfit',sans-serif", outline: "none", color: C.dark, background: C.white }}/>
        <button onClick={send} style={{ width: 34, height: 34, borderRadius: "50%", background: C.seafoam, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 14, height: 14, stroke: "white", strokeWidth: 2, fill: "none", display: "flex" }}>{I.send}</div></button>
      </div>
    </div>
  );
};

function MeetTheTiles({ onBack, format }) {
  const [zoom, setZoom] = useState(null);
  const [dragonNote, setDragonNote] = useState(false);
  const [localFormat, setLocalFormat] = useState(format);
  const Section = ({ title, color, children, note }) => (<div style={{ marginBottom: 20 }}><div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:14, fontWeight:600, color: color||C.cherry, marginBottom: 6, letterSpacing:1 }}>{title}</div>{children}{note && <div style={{ fontSize:10.5, color:C.light, marginTop:6, lineHeight:1.5, fontStyle:"italic" }}>{note}</div>}</div>);
  const TileRowWrap = ({ children }) => (<div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>{children}</div>);
  const Label = ({ children }) => (<span style={{ fontSize:10, color:C.mid, fontWeight:500, marginLeft:2, marginRight:6 }}>{children}</span>);
  const ZoomOverlay = () => { if (!zoom) return null; return (<div onClick={() => setZoom(null)} style={{ position:"fixed", inset:0, background:"rgba(48,32,64,0.6)", backdropFilter:"blur(4px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", animation:"fadeIn 0.2s ease" }}><div style={{ animation:"zoomIn 0.25s ease", display:"flex", flexDirection:"column", alignItems:"center", gap:10 }} onClick={e => e.stopPropagation()}><div style={{ transform:"scale(1.6)" }}>{zoom.tile}</div><div style={{ marginTop:16, textAlign:"center" }}><div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:18, fontWeight:600, color:"#fff" }}>{zoom.name}</div>{zoom.desc && <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", marginTop:4, maxWidth:240, lineHeight:1.4 }}>{zoom.desc}</div>}</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginTop:8 }}>Tap anywhere to close</div></div></div>); };
  const zt = (tile, name, desc) => () => setZoom({tile, name, desc});
  return (<><ZoomOverlay/><div style={{ padding:"6px 22px 0", display:"flex", alignItems:"center" }}><div onClick={onBack} style={{ fontSize:12, color:C.lavDeep, cursor:"pointer", fontWeight:500, display:"flex", alignItems:"center", gap:3 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Learn</div></div><PT>Meet the Tiles</PT><div style={{ display:"flex", justifyContent:"flex-end", gap:4, marginTop:-6, marginBottom:8, padding:"0 20px" }}>{["Video","Text"].map(f => (<div key={f} onClick={() => setLocalFormat(f)} style={{ padding:"4px 10px", borderRadius:12, fontSize:10, fontWeight: localFormat===f?600:400, cursor:"pointer", background: localFormat===f?C.lavDeep:"transparent", color: localFormat===f?C.white:C.mid, border: localFormat===f?"none":`1px solid ${C.lavBorder}`, transition:"all 0.25s" }}>{f}</div>))}</div><Cnt>
    {localFormat === "Video" ? (<div style={{ background:C.lavCard, border:`1px solid ${C.lavBorder}`, borderRadius:14, padding:"28px 20px", textAlign:"center", marginBottom:16 }}><div style={{ fontSize:28, marginBottom:8 }}>▶️</div><div style={{ fontSize:13, color:C.mid, fontWeight:500 }}>Video lesson coming soon</div><div style={{ fontSize:11, color:C.light, marginTop:4 }}>Switch to Text to read this lesson now</div></div>) : (<>
    <p className="body-text" style={{ color:C.mid, marginBottom:16 }}>American Mahjong uses <strong style={{color:C.dark}}>152 tiles</strong>, divided into several groups. Tap any tile to zoom in.</p>
    <div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:16, fontWeight:600, color:C.cherry, marginBottom:2, letterSpacing:.5 }}>Suits</div>
    <p style={{ fontSize:11.5, color:C.mid, lineHeight:1.5, marginBottom:14 }}>There are three main suits, similar to suits in a card deck. Each has tiles numbered 1–9, and each appears <strong style={{color:C.dark}}>four times</strong> in the set.</p>
    <Section title="Dots" color="#4A3660" note="Tiles with circles — each number has a unique dot pattern."><TileRowWrap>{[1,2,3,4,5,6,7,8,9].map(n => <div key={n} onClick={zt(<MiniDot n={n} big/>, n + " Dot", n + " dot" + (n>1?"s":"") + " arranged in a pattern. Four copies in the set.")}><MiniDot n={n}/></div>)}</TileRowWrap></Section>
    <Section title="Bams (Bamboo)" color="#2E8B57" note="Tiles with bamboo-shaped sticks. The 1 Bam features a bird — our Bam Bird!"><TileRowWrap>{[1,2,3,4,5,6,7,8,9].map(n => <div key={n} onClick={zt(<MiniBam n={n} big/>, n===1?"1 Bam — The Bird":(n + " Bam"), n===1?"The bird tile! Also known as Bam Bird. Four copies in the set.":(n + " bamboo stalk" + (n>1?"s":"") + ". Four copies in the set."))}><MiniBam n={n}/></div>)}</TileRowWrap></Section>
    <Section title="Craks (Characters)" color="#C2413B" note="Tiles with Chinese characters representing numbers 1–9."><TileRowWrap>{[1,2,3,4,5,6,7,8,9].map(n => <div key={n} onClick={zt(<MiniCrak n={n} big/>, n + " Crak", "The Chinese character for " + n + ". Four copies in the set.")}><MiniCrak n={n}/></div>)}</TileRowWrap></Section>
    <div style={{ height:1, background:"linear-gradient(90deg,transparent," + C.lavBorder + ",transparent)", margin:"6px 0 16px" }}/>
    <div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:16, fontWeight:600, color:C.cherry, marginBottom:2, letterSpacing:.5 }}>Honor Tiles</div>
    <p style={{ fontSize:11.5, color:C.mid, lineHeight:1.5, marginBottom:14 }}>Special tiles that are not numbered.</p>
    <Section title="Winds" color="#4A7FA8" note="Four directions. Each appears four times in the set."><TileRowWrap>{["N","E","W","S"].map(d => <div key={d} onClick={zt(<MiniWind d={d} big/>, WIND_CFG[d].l, "The " + WIND_CFG[d].l.toLowerCase() + " wind. Four copies in the set.")}><MiniWind d={d}/></div>)}</TileRowWrap></Section>
    <Section title="Dragons" color="#4A7FA8"><TileRowWrap><div onClick={zt(<MiniDragon type="red" big/>, "Red Dragon", "Goes with Craks. Four copies in the set.")}><MiniDragon type="red"/></div><Label>Red</Label><div onClick={zt(<MiniDragon type="green" big/>, "Green Dragon", "Goes with Bams. Four copies in the set.")}><MiniDragon type="green"/></div><Label>Green</Label><div onClick={zt(<MiniDragon type="white" big/>, "White Dragon (Soap)", "Goes with Dots. Has a double life — also used as 0 on the card. Four copies.")}><MiniDragon type="white"/></div><Label>Soap</Label></TileRowWrap>
      <div onClick={() => setDragonNote(!dragonNote)} style={{ marginTop:10, background:"linear-gradient(135deg," + C.paleBlueLt + "," + C.paleBlue + ")", borderRadius: dragonNote?14:10, padding: dragonNote?"12px 14px":"9px 14px", border:"1px solid rgba(173,212,236,0.3)", cursor:"pointer", transition:"all 0.3s ease" }}><div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}><div style={{ display:"flex", alignItems:"center", gap:5 }}><span style={{ fontSize:12, fontWeight:700, color:"#4A96B8" }}>!</span><span style={{ fontSize:11, fontWeight:400, color:C.dark }}>A Note on Dragons</span></div><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round" style={{ transition:"transform 0.3s", transform:dragonNote?"rotate(180deg)":"rotate(0deg)" }}><polyline points="6 9 12 15 18 9"/></svg></div>{dragonNote && <div style={{ fontSize:10.5, color:C.mid, lineHeight:1.5, marginTop:8 }}>Red dragons go with Craks. Green dragons go with Bams. White dragons go with Dots.<br/><br/>White dragons are the only dragons with a double life! They can be used for 0s or for dragons. For example if a line says 2025 — the white dragon is the zero.<br/><br/>White dragons look like a box, so they are often called <strong style={{color:C.dark}}>Soap.</strong></div>}</div>
    </Section>
    <div style={{ height:1, background:"linear-gradient(90deg,transparent," + C.lavBorder + ",transparent)", margin:"6px 0 16px" }}/>
    <div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:16, fontWeight:600, color:C.cherry, marginBottom:2, letterSpacing:.5 }}>Special Tiles</div>
    <p style={{ fontSize:11.5, color:C.mid, lineHeight:1.5, marginBottom:14 }}>Unique tiles with special roles.</p>
    <Section title="Flowers" color="#8B7355" note="8 unique decorative tiles that appear in specific hands. One copy each."><div style={{ display:"flex", gap:6, marginBottom:6, flexWrap:"wrap" }}>{[1,2,3,4].map(n => <div key={n} onClick={zt(<MiniFlower n={n} big/>, "Flower " + n, "A unique flower tile. One copy in the set.")}><MiniFlower n={n}/></div>)}</div><div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{[5,6,7,8].map(n => <div key={n} onClick={zt(<MiniFlower n={n} big/>, "Flower " + n, "A unique flower tile. One copy in the set.")}><MiniFlower n={n}/></div>)}</div></Section>
    <Section title="Jokers" color="#B8A9C9" note="8 wild tiles that can substitute for other tiles, with restrictions. One copy each."><div style={{ display:"flex", gap:6, marginBottom:6, flexWrap:"wrap" }}>{[1,2,3,4].map(n => <div key={n} onClick={zt(<MiniJoker n={n} big/>, "Joker " + n, "A wild tile — can substitute for suited or honor tiles in groups of 3 or more.")}><MiniJoker n={n}/></div>)}</div><div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{[5,6,7,8].map(n => <div key={n} onClick={zt(<MiniJoker n={n} big/>, "Joker " + n, "A wild tile — can substitute for suited or honor tiles in groups of 3 or more.")}><MiniJoker n={n}/></div>)}</div></Section>
    <div style={{ height:1, background:"linear-gradient(90deg,transparent," + C.lavBorder + ",transparent)", margin:"6px 0 16px" }}/>
    </>)}</Cnt></>);
}

const learnData = [
  { s: "Getting Started", items: [
    { t: "What is American Mahjong", d: "The tiles, the card, and the goal", lvl: "First Timer" },
    { t: "Meet the Tiles", d: "Dots, Bams, Craks, Honors, Flowers & Jokers", lvl: "First Timer" },
    { t: "Reading the NMJL Card", d: "Decoding patterns, symbols & hand values", lvl: "First Timer" },
  ]},
  { s: "Setup & Flow", items: [
    { t: "Setting Up & Dealing", d: "Building the wall, breaking, and dealing tiles", lvl: "Novice" },
    { t: "Gameplay: Turns, Calls & Exposures", d: "Draw, discard, calling tiles, and Mahjong", lvl: "Novice" },
  ]},
  { s: "Strategy", items: [
    { t: "Hand Selection & Commitment", d: "Narrowing sections, locking in, and pivoting", lvl: "Intermediate" },
    { t: "Maximizing the Charleston", d: "R-O-L passing, blind passes & tile strategy", lvl: "Intermediate" },
    { t: "Reading Opponents & Defense", d: "Exposure analysis, hand reading & dogging", lvl: "Advanced" },
    { t: "Scoring & Payment Systems", d: "NMJL scoring, self-picks, jokerless bonuses", lvl: "Advanced" },
  ]},
  { s: "Etiquette", items: [
    { t: "Player Alignment", d: "Seating, wind positions, and rotation", lvl: "First Timer" },
    { t: "Pace of Play", d: "Keeping the game moving without rushing", lvl: "Novice" },
    { t: "Tile Handling", d: "Proper picking, racking, and discarding", lvl: "First Timer" },
    { t: "Courtesy at the Table", d: "Sportsmanship, calling etiquette, and table talk", lvl: "Novice" },
  ]},
];

const levels = ["All", "First Timer", "Novice", "Intermediate", "Advanced"];
const lt = { "First Timer": "b", Novice: "n", Beginner: "b", Intermediate: "i", Advanced: "a" };

function LearnPage({ showChat, setShowChat }) {
  const [lesson, setLesson] = useState(null);
  const [level, setLevel] = useState("All");
  const [format, setFormat] = useState("Text");
  if (lesson === "Meet the Tiles") return <MeetTheTiles onBack={() => setLesson(null)} format={format}/>;
  if (lesson === "History") return (<>
    <div style={{ padding:"6px 22px 0", display:"flex", alignItems:"center" }}>
      <div onClick={() => setLesson(null)} style={{ fontSize:12, color:C.lavDeep, cursor:"pointer", fontWeight:500, display:"flex", alignItems:"center", gap:3 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Learn</div>
    </div>
    <PT>The History of Mahjong</PT>
    <Cnt>
      <p className="body-text" style={{ color:C.mid, marginBottom:14 }}>Mahjong originated in China during the mid-to-late <strong style={{color:C.dark}}>Qing dynasty</strong>, likely in the 1800s. While its exact origins are debated, it evolved from earlier Chinese card and tile games.</p>
      <p className="body-text" style={{ color:C.mid, marginBottom:14 }}>The game arrived in the United States in the <strong style={{color:C.dark}}>1920s</strong>, brought by travelers and immigrants. It quickly became a sensation — especially among Jewish-American women, who embraced it as a social pastime.</p>
      <p className="body-text" style={{ color:C.mid, marginBottom:14 }}>In <strong style={{color:C.dark}}>1937</strong>, the National Mah Jongg League (NMJL) was founded to standardize rules for American play. Each year they release a new card with official hands — the card you'll use when you play in Mahji.</p>
      <p className="body-text" style={{ color:C.mid, marginBottom:14 }}>Today, American Mahjong is experiencing a massive <strong style={{color:C.dark}}>renaissance</strong>. A new generation of players is discovering the game through social media, modern tile sets, and apps like Mahji. What was once your grandmother's game is now everyone's game.</p>
      <p className="body-text" style={{ color:C.mid, marginBottom:14, fontStyle:"italic" }}>Welcome to the table.</p>
    </Cnt>
  </>);
  const filtered = level === "All" ? learnData : learnData.map(sec => ({ ...sec, items: sec.items.filter(it => it.lvl === level) })).filter(sec => sec.items.length > 0);
  let num = 0;
  return (<>
    <PT>Learn</PT>
    <Cnt>
    <div style={{ display:"flex", gap:5, marginBottom:12, flexWrap:"nowrap", overflowX:"auto" }}>
      {levels.map(lv => (<div key={lv} onClick={() => setLevel(lv)} style={{ padding:"6px 12px", borderRadius:20, fontSize:11, fontWeight: level===lv ? 600 : 400, cursor:"pointer", background: level===lv ? C.seafoam : "transparent", color: level===lv ? C.white : C.mid, border: level===lv ? "none" : `1px solid ${C.lavBorder}`, transition:"all 0.3s", whiteSpace:"nowrap", flexShrink:0 }}>{lv === "All" ? "See All" : lv}</div>))}
    </div>
    {filtered.map((sec, si) => <div key={sec.s}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <SH>{sec.s}</SH>
        {si === 0 && <div style={{ display:"flex", gap:4 }}>
          {["Video","Text"].map(f => (<div key={f} onClick={() => setFormat(f)} style={{ padding:"4px 10px", borderRadius:12, fontSize:10, fontWeight: format===f?600:400, cursor:"pointer", background: format===f ? C.lavDeep : "transparent", color: format===f ? C.white : C.lavText, border: format===f ? "none" : `1px solid ${C.lavBorder}`, transition:"all 0.25s" }}>
            {f === "Video" ? "📹" : "📖"} {f}</div>))}
        </div>}
      </div>
      {sec.items.map((it) => { num++; return <Card key={it.t} title={it.t} desc={it.d} num={num} tags={[{t:lt[it.lvl]||"b",l:it.lvl}]} onClick={it.t === "Meet the Tiles" ? () => setLesson("Meet the Tiles") : undefined}/>; })}
    </div>)}
    {/* History bonus button */}
    <div onClick={() => setLesson("History")} style={{ marginTop:20, marginBottom:10, padding:"14px 18px", background: C.paleBlue || "#D9ECF5", border:`1px solid rgba(142,199,226,0.3)`, borderRadius:14, display:"flex", alignItems:"center", gap:12, cursor:"pointer", transition:"all 0.3s" }} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 14px rgba(142,199,226,0.2)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
      <div style={{ width:32, height:32, borderRadius:"50%", background:C.cerulean, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:14 }}>📜</div>
      <div>
        <div style={{ fontSize:12, fontWeight:600, color:C.cerulean, letterSpacing:0.5 }}>Bonus!</div>
        <div style={{ fontSize:12, color:C.mid, marginTop:1 }}>Learn the History of American Mahjong</div>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.cerulean} strokeWidth="1.5" strokeLinecap="round" style={{ marginLeft:"auto", flexShrink:0 }}><polyline points="9 18 15 12 9 6"/></svg>
    </div>
    {showChat && <BamOverlay onClose={() => setShowChat(false)} context="Learn"/>}
    {!showChat && <BamFloat onClick={() => setShowChat(true)}/>}
  </Cnt></>);
}

export default LearnPage;
