import { useState } from "react";

const C = {
  bg: "#FDFCFE", lavHint: "#F5F2F9", lavSoft: "#ECE7F3",
  lavCard: "rgba(243,239,250,0.5)", lavBorder: "rgba(196,184,218,0.22)",
  lavender: "#C0B2D4", lavMid: "#A898BE", lavDeep: "#7E64A4", lavText: "#9688AA",
  cherry: "#E03050", cherryLt: "#E8566D",
  paleBlue: "#D9ECF5", paleBlueLt: "#EDF5FA", paleBlueMid: "#ADD4EC",
  cerulean: "#8EC7E2", seafoam: "#6DBFA8", seafoamLt: "rgba(118,195,170,0.3)",
  dark: "#302040", mid: "#5E4D6D", light: "#9A8DAA", white: "#FFFFFF",
  gold: "#B08D3A", clinton: "#65554a",
};

const matsList = [
  { id: "brn", name: "Coffee", g: "linear-gradient(145deg,#4A3D32,#3A2E24)" },
  { id: "sfm", name: "Seafoam", g: "linear-gradient(145deg,#B5D9CE,#9ECABD)" },
  { id: "prp", name: "Lavender", g: "linear-gradient(145deg,#D5CCE2,#C4B8D6)" },
  { id: "blu", name: "Cerulean", g: "linear-gradient(145deg,#CADEE9,#B8D2E0)" },
];

// Per-mat board colors:
// Coffee gets seafoam accents; Seafoam/Lavender/Cerulean all get darker coffee-brown accents
const matB = {
  brn: { bg: "linear-gradient(145deg,#4A3D32,#3E3228,#352A20)", rack: "rgba(158,202,189,0.12)", rackB: "rgba(158,202,189,0.18)", text: "rgba(158,202,189,0.5)", area: "rgba(158,202,189,0.06)", areaB: "rgba(158,202,189,0.14)", areaT: "rgba(158,202,189,0.35)", you: "rgba(200,190,175,0.85)" },
  sfm: { bg: "linear-gradient(145deg,#8FBFB2,#7AAD9F,#6B9E90)", rack: "rgba(58,46,36,0.14)", rackB: "rgba(58,46,36,0.2)", text: "rgba(58,46,36,0.4)", area: "rgba(58,46,36,0.07)", areaB: "rgba(58,46,36,0.16)", areaT: "rgba(58,46,36,0.3)", you: "rgba(255,255,255,0.7)" },
  prp: { bg: "linear-gradient(145deg,#B5A8C8,#A496B8,#9688AA)", rack: "rgba(58,46,36,0.14)", rackB: "rgba(58,46,36,0.2)", text: "rgba(58,46,36,0.4)", area: "rgba(58,46,36,0.07)", areaB: "rgba(58,46,36,0.16)", areaT: "rgba(58,46,36,0.3)", you: "rgba(255,255,255,0.7)" },
  blu: { bg: "linear-gradient(145deg,#A0C4D6,#8FB5C8,#80A6BA)", rack: "rgba(58,46,36,0.14)", rackB: "rgba(58,46,36,0.2)", text: "rgba(58,46,36,0.4)", area: "rgba(58,46,36,0.07)", areaB: "rgba(58,46,36,0.16)", areaT: "rgba(58,46,36,0.3)", you: "rgba(255,255,255,0.7)" },
};

