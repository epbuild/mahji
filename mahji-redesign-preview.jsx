import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   MAHJI — Quiet Luxury Redesign Preview v3
   ═══════════════════════════════════════════════════════════ */

const cherry = "#E03050";
const cherryLt = "#E8566D";
const cherryGlow = "rgba(224,48,80,0.2)";
const cherryGlowHover = "rgba(224,48,80,0.35)";
const cerulean = "#8EC7E2";
const ceruleanLight = "#A8D8EE";
const serif = "'Bodoni Moda', serif";
const sans = "'Outfit', sans-serif";

const T = {
  light: {
    appBg: "linear-gradient(180deg,#FFFFFF 0%,#FDFCFE 12%,#FAF8FC 28%,#F7F4FA 45%,#F4F0F7 60%,#F1ECF5 75%,#EEE8F2 90%,#ECE6F0 100%)",
    silk: "radial-gradient(ellipse 120% 80% at 30% 20%, rgba(243,239,250,0.35) 0%, transparent 60%)",
    cardBg: "#FFFFFF",
    cardSheen: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 50%)",
    cardBorder: "rgba(196,184,218,0.22)",
    cardRest: "none",
    cardHover: "0 8px 24px rgba(126,100,164,0.13), 0 0 0 1px rgba(196,184,218,0.18)",
    cardActive: "0 2px 8px rgba(126,100,164,0.18), 0 0 0 1.5px rgba(126,100,164,0.2)",
    textMain: "#302040", textMid: "#5E4D6D", textDim: "#9A8DAA",
    statBg: "linear-gradient(145deg, rgba(248,244,253,0.95) 0%, rgba(240,234,246,0.85) 100%)",
    statBorder: "linear-gradient(135deg, rgba(142,199,226,0.22), rgba(192,178,212,0.18), rgba(109,191,168,0.2))",
    statGloss: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, transparent 100%)",
    statNum: "#7E64A4",
    lavDeep: "#7E64A4", lavender: "#C0B2D4", lavBorder: "rgba(196,184,218,0.22)",
    lavHint: "#F5F2F9", lavText: "#9688AA",
    accentBorder: cherry,
    iconBg: "rgba(224,48,80,0.04)", iconColor: cherry,
    navBg: "rgba(255,255,255,0.96)", navBorderTop: "rgba(124,96,162,0.08)",
    navInactive: "rgba(124,96,162,0.5)", navActive: "#7C60A2",
    btnBg: "#FFFFFF", btnBorder: "rgba(196,184,218,0.22)", btnText: "#302040",
    btnRest: "none",
    btnHover: "0 8px 24px rgba(126,100,164,0.13), 0 0 0 1px rgba(196,184,218,0.18)",
    btnActive: "0 2px 8px rgba(126,100,164,0.18), 0 0 0 1.5px rgba(126,100,164,0.22)",
  },
  dark: {
    appBg: "linear-gradient(180deg, #1E1432 0%, #1A1028 35%, #16102A 100%)",
    silk: "radial-gradient(ellipse 140% 90% at 25% 15%, rgba(142,199,226,0.04) 0%, transparent 50%), radial-gradient(ellipse 100% 80% at 75% 85%, rgba(109,191,168,0.03) 0%, transparent 50%)",
    cardBg: "rgba(255,255,255,0.035)",
    cardSheen: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%)",
    cardBorder: "rgba(192,178,212,0.1)",
    cardRest: "0 0 0 1px rgba(192,178,212,0.06), 0 1px 4px rgba(0,0,0,0.15)",
    cardHover: "0 8px 28px rgba(142,199,226,0.1), 0 0 0 1px rgba(168,216,238,0.14)",
    cardActive: "0 2px 10px rgba(142,199,226,0.15), 0 0 0 1.5px rgba(168,216,238,0.18)",
    textMain: "rgba(255,255,255,0.9)", textMid: "rgba(255,255,255,0.55)", textDim: "rgba(255,255,255,0.3)",
    statBg: "rgba(30,20,50,0.7)",
    statBorder: "linear-gradient(135deg, rgba(142,199,226,0.2), rgba(192,178,212,0.12), rgba(109,191,168,0.16))",
    statGloss: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
    statNum: ceruleanLight,
    lavDeep: "#9B88BB", lavender: "#D4C8E8", lavBorder: "rgba(192,178,212,0.1)",
    lavHint: "rgba(155,136,187,0.08)", lavText: "rgba(255,255,255,0.28)",
    accentBorder: "rgba(142,199,226,0.2)",
    iconBg: "rgba(142,199,226,0.08)", iconColor: ceruleanLight,
    navBg: "rgba(22,16,42,0.96)", navBorderTop: "rgba(168,216,238,0.06)",
    navInactive: "rgba(168,216,238,0.4)", navActive: ceruleanLight,
    btnBg: "rgba(255,255,255,0.055)", btnBorder: "rgba(192,178,212,0.14)", btnText: "rgba(255,255,255,0.88)",
    btnRest: "0 0 0 1px rgba(192,178,212,0.08), 0 1px 6px rgba(142,199,226,0.05)",
    btnHover: "0 8px 28px rgba(142,199,226,0.12), 0 0 0 1px rgba(168,216,238,0.16), 0 0 22px rgba(142,199,226,0.05)",
    btnActive: "0 2px 10px rgba(142,199,226,0.16), 0 0 0 1.5px rgba(168,216,238,0.2)",
  },
};
const gt = (dk) => dk ? T.dark : T.light;

