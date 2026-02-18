import { C } from '../constants/colors';
import { BirdIcon, I, Logo } from './ui/Icons';

export const NavBar = ({ active, onNav }) => (
  <div className="nav-bar">
    {[{id:"learn",icon:I.book,label:"learn"},{id:"practice",icon:I.clock,label:"practice"},{id:"play",label:"play",isPlay:true},{id:"shop",icon:I.bag,label:"shop"},{id:"bam",label:"ask bam",isBird:true}].map(it => it.isPlay ? (
      <div key="play" onClick={() => onNav("play")} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", marginTop: -18, minWidth: 48 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(224,48,80,0.2)", border: `3px solid ${C.white}` }}>
          <div style={{ width: 16, height: 16, stroke: "white", strokeWidth: 2, fill: "none", marginLeft: 2, display: "flex" }}>{I.play}</div></div>
        <span style={{ fontSize: 9, color: C.cherry, fontWeight: 600, marginTop: 4, letterSpacing: .6 }}>play</span></div>
    ) : (
      <div key={it.id} onClick={() => onNav(it.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "5px 8px 3px", borderRadius: 10, minWidth: 48 }}>
        <div style={{ width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {it.isBird ? <BirdIcon size={22} color={active===it.id?C.lavDeep:C.lavText} sw={active===it.id?2.2:1.8}/> :
          <div style={{ width: 20, height: 20, stroke: active===it.id?C.lavDeep:C.lavText, strokeWidth: active===it.id?1.6:1.3, fill: "none", display: "flex" }}>{it.icon}</div>}
        </div>
        <span style={{ fontSize: 9, color: active===it.id?C.lavDeep:C.lavText, fontWeight: active===it.id?600:500, letterSpacing: .6 }}>{it.label}</span></div>
    ))}
  </div>
);

export const Header = ({ onHome, onProfile, isHome, cartCount = 0, onCart = () => {}, page = "" }) => (
  <div className="app-header">
    <Logo onClick={onHome} showText={!isHome}/>
    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
      {page==="shop" && <div onClick={onCart} style={{ position:"relative", cursor:"pointer" }}>
        <div style={{ width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.lavDeep} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        {cartCount>0 && <div style={{ position:"absolute", top:-2, right:-4, width:16, height:16, borderRadius:"50%", background:C.cherry, color:"#fff", fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{cartCount}</div>}
      </div>}
      <div onClick={onProfile} style={{ width: 34, height: 34, borderRadius: "50%", background: C.lavHint, border: `1.5px solid ${C.lavender}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <div style={{ width: 14, height: 14, stroke: C.lavDeep, strokeWidth: 1.3, fill: "none", display: "flex" }}>{I.user}</div></div>
    </div>
  </div>
);

export const PT = ({ children }) => (
  <div style={{ textAlign: "center", padding: "22px 24px 18px" }}>
    <h1 className="page-title">{children}</h1>
  </div>
);

export const SH = ({ children, style = {} }) => (
  <div className="section-header" style={style}>{children}</div>
);

export const Tag = ({ type, children }) => {
  const m = { b: { bg: "rgba(142,199,226,0.12)", c: "#4A96B8" }, n: { bg: "rgba(168,152,190,0.12)", c: C.lavDeep }, i: { bg: "rgba(176,141,58,0.1)", c: C.gold }, a: { bg: "rgba(224,48,80,0.06)", c: C.cherry } };
  const s = m[type]||m.b;
  return <span style={{ display: "inline-block", fontSize: 8, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", borderRadius: 6, marginRight: 4, marginTop: 5, background: s.bg, color: s.c }}>{children}</span>;
};

export const Card = ({ title, desc, tags = [], num, onClick }) => (
  <div onClick={onClick} style={{ background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 16, padding: "16px 18px 16px 20px", marginBottom: 10, cursor: onClick ? "pointer" : "default", position: "relative", overflow: "hidden", transition: "all 0.35s" }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(142,199,226,0.18)";}}
    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
    <div style={{ position: "absolute", left: 0, top: 12, bottom: 12, width: 1, background: C.cherry, borderRadius: "0 1px 1px 0" }}/>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {num!=null && <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.cherry, color: C.white, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{num}</div>}
      <div style={{ flex: 1 }}>
        <div className="card-title" style={{ color: C.dark }}>{title}</div>
        {desc && <div className="card-desc" style={{ color: C.light, marginTop: 3 }}>{desc}</div>}
        {tags.length > 0 && <div>{tags.map(tg => <Tag key={tg.l} type={tg.t}>{tg.l}</Tag>)}</div>}
      </div>
      <div style={{ width: 16, height: 16, stroke: C.lavText, strokeWidth: 1.3, fill: "none", display: "flex" }}>{I.chevR}</div>
    </div>
  </div>
);

export const Tabs = ({ items, active, onSelect }) => (
  <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
    {items.map(it => <div key={it} onClick={() => onSelect(it)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: active===it?600:400, background: active===it?C.cherry:"transparent", color: active===it?C.white:C.mid, border: active===it?"none":`1px solid ${C.lavBorder}`, cursor: "pointer", transition: "all 0.3s" }}>{it}</div>)}
  </div>
);

export const Cnt = ({ children }) => (
  <div className="content-scroll">{children}</div>
);

export const CardSel = ({ items, active, onSelect }) => (
  <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
    {items.map(it => <div key={it.id} onClick={() => onSelect(it.id)} style={{ flex: 1, textAlign: "center", padding: "12px 6px", background: C.white, border: `${active===it.id?"1.5px":"1px"} solid ${active===it.id?C.seafoam:"rgba(118,195,170,0.25)"}`, borderRadius: 14, cursor: "pointer" }}>
      <h4 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 500, color: active===it.id?"#4A9E88":C.dark, marginBottom: 1 }}>{it.name}</h4>
      <p style={{ fontSize: 9, color: C.light, margin: 0 }}>{it.sub}</p></div>)}
  </div>
);

export const BamFloat = ({ onClick }) => (
  <div className="bam-float" onClick={onClick}>
    <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${C.paleBlue},${C.paleBlueMid})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 12px rgba(142,199,226,0.25)", border: "2px solid rgba(255,255,255,0.7)" }}>
      <BirdIcon size={20} color={C.cerulean} sw={2}/>
    </div>
  </div>
);