const BirdIcon = ({ size = 18, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 25 C8 22, 7 17, 9 13 C10 10.5, 12 8.5, 15 7.5 C17 6.8, 19 6.5, 21 7 C23 7.5, 24.5 9, 25 11 C25.5 13, 25 16, 23 19 C21 22, 17 25, 14 26 C12 26.5, 11 26, 11 25Z"/>
    <path d="M23.5 8.5 L27 7 L24 10"/>
    <circle cx="21" cy="9.5" r="0.9" fill={color} stroke="none"/>
    <path d="M12 15 C14 13, 18 13, 21 15.5"/>
    <path d="M14 25.5 L14 29 M14 29 L12.5 30 M14 29 L15.5 30"/>
    <path d="M18 24.5 L18 28 M18 28 L16.5 29 M18 28 L19.5 29"/>
  </svg>
);

const I = {
  book: <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  clock: <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  play: <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>,
  bag: <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  user: <svg viewBox="0 0 24 24" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  send: <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  chevR: <svg viewBox="0 0 24 24" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  chevL: <svg viewBox="0 0 24 24" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  settings: <svg viewBox="0 0 24 24" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  creditCard: <svg viewBox="0 0 24 24" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  trash: <svg viewBox="0 0 24 24" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  logOut: <svg viewBox="0 0 24 24" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  target: <svg viewBox="0 0 24 24" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  bell: <svg viewBox="0 0 24 24" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  volume: <svg viewBox="0 0 24 24" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  edit: <svg viewBox="0 0 24 24" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

const DecoLine = () => (
  <svg width="210" height="22" viewBox="0 0 210 22" fill="none" style={{ display: "block", margin: "0 auto 20px" }}>
    <path d="M8 11 C22 11, 28 4, 50 4 C66 4, 70 11, 78 11" stroke={C.lavender} strokeWidth="0.7" strokeLinecap="round"/>
    <path d="M8 11 C22 11, 28 18, 50 18 C66 18, 70 11, 78 11" stroke={C.lavender} strokeWidth="0.5" strokeLinecap="round" opacity="0.5"/>
    <rect x="76" y="7.5" width="5" height="5" rx="0.8" transform="rotate(45 78.5 10)" stroke={C.lavMid} strokeWidth="0.7" fill="none"/>
    <line x1="86" y1="10" x2="114" y2="10" stroke={C.cherry} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="100" cy="10" r="2" fill={C.cherry}/>
    <rect x="119" y="7.5" width="5" height="5" rx="0.8" transform="rotate(45 121.5 10)" stroke={C.lavMid} strokeWidth="0.7" fill="none"/>
    <path d="M124 11 C134 11, 138 4, 152 4 C172 4, 180 11, 192 11" stroke={C.lavender} strokeWidth="0.7" strokeLinecap="round"/>
    <path d="M124 11 C134 11, 138 18, 152 18 C172 18, 180 11, 192 11" stroke={C.lavender} strokeWidth="0.5" strokeLinecap="round" opacity="0.5"/>
    <circle cx="6" cy="11" r="1" fill={C.lavender} opacity="0.4"/><circle cx="194" cy="11" r="1" fill={C.lavender} opacity="0.4"/>
  </svg>
);

const Logo = ({ onClick, showText = true }) => (
  <a onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 5, textDecoration: "none", cursor: "pointer" }}>
    <svg width="18" height="24" viewBox="0 0 26 34" fill="none"><rect x="1" y="1" width="24" height="32" rx="4.5" stroke={C.lavDeep} strokeWidth="1"/><rect x="5.5" y="6" width="15" height="22" rx="2.5" stroke={C.cherry} strokeWidth=".7" opacity=".6"/><circle cx="13" cy="17" r="2.2" stroke={C.cerulean} strokeWidth=".8" fill="none"/></svg>
    {showText && <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 10, fontWeight: 400, color: C.cherry, letterSpacing: 2.5 }}>MAHJI</span>}
  </a>
);

const NavBar = ({ active, onNav }) => (
  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.94)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(200,190,215,0.12)", padding: "7px 6px 26px", display: "flex", justifyContent: "space-around", alignItems: "flex-end", zIndex: 20 }}>
    {[{id:"learn",icon:I.book,label:"learn"},{id:"practice",icon:I.clock,label:"practice"},{id:"play",label:"play",isPlay:true},{id:"shop",icon:I.bag,label:"shop"},{id:"bam",label:"ask bam",isBird:true}].map(it => it.isPlay ? (
      <div key="play" onClick={() => onNav("play")} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", marginTop: -18, minWidth: 48 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(224,48,80,0.2)", border: `3px solid ${C.white}` }}>
          <div style={{ width: 16, height: 16, stroke: "white", strokeWidth: 2, fill: "none", marginLeft: 2, display: "flex" }}>{I.play}</div></div>
        <span style={{ fontSize: 8, color: C.cherry, fontWeight: 600, marginTop: 4, letterSpacing: .6 }}>play</span></div>
    ) : (
      <div key={it.id} onClick={() => onNav(it.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", padding: "5px 8px 3px", borderRadius: 10, minWidth: 48 }}>
        <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {it.isBird ? <BirdIcon size={20} color={active===it.id?C.lavDeep:C.lavText} sw={active===it.id?2.2:1.8}/> :
          <div style={{ width: 18, height: 18, stroke: active===it.id?C.lavDeep:C.lavText, strokeWidth: active===it.id?1.6:1.3, fill: "none", display: "flex" }}>{it.icon}</div>}
        </div>
        <span style={{ fontSize: 8, color: active===it.id?C.lavDeep:C.lavText, fontWeight: active===it.id?600:500, letterSpacing: .6 }}>{it.label}</span></div>
    ))}
  </div>
);