// ── ICONS ──
const SunIcon = ({s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="4.5"/>{[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180;return <line key={a} x1={12+7.5*Math.cos(r)} y1={12+7.5*Math.sin(r)} x2={12+9.5*Math.cos(r)} y2={12+9.5*Math.sin(r)}/>})}</svg>;
const MoonIcon = ({s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const BirdIcon = ({size=18,color="currentColor",sw=2}) => <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M11 25 C8 22, 7 17, 9 13 C10 10.5, 12 8.5, 15 7.5 C17 6.8, 19 6.5, 21 7 C23 7.5, 24.5 9, 25 11 C25.5 13, 25 16, 23 19 C21 22, 17 25, 14 26 C12 26.5, 11 26, 11 25Z"/><path d="M23.5 8.5 L27 7 L24 10"/><circle cx="21" cy="9.5" r="0.9" fill={color} stroke="none"/><path d="M12 15 C14 13, 18 13, 21 15.5"/><path d="M14 25.5 L14 29 M14 29 L12.5 30 M14 29 L15.5 30"/><path d="M18 24.5 L18 28 M18 28 L16.5 29 M18 28 L19.5 29"/></svg>;
const BookIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const ClockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const PlayIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>;
const BagIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const HomeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const TileIcon = ({w=20,h=27,strokeColor}) => <svg width={w} height={h} viewBox="0 0 26 34" fill="none"><rect x="1" y="1" width="24" height="32" rx="4.5" stroke={strokeColor||"rgba(212,200,232,0.6)"} strokeWidth="1.3"/><rect x="5.5" y="6" width="15" height="22" rx="2.5" stroke={cherry} strokeWidth="1" opacity="0.6"/><circle cx="13" cy="17" r="2.2" stroke={cerulean} strokeWidth="1" fill="none"/></svg>;

// ── LIVE SQUIGGLE (exact from app) ──
const DecoLine = ({isDark}) => {
  const sw1 = isDark ? "#85D4BC" : "#C0B2D4";
  const sw2 = isDark ? "#D4C8E8" : "#C0B2D4";
  const dm = isDark ? ceruleanLight : "#A898BE";
  const sw3 = isDark ? ceruleanLight : "";
  const sO = isDark ? 0.45 : 0.55;
  const s2O = isDark ? 0.27 : 0.3;
  const dO = isDark ? 0.5 : 0.55;
  const cO = isDark ? 0.7 : 0.8;
  return (
    <svg width="210" height="26" viewBox="0 0 210 26" fill="none" style={{display:"block",margin:"0 auto 8px"}}>
      <path d="M8 13 C22 13, 28 6, 48 6 C62 6, 66 13, 73 13" stroke={sw1} strokeWidth="0.8" strokeLinecap="round" opacity={sO}/>
      <path d="M8 13 C22 13, 28 20, 48 20 C62 20, 66 13, 73 13" stroke={sw2} strokeWidth="0.5" strokeLinecap="round" opacity={s2O}/>
      {sw3 && <path d="M18 13 C30 13, 36 9, 50 9 C60 9, 66 13, 73 13" stroke={sw3} strokeWidth="0.4" strokeLinecap="round" opacity="0.25"/>}
      <rect x="76" y="9.5" width="5" height="5" rx="0.8" transform="rotate(45 78.5 12)" stroke={dm} strokeWidth="0.7" fill="none" opacity={dO}/>
      <line x1="86" y1="12" x2="114" y2="12" stroke={cherry} strokeWidth="1.5" strokeLinecap="round" opacity={cO}/>
      <circle cx="100" cy="12" r="2" fill={cherry} opacity={cO}/>
      <rect x="119" y="9.5" width="5" height="5" rx="0.8" transform="rotate(45 121.5 12)" stroke={dm} strokeWidth="0.7" fill="none" opacity={dO}/>
      <path d="M127 13 C134 13, 138 6, 152 6 C172 6, 180 13, 192 13" stroke={sw1} strokeWidth="0.8" strokeLinecap="round" opacity={sO}/>
      <path d="M127 13 C134 13, 138 20, 152 20 C172 20, 180 13, 192 13" stroke={sw2} strokeWidth="0.5" strokeLinecap="round" opacity={s2O}/>
      {sw3 && <path d="M127 13 C140 13, 144 9, 158 9 C168 9, 178 13, 190 13" stroke={sw3} strokeWidth="0.4" strokeLinecap="round" opacity="0.25"/>}
      <circle cx="6" cy="13" r="1.2" fill={sw2} opacity={sO*0.5}/>
      <circle cx="194" cy="13" r="1.2" fill={sw2} opacity={sO*0.5}/>
    </svg>
  );
};

// ── SUN+MOON TOGGLE ──
const ThemeToggle = ({isDark, onToggle}) => (
  <button onClick={onToggle} aria-label="Toggle theme" style={{
    background: isDark ? "rgba(168,216,238,0.08)" : "rgba(126,100,164,0.06)",
    border: `1px solid ${isDark ? "rgba(168,216,238,0.12)" : "rgba(126,100,164,0.1)"}`,
    borderRadius: 20, cursor: "pointer", padding: "4px 6px",
    display: "flex", alignItems: "center", gap: 4, height: 28, transition: "all 0.35s",
  }}>
    <span style={{display:"flex",alignItems:"center",justifyContent:"center",width:20,height:20,borderRadius:"50%",
      background: !isDark ? "rgba(126,100,164,0.12)" : "transparent",
      color: !isDark ? "#7E64A4" : "rgba(255,255,255,0.25)", transition: "all 0.35s"}}><SunIcon/></span>
    <span style={{display:"flex",alignItems:"center",justifyContent:"center",width:20,height:20,borderRadius:"50%",
      background: isDark ? "rgba(168,216,238,0.15)" : "transparent",
      color: isDark ? ceruleanLight : "rgba(126,100,164,0.3)", transition: "all 0.35s"}}><MoonIcon/></span>
  </button>
);

// ── INTRO: "Let's Play" + "MAHJI" text → spins → morphs into tile → tile spins to top-left corner ──
const IntroAnimation = ({onDone}) => {
  // CSS animation based — matches the live splash but starts with text
  return (
    <div className="intro-overlay">
      <style>{`
        .intro-overlay {
          position:fixed; inset:0; z-index:2000; pointer-events:auto;
        }
        .intro-bg {
          position:absolute; inset:0;
          background:linear-gradient(160deg, #1E1432 0%, #1A1028 50%, #16102A 100%);
          animation: introBgFade 3.4s ease forwards;
        }
        .intro-text {
          position:absolute; top:50%; left:50%; z-index:2001;
          transform:translate(-50%,-50%);
          text-align:center;
          animation: introTextAnim 3.4s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .intro-tile {
          position:absolute; top:50%; left:50%; z-index:2002;
          animation: introTileAnim 3.4s cubic-bezier(0.4,0,0.2,1) forwards;
          will-change: transform, top, left, opacity;
        }
        .intro-skip {
          position:absolute; top:16px; right:20px; z-index:2003;
          background:none; border:none; color:rgba(255,255,255,0.3);
          font-family:${sans}; font-size:11px; letter-spacing:2px;
          cursor:pointer; text-transform:uppercase;
        }
        /* Text: elegant fade+rise in, hold, then spin + shrink + fade */
        @keyframes introTextAnim {
          0%   { opacity:0; transform:translate(-50%,-50%) translateY(20px) scale(1) rotate(0deg); }
          10%  { opacity:1; transform:translate(-50%,-50%) translateY(0px) scale(1) rotate(0deg); }
          35%  { opacity:1; transform:translate(-50%,-50%) translateY(0px) scale(1) rotate(0deg); }
          55%  { opacity:0; transform:translate(-50%,-50%) translateY(0px) scale(0.2) rotate(-360deg); }
          100% { opacity:0; transform:translate(-50%,-50%) translateY(0px) scale(0) rotate(-360deg); }
        }
        /* Tile: appears from text spin, continues spin to corner */
        @keyframes introTileAnim {
          0%   { top:50%; left:50%; transform:translate(-50%,-50%) scale(3.5) rotate(-360deg); opacity:0; }
          48%  { top:50%; left:50%; transform:translate(-50%,-50%) scale(3.5) rotate(-360deg); opacity:0; }
          52%  { top:50%; left:50%; transform:translate(-50%,-50%) scale(3.5) rotate(-360deg); opacity:1; }
          66%  { top:50%; left:50%; transform:translate(-50%,-50%) scale(3.5) rotate(-720deg); opacity:1; }
          90%  { top:12px; left:20px; transform:translate(0,0) scale(1.05) rotate(-1060deg); opacity:1; }
          100% { top:12px; left:20px; transform:translate(0,0) scale(1) rotate(-1080deg); opacity:0; }
        }
        /* Background fades out */
        @keyframes introBgFade {
          0%   { opacity:1; }
          75%  { opacity:1; }
          100% { opacity:0; }
        }
      `}</style>
      <div className="intro-bg"/>
      <button className="intro-skip" onClick={onDone}>Skip</button>
      {/* Text */}
      <div className="intro-text">
        <div style={{fontFamily:serif,fontSize:13,fontWeight:400,letterSpacing:6,color:ceruleanLight,textTransform:"uppercase",marginBottom:10,opacity:0.55}}>Let's Play</div>
        <div style={{fontFamily:serif,fontSize:52,fontWeight:700,color:"#FFFFFF",letterSpacing:10}}>MAHJI</div>
      </div>
      {/* Tile that appears from the spin */}
      <div className="intro-tile">
        <TileIcon w={20} h={27}/>
      </div>
      {/* Auto-complete timer */}
      <AutoDone onDone={onDone} ms={3500}/>
    </div>
  );
};

// helper to fire onDone after animation
const AutoDone = ({onDone, ms}) => {
  useEffect(() => {
    const t = setTimeout(onDone, ms);
    return () => clearTimeout(t);
  }, [onDone, ms]);
  return null;
};

// ── STAT CARD ──
const StatCard = ({num, label, isDark}) => {
  const t = gt(isDark);
  const [h, setH] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <div
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setH(false);setPressed(false);}}
      onMouseDown={()=>setPressed(true)} onMouseUp={()=>setPressed(false)}
      onTouchStart={()=>setPressed(true)} onTouchEnd={()=>setTimeout(()=>setPressed(false),150)}
      style={{
        flex:"1 1 0", maxWidth:115, borderRadius:12, padding:"1.5px",
        background:t.statBorder, cursor:"pointer",
        transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        transform: pressed ? "scale(0.96)" : h ? "translateY(-2px) scale(1.03)" : "none",
        boxShadow: pressed ? t.btnActive : h ? t.btnHover : t.btnRest,
      }}>
      <div style={{
        background:t.statBg, borderRadius:10.5,
        padding:"14px 8px 12px",
        textAlign:"center", position:"relative", overflow:"hidden",
        backdropFilter: isDark ? "blur(12px)" : "none",
      }}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:"40%",background:t.statGloss,borderRadius:"10.5px 10.5px 0 0",pointerEvents:"none"}}/>
        <div style={{fontFamily:serif,fontSize:22,fontWeight:600,color:t.statNum,lineHeight:1,position:"relative"}}>{num}</div>
        <div style={{fontSize:8,color:t.textDim,textTransform:"uppercase",letterSpacing:2,marginTop:5,fontWeight:500,position:"relative",fontFamily:sans,whiteSpace:"nowrap"}}>{label}</div>
      </div>
    </div>
  );
};