const Header = ({ onHome, onProfile, isHome }) => (
  <div style={{ padding: "6px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Logo onClick={onHome} showText={!isHome}/>
    <div onClick={onProfile} style={{ width: 32, height: 32, borderRadius: "50%", background: C.lavHint, border: `1.5px solid ${C.lavender}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
      <div style={{ width: 13, height: 13, stroke: C.lavDeep, strokeWidth: 1.3, fill: "none", display: "flex" }}>{I.user}</div></div>
  </div>
);

const PT = ({ children }) => <div style={{ textAlign: "center", padding: "22px 22px 18px" }}><h1 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 26, fontWeight: 700, color: C.cherry, letterSpacing: 4, margin: 0 }}>{children}</h1></div>;
const SH = ({ children, style }) => <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 10, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: C.cherry, margin: "18px 0 10px 2px", ...style }}>{children}</div>;
const Tag = ({ type, children }) => { const m = { b: { bg: "rgba(142,199,226,0.12)", c: "#4A96B8" }, n: { bg: "rgba(168,152,190,0.12)", c: C.lavDeep }, i: { bg: "rgba(176,141,58,0.1)", c: C.gold }, a: { bg: "rgba(224,48,80,0.06)", c: C.cherry } }; const s = m[type]||m.b; return <span style={{ display: "inline-block", fontSize: 7.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", padding: "2.5px 7px", borderRadius: 6, marginRight: 3, marginTop: 5, background: s.bg, color: s.c }}>{children}</span>; };

const Card = ({ title, desc, tags, num }) => (
  <div style={{ background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 16, padding: "16px 16px 16px 18px", marginBottom: 10, cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.35s" }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(142,199,226,0.18)";}}
    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
    <div style={{ position: "absolute", left: 0, top: 12, bottom: 12, width: .75, background: C.cherry, borderRadius: "0 1px 1px 0" }}/>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {num!=null && <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.cherry, color: C.white, fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{num}</div>}
      <div><h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 15, fontWeight: 500, color: C.dark, marginBottom: 2, letterSpacing: .3 }}>{title}</h3>
        <p style={{ fontSize: 11, color: C.light, lineHeight: 1.4, margin: 0 }}>{desc}</p>
        {tags && <div>{tags.map((t,i) => <Tag key={i} type={t[0]}>{t[1]}</Tag>)}</div>}</div>
    </div>
  </div>
);

const Tabs = ({ items, active, onSelect }) => (
  <div style={{ display: "flex", gap: 5, marginBottom: 14, justifyContent: "center" }}>
    {items.map(it => <div key={it} onClick={() => onSelect(it)} style={{ fontSize: 9.5, fontWeight: 500, padding: "5px 12px", borderRadius: 18, border: active===it?"none":`1px solid ${C.seafoamLt}`, color: active===it?C.white:"rgba(80,155,135,0.65)", cursor: "pointer", background: active===it?C.seafoam:C.white, whiteSpace: "nowrap" }}>{it}</div>)}
  </div>
);

const CardSel = ({ items, active, onSelect }) => (
  <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
    {items.map(it => <div key={it.id} onClick={() => onSelect(it.id)} style={{ flex: 1, textAlign: "center", padding: "12px 6px", background: C.white, border: `${active===it.id?"1.5px":"1px"} solid ${active===it.id?C.seafoam:"rgba(118,195,170,0.25)"}`, borderRadius: 14, cursor: "pointer" }}>
      <h4 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 12, fontWeight: 500, color: active===it.id?"#4A9E88":C.dark, marginBottom: 1 }}>{it.name}</h4>
      <p style={{ fontSize: 8.5, color: C.light, margin: 0 }}>{it.sub}</p></div>)}
  </div>
);

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
            ? { background: C.white, border: `0.5px solid rgba(224,48,80,0.2)`, color: C.dark, borderBottomLeftRadius: 3, marginRight: "auto" }
            : { background: C.white, border: `0.5px solid rgba(109,191,168,0.3)`, color: C.dark, borderBottomRightRadius: 3, marginLeft: "auto" })
        }}>{m.text}</div>)}
      </div>
      <div style={{ display: "flex", gap: 6, padding: "8px 12px 12px" }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything..." style={{ flex: 1, padding: "8px 12px", borderRadius: 18, border: `0.5px solid rgba(224,48,80,0.2)`, fontSize: 11, fontFamily: "'Outfit',sans-serif", outline: "none", color: C.dark, background: C.white }}/>
        <button onClick={send} style={{ width: 30, height: 30, borderRadius: "50%", background: C.seafoam, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 12, height: 12, stroke: "white", strokeWidth: 2, fill: "none", display: "flex" }}>{I.send}</div></button>
      </div>
    </div>
  );
};

const BamFloat = ({ onClick }) => (
  <div onClick={onClick} style={{ position: "absolute", bottom: 90, right: 16, width: 44, height: 44, borderRadius: "50%", background: C.seafoam, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 14px rgba(109,191,168,0.25)", zIndex: 15, border: `2.5px solid ${C.white}`, animation: "bfloat 3s ease-in-out infinite" }}>
    <BirdIcon size={22} color={C.white} sw={1.6}/>
  </div>
);

const Cnt = ({ children }) => <div style={{ flex: 1, padding: "0 18px", overflowY: "auto", paddingBottom: 100 }}>{children}</div>;

// DATA
const learnData = [
  { s: "Getting Started", items: [
    { t: "What Is American Mahjong", d: "The tiles, the card, and the goal", lvl: "First Timer" },
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

const drillsData = [
  { t: "Learn the Hands", d: "Match tiles to NMJL card patterns", lvls: ["Beginner"] },
  { t: "How to Deal", d: "Roll dice, break the wall, deal correctly", lvls: ["Beginner"] },
  { t: "Practicing the Charleston", d: "Master R-O-L-★-L-O-R and blind passes", lvls: ["Beginner","Intermediate","Advanced"] },
  { t: "Reading Exposures", d: "Narrow down opponent hands from melds", lvls: ["Intermediate","Advanced"] },
  { t: "Playing Defense", d: "Choose the safest discard, stop feeding", lvls: ["Advanced"] },
];

const shopSections = [
  { title: "NMJL Card", items: ["2026 NMJL Card","2025 NMJL Card"] },
  { title: "The Mahji Set", items: ["Mahji x NMJL Custom Tile Set","Mahji Carrying Case"] },
  { title: "Other Sets", items: ["Classic American Set","Travel Mini Set","Vintage Reissue Set"] },
  { title: "Table Accessories", items: ["Mahji Mat (Coffee)","Mahji Mat (Seafoam)","Tile Racks (Set of 4)","Pushers (Set of 4)","Wind Indicator Set"] },
  { title: "Mahji Gear", items: ["Mahji Trucker Hat","Mahji Tote","Mahji Crewneck"] },
];

// PAGES
function HomePage({ onNav }) {
  return (
    <>
      <div style={{ textAlign: "center", padding: "18px 24px 4px" }}>
        <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 10, fontWeight: 400, letterSpacing: 5, color: C.cherry, textTransform: "uppercase", marginBottom: 5 }}>Let's Play</div>
        <h1 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 46, fontWeight: 700, color: C.cherry, letterSpacing: 8, lineHeight: 1, margin: "0 0 16px" }}>MAHJI</h1>
        <DecoLine/>
      </div>
      <Cnt>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[["12","Games"],["3","Wins"],["7d","Streak"]].map(([n,l]) => (
            <div key={l} style={{ flex: 1, background: C.lavCard, border: `1px solid ${C.lavBorder}`, borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 20, fontWeight: 600, color: C.lavDeep, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 8, color: C.lavText, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 3, fontWeight: 500 }}>{l}</div></div>))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[{id:"learn",title:"Learn",desc:"Tiles, rules & strategy",icon:I.book},{id:"practice",title:"Practice",desc:"Drills & exercises",icon:I.clock}].map(c => (
            <div key={c.id} onClick={() => onNav(c.id)} style={{ background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 18, padding: "20px 16px", cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.35s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";}}>
              <div style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: .75, background: C.cherry, borderRadius: "0 1px 1px 0" }}/>
              <div style={{ width: 24, height: 24, stroke: C.cherry, strokeWidth: 1.2, fill: "none", marginBottom: 12, display: "flex" }}>{c.icon}</div>
              <h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 16, fontWeight: 700, color: C.cherry, marginBottom: 2 }}>{c.title}</h3>
              <p style={{ fontSize: 11, color: C.lavText, margin: 0 }}>{c.desc}</p></div>))}
          <div onClick={() => onNav("play")} style={{ gridColumn: "1/-1", background: `linear-gradient(135deg,${C.paleBlueLt},${C.paleBlue} 50%,#C6E1F0 85%,${C.paleBlueLt})`, border: "1px solid rgba(173,212,236,0.35)", borderRadius: 18, padding: "22px 20px", cursor: "pointer", transition: "all 0.35s" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";}}>
            <div style={{ width: 24, height: 24, stroke: C.cherry, strokeWidth: 1.3, fill: "none", marginBottom: 12, display: "flex" }}>{I.play}</div>
            <h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 18, fontWeight: 700, color: C.cherry, marginBottom: 2 }}>Play Now</h3>
            <p style={{ fontSize: 11, color: C.mid, opacity: .75, margin: 0 }}>Challenge AI or invite friends</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.5)", padding: "4px 12px", borderRadius: 16, fontSize: 10, color: C.mid, marginTop: 8, border: "1px solid rgba(173,212,236,0.35)" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4ADE80", display: "inline-block" }}/><span>2,341 playing now</span></div>
          </div>
          {[{id:"shop",title:"Shop",desc:"Tiles, sets & accessories",icon:I.bag},{id:"bam",title:"Ask Bam Bird",desc:"Your AI Mahj mentor",isBird:true}].map(c => (
            <div key={c.id} onClick={() => onNav(c.id)} style={{ background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 18, padding: "20px 16px", cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.35s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";}}>
              <div style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: .75, background: C.cherry, borderRadius: "0 1px 1px 0" }}/>
              <div style={{ marginBottom: 12 }}>{c.isBird?<BirdIcon size={24} color={C.cherry} sw={1.4}/>:<div style={{ width: 24, height: 24, stroke: C.cherry, strokeWidth: 1.2, fill: "none", display: "flex" }}>{c.icon}</div>}</div>
              <h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 16, fontWeight: 700, color: C.cherry, marginBottom: 2 }}>{c.title}</h3>
              <p style={{ fontSize: 11, color: C.lavText, margin: 0 }}>{c.desc}</p></div>))}
        </div>
      </Cnt>
    </>
  );
}