// ── FEATURE CARD ──
const FeatureCard = ({title, desc, icon, isBird, isDark, onClick}) => {
  const t = gt(isDark);
  const [h,setH] = useState(false);
  const [pressed,setPressed] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setH(false);setPressed(false);}}
      onMouseDown={()=>setPressed(true)} onMouseUp={()=>setPressed(false)}
      onTouchStart={()=>setPressed(true)} onTouchEnd={()=>setTimeout(()=>setPressed(false),200)}
      style={{
        background:t.cardBg, border:`1px solid ${t.cardBorder}`, borderRadius:14,
        padding:"16px 14px", cursor:"pointer", overflow:"hidden",
        borderTop:`2.5px solid ${t.accentBorder}`,
        transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        transform: pressed ? "scale(0.97)" : h ? "translateY(-4px) scale(1.02)" : "none",
        boxShadow: pressed ? t.cardActive : h ? t.cardHover : t.cardRest,
        position:"relative",
      }}>
      <div style={{position:"absolute",inset:0,background:t.cardSheen,pointerEvents:"none",borderRadius:14}}/>
      <div style={{width:26,height:26,borderRadius:7,background:t.iconBg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8,color:t.iconColor,position:"relative",transition:"transform 0.3s",transform:h?"scale(1.12)":"none"}}>
        {isBird ? <BirdIcon size={15} color={t.iconColor} sw={1.8}/> : icon}
      </div>
      <h3 style={{fontFamily:serif,fontSize:14,fontWeight:600,color:t.textMain,marginBottom:2,position:"relative"}}>{title}</h3>
      <p style={{fontSize:11,color:t.textDim,margin:0,lineHeight:1.4,fontFamily:sans,position:"relative"}}>{desc}</p>
    </div>
  );
};