function LearnPage({ showChat, setShowChat }) {
  const [tab, setTab] = useState("See All");
  const f = learnData.map(s => ({ ...s, items: s.items.filter(i => tab==="See All"||i.lvl===tab) })).filter(s => s.items.length);
  return (<><PT>Learn</PT><Cnt><Tabs items={["See All","First Timer","Novice","Intermediate","Advanced"]} active={tab} onSelect={setTab}/>
    {f.map(s => <div key={s.s}><SH>{s.s}</SH>{s.items.map(i => <Card key={i.t} title={i.t} desc={i.d} tags={[[lt[i.lvl],i.lvl]]}/>)}</div>)}
  </Cnt><BamFloat onClick={() => setShowChat(true)}/>{showChat && <BamOverlay onClose={() => setShowChat(false)} context="Learn"/>}</>);
}

function PracticePage({ showChat, setShowChat }) {
  const [tab, setTab] = useState("See All"); const [card, setCard] = useState("2025");
  const f = drillsData.filter(d => tab==="See All"||d.lvls.includes(tab));
  return (<><PT>Practice</PT><Cnt><Tabs items={["See All","Beginner","Intermediate","Advanced"]} active={tab} onSelect={setTab}/>
    <SH style={{ marginTop: 4 }}>Select Card</SH>
    <CardSel items={[{id:"2025",name:"NMJL 2025",sub:"Current year"},{id:"2024",name:"NMJL 2024",sub:"Last year"},{id:"big",name:"Big Card",sub:"Mahjong Line"}]} active={card} onSelect={setCard}/>
    <SH>Select Drill</SH>
    {f.map((d,i) => <Card key={d.t} num={i+1} title={d.t} desc={d.d} tags={d.lvls.map(l=>[lt[l],l])}/>)}
  </Cnt><BamFloat onClick={() => setShowChat(true)}/>{showChat && <BamOverlay onClose={() => setShowChat(false)} context="Practice"/>}</>);
}

function PlayPage() {
  const [diff, setDiff] = useState("Intermediate"); const [card, setCard] = useState("2025"); const [mat, setMat] = useState("brn");
  const mb = matB[mat]; const t13 = Array(13).fill(0);
  const Rack = ({ dir, label }) => {
    const isV = dir==="left"||dir==="right";
    const pos = dir==="top"?{top:6,left:"50%",transform:"translateX(-50%)"}:dir==="bottom"?{bottom:6,left:"50%",transform:"translateX(-50%)"}:dir==="left"?{left:4,top:"50%",transform:"translateY(-50%)"}:{right:4,top:"50%",transform:"translateY(-50%)"};
    return (
      <div style={{ position: "absolute", ...pos, display: "flex", flexDirection: isV?"column":"row", alignItems: "center", gap: isV?0:1 }}>
        {!isV && <div style={{ fontSize: 7, color: mb.text, letterSpacing: .5, marginBottom: 2 }}>{label}</div>}
        <div style={{ display: "flex", flexDirection: isV?"column":"row", gap: 1 }}>
          {(dir==="bottom"?[...t13,0]:t13.slice(0,isV?10:13)).map((_,i) => (
            <div key={i} style={{ width: isV?16:11, height: isV?11:16, borderRadius: 2,
              background: dir==="bottom"?"rgba(255,255,255,0.9)":mb.rack,
              border: `0.5px solid ${dir==="bottom"?"rgba(200,190,175,0.35)":mb.rackB}`,
              boxShadow: dir==="bottom"?"0 1px 3px rgba(0,0,0,0.12)":"none" }}/>
          ))}
        </div>
        {isV && <div style={{ fontSize: 7, color: mb.text, letterSpacing: .5, marginTop: 2 }}>{label}</div>}
        {!isV && dir==="bottom" && <div style={{ fontSize: 7, color: mb.you, letterSpacing: .5, marginTop: 3 }}>You — South</div>}
      </div>
    );
  };
  return (<><PT>Play</PT><Cnt>
    <Tabs items={["Novice","Intermediate","Advanced"]} active={diff} onSelect={setDiff}/>
    <SH style={{ marginTop: 4 }}>Select Card</SH>
    <CardSel items={[{id:"2025",name:"NMJL 2025",sub:"Current year"},{id:"2024",name:"NMJL 2024",sub:"Last year"},{id:"big",name:"Big Card",sub:"Mahjong Line"}]} active={card} onSelect={setCard}/>
    <SH>Select Your Game Mat</SH>
    <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
      {matsList.map(m => <div key={m.id} style={{ textAlign: "center" }}>
        <div onClick={() => setMat(m.id)} style={{ width: 48, height: 48, borderRadius: 12, background: m.g, cursor: "pointer", border: mat===m.id?`2px solid ${C.cherry}`:"2px solid transparent", boxShadow: mat===m.id?"0 2px 10px rgba(224,48,80,0.15)":"none" }}/>
        <div style={{ fontSize: 7, color: C.light, marginTop: 3, letterSpacing: .5 }}>{m.name}</div></div>)}
    </div>
    <div style={{ background: mb.bg, borderRadius: 16, padding: 18, marginBottom: 10, position: "relative", minHeight: 300, border: "1px solid rgba(60,48,35,0.15)", boxShadow: "inset 0 2px 10px rgba(0,0,0,0.1)", transition: "all 0.5s ease" }}>
      <Rack dir="top" label="North"/>
      <Rack dir="left" label="West"/>
      <Rack dir="right" label="East"/>
      <div style={{ width: 150, height: 90, margin: "40px auto 20px", background: mb.area, border: `1px solid ${mb.areaB}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 9, color: mb.areaT, letterSpacing: 1, fontStyle: "italic" }}>Discard area</span></div>
      <Rack dir="bottom" label="You — South"/>
    </div>
    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
      {["Sort by Rank","Sort by Suit"].map(t => <div key={t} style={{ fontSize: 8.5, color: C.mid, padding: "4px 9px", background: C.white, borderRadius: 8, border: `1px solid ${C.lavBorder}`, cursor: "pointer" }}>{t}</div>)}
    </div>
    <div style={{ marginTop: 14 }}>
      <button style={{ display: "block", width: "100%", padding: 13, border: "none", borderRadius: 14, fontFamily: "'Bodoni Moda',serif", fontSize: 15, fontWeight: 600, letterSpacing: 2, color: C.white, cursor: "pointer", background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`, boxShadow: "0 4px 14px rgba(224,48,80,0.18)" }}>Start Game</button>
    </div>
  </Cnt></>);
}