const PlayNowBanner = ({isDark, onClick}) => {
  const t = gt(isDark);
  const [h,setH] = useState(false);
  const [pressed,setPressed] = useState(false);
  return (
    <div onClick={()=>{setPressed(true);setTimeout(()=>setPressed(false),300);onClick?.();}}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setH(false);setPressed(false);}}
      onMouseDown={()=>setPressed(true)} onMouseUp={()=>setPressed(false)}
      style={{
        background:isDark?"transparent":"linear-gradient(135deg, #EDF5FA, #D9ECF5 40%, #C6E1F0 80%, #EDF5FA)",
        border:isDark?`1px solid ${cerulean}`:"1px solid rgba(173,212,236,0.3)",
        borderRadius:14,padding:"14px 16px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",
        cursor:"pointer",transition:"all 0.3s",position:"relative",overflow:"hidden",
        boxShadow: pressed ? t.cardActive : h ? t.cardHover : "none",
        transform: pressed ? "scale(0.98)" : "none",
      }}>
      <div style={{position:"absolute",inset:0,background:isDark?"none":t.cardSheen,pointerEvents:"none"}}/>
      <div style={{display:"flex",alignItems:"center",gap:12,position:"relative"}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${cherry},${cherryLt})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:pressed?`0 0 20px ${cherryGlowHover}`:`0 2px 8px ${cherryGlow}, inset 0 1px 0 rgba(255,255,255,0.15)`,transition:"all 0.3s",transform:pressed?"scale(1.12)":"none",color:"white"}}><PlayIcon/></div>
        <div>
          <h3 style={{fontFamily:serif,fontSize:15,fontWeight:700,color:isDark?"#fff":t.textMain,marginBottom:0}}>Play Now</h3>
          <p style={{fontSize:10.5,color:t.textMid,margin:0,fontFamily:sans}}>Challenge AI or invite friends</p>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:10,fontSize:9,color:t.textDim,fontFamily:sans,background:isDark?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.5)",position:"relative"}}>
        <span style={{width:4,height:4,borderRadius:"50%",background:"#4ADE80",display:"inline-block"}}/>2,341
      </div>
    </div>
  );
};

const LessonCard = ({title, desc, num, isDark}) => {
  const t = gt(isDark);
  const [h,setH] = useState(false);
  const [pressed,setPressed] = useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setH(false);setPressed(false);}}
      onMouseDown={()=>setPressed(true)} onMouseUp={()=>setPressed(false)}
      onTouchStart={()=>setPressed(true)} onTouchEnd={()=>setTimeout(()=>setPressed(false),200)}
      style={{
        background:isDark?t.btnBg:t.cardBg,border:`1px solid ${isDark?t.btnBorder:t.cardBorder}`,
        borderRadius:14,padding:"14px 14px 14px 16px",marginBottom:8,cursor:"pointer",
        position:"relative",overflow:"hidden",transition:"all 0.3s",
        transform: pressed ? "scale(0.98)" : h ? "translateY(-2px)" : "none",
        boxShadow: pressed ? t.btnActive : h ? t.btnHover : t.btnRest,
      }}>
      <div style={{position:"absolute",inset:0,background:t.cardSheen,pointerEvents:"none"}}/>
      <div style={{position:"absolute",left:0,top:10,bottom:10,width:0.75,background:cherry,borderRadius:"0 1px 1px 0",opacity:0.5}}/>
      <div style={{display:"flex",alignItems:"center",gap:10,position:"relative"}}>
        {num!=null && <div style={{width:22,height:22,borderRadius:"50%",background:`linear-gradient(135deg,${cherry},${cherryLt})`,color:"#fff",fontSize:10,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"inset 0 1px 0 rgba(255,255,255,0.15)"}}>{num}</div>}
        <div>
          <h3 style={{fontFamily:serif,fontSize:14,fontWeight:500,color:isDark?t.btnText:t.textMain,marginBottom:2}}>{title}</h3>
          <p style={{fontSize:10.5,color:t.textDim,lineHeight:1.4,margin:0,fontFamily:sans}}>{desc}</p>
        </div>
      </div>
    </div>
  );
};