function ShopPage() {
  const [open, setOpen] = useState(null);
  const cats = [
    { id: "cards", title: "NMJL Card", sub: "Official playing cards", bg: "linear-gradient(135deg,#FDF8F4,#F8F0E8)", items: ["2026 NMJL Card","2025 NMJL Card"] },
    { id: "mahji", title: "The Mahji Set", sub: "Our custom tile collection", bg: "linear-gradient(135deg,#F3EFF8,#ECE7F3)", items: ["Mahji x NMJL Custom Tile Set","Mahji Carrying Case"] },
    { id: "sets", title: "Other Sets", sub: "Classic & travel options", bg: "linear-gradient(135deg,#EDF5FA,#D9ECF5)", items: ["Classic American Set","Travel Mini Set","Vintage Reissue Set"] },
    { id: "table", title: "Table Accessories", sub: "Mats, racks & pushers", bg: "linear-gradient(135deg,#F0F8F5,#E0F0EB)", items: ["Mahji Mat (Coffee)","Mahji Mat (Seafoam)","Tile Racks (Set of 4)","Pushers (Set of 4)","Wind Indicator Set"] },
    { id: "gear", title: "Mahji Gear", sub: "Wear your game", bg: "linear-gradient(135deg,#FAF4F5,#F5ECED)", items: ["Mahji Trucker Hat","Mahji Tote","Mahji Crewneck"] },
  ];

  if (open) {
    const cat = cats.find(c => c.id === open);
    return (<>
      <div style={{ padding: "6px 22px 0", display: "flex", alignItems: "center", gap: 8 }}>
        <div onClick={() => setOpen(null)} style={{ fontSize: 11, color: C.lavDeep, cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Shop</div>
      </div>
      <PT>{cat.title}</PT>
      <Cnt>
        {cat.items.map(item => (
          <div key={item} style={{ background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 16, overflow: "hidden", marginBottom: 10, cursor: "pointer", transition: "all 0.35s" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(142,199,226,0.18)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
            <div style={{ height: 100, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 16, color: C.cherry, fontWeight: 500, opacity: .35 }}>[ preview ]</div></div>
            <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 14, fontWeight: 500, color: C.dark, marginBottom: 2 }}>{item}</h3>
                <span style={{ fontSize: 10, color: C.light }}>Tap for details & pricing</span></div>
              <div style={{ width: 14, height: 14, stroke: C.lavText, strokeWidth: 1.3, fill: "none", display: "flex" }}>{I.chevR}</div>
            </div>
          </div>
        ))}
      </Cnt>
    </>);
  }

  return (<><PT>Shop</PT><Cnt>
    <p style={{ fontSize: 11.5, color: C.mid, marginBottom: 14, fontStyle: "italic" }}>Curated essentials for the modern Mahj player.</p>
    {cats.map(cat => (
      <div key={cat.id} onClick={() => setOpen(cat.id)} style={{ background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 16, overflow: "hidden", marginBottom: 10, cursor: "pointer", transition: "all 0.35s" }}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(142,199,226,0.18)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
        <div style={{ height: 120, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 18, color: C.cherry, fontWeight: 500, opacity: .35 }}>[ preview ]</div></div>
        <div style={{ padding: "12px 14px" }}>
          <h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 15, fontWeight: 500, color: C.dark, marginBottom: 2 }}>{cat.title}</h3>
          <p style={{ fontSize: 10, color: C.light, margin: 0 }}>{cat.sub}</p></div>
      </div>
    ))}
  </Cnt></>);
}

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