const BamFloat = () => <div style={{position:"fixed",bottom:80,right:16,width:44,height:44,borderRadius:"50%",background:"#6DBFA8",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 14px rgba(109,191,168,0.25)",zIndex:35,border:"2.5px solid rgba(255,255,255,0.8)",animation:"bamFloat 3.5s ease-in-out infinite"}}><BirdIcon size={22} color="white" sw={1.6}/></div>;
const PageTitle = ({children,isDark}) => <div style={{textAlign:"center",padding:"20px 24px 16px"}}><h1 style={{fontFamily:serif,fontSize:26,fontWeight:700,color:isDark?"#FFFFFF":cherry,letterSpacing:5,margin:0}}>{children}</h1></div>;
const SectionHeader = ({children,isDark}) => <div style={{fontFamily:serif,fontSize:10,fontWeight:600,letterSpacing:2.8,textTransform:"uppercase",color:cherry,margin:"18px 0 10px 2px",opacity:isDark?0.8:1}}>{children}</div>;

const MobileHeader = ({onHome, isDark, onToggle, page}) => {
  const t = gt(isDark);
  return (
    <div style={{padding:"12px 20px 4px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:10}}>
      <a onClick={onHome} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",textDecoration:"none"}}>
        <TileIcon w={18} h={24} strokeColor={isDark?ceruleanLight:t.lavDeep}/>
        {page!=="home" && <span style={{fontFamily:serif,fontSize:11,fontWeight:400,letterSpacing:2.5,color:isDark?"#FFFFFF":cherry}}>MAHJI</span>}
      </a>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <ThemeToggle isDark={isDark} onToggle={onToggle}/>
        <div style={{width:30,height:30,borderRadius:"50%",background:t.lavHint,border:`1.5px solid ${t.lavender}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:isDark?t.lavender:t.lavDeep}}><UserIcon/></div>
      </div>
    </div>
  );
};

const MobileBottomNav = ({active, onNav, isDark}) => {
  const t = gt(isDark);
  const items = [{id:"home",label:"Home",Icon:HomeIcon},{id:"learn",label:"Learn",Icon:BookIcon},{id:"play",label:"Play",isPlay:true},{id:"practice",label:"Practice",Icon:ClockIcon},{id:"shop",label:"Shop",Icon:BagIcon}];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:t.navBg,backdropFilter:"blur(24px)",borderTop:`1px solid ${t.navBorderTop}`,padding:"8px 6px calc(env(safe-area-inset-bottom, 8px) + 8px)",display:"flex",justifyContent:"space-around",alignItems:"flex-end",zIndex:50}}>
      {items.map(it => {
        if (it.isPlay) return <div key="play" onClick={()=>onNav("play")} style={{display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer",marginTop:-18,minWidth:48}}><div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${cherry},${cherryLt})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 14px ${cherryGlow}, inset 0 1px 0 rgba(255,255,255,0.12)`,border:`3px solid ${isDark?"rgba(22,16,42,0.96)":"rgba(255,255,255,0.96)"}`,color:"white"}}><PlayIcon/></div><span style={{fontSize:9,fontFamily:sans,fontWeight:600,marginTop:3,letterSpacing:0.6,color:cherry}}>Play</span></div>;
        const isA = active === it.id;
        return <div key={it.id} onClick={()=>onNav(it.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"5px 8px 3px",borderRadius:10,minWidth:48,color:isA?t.navActive:t.navInactive,transition:"color 0.25s"}}><it.Icon/><span style={{fontSize:9,fontFamily:sans,fontWeight:isA?600:500,letterSpacing:0.6}}>{it.label}</span></div>;
      })}
    </div>
  );
};

// ═══ PAGES ═══
const HomePage = ({onNav, isDark, isNewUser}) => {
  const t = gt(isDark);
  return (<>
    {isDark && <div style={{position:"absolute",top:0,left:0,right:0,height:500,pointerEvents:"none",zIndex:0}}><div style={{position:"absolute",top:-30,right:-20,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle, rgba(142,199,226,0.04) 0%, transparent 70%)"}}/><div style={{position:"absolute",top:320,left:-40,width:150,height:150,borderRadius:"50%",background:"radial-gradient(circle, rgba(109,191,168,0.03) 0%, transparent 70%)"}}/></div>}
    <div style={{position:"absolute",inset:0,background:t.silk,pointerEvents:"none",zIndex:0}}/>
    <div style={{textAlign:"center",padding:"18px 24px 4px",position:"relative",zIndex:1}}>
      <div style={{fontFamily:serif,fontSize:12,fontWeight:400,letterSpacing:5.5,color:isDark?ceruleanLight:cherry,textTransform:"uppercase",marginBottom:5,opacity:isDark?0.5:0.6}}>Let's Play</div>
      <h1 style={{fontFamily:serif,fontSize:46,fontWeight:700,color:isDark?"#FFFFFF":cherry,letterSpacing:8,lineHeight:1,margin:"0 0 7px"}}>MAHJI</h1>
      <DecoLine isDark={isDark}/>
      {/* New user: show "Master the Tiles" tagline */}
      {isNewUser && (
        <p style={{fontSize:11,fontStyle:"italic",marginTop:2,fontFamily:sans,background:`linear-gradient(90deg, #C0B2D4, ${cerulean}, #6DBFA8, ${cherry}, #C0B2D4)`,backgroundSize:"200% 100%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",animation:"shimmer 3s ease-in-out infinite"}}>Master the Tiles</p>
      )}
    </div>
    <div style={{flex:1,padding:"0 18px",overflowY:"auto",paddingBottom:90,position:"relative",zIndex:1}}>
      {/* Returning user: show stats */}
      {!isNewUser && (
        <div style={{display:"flex",gap:8,marginBottom:14,justifyContent:"center"}}>
          <StatCard num="7d" label="Streak" isDark={isDark}/>
          <StatCard num="12" label="Games" isDark={isDark}/>
          <StatCard num="3" label="Wins" isDark={isDark}/>
        </div>
      )}
      <PlayNowBanner isDark={isDark} onClick={()=>onNav("play")}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <FeatureCard title="Learn" desc="Tiles, rules & strategy" icon={<BookIcon/>} isDark={isDark} onClick={()=>onNav("learn")}/>
        <FeatureCard title="Practice" desc="Drills & exercises" icon={<ClockIcon/>} isDark={isDark} onClick={()=>onNav("practice")}/>
        <FeatureCard title="Shop" desc="Tiles, sets & accessories" icon={<BagIcon/>} isDark={isDark} onClick={()=>onNav("shop")}/>
        <FeatureCard title="Ask Bam Bird" desc="Your AI Mahj mentor" isBird isDark={isDark} onClick={()=>onNav("bam")}/>
      </div>
      <div style={{textAlign:"center",marginTop:20,paddingBottom:8}}>
        <svg width="40" height="6" viewBox="0 0 40 6" fill="none" style={{display:"block",margin:"0 auto 8px"}}><line x1="2" y1="3" x2="38" y2="3" stroke={cherry} strokeWidth="1" strokeLinecap="round" opacity="0.3"/><circle cx="20" cy="3" r="1.5" fill={cherry} opacity="0.3"/></svg>
        <p style={{fontSize:9,color:t.textDim,opacity:0.5,margin:0,fontFamily:sans}}>© Mahji LLC</p>
      </div>
    </div>
  </>);
};

// ── TAG BADGE ──
const Tag = ({type, children, isDark}) => {
  const m = {
    b: { bg:isDark?"rgba(142,199,226,0.1)":"rgba(142,199,226,0.12)", c:isDark?ceruleanLight:"#4A96B8" },
    n: { bg:isDark?"rgba(168,152,190,0.1)":"rgba(168,152,190,0.12)", c:isDark?"#D4C8E8":"#7E64A4" },
    i: { bg:isDark?"rgba(176,141,58,0.1)":"rgba(176,141,58,0.1)", c:isDark?"#D4B85C":"#B08D3A" },
    a: { bg:isDark?"rgba(224,48,80,0.08)":"rgba(224,48,80,0.06)", c:isDark?"#F06078":cherry },
  };
  const s = m[type]||m.b;
  return <span style={{display:"inline-block",fontSize:7.5,fontWeight:600,letterSpacing:1,textTransform:"uppercase",padding:"2.5px 7px",borderRadius:6,marginRight:3,marginTop:5,background:s.bg,color:s.c,fontFamily:sans}}>{children}</span>;
};

// ── LESSON CARD (with tags) ──
const LessonCardFull = ({title,desc,num,tags,isDark}) => {
  const t = gt(isDark);
  const [h,setH]=useState(false);
  const [p,setP]=useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setH(false);setP(false);}}
      onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)}
      onTouchStart={()=>setP(true)} onTouchEnd={()=>setP(false)}
      style={{background:isDark?t.btnBg:t.cardBg,border:`1px solid ${isDark?t.btnBorder:t.cardBorder}`,borderRadius:14,padding:"14px 14px 14px 16px",marginBottom:8,cursor:"pointer",position:"relative",overflow:"hidden",transition:"all 0.3s",transform:p?"scale(0.98)":h?"translateY(-2px)":"none",boxShadow:p?t.btnActive:h?t.btnHover:t.btnRest}}>
      <div style={{position:"absolute",inset:0,background:t.cardSheen,pointerEvents:"none"}}/>
      <div style={{position:"absolute",left:0,top:10,bottom:10,width:0.75,background:cherry,borderRadius:"0 1px 1px 0",opacity:0.5}}/>
      <div style={{display:"flex",alignItems:"center",gap:10,position:"relative"}}>
        {num!=null&&<div style={{width:22,height:22,borderRadius:"50%",background:`linear-gradient(135deg,${cherry},${cherryLt})`,color:"#fff",fontSize:10,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"inset 0 1px 0 rgba(255,255,255,0.15)"}}>{num}</div>}
        <div>
          <h3 style={{fontFamily:serif,fontSize:14,fontWeight:500,color:isDark?t.btnText:t.textMain,marginBottom:2}}>{title}</h3>
          <p style={{fontSize:10.5,color:t.textDim,lineHeight:1.4,margin:0,fontFamily:sans}}>{desc}</p>
          {tags&&<div>{tags.map((tg,i)=><Tag key={i} type={tg.t} isDark={isDark}>{tg.l}</Tag>)}</div>}
        </div>
      </div>
    </div>
  );
};