function ProfilePage({ onBack, onHome, signedIn, onSignOut, onSignIn }) {
  const [sub, setSub] = useState(null); // null | "edit" | "prefs"
  const [avatar, setAvatar] = useState("🀄"); const [showAv, setShowAv] = useState(false);
  const avatars = ["🀄","🎋","🐉","🌸","🦅","🎯","🎲","✨"];
  const [goal, setGoal] = useState(3);

  const Back = ({ to, label }) => (
    <div style={{ padding: "6px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div onClick={() => to ? setSub(null) : onBack()} style={{ fontSize: 11, color: C.lavDeep, cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>{label || "Back"}</div>
      <Logo onClick={onHome}/><div style={{ width: 40 }}/></div>
  );

  // Signed out state
  if (!signedIn) return (<>
    <Back label="Back"/>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 40px", paddingBottom: 100 }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.lavSoft, border: `2px solid ${C.lavender}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <BirdIcon size={40} color={C.cherry} sw={1.4}/>
      </div>
      <h2 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 22, fontWeight: 700, color: C.cherry, textAlign: "center", marginBottom: 8, letterSpacing: 1 }}>Your tiles are waiting</h2>
      <p style={{ fontSize: 12, color: C.mid, textAlign: "center", lineHeight: 1.6, marginBottom: 24 }}>Sign in to track your stats, save your streak, and pick up right where you left off.</p>
      <button onClick={onSignIn} style={{ width: "100%", padding: 14, border: "none", borderRadius: 14, fontFamily: "'Bodoni Moda',serif", fontSize: 15, fontWeight: 600, letterSpacing: 2, color: C.white, cursor: "pointer", background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`, boxShadow: "0 4px 14px rgba(224,48,80,0.18)", marginBottom: 12 }}>Sign In</button>
      <button style={{ width: "100%", padding: 14, border: `1px solid ${C.lavBorder}`, borderRadius: 14, fontFamily: "'Bodoni Moda',serif", fontSize: 14, fontWeight: 500, letterSpacing: 1.5, color: C.lavDeep, cursor: "pointer", background: C.white }}>Create Account</button>
      <p style={{ fontSize: 10, color: C.lavText, textAlign: "center", marginTop: 16, fontStyle: "italic" }}>Free to play — always.</p>
    </div>
  </>);

  if (sub === "edit") return (<>
    <Back to="profile" label="Profile"/>
    <PT>Edit Profile</PT>
    <Cnt>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div onClick={() => setShowAv(!showAv)} style={{ width: 70, height: 70, borderRadius: "50%", background: C.lavSoft, border: `2px solid ${C.lavender}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 32, cursor: "pointer", marginBottom: 8 }}>{avatar}</div>
        {showAv && <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 10 }}>
          {avatars.map(a => <div key={a} onClick={() => {setAvatar(a);setShowAv(false);}} style={{ width: 36, height: 36, borderRadius: "50%", background: avatar===a?C.lavSoft:C.white, border: `1px solid ${avatar===a?C.lavDeep:C.lavBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }}>{a}</div>)}</div>}
        <div style={{ fontSize: 9, color: C.lavText }}>Tap to change avatar</div>
      </div>
      {[["First Name","Erika"],["Last Name","Panico"],["Username","@mahji_erika"]].map(([l,v]) => (
        <div key={l} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 9, color: C.lavText, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4, fontWeight: 600 }}>{l}</div>
          <div style={{ padding: "10px 14px", background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 12, fontSize: 13, color: C.dark }}>{v}</div>
        </div>
      ))}
      <SH>Daily Goal</SH>
      <p style={{ fontSize: 11, color: C.light, marginBottom: 10 }}>How many games do you want to play per day?</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[1,2,3,5].map(g => (
          <div key={g} onClick={() => setGoal(g)} style={{ flex: 1, textAlign: "center", padding: "14px 6px", background: goal===g?C.seafoam:C.white, color: goal===g?C.white:C.dark, border: `1px solid ${goal===g?C.seafoam:"rgba(118,195,170,0.25)"}`, borderRadius: 14, cursor: "pointer", transition: "all 0.25s" }}>
            <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 18, fontWeight: 600 }}>{g}</div>
            <div style={{ fontSize: 8, marginTop: 2, opacity: .7 }}>{g===1?"Casual":g===2?"Regular":g===3?"Serious":g===5?"Intense":""}</div>
          </div>))}
      </div>
      <button style={{ display: "block", width: "100%", padding: 12, border: "none", borderRadius: 14, fontFamily: "'Bodoni Moda',serif", fontSize: 14, fontWeight: 600, letterSpacing: 2, color: C.white, cursor: "pointer", background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`, marginTop: 10 }}>Save Changes</button>
    </Cnt>
  </>);

  if (sub === "prefs") return (<>
    <Back to="profile" label="Profile"/>
    <PT>Preferences</PT>
    <Cnt>
      {[{icon:I.bell,label:"Push Notifications",desc:"Reminders to play & streak alerts",on:true},
        {icon:I.volume,label:"Sound Effects",desc:"Tile clicks, win celebrations",on:true},
        {icon:I.volume,label:"Background Music",desc:"Ambient music during gameplay",on:false},
      ].map(p => (
        <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 14, marginBottom: 8 }}>
          <div style={{ width: 16, height: 16, stroke: C.lavDeep, strokeWidth: 1.3, fill: "none", display: "flex", flexShrink: 0 }}>{p.icon}</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{p.label}</div>
            <div style={{ fontSize: 10, color: C.light, marginTop: 1 }}>{p.desc}</div></div>
          <div style={{ width: 36, height: 20, borderRadius: 10, background: p.on?C.seafoam:"rgba(200,190,215,0.25)", cursor: "pointer", position: "relative", transition: "all 0.3s" }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: p.on?18:2, boxShadow: "0 1px 3px rgba(0,0,0,0.15)", transition: "left 0.3s" }}/></div>
        </div>
      ))}
      <SH>Display</SH>
      <Row icon={I.settings} label="Default Mat Color" sub="Coffee"/>
      <Row icon={I.settings} label="Default Card" sub="NMJL 2025"/>
      <Row icon={I.settings} label="Default Difficulty" sub="Intermediate"/>
    </Cnt>
  </>);

  // Main profile
  return (<>
    <Back label="Back"/>
    <PT>Profile</PT>
    <Cnt>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ width: 70, height: 70, borderRadius: "50%", background: C.lavSoft, border: `2px solid ${C.lavender}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 8 }}>{avatar}</div>
        <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 18, fontWeight: 600, color: C.dark, marginBottom: 2 }}>Erika Panico</div>
        <div style={{ fontSize: 11, color: C.lavText }}>@mahji_erika</div>
      </div>

      <SH style={{ marginTop: 4 }}>Progress</SH>
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 16 }}>
        <Ring val={12} max={50} label="Games" color={C.cerulean}/>
        <Ring val={3} max={12} label="Wins" color={C.cherry}/>
        <Ring val={7} max={30} label="Day Streak" color={C.seafoam}/>
      </div>

      <SH>This Week</SH>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 70, marginBottom: 16, padding: "0 8px" }}>
        {[{d:"M",v:3},{d:"T",v:5},{d:"W",v:2},{d:"T",v:4},{d:"F",v:6},{d:"S",v:1},{d:"S",v:0}].map((b,i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ width: "100%", height: b.v*10, background: i===4?C.cherry:`linear-gradient(180deg,${C.cerulean},${C.paleBlue})`, borderRadius: 6, minHeight: b.v?6:2 }}/>
            <span style={{ fontSize: 8, color: C.lavText, fontWeight: 500 }}>{b.d}</span></div>))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[{i:"🏆",l:"Win Rate",v:"25%",s:"3 of 12 games"},{i:"📚",l:"Lessons",v:"6 / 9",s:"67% complete"},
          {i:"🎯",l:"Daily Goal",v:`${goal} games`,s:"Per day target"},{i:"⏱️",l:"Time Played",v:"4h 23m",s:"This month"}].map(s => (
          <div key={s.l} style={{ background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.i}</div>
            <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 16, fontWeight: 600, color: C.dark }}>{s.v}</div>
            <div style={{ fontSize: 9, color: C.lavText, fontWeight: 500, letterSpacing: .5, marginTop: 2 }}>{s.l}</div>
            <div style={{ fontSize: 8, color: C.light, marginTop: 1 }}>{s.s}</div></div>))}
      </div>

      <SH>Account</SH>
      <Row icon={I.edit} label="Edit Profile" sub="Name, username, avatar, goals" onClick={() => setSub("edit")}/>
      <Row icon={I.settings} label="Preferences" sub="Notifications, sounds, defaults" onClick={() => setSub("prefs")}/>
      <Row icon={I.creditCard} label="Billing" sub="Free plan — no charges"/>
      <SH>Danger Zone</SH>
      <Row icon={I.trash} label="Delete All Data" sub="Wipe stats, progress, and preferences" danger/>
      <Row icon={I.logOut} label="Sign Out" danger onClick={onSignOut}/>
      <div style={{ textAlign: "center", marginTop: 20, marginBottom: 10 }}><div style={{ fontSize: 9, color: C.lavText, letterSpacing: 1 }}>MAHJI v1.0 — Free to play</div></div>
    </Cnt>
  </>);
}

// MAIN APP
export default function App() {
  const [page, setPage] = useState("home");
  const [prevPage, setPrevPage] = useState("home");
  const [showChat, setShowChat] = useState(false);
  const [signedIn, setSignedIn] = useState(true);
  const onNav = p => { setPage(p); setShowChat(false); };
  const onHome = () => { setPage("home"); setShowChat(false); };
  const onProfile = () => { setPrevPage(page); setPage("profile"); };
  const onSignOut = () => { setSignedIn(false); setPage("home"); };
  const onSignIn = () => { setSignedIn(true); };

  return (
    <div style={{ fontFamily: "'Outfit',sans-serif", background: "#F0ECF2", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: 20 }}>
      <style>{`
        @keyframes bfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        input::placeholder{color:${C.lavText}} *{margin:0;padding:0;box-sizing:border-box} svg{display:block}
        *::-webkit-scrollbar{display:none} *{scrollbar-width:none}
      `}</style>
      <div style={{ width: 375, height: 812, background: "linear-gradient(180deg,#FFFFFF 0%,#FDFCFE 12%,#FAF8FC 28%,#F7F4FA 45%,#F4F0F7 60%,#F1ECF5 75%,#EEE8F2 90%,#ECE6F0 100%)", borderRadius: 40, overflow: "hidden", boxShadow: "0 20px 60px rgba(50,35,65,0.08),0 3px 16px rgba(50,35,65,0.04),inset 0 0 0 1px rgba(200,190,215,0.18)", position: "relative", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px 26px 4px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, fontWeight: 600, color: C.dark }}><span>9:41</span><span style={{ fontSize: 11, color: C.mid }}>●●●○ WiFi 🔋</span></div>
        {page!=="profile" && <Header onHome={onHome} onProfile={onProfile} isHome={page==="home"}/>}
        {page==="home" && <HomePage onNav={onNav}/>}
        {page==="learn" && <LearnPage showChat={showChat} setShowChat={setShowChat}/>}
        {page==="practice" && <PracticePage showChat={showChat} setShowChat={setShowChat}/>}
        {page==="play" && <PlayPage/>}
        {page==="shop" && <ShopPage/>}
        {page==="bam" && <BamPage/>}
        {page==="profile" && <ProfilePage onBack={() => setPage(prevPage)} onHome={onHome} signedIn={signedIn} onSignOut={onSignOut} onSignIn={onSignIn}/>}
        <NavBar active={page==="home"||page==="profile"?null:page} onNav={onNav}/>
      </div>
    </div>
  );
}