// ── LEVEL FILTER PILLS ──
const LevelFilter = ({levels,active,onSelect,isDark}) => {
  const t = gt(isDark);
  return (
    <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"nowrap",overflowX:"auto"}}>
      {levels.map(lv=>(
        <div key={lv} onClick={()=>onSelect(lv)} style={{
          padding:"6px 12px",borderRadius:20,fontSize:11,fontFamily:sans,
          fontWeight:active===lv?600:400,cursor:"pointer",
          background:active===lv?"#6DBFA8":(isDark?t.btnBg:"transparent"),
          color:active===lv?"#fff":t.textMid,
          border:active===lv?"none":`1px solid ${isDark?t.btnBorder:t.cardBorder}`,
          boxShadow:isDark&&active!==lv?t.btnRest:"none",
          transition:"all 0.3s",whiteSpace:"nowrap",flexShrink:0,
        }}>{lv==="All"?"See All":lv}</div>
      ))}
    </div>
  );
};

// ── LEARN DATA ──
const learnData = [
  {s:"Getting Started",items:[
    {t:"What is American Mahjong",d:"The tiles, the card, and the goal",lvl:"First Timer"},
    {t:"Meet the Tiles",d:"Dots, Bams, Craks, Honors, Flowers & Jokers",lvl:"First Timer"},
    {t:"Reading the NMJL Card",d:"Decoding patterns, symbols & hand values",lvl:"First Timer"},
  ]},
  {s:"Setup & Flow",items:[
    {t:"Setting Up & Dealing",d:"Building the wall, breaking, and dealing tiles",lvl:"Novice"},
    {t:"Gameplay: Turns, Calls & Exposures",d:"Draw, discard, calling tiles, and Mahjong",lvl:"Novice"},
  ]},
  {s:"Strategy",items:[
    {t:"Hand Selection & Commitment",d:"Narrowing sections, locking in, and pivoting",lvl:"Intermediate"},
    {t:"Maximizing the Charleston",d:"R-O-L passing, blind passes & tile strategy",lvl:"Intermediate"},
    {t:"Reading Opponents & Defense",d:"Exposure analysis, hand reading & dogging",lvl:"Advanced"},
    {t:"Scoring & Payment Systems",d:"NMJL scoring, self-picks, jokerless bonuses",lvl:"Advanced"},
  ]},
  {s:"Etiquette",items:[
    {t:"Player Alignment",d:"Seating, wind positions, and rotation",lvl:"First Timer"},
    {t:"Pace of Play",d:"Keeping the game moving without rushing",lvl:"Novice"},
    {t:"Tile Handling",d:"Proper picking, racking, and discarding",lvl:"First Timer"},
    {t:"Courtesy at the Table",d:"Sportsmanship, calling etiquette, and table talk",lvl:"Novice"},
  ]},
];
const learnLevels = ["All","First Timer","Novice","Intermediate","Advanced"];
const lvlTag = {"First Timer":"b",Novice:"n",Beginner:"b",Intermediate:"i",Advanced:"a"};

// ── PRACTICE DATA ──
const drillsData = [
  {t:"Learn the Hands",d:"Match tiles to NMJL card patterns",lvls:["Novice"]},
  {t:"How to Deal",d:"Roll dice, break the wall, deal correctly",lvls:["Novice"]},
  {t:"Practicing the Charleston",d:"Master R-O-L-★-L-O-R and blind passes",lvls:["Novice","Intermediate","Advanced"]},
  {t:"Reading Exposures",d:"Narrow down opponent hands from melds",lvls:["Intermediate","Advanced"]},
  {t:"Playing Defense",d:"Choose the safest discard, stop feeding",lvls:["Advanced"]},
];
const practiceLevels = ["All","Novice","Intermediate","Advanced"];

// ── LEARN PAGE ──
const LearnPage = ({isDark}) => {
  const [level,setLevel] = useState("All");
  const filtered = level==="All" ? learnData : learnData.map(sec=>({...sec,items:sec.items.filter(it=>it.lvl===level)})).filter(sec=>sec.items.length>0);
  let num = 0;
  return (<>
    <PageTitle isDark={isDark}>Learn</PageTitle>
    <div style={{flex:1,padding:"0 18px",overflowY:"auto",paddingBottom:90}}>
      <LevelFilter levels={learnLevels} active={level} onSelect={setLevel} isDark={isDark}/>
      {filtered.map(sec=>(
        <div key={sec.s}>
          <SectionHeader isDark={isDark}>{sec.s}</SectionHeader>
          {sec.items.map(it=>{num++;return <LessonCardFull key={it.t} title={it.t} desc={it.d} num={num} tags={[{t:lvlTag[it.lvl]||"b",l:it.lvl}]} isDark={isDark}/>;
          })}
        </div>
      ))}
      {filtered.length===0&&<div style={{textAlign:"center",padding:30,color:gt(isDark).textDim,fontSize:12,fontFamily:sans}}>No lessons at this level yet</div>}
    </div>
    <BamFloat/>
  </>);
};

// ── PRACTICE PAGE ──
const PracticePage = ({isDark}) => {
  const [level,setLevel] = useState("All");
  const filtered = level==="All" ? drillsData : drillsData.filter(d=>d.lvls.includes(level));
  let num = 0;
  return (<>
    <PageTitle isDark={isDark}>Practice</PageTitle>
    <div style={{flex:1,padding:"0 18px",overflowY:"auto",paddingBottom:90}}>
      <LevelFilter levels={practiceLevels} active={level} onSelect={setLevel} isDark={isDark}/>
      <SectionHeader isDark={isDark}>Drills</SectionHeader>
      {filtered.map(d=>{num++;return <LessonCardFull key={d.t} title={d.t} desc={d.d} num={num} tags={d.lvls.map(l=>({t:lvlTag[l]||"b",l}))} isDark={isDark}/>;
      })}
      {filtered.length===0&&<div style={{textAlign:"center",padding:30,color:gt(isDark).textDim,fontSize:12,fontFamily:sans}}>No drills at this level yet</div>}
    </div>
    <BamFloat/>
  </>);
};

const ShopCard = ({cat, isDark}) => {
  const t = gt(isDark);
  const [h,setH] = useState(false);
  const [pressed,setPressed] = useState(false);
  // Per-category colored hover glow in dark mode
  const hoverGlow = isDark ? cat.darkGlow : t.cardHover;
  const activeGlow = isDark ? cat.darkGlow.replace("0.12","0.18").replace("0.15","0.22") : t.cardActive;
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setH(false);setPressed(false);}}
      onMouseDown={()=>setPressed(true)} onMouseUp={()=>setPressed(false)}
      onTouchStart={()=>setPressed(true)} onTouchEnd={()=>setTimeout(()=>setPressed(false),200)}
      style={{background:isDark?t.btnBg:t.cardBg,border:`1px solid ${isDark?t.btnBorder:t.cardBorder}`,borderRadius:14,overflow:"hidden",marginBottom:10,cursor:"pointer",transition:"all 0.3s",position:"relative",transform:pressed?"scale(0.98)":h?"translateY(-2px)":"none",boxShadow:pressed?activeGlow:h?hoverGlow:t.btnRest}}>
      <div style={{position:"absolute",inset:0,background:t.cardSheen,pointerEvents:"none"}}/>
      <div style={{height:cat.hasTilePreview?"auto":90,minHeight:cat.hasTilePreview?80:90,background:cat.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {cat.hasTilePreview ? (
          <div style={{padding:"12px 8px",display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center"}}>
            {["🀄","🀅","🀆","🀇","🀈","🀉","🀊","🀋"].map((t,i)=>(
              <div key={i} style={{width:28,height:38,borderRadius:4,background:isDark?"rgba(255,255,255,0.06)":"#fff",border:`1px solid ${isDark?"rgba(192,178,212,0.12)":"#C2413B"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>{t}</div>
            ))}
          </div>
        ) : (
          <div style={{fontFamily:serif,fontSize:16,color:isDark?"rgba(255,255,255,0.15)":`${cherry}44`,fontWeight:500}}>[ preview ]</div>
        )}
      </div>
      <div style={{padding:"12px 16px",position:"relative"}}><h3 style={{fontFamily:serif,fontSize:15,fontWeight:500,color:isDark?t.btnText:t.textMain,marginBottom:2}}>{cat.title}</h3><p style={{fontSize:10.5,color:t.textDim,margin:0,fontFamily:sans}}>{cat.sub}</p></div>
    </div>
  );
};
const ShopPage = ({isDark}) => {
  const t = gt(isDark);
  const cats = [
    {title:"Game Cards",sub:"Official NMJL playing cards",bg:isDark?"rgba(255,255,255,0.03)":"linear-gradient(135deg,#FDF8F4,#F8F0E8)",darkGlow:"0 8px 28px rgba(253,248,244,0.08), 0 0 0 1px rgba(248,240,232,0.12), 0 0 20px rgba(253,248,244,0.04)"},
    {title:"The Mahji Set",sub:"152 hand-designed tiles",bg:isDark?"rgba(255,255,255,0.03)":"linear-gradient(135deg,#F3EFF8,#ECE7F3)",hasTilePreview:true,darkGlow:"0 8px 28px rgba(192,178,212,0.1), 0 0 0 1px rgba(192,178,212,0.14), 0 0 20px rgba(192,178,212,0.05)"},
    {title:"Table Accessories",sub:"Mats, racks, shufflers & more",bg:isDark?"rgba(255,255,255,0.03)":"linear-gradient(135deg,#F0F8F5,#E0F0EB)",darkGlow:"0 8px 28px rgba(109,191,168,0.1), 0 0 0 1px rgba(109,191,168,0.14), 0 0 20px rgba(109,191,168,0.05)"},
    {title:"The Salon",sub:"Lifestyle treats for the modern mahj enthusiast",bg:isDark?"rgba(255,255,255,0.03)":"linear-gradient(135deg,#FAF4F5,#F5ECED)",darkGlow:"0 8px 28px rgba(224,48,80,0.08), 0 0 0 1px rgba(224,48,80,0.1), 0 0 20px rgba(224,48,80,0.04)"},
  ];
  return (<><PageTitle isDark={isDark}>Shop</PageTitle><div style={{flex:1,padding:"0 18px",overflowY:"auto",paddingBottom:90}}>
    <p style={{fontSize:12,fontStyle:"italic",marginTop:2,fontFamily:sans,textAlign:"center",marginBottom:14,background:`linear-gradient(90deg, #C0B2D4, ${cerulean}, #6DBFA8, ${cherry}, #C0B2D4)`,backgroundSize:"200% 100%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",animation:"shimmer 3s ease-in-out infinite"}}>Curated essentials for the modern Mahj player.</p>
    {cats.map(c=><ShopCard key={c.title} cat={c} isDark={isDark}/>)}
  </div><BamFloat/></>);
};

const PlayPage = ({isDark}) => {
  const t = gt(isDark);
  return (<><PageTitle isDark={isDark}>Play</PageTitle><div style={{flex:1,padding:"0 18px",overflowY:"auto",paddingBottom:90}}>
    <div style={{display:"flex",gap:5,marginBottom:14}}>{["Novice","Intermediate","Advanced"].map((d,i)=><div key={d} style={{padding:"6px 14px",borderRadius:18,fontSize:11,fontFamily:sans,fontWeight:i===1?600:400,cursor:"pointer",background:i===1?"#6DBFA8":(isDark?t.btnBg:"transparent"),color:i===1?"#fff":t.textMid,border:i===1?"none":`1px solid ${t.cardBorder}`,boxShadow:isDark&&i!==1?t.btnRest:"none"}}>{d}</div>)}</div>
    <SectionHeader isDark={isDark} style={{marginTop:4}}>Select Card</SectionHeader>
    <div style={{display:"flex",gap:8,marginBottom:14}}>
      {[{id:"2025",name:"NMJL 2025",sub:"Current year"},{id:"2024",name:"NMJL 2024",sub:"Last year"},{id:"big",name:"Big Card",sub:"Mahjong Line"}].map((c,i)=>(
        <div key={c.id} style={{flex:1,textAlign:"center",padding:"12px 6px",background:isDark?t.btnBg:t.cardBg,border:`${i===0?"1.5px":"1px"} solid ${i===0?"#6DBFA8":(isDark?t.btnBorder:t.cardBorder)}`,borderRadius:14,cursor:"pointer",boxShadow:isDark?t.btnRest:"none"}}>
          <h4 style={{fontFamily:serif,fontSize:12,fontWeight:500,color:i===0?(isDark?"#85D4BC":"#4A9E88"):(isDark?t.btnText:t.textMain),marginBottom:1}}>{c.name}</h4>
          <p style={{fontSize:8.5,color:t.textDim,margin:0,fontFamily:sans}}>{c.sub}</p>
        </div>
      ))}
    </div>
    <SectionHeader isDark={isDark}>Select Your Game Mat</SectionHeader>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
      {[{n:"Coffee",gr:"linear-gradient(145deg,#4A3D32,#3A2E24)"},{n:"Seafoam",gr:"linear-gradient(145deg,#B5D9CE,#9ECABD)"},{n:"Lavender",gr:"linear-gradient(145deg,#D5CCE2,#C4B8D6)"},{n:"Cerulean",gr:"linear-gradient(145deg,#CADEE9,#B8D2E0)"}].map((m,i)=><div key={m.n} style={{textAlign:"center"}}><div style={{width:42,height:42,borderRadius:10,background:m.gr,cursor:"pointer",border:i===0?`2px solid ${cherry}`:"2px solid transparent",boxShadow:i===0?`0 2px 10px ${cherryGlow}`:"none"}}/><div style={{fontSize:7,color:t.textDim,marginTop:3,letterSpacing:.5,fontFamily:sans}}>{m.n}</div></div>)}
      <button style={{padding:"10px 16px",border:"none",borderRadius:12,fontFamily:serif,fontSize:13,fontWeight:600,letterSpacing:1,color:"#fff",cursor:"pointer",background:`linear-gradient(135deg,${cherry},${cherryLt})`,boxShadow:`0 4px 14px ${cherryGlow}`,display:"flex",alignItems:"center",gap:6,flexShrink:0,marginLeft:"auto"}}>Start ▶</button>
    </div>
    <div style={{background:"linear-gradient(145deg,#4A3D32,#3E3228,#352A20)",borderRadius:16,padding:18,minHeight:200,border:"1px solid rgba(60,48,35,0.15)",boxShadow:"inset 0 2px 10px rgba(0,0,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:11,color:"rgba(158,202,189,0.35)",letterSpacing:1,fontStyle:"italic",fontFamily:sans}}>Game board preview</span></div>
  </div></>);
};

// ═══ MAIN ═══
export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [page, setPage] = useState("home");
  const [showIntro, setShowIntro] = useState(true);
  const [appVisible, setAppVisible] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true);

  const handleIntroDone = useCallback(() => {
    setAppVisible(true);
    setTimeout(() => setShowIntro(false), 800);
  }, []);

  const replayIntro = () => { setAppVisible(false); setTimeout(()=>setShowIntro(true),100); };
  const t = gt(isDark);

  return (<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:${sans};-webkit-font-smoothing:antialiased;overflow:hidden}
      *::-webkit-scrollbar{display:none} *{scrollbar-width:none} svg{display:block}
      @keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @keyframes bamFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
    `}</style>

    {showIntro && <IntroAnimation onDone={handleIntroDone}/>}

    <div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden",background:t.appBg,fontFamily:sans,opacity:appVisible?1:0,transition:"opacity 0.5s ease"}}>
      <div style={{position:"absolute",inset:0,background:t.silk,pointerEvents:"none",zIndex:0}}/>
      <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
        <MobileHeader onHome={()=>setPage("home")} isDark={isDark} onToggle={()=>setIsDark(d=>!d)} page={page}/>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
          {page==="home" && <HomePage onNav={setPage} isDark={isDark} isNewUser={isNewUser}/>}
          {page==="learn" && <LearnPage isDark={isDark}/>}
          {page==="practice" && <PracticePage isDark={isDark}/>}
          {page==="play" && <PlayPage isDark={isDark}/>}
          {page==="shop" && <ShopPage isDark={isDark}/>}
        </div>
        <MobileBottomNav active={page} onNav={setPage} isDark={isDark}/>
      </div>
      {/* Controls */}
      <div style={{position:"fixed",top:12,left:12,zIndex:100,display:"flex",gap:6}}>
        <button onClick={replayIntro} style={{background:isDark?"rgba(168,216,238,0.08)":"rgba(126,100,164,0.06)",border:`1px solid ${isDark?"rgba(168,216,238,0.12)":"rgba(126,100,164,0.1)"}`,borderRadius:8,padding:"5px 10px",cursor:"pointer",fontFamily:sans,fontSize:9,letterSpacing:1.5,textTransform:"uppercase",color:isDark?"rgba(168,216,238,0.5)":"rgba(126,100,164,0.5)"}}>▶ Intro</button>
        <button onClick={()=>setIsNewUser(u=>!u)} style={{background:isDark?"rgba(168,216,238,0.08)":"rgba(126,100,164,0.06)",border:`1px solid ${isDark?"rgba(168,216,238,0.12)":"rgba(126,100,164,0.1)"}`,borderRadius:8,padding:"5px 10px",cursor:"pointer",fontFamily:sans,fontSize:9,letterSpacing:1.5,textTransform:"uppercase",color:isDark?"rgba(168,216,238,0.5)":"rgba(126,100,164,0.5)"}}>{isNewUser ? "👤 New User" : "⭐ Returning"}</button>
      </div>
    </div>
  </>);
}
