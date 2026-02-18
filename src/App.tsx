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


// ── INLINE TILE SYSTEM (Original SVG artwork) ──
const DOT_COLORS = ['#B8A9C9','#89B4D4','#7FBFB3','#C2413B','#D4A0B0'];
const DOT_LAYOUTS = {1:[[0,0]],2:[[-14,0],[14,0]],3:[[-14,-12],[14,-12],[0,12]],4:[[-14,-14],[14,-14],[-14,14],[14,14]],5:[[-15,-14],[15,-14],[0,0],[-15,14],[15,14]],6:[[-15,-18],[15,-18],[-15,0],[15,0],[-15,18],[15,18]],7:[[-15,-18],[15,-18],[-15,0],[15,0],[-15,18],[15,18],[0,0]],8:[[-15,-18],[0,-18],[15,-18],[-10,-1],[10,-1],[-15,18],[0,18],[15,18]],9:[[-16,-19],[0,-19],[16,-19],[-16,0],[0,0],[16,0],[-16,19],[0,19],[16,19]]};
const BAM_COLS = ['#7FBFB3','#89B4D4','#B8A9C9','#8B7355'];
const BAM_DARK = ['#5A9E93','#6A9AB8','#9484A8','#6B5540'];
const CHINESE_N = ["\u4E00","\u4E8C","\u4E09","\u56DB","\u4E94","\u516D","\u4E03","\u516B","\u4E5D"];
const WIND_CFG = {E:{c:"#4A7FA8",cc:"#89B4D4",l:"EAST"},S:{c:"#C2413B",cc:"#C2413B",l:"SOUTH"},W:{c:"#4A8E80",cc:"#7FBFB3",l:"WEST"},N:{c:"#5B3A8C",cc:"#C8B8E0",l:"NORTH"}};
const SOAP_COLORS = ['#B8A9C9','#89B4D4','#7FBFB3','#D4A0B0','#C2413B'];
const F_COLS = [{p:'#B8A9C9',s:'#D4A0B0',c:'#C4A96A'},{p:'#89B4D4',s:'#A8D0E4',c:'#C2413B'},{p:'#7FBFB3',s:'#A8D9CF',c:'#B8A9C9'},{p:'#D4A0B0',s:'#E8C0CC',c:'#7FBFB3'},{p:'#C2413B',s:'#D87070',c:'#C4A96A'},{p:'#8B7355',s:'#A89070',c:'#C2413B'},{p:'#89B4D4',s:'#B8A9C9',c:'#7FBFB3'},{p:'#7FBFB3',s:'#C2413B',c:'#B8A9C9'}];
const STAR_COLS = [{star:'#B8A9C9',trail:'#D4A0B0'},{star:'#89B4D4',trail:'#7FBFB3'},{star:'#C2413B',trail:'#C4A96A'},{star:'#7FBFB3',trail:'#89B4D4'},{star:'#D4A0B0',trail:'#B8A9C9'},{star:'#C4A96A',trail:'#C2413B'},{star:'#89B4D4',trail:'#B8A9C9'},{star:'#C2413B',trail:'#D4A0B0'}];

const TileShell = ({ children, big, onClick }) => {
  const w = big ? 80 : 48, h = big ? 108 : 65;
  return (
    <div onClick={onClick} style={{ width:w, height:h, background:"#fff", borderRadius: big?10:7, border:"1px solid #C2413B", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", flexShrink:0, boxShadow:"0 1px 4px rgba(0,0,0,0.08)", cursor: onClick?"pointer":"default", transition:"all 0.3s ease" }}>
      {children}
    </div>
  );
};

// ── DOTS (Original: viewBox -36 -36 72 72) ──
const MiniDot = ({ n, big }) => {
  const layout = DOT_LAYOUTS[n];
  const r = n===1 ? 18 : (n<=4 ? 11 : (n<=6 ? 9 : 7.5));
  const sw = big ? 54 : 36, sh = big ? 54 : 36;
  return <TileShell big={big}>
    <span style={{ fontFamily:"'Bodoni Moda',serif", fontSize:big?11:7, fontWeight:700, color:"#4A3660", position:"absolute", top:big?3:1, right:big?6:3, zIndex:1 }}>{n}</span>
    <svg viewBox="-36 -36 72 72" width={sw} height={sh}>
      {layout.map(([x,y],i) => { const col=DOT_COLORS[i%5]; return (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={`${col}22`} stroke={col} strokeWidth={n===1?2.5:1.6}/>
          <circle cx={x} cy={y} r={r*0.6} fill="none" stroke={col} strokeWidth={0.7} opacity={0.45}/>
          <circle cx={x} cy={y} r={r*0.3} fill={col}/>
        </g>
      ); })}
    </svg>
  </TileShell>;
};

// ── BAMS (Original: viewBox 0 0 68 96) ──
const BamBirdSvg = ({ w, h }) => (
  <svg viewBox="0 0 68 96" width={w} height={h}>
    <rect x="30" y="48" width="7" height="46" rx="3.5" fill="#7FBFB3"/>
    <rect x="28" y="58" width="11" height="3" rx="1.5" fill="#5A9E93"/>
    <rect x="28" y="70" width="11" height="3" rx="1.5" fill="#5A9E93"/>
    <rect x="28" y="82" width="11" height="3" rx="1.5" fill="#5A9E93"/>
    <ellipse cx="23" cy="52" rx="9" ry="3" transform="rotate(-25 23 52)" fill="#7FBFB3" opacity="0.5"/>
    <ellipse cx="45" cy="56" rx="8" ry="2.5" transform="rotate(20 45 56)" fill="#89B4D4" opacity="0.4"/>
    <path d="M14 34 Q6 22 4 14 Q8 20 16 30" fill="#B8A9C9" opacity="0.8"/>
    <path d="M16 32 Q10 18 10 10 Q14 18 18 28" fill="#7FBFB3" opacity="0.7"/>
    <path d="M18 31 Q14 16 16 8 Q18 16 20 27" fill="#89B4D4" opacity="0.75"/>
    <path d="M20 30 Q19 14 22 8 Q22 16 22 26" fill="#D4A0B0" opacity="0.6"/>
    <ellipse cx="34" cy="32" rx="15" ry="12" fill="#89B4D4"/>
    <ellipse cx="34" cy="35" rx="12" ry="8" fill="#A8D0E4"/>
    <path d="M22 28 Q16 20 20 14 Q24 22 30 26 Z" fill="#6D9ABB"/>
    <path d="M24 30 Q20 24 22 18 Q26 24 30 28 Z" fill="#5A8FAD" opacity="0.6"/>
    <circle cx="46" cy="22" r="8.5" fill="#89B4D4"/>
    <circle cx="46" cy="22" r="7.5" fill="#78C4B0"/>
    <circle cx="49" cy="20" r="3" fill="white"/>
    <circle cx="49" cy="20" r="2" fill="#333"/>
    <circle cx="49.5" cy="19.5" r="0.7" fill="white"/>
    <path d="M53 22 L60 20.5 L53 24 Z" fill="#C4A96A"/>
    <path d="M43 14 Q45 7 47 14" fill="none" stroke="#C2413B" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="45" cy="8" r="1.2" fill="#C2413B"/>
    <path d="M30 44 L27 47 M30 44 L26 44" stroke="#8B7355" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M37 44 L40 47 M37 44 L41 44" stroke="#8B7355" strokeWidth="1.2" strokeLinecap="round"/>
    <ellipse cx="36" cy="38" rx="6" ry="3.5" fill="#B8D8EB" opacity="0.4"/>
  </svg>
);

const BamStalksSvg = ({ count, w, h }) => {
  const vw = 68, vh = 96;
  const els = [];
  if (count <= 4) {
    const stW = 7, stH = 65, totalW = count*stW+(count-1)*6, startX = (vw-totalW)/2, startY = vh-stH-4;
    for (let i=0;i<count;i++) { const x=startX+i*(stW+6), col=BAM_COLS[i%4], dark=BAM_DARK[i%4];
      els.push(<rect key={`s${i}`} x={x} y={startY} width={stW} height={stH} rx={stW/2} fill={col}/>);
      [0.25,0.5,0.75].forEach((p,j) => { els.push(<rect key={`n${i}-${j}`} x={x-2} y={startY+stH*p} width={stW+4} height={3} rx={1.5} fill={dark}/>); });
      els.push(<ellipse key={`l${i}`} cx={x+stW+5} cy={startY+5} rx={6} ry={2.2} fill={col} opacity={0.5} transform={`rotate(15 ${x+stW+5} ${startY+5})`}/>);
    }
  } else {
    const botCount=Math.ceil(count/2), topCount=count-botCount, stW=6, stH=38;
    const botTotalW=botCount*stW+(botCount-1)*5, botStartX=(vw-botTotalW)/2, botY=vh-stH-4;
    for (let i=0;i<botCount;i++) { const x=botStartX+i*(stW+5), ci=(i+topCount)%4, col=BAM_COLS[ci], dark=BAM_DARK[ci];
      els.push(<rect key={`bs${i}`} x={x} y={botY} width={stW} height={stH} rx={stW/2} fill={col}/>);
      [0.3,0.6].forEach((p,j) => { els.push(<rect key={`bn${i}-${j}`} x={x-1.5} y={botY+stH*p} width={stW+3} height={2.5} rx={1} fill={dark}/>); });
      els.push(<ellipse key={`bl${i}`} cx={x+stW+4} cy={botY+3} rx={5} ry={2} fill={col} opacity={0.45} transform={`rotate(12 ${x+stW+4} ${botY+3})`}/>);
    }
    const topTotalW=topCount*stW+(topCount-1)*5, topStartX=(vw-topTotalW)/2, topY=botY-stH-6;
    for (let i=0;i<topCount;i++) { const x=topStartX+i*(stW+5), col=BAM_COLS[i%4], dark=BAM_DARK[i%4];
      els.push(<rect key={`ts${i}`} x={x} y={topY} width={stW} height={stH} rx={stW/2} fill={col}/>);
      [0.3,0.6].forEach((p,j) => { els.push(<rect key={`tn${i}-${j}`} x={x-1.5} y={topY+stH*p} width={stW+3} height={2.5} rx={1} fill={dark}/>); });
      els.push(<ellipse key={`tl${i}`} cx={x+stW+4} cy={topY+3} rx={5} ry={2} fill={col} opacity={0.45} transform={`rotate(12 ${x+stW+4} ${topY+3})`}/>);
    }
  }
  return <svg viewBox={`0 0 ${vw} ${vh}`} width={w} height={h}>{els}</svg>;
};

const MiniBam = ({ n, big }) => {
  const sw = big ? 54 : 34, sh = big ? 76 : 48;
  return <TileShell big={big}>
    <span style={{ fontFamily:"'Bodoni Moda',serif", fontSize:big?11:7, fontWeight:700, color:"#2E8B57", position:"absolute", top:big?3:1, right:big?6:3, zIndex:1 }}>{n}</span>
    {n === 1 ? <BamBirdSvg w={sw} h={sh}/> : <BamStalksSvg count={n} w={sw} h={sh}/>}
  </TileShell>;
};

// ── CRAKS (Original: viewBox 0 0 70 80) ──
const MiniCrak = ({ n, big }) => {
  const sw = big ? 52 : 34, sh = big ? 60 : 40;
  return <TileShell big={big}>
    <span style={{ fontFamily:"'Bodoni Moda',serif", fontSize:big?11:7, fontWeight:700, color:"#C2413B", position:"absolute", top:big?3:1, right:big?6:3, zIndex:1 }}>{n}</span>
    <svg viewBox="0 0 70 80" width={sw} height={sh}>
      <text x="35" y="58" textAnchor="middle" fontFamily="'Noto Sans SC','SimSun',sans-serif" fontSize="56" fontWeight="500" fill="#C2413B">{CHINESE_N[n-1]}</text>
    </svg>
  </TileShell>;
};

// ── WINDS (Original: viewBox 0 0 80 80) ──
const MiniWind = ({ d, big }) => {
  const cfg = WIND_CFG[d];
  return <TileShell big={big}>
    <svg viewBox="0 0 80 80" width={big?50:30} height={big?50:30} style={{ position:"absolute", opacity:.2, pointerEvents:"none" }}>
      <polygon points="40,2 44,30 40,24 36,30" fill={cfg.cc}/>
      <polygon points="40,78 44,50 40,56 36,50" fill={cfg.cc}/>
      <polygon points="2,40 30,36 24,40 30,44" fill={cfg.cc}/>
      <polygon points="78,40 50,36 56,40 50,44" fill={cfg.cc}/>
      <polygon points="12,12 32,30 26,28 30,32" fill={cfg.cc} opacity="0.7"/>
      <polygon points="68,12 48,30 54,28 50,32" fill={cfg.cc} opacity="0.7"/>
      <polygon points="12,68 32,50 26,52 30,48" fill={cfg.cc} opacity="0.7"/>
      <polygon points="68,68 48,50 54,52 50,48" fill={cfg.cc} opacity="0.7"/>
      <circle cx="40" cy="40" r="8" fill={cfg.cc} opacity="0.4"/>
      <circle cx="40" cy="40" r="4" fill={cfg.cc} opacity="0.6"/>
    </svg>
    <span style={{ fontFamily:"'Bodoni Moda',serif", fontSize:big?36:20, fontWeight:700, color:cfg.c, lineHeight:1, position:"relative", zIndex:1 }}>{d}</span>
    <span style={{ fontFamily:"'Bodoni Moda',serif", fontSize:big?8:5, letterSpacing:2, fontWeight:600, color:cfg.c, position:"relative", zIndex:1 }}>{cfg.l}</span>
  </TileShell>;
};

// ── DRAGONS (Original: viewBox 0 0 70 100) ──
const MiniDragon = ({ type, big }) => {
  const sw = big ? 52 : 32, sh = big ? 74 : 46;
  if (type==="red") {
    const dots = [[42,16],[50,24],[46,32],[36,38],[26,44],[20,52],[18,60],[22,68],[30,74],[34,80]];
    return <TileShell big={big}><svg viewBox="0 0 70 100" width={sw} height={sh}>
      <path d="M35 12 C50 12 55 22 50 32 C45 42 25 42 20 52 C15 62 20 72 30 76 C35 78 38 80 35 88" fill="none" stroke="#C2413B" strokeWidth="7" strokeLinecap="round"/>
      <path d="M35 12 C50 12 55 22 50 32 C45 42 25 42 20 52 C15 62 20 72 30 76 C35 78 38 80 35 88" fill="none" stroke="#D87070" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
      {dots.map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="1.2" fill="white" opacity="0.6"/>)}
      <ellipse cx="35" cy="10" rx="6" ry="5" fill="#C2413B"/>
      <circle cx="33" cy="8.5" r="1.4" fill="white"/><circle cx="33" cy="8.5" r="0.7" fill="#333"/>
      <line x1="35" y1="5" x2="33" y2="1" stroke="#C2413B" strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="35" y1="5" x2="37" y2="1" stroke="#C2413B" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M35 88 Q32 94 30 96" fill="none" stroke="#C2413B" strokeWidth="3" strokeLinecap="round"/>
    </svg></TileShell>;
  }
  if (type==="green") {
    const dots = [[28,16],[20,24],[22,32],[32,38],[42,44],[50,52],[52,60],[48,68],[40,74],[36,80]];
    return <TileShell big={big}><svg viewBox="0 0 70 100" width={sw} height={sh}>
      <path d="M35 12 C20 12 15 22 20 32 C25 42 45 42 50 52 C55 62 50 72 40 76 C35 78 32 80 35 88" fill="none" stroke="#2E8B57" strokeWidth="7" strokeLinecap="round"/>
      <path d="M35 12 C20 12 15 22 20 32 C25 42 45 42 50 52 C55 62 50 72 40 76 C35 78 32 80 35 88" fill="none" stroke="#5ABF7F" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
      {dots.map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="1.2" fill="white" opacity="0.6"/>)}
      <ellipse cx="35" cy="10" rx="6" ry="5" fill="#2E8B57"/>
      <circle cx="37" cy="8.5" r="1.4" fill="white"/><circle cx="37" cy="8.5" r="0.7" fill="#333"/>
      <line x1="35" y1="5" x2="33" y2="1" stroke="#2E8B57" strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="35" y1="5" x2="37" y2="1" stroke="#2E8B57" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M35 88 Q38 94 40 96" fill="none" stroke="#2E8B57" strokeWidth="3" strokeLinecap="round"/>
    </svg></TileShell>;
  }
  // Soap
  const els = [];
  for (let i=0;i<6;i++) { const x=10+i*10, c=SOAP_COLORS[i%5]; els.push(<g key={`t${i}`}><circle cx={x} cy="8" r="3.2" fill={`${c}22`} stroke={c} strokeWidth="1"/><circle cx={x} cy="8" r="1.5" fill={c} opacity="0.6"/><circle cx={x} cy="8" r="4.5" fill="none" stroke={c} strokeWidth="0.4" strokeDasharray="1.5 1.5" opacity="0.5"/></g>); }
  for (let i=0;i<6;i++) { const x=10+i*10, c=SOAP_COLORS[(i+2)%5]; els.push(<g key={`b${i}`}><circle cx={x} cy="92" r="3.2" fill={`${c}22`} stroke={c} strokeWidth="1"/><circle cx={x} cy="92" r="1.5" fill={c} opacity="0.6"/><circle cx={x} cy="92" r="4.5" fill="none" stroke={c} strokeWidth="0.4" strokeDasharray="1.5 1.5" opacity="0.5"/></g>); }
  for (let i=0;i<6;i++) { const y=18+i*13, c=SOAP_COLORS[(i+1)%5]; els.push(<g key={`l${i}`}><circle cx="8" cy={y} r="3.2" fill={`${c}22`} stroke={c} strokeWidth="1"/><circle cx="8" cy={y} r="1.5" fill={c} opacity="0.6"/><circle cx="8" cy={y} r="4.5" fill="none" stroke={c} strokeWidth="0.4" strokeDasharray="1.5 1.5" opacity="0.5"/></g>); }
  for (let i=0;i<6;i++) { const y=18+i*13, c=SOAP_COLORS[(i+3)%5]; els.push(<g key={`r${i}`}><circle cx="62" cy={y} r="3.2" fill={`${c}22`} stroke={c} strokeWidth="1"/><circle cx="62" cy={y} r="1.5" fill={c} opacity="0.6"/><circle cx="62" cy={y} r="4.5" fill="none" stroke={c} strokeWidth="0.4" strokeDasharray="1.5 1.5" opacity="0.5"/></g>); }
  return <TileShell big={big}><svg viewBox="0 0 70 100" width={sw} height={sh}>{els}</svg></TileShell>;
};

// ── FLOWERS (Original: viewBox 0 0 70 80, 8 unique variants) ──
const anglesFor = (n) => Array.from({length:n},(_,i) => Math.round(i*(360/n)));
const FlowerSvgs = [
  (p,s,c) => <>{anglesFor(8).map(a=> <ellipse key={`o${a}`} cx="35" cy="28" rx="8" ry="14" fill={p} opacity=".8" transform={`rotate(${a} 35 40)`}/>)}{anglesFor(8).map((_,i)=> <ellipse key={`i${i}`} cx="35" cy="30" rx="6" ry="10" fill={s} opacity=".65" transform={`rotate(${22+i*45} 35 40)`}/>)}<circle cx="35" cy="40" r="8" fill={c}/><circle cx="35" cy="40" r="4" fill="white" opacity=".25"/></>,
  (p,s,c) => <>{anglesFor(5).map(a=> <path key={`o${a}`} d="M35 40 Q28 20 35 12 Q42 20 35 40" fill={p} opacity=".85" transform={`rotate(${a} 35 40)`}/>)}{anglesFor(5).map(a=> <path key={`i${a}`} d="M35 40 Q31 26 35 20 Q39 26 35 40" fill={s} opacity=".5" transform={`rotate(${a} 35 40)`}/>)}<circle cx="35" cy="40" r="7" fill={c}/><circle cx="35" cy="40" r="3.5" fill={s} opacity=".45"/></>,
  (p,s,c) => <>{anglesFor(5).map(a=> <circle key={`p${a}`} cx="35" cy="26" r="12" fill={p} opacity=".7" transform={`rotate(${a} 35 40)`}/>)}<circle cx="35" cy="40" r="8" fill={c}/><circle cx="35" cy="40" r="4" fill={s} opacity=".5"/>{anglesFor(6).map(a=> <circle key={`s${a}`} cx="35" cy="35" r="1.2" fill="white" opacity=".5" transform={`rotate(${a} 35 40)`}/>)}</>,
  (p,s,c) => <>{Array.from({length:9},(_,i)=>i*40).map(a=> <ellipse key={`o${a}`} cx="35" cy="26" rx="6.5" ry="15" fill={p} opacity=".75" transform={`rotate(${a} 35 40)`}/>)}{Array.from({length:9},(_,i)=>20+i*40).map(a=> <ellipse key={`i${a}`} cx="35" cy="30" rx="4.5" ry="10" fill={s} opacity=".55" transform={`rotate(${a} 35 40)`}/>)}<circle cx="35" cy="40" r="6.5" fill={c}/></>,
  (p,s,c) => <>{anglesFor(12).map(a=> <ellipse key={`o${a}`} cx="35" cy="27" rx="4" ry="13" fill={p} opacity=".7" transform={`rotate(${a} 35 40)`}/>)}{Array.from({length:12},(_,i)=>15+i*30).map(a=> <ellipse key={`i${a}`} cx="35" cy="30" rx="3" ry="10" fill={s} opacity=".5" transform={`rotate(${a} 35 40)`}/>)}<circle cx="35" cy="40" r="7.5" fill={c}/><circle cx="35" cy="40" r="3.5" fill="white" opacity=".2"/></>,
  (p,s,c) => <>{anglesFor(6).map(a=> <ellipse key={a} cx="35" cy="24" rx="10" ry="16" fill={p} opacity=".8" transform={`rotate(${a} 35 40)`}/>)}<circle cx="35" cy="40" r="9" fill={c}/><circle cx="35" cy="40" r="5" fill={s} opacity=".4"/></>,
  (p,s,c) => <>{anglesFor(8).map(a=> <path key={a} d="M35 40 Q28 30 26 22 Q30 18 35 24 Q40 18 44 22 Q42 30 35 40" fill={p} opacity=".75" transform={`rotate(${a} 35 40)`}/>)}<circle cx="35" cy="40" r="7" fill={c}/><circle cx="35" cy="40" r="3.5" fill="white" opacity=".3"/></>,
  (p,s,c) => <>{Array.from({length:14},(_,i)=>Math.round(i*25.7)).map(a=> <ellipse key={a} cx="35" cy="28" rx="4.5" ry="11" fill={p} opacity=".75" transform={`rotate(${a} 35 40)`}/>)}<circle cx="35" cy="40" r="10" fill={c}/><circle cx="35" cy="40" r="7" fill={s} opacity=".35"/><circle cx="35" cy="40" r="4" fill={c} opacity=".6"/></>,
];
const MiniFlower = ({ n, big }) => {
  const fc = F_COLS[(n-1)%8]; const sw = big?52:32, sh = big?60:37;
  return <TileShell big={big}><svg viewBox="0 0 70 80" width={sw} height={sh}>{FlowerSvgs[(n-1)%8](fc.p, fc.s, fc.c)}</svg></TileShell>;
};

// ── JOKERS (Original artwork) ──
const MiniJoker = ({ n, big }) => {
  const c = STAR_COLS[(n-1)%8];
  return <TileShell big={big}>
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", width:"100%", height:"100%", background:"linear-gradient(180deg,#FBF8FE,#F8F4FB)", borderRadius:"inherit" }}>
      <span style={{ fontFamily:"'Bodoni Moda',serif", fontSize:big?13:8, fontWeight:700, fontStyle:"italic", letterSpacing:big?3:2, color:c.star }}>JOKER</span>
      <svg viewBox="0 0 12 12" width={big?12:7} height={big?12:7}><polygon points="6,0 7.5,4 12,4 8.5,7 9.5,12 6,9 2.5,12 3.5,7 0,4 4.5,4" fill={c.trail} opacity="0.5"/></svg>
      <svg viewBox="0 0 66 50" width={big?50:30} height={big?38:22}>
        <path d="M8 40 Q20 32 30 26 Q38 22 42 18" fill="none" stroke={c.trail} strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
        <path d="M12 42 Q22 34 32 28 Q40 24 44 20" fill="none" stroke={c.trail} strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
        <circle cx="14" cy="38" r="1" fill={c.trail} opacity="0.4"/>
        <circle cx="22" cy="33" r="1.3" fill={c.trail} opacity="0.5"/>
        <circle cx="30" cy="28" r="1" fill={c.trail} opacity="0.35"/>
        <polygon points="48,6 50.5,14 58,14 52,19 54,27 48,22.5 42,27 44,19 38,14 45.5,14" fill={c.star}/>
        <polygon points="48,10 49.5,14.5 54,14.5 50.5,17 51.5,21.5 48,19 44.5,21.5 45.5,17 42,14.5 46.5,14.5" fill="white" opacity="0.3"/>
        <circle cx="56" cy="8" r="0.8" fill={c.star} opacity="0.6"/>
        <circle cx="52" cy="4" r="0.6" fill={c.star} opacity="0.4"/>
      </svg>
    </div>
  </TileShell>;
};

// ── TILE BACK (Original: viewBox 0 0 50 66) ──
const MiniTileBack = ({ big }) => <TileShell big={big}><div style={{ width:"100%",height:"100%",background:"#C2413B",borderRadius:"inherit",display:"flex",alignItems:"center",justifyContent:"center" }}>
  <svg viewBox="0 0 50 66" width={big?40:24} height={big?52:32}>
    <rect x="4" y="4" width="42" height="58" rx="6" fill="none" stroke="#B8A9C9" strokeWidth="3"/>
    <rect x="11" y="11" width="28" height="44" rx="4" fill="none" stroke="#89B4D4" strokeWidth="2.5"/>
    <rect x="17" y="17" width="16" height="32" rx="3" fill="none" stroke="#7FBFB3" strokeWidth="2"/>
    <circle cx="25" cy="33" r="5" fill="#89B4D4" opacity="0.9"/>
    <circle cx="25" cy="33" r="3" fill="#7FBFB3" opacity="0.7"/>
    <circle cx="25" cy="33" r="1.5" fill="white" opacity="0.6"/>
  </svg>
</div></TileShell>;

// ── MEET THE TILES LESSON ──
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

  // Zoom overlay
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
            {[1,2,3,4,5,6,7,8,9].map(n => <div key={n} onClick={zt(<MiniDot n={n} big/>, `${n} Dot`, `${n} dot${n>1?"s":""} arranged in a pattern. Four copies in the set.`)}><MiniDot n={n}/></div>)}
          </TileRowWrap>
        </Section>

        <Section title="Bams (Bamboo)" color="#2E8B57" note="Tiles with bamboo-shaped sticks. The 1 Bam features a bird — our Bam Bird!">
          <TileRowWrap>
            {[1,2,3,4,5,6,7,8,9].map(n => <div key={n} onClick={zt(<MiniBam n={n} big/>, n===1?"1 Bam — The Bird":`${n} Bam`, n===1?"The bird tile! Also known as Bam Bird. Four copies in the set.":`${n} bamboo stalk${n>1?"s":""}. Four copies in the set.`)}><MiniBam n={n}/></div>)}
          </TileRowWrap>
        </Section>

        <Section title="Craks (Characters)" color="#C2413B" note="Tiles with Chinese characters representing numbers 1–9.">
          <TileRowWrap>
            {[1,2,3,4,5,6,7,8,9].map(n => <div key={n} onClick={zt(<MiniCrak n={n} big/>, `${n} Crak`, `The Chinese character for ${n}. Four copies in the set.`)}><MiniCrak n={n}/></div>)}
          </TileRowWrap>
        </Section>

        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.lavBorder},transparent)`, margin:"6px 0 14px" }}/>

        <div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:15, fontWeight:600, color:C.cherry, marginBottom:2, letterSpacing:.5 }}>Honor Tiles</div>
        <p style={{ fontSize:10.5, color:C.mid, lineHeight:1.5, marginBottom:12 }}>Special tiles that are not numbered.</p>

        <Section title="Winds" color="#4A7FA8" note="Four directions. Each appears four times in the set.">
          <TileRowWrap>
            {["N","E","W","S"].map(d => <div key={d} onClick={zt(<MiniWind d={d} big/>, WIND_CFG[d].l, `The ${WIND_CFG[d].l.toLowerCase()} wind. Four copies in the set.`)}><MiniWind d={d}/></div>)}
          </TileRowWrap>
        </Section>

        <Section title="Dragons" color="#4A7FA8">
          <TileRowWrap>
            <div onClick={zt(<MiniDragon type="red" big/>, "Red Dragon", "Goes with Craks. Four copies in the set.")}><MiniDragon type="red"/></div><Label>Red</Label>
            <div onClick={zt(<MiniDragon type="green" big/>, "Green Dragon", "Goes with Bams. Four copies in the set.")}><MiniDragon type="green"/></div><Label>Green</Label>
            <div onClick={zt(<MiniDragon type="white" big/>, "White Dragon (Soap)", 'Goes with Dots. Has a double life — also used as "0" on the card. Four copies.')}><MiniDragon type="white"/></div><Label>Soap</Label>
          </TileRowWrap>
          <div onClick={() => setDragonNote(!dragonNote)} style={{ marginTop:8, background:`linear-gradient(135deg,${C.paleBlueLt},${C.paleBlue})`, borderRadius: dragonNote?14:10, padding: dragonNote?"10px 12px":"8px 12px", border:"1px solid rgba(173,212,236,0.3)", cursor:"pointer", transition:"all 0.3s ease" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#4A96B8" }}>!</span>
                <span style={{ fontSize:10, fontWeight:400, color:C.dark }}>A Note on Dragons</span>
              </div>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round" style={{ transition:"transform 0.3s", transform:dragonNote?"rotate(180deg)":"rotate(0deg)" }}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            {dragonNote && <div style={{ fontSize:9.5, color:C.mid, lineHeight:1.5, marginTop:8 }}>
              Red dragons go with Craks. Green dragons go with Bams. White dragons go with Dots.<br/><br/>
              White dragons are the only dragons with a double life! They can be used for "0"s or for dragons. For example if a line says "2025" — the white dragon is the zero.<br/><br/>
              White dragons look like a box, so they are often called <strong style={{color:C.dark}}>"Soap."</strong>
            </div>}
          </div>
        </Section>

        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.lavBorder},transparent)`, margin:"6px 0 14px" }}/>

        <div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:15, fontWeight:600, color:C.cherry, marginBottom:2, letterSpacing:.5 }}>Special Tiles</div>
        <p style={{ fontSize:10.5, color:C.mid, lineHeight:1.5, marginBottom:12 }}>Unique tiles with special roles.</p>

        <Section title="Flowers" color="#8B7355" note="8 unique decorative tiles that appear in specific hands. One copy each.">
          <div style={{ display:"flex", gap:5, marginBottom:5 }}>{[1,2,3,4].map(n => <div key={n} onClick={zt(<MiniFlower n={n} big/>, `Flower ${n}`, "A unique flower tile. One copy in the set.")}><MiniFlower n={n}/></div>)}</div>
          <div style={{ display:"flex", gap:5 }}>{[5,6,7,8].map(n => <div key={n} onClick={zt(<MiniFlower n={n} big/>, `Flower ${n}`, "A unique flower tile. One copy in the set.")}><MiniFlower n={n}/></div>)}</div>
        </Section>

        <Section title="Jokers" color="#B8A9C9" note="8 wild tiles that can substitute for other tiles, with restrictions. One copy each.">
          <div style={{ display:"flex", gap:5, marginBottom:5 }}>{[1,2,3,4].map(n => <div key={n} onClick={zt(<MiniJoker n={n} big/>, `Joker ${n}`, "A wild tile — can substitute for suited or honor tiles in groups of 3 or more.")}><MiniJoker n={n}/></div>)}</div>
          <div style={{ display:"flex", gap:5 }}>{[5,6,7,8].map(n => <div key={n} onClick={zt(<MiniJoker n={n} big/>, `Joker ${n}`, "A wild tile — can substitute for suited or honor tiles in groups of 3 or more.")}><MiniJoker n={n}/></div>)}</div>
        </Section>

        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.lavBorder},transparent)`, margin:"6px 0 14px" }}/>

      </Cnt>
    </>
  );
}

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
    <svg width="18" height="24" viewBox="0 0 26 34" fill="none"><rect x="1" y="1" width="24" height="32" rx="4.5" stroke={C.lavDeep} strokeWidth="1.3"/><rect x="5.5" y="6" width="15" height="22" rx="2.5" stroke={C.cherry} strokeWidth="1" opacity=".6"/><circle cx="13" cy="17" r="2.2" stroke={C.cerulean} strokeWidth="1" fill="none"/></svg>
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

const Header = ({ onHome, onProfile, isHome, cartCount, onCart, page }) => (
  <div style={{ padding: "6px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Logo onClick={onHome} showText={!isHome}/>
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      {page==="shop" && <div onClick={onCart} style={{ position:"relative", cursor:"pointer" }}>
        <div style={{ width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.lavDeep} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        {cartCount>0 && <div style={{ position:"absolute", top:-2, right:-4, width:15, height:15, borderRadius:"50%", background:C.cherry, color:"#fff", fontSize:8, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{cartCount}</div>}
      </div>}
      <div onClick={onProfile} style={{ width: 32, height: 32, borderRadius: "50%", background: C.lavHint, border: `1.5px solid ${C.lavender}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <div style={{ width: 13, height: 13, stroke: C.lavDeep, strokeWidth: 1.3, fill: "none", display: "flex" }}>{I.user}</div></div>
    </div>
  </div>
);

const PT = ({ children }) => <div style={{ textAlign: "center", padding: "22px 22px 18px" }}><h1 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 26, fontWeight: 700, color: C.cherry, letterSpacing: 4, margin: 0 }}>{children}</h1></div>;
const SH = ({ children, style }) => <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 10, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: C.cherry, margin: "18px 0 10px 2px", ...style }}>{children}</div>;
const Tag = ({ type, children }) => { const m = { b: { bg: "rgba(142,199,226,0.12)", c: "#4A96B8" }, n: { bg: "rgba(168,152,190,0.12)", c: C.lavDeep }, i: { bg: "rgba(176,141,58,0.1)", c: C.gold }, a: { bg: "rgba(224,48,80,0.06)", c: C.cherry } }; const s = m[type]||m.b; return <span style={{ display: "inline-block", fontSize: 7.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", padding: "2.5px 7px", borderRadius: 6, marginRight: 3, marginTop: 5, background: s.bg, color: s.c }}>{children}</span>; };

const Card = ({ title, desc, tags, num, onClick }) => (
  <div onClick={onClick} style={{ background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 16, padding: "16px 16px 16px 18px", marginBottom: 10, cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.35s" }}
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

const drillsData = [
  { t: "Learn the Hands", d: "Match tiles to NMJL card patterns", lvls: ["Beginner"] },
  { t: "How to Deal", d: "Roll dice, break the wall, deal correctly", lvls: ["Beginner"] },
  { t: "Practicing the Charleston", d: "Master R-O-L-★-L-O-R and blind passes", lvls: ["Beginner","Intermediate","Advanced"] },
  { t: "Reading Exposures", d: "Narrow down opponent hands from melds", lvls: ["Intermediate","Advanced"] },
  { t: "Playing Defense", d: "Choose the safest discard, stop feeding", lvls: ["Advanced"] },
];

const shopSections = [
  { title: "Game Cards", items: ["NMJL Card"] },
  { title: "Tiles", items: ["The Mahji Set"] },
  { title: "Table Accessories", items: ["Mats","Racks","Shufflers","Card Holders","Tile Bags","Totes"] },
  { title: "The Salon", items: ["Linen Napkins","Pillows","Frosted Cups","Needlepoint Pillows","Trucker Hats","Silk Scarf","Silk Pajamas","Cashmere Eye Mask","Stationery"] },
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
  const [lesson, setLesson] = useState(null);
  const f = learnData.map(s => ({ ...s, items: s.items.filter(i => tab==="See All"||i.lvl===tab) })).filter(s => s.items.length);

  if (lesson === "Meet the Tiles") return <MeetTheTiles onBack={() => setLesson(null)}/>;

  return (<><PT>Learn</PT><Cnt><Tabs items={["See All","First Timer","Novice","Intermediate","Advanced"]} active={tab} onSelect={setTab}/>
    {f.map(s => <div key={s.s}><SH>{s.s}</SH>{s.items.map(i => <Card key={i.t} title={i.t} desc={i.d} tags={[[lt[i.lvl],i.lvl]]} onClick={i.t==="Meet the Tiles"?()=>setLesson(i.t):undefined}/>)}</div>)}
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

function ShopPage({ cart, setCart }) {
  const [open, setOpen] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const addToCart = (item, price) => { setCart(prev => [...prev, { item, price }]); };
  const removeFromCart = (idx) => { setCart(prev => prev.filter((_,i) => i !== idx)); };

  const cats = [
    { id: "cards", title: "Game Cards", sub: "Official NMJL playing cards", bg: "linear-gradient(135deg,#FDF8F4,#F8F0E8)", items: [{name:"NMJL Card",price:15}] },
    { id: "tiles", title: "Tiles", sub: "The Mahji Set", bg: "linear-gradient(135deg,#F3EFF8,#ECE7F3)", items: [{name:"The Mahji Set",price:200}] },
    { id: "table", title: "Table Accessories", sub: "Mats, racks, shufflers & more", bg: "linear-gradient(135deg,#F0F8F5,#E0F0EB)", items: [{name:"Mats",price:45},{name:"Racks",price:35},{name:"Shufflers",price:60},{name:"Card Holders",price:25},{name:"Tile Bags",price:30},{name:"Totes",price:55}] },
    { id: "salon", title: "The Salon", sub: "Lifestyle treats for the modern mahj enthusiast", bg: "linear-gradient(135deg,#FAF4F5,#F5ECED)", items: [{name:"Linen Napkins",price:40},{name:"Pillows",price:85},{name:"Frosted Cups",price:28},{name:"Needlepoint Pillows",price:120},{name:"Trucker Hats",price:35},{name:"Silk Scarf",price:65},{name:"Silk Pajamas",price:150},{name:"Cashmere Eye Mask",price:75},{name:"Stationery",price:30}] },
  ];

  const FlipTile = ({ front, delay, cycle }) => (
    <div style={{ perspective:600, width:48, height:65 }}>
      <div style={{ position:"relative", width:"100%", height:"100%", transformStyle:"preserve-3d", animation:`tileFlipLoop ${cycle}s ease ${delay}ms infinite` }}>
        <div style={{ position:"absolute", width:"100%", height:"100%", backfaceVisibility:"hidden" }}><MiniTileBack/></div>
        <div style={{ position:"absolute", width:"100%", height:"100%", backfaceVisibility:"hidden", transform:"rotateY(180deg)" }}>{front}</div>
      </div>
      <style>{`@keyframes tileFlipLoop{0%{transform:rotateY(0deg)}10%{transform:rotateY(180deg)}50%{transform:rotateY(180deg)}60%{transform:rotateY(360deg)}100%{transform:rotateY(360deg)}}`}</style>
    </div>
  );
  const TilesPreview = () => {
    const cyc = 6;
    const top = [<MiniDot n={2}/>,<MiniBam n={1}/>,<MiniBam n={3}/>,<MiniCrak n={5}/>];
    const bot = [<MiniWind d="S"/>,<MiniFlower n={3}/>,<MiniDragon type="white"/>,<MiniJoker n={3}/>];
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"center", padding:"10px 6px" }}>
        <div style={{ display:"flex", gap:4 }}>{top.map((t,i) => <FlipTile key={"t"+i} front={t} delay={300+i*200} cycle={cyc}/>)}</div>
        <div style={{ display:"flex", gap:4 }}>{bot.map((t,i) => <FlipTile key={"b"+i} front={t} delay={1200+i*200} cycle={cyc}/>)}</div>
      </div>
    );
  };

  const TileSetDetail = () => {
    const ts = 34, th = 46, g = 2;
    const TinyShell = ({ children }) => (
      <div style={{ width:ts, height:th, background:"#fff", borderRadius:5, border:"1px solid #C2413B", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", flexShrink:0, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>{children}</div>
    );
    const TDot = ({ n }) => { const lay=DOT_LAYOUTS[n]; const r=n===1?8:n<=4?5:n<=6?4:3.5;
      return <TinyShell><span style={{fontFamily:"'Bodoni Moda',serif",fontSize:5.5,fontWeight:700,color:"#4A3660",position:"absolute",top:1,right:2}}>{n}</span><svg viewBox="-18 -18 36 36" width="28" height="28">{lay.map(([x,y],i)=>{const c=DOT_COLORS[i%5];return <g key={i}><circle cx={x*.5} cy={y*.5} r={r} fill={c+"22"} stroke={c} strokeWidth=".8"/><circle cx={x*.5} cy={y*.5} r={r*.3} fill={c}/></g>;})}</svg></TinyShell>;
    };
    const TBam = ({ n }) => {
      if(n===1) return <TinyShell><span style={{fontFamily:"'Bodoni Moda',serif",fontSize:5.5,fontWeight:700,color:"#2E8B57",position:"absolute",top:1,right:2}}>1</span><svg viewBox="0 0 34 44" width="26" height="34"><ellipse cx="17" cy="14" rx="7" ry="5.5" fill="#89B4D4"/><circle cx="22" cy="11" r="4" fill="#78C4B0"/><circle cx="23.5" cy="10.5" r="1.2" fill="#fff"/><circle cx="23.5" cy="10.5" r=".6" fill="#333"/><path d="M26 11 L29 10.5 L26 13Z" fill="#C4A96A"/><rect x="15.5" y="22" width="3" height="20" rx="1.5" fill="#7FBFB3"/></svg></TinyShell>;
      return <TinyShell><span style={{fontFamily:"'Bodoni Moda',serif",fontSize:5.5,fontWeight:700,color:"#2E8B57",position:"absolute",top:1,right:2}}>{n}</span><svg viewBox="0 0 34 44" width="26" height="34">{Array(n).fill(0).map((_,i)=>{const sp=34/(n+1);const x=sp*(i+1)-1.5;const c=BAM_COLS[i%4];const d=BAM_DARK[i%4];return <g key={i}><rect x={x} y={3} width={3} height={38} rx={1.5} fill={c}/><rect x={x-1} y={14} width={5} height={1.5} rx={.7} fill={d}/><rect x={x-1} y={24} width={5} height={1.5} rx={.7} fill={d}/></g>;})}</svg></TinyShell>;
    };
    const TCrak = ({ n }) => <TinyShell><span style={{fontFamily:"'Bodoni Moda',serif",fontSize:5.5,fontWeight:700,color:"#C2413B",position:"absolute",top:1,right:2}}>{n}</span><svg viewBox="0 0 30 34" width="24" height="28"><text x="15" y="26" textAnchor="middle" fontFamily="'Noto Sans SC','SimSun',sans-serif" fontSize="24" fontWeight="500" fill="#C2413B">{CHINESE_N[n-1]}</text></svg></TinyShell>;
    const TWind = ({ d }) => { const w=WIND_CFG[d]; return <TinyShell><span style={{fontFamily:"'Bodoni Moda',serif",fontSize:14,fontWeight:700,color:w.c,lineHeight:1}}>{d}</span><span style={{fontFamily:"'Bodoni Moda',serif",fontSize:4,letterSpacing:1,fontWeight:600,color:w.c}}>{w.l}</span></TinyShell>; };
    const TDrg = ({ type }) => {
      if(type==="red") return <TinyShell><svg viewBox="0 0 26 36" width="20" height="30"><path d="M13 4 C18 4 20 10 18 14 C16 18 10 18 8 22 C6 26 8 30 13 32" fill="none" stroke="#C2413B" strokeWidth="3" strokeLinecap="round"/><ellipse cx="13" cy="3.5" rx="3" ry="2.5" fill="#C2413B"/></svg></TinyShell>;
      if(type==="green") return <TinyShell><svg viewBox="0 0 26 36" width="20" height="30"><path d="M13 4 C8 4 6 10 8 14 C10 18 16 18 18 22 C20 26 18 30 13 32" fill="none" stroke="#2E8B57" strokeWidth="3" strokeLinecap="round"/><ellipse cx="13" cy="3.5" rx="3" ry="2.5" fill="#2E8B57"/></svg></TinyShell>;
      const sc=["#B8A9C9","#89B4D4","#7FBFB3","#D4A0B0","#C2413B"];
      return <TinyShell><svg viewBox="0 0 26 36" width="20" height="30">{[0,1,2,3,4].map(i=> <g key={i}><circle cx={4+i*4.5} cy={4} r={1.5} fill={sc[i]+"33"} stroke={sc[i]} strokeWidth=".5"/><circle cx={4+i*4.5} cy={32} r={1.5} fill={sc[i]+"33"} stroke={sc[i]} strokeWidth=".5"/></g>)}{[0,1,2].map(i=> <g key={"s"+i}><circle cx={3} cy={10+i*8} r={1.5} fill={sc[i]+"33"} stroke={sc[i]} strokeWidth=".5"/><circle cx={23} cy={10+i*8} r={1.5} fill={sc[(i+2)%5]+"33"} stroke={sc[(i+2)%5]} strokeWidth=".5"/></g>)}</svg></TinyShell>;
    };
    const TFlower = ({ n }) => { const f=FC[(n-1)%8]; return <TinyShell><svg viewBox="0 0 28 32" width="24" height="28">{Array.from({length:6},(_,i)=>i*60).map(a=> <ellipse key={a} cx="14" cy="10" rx="4" ry="7" fill={f.p} opacity=".7" transform={`rotate(${a} 14 16)`}/>)}<circle cx="14" cy="16" r="4" fill={f.c}/></svg></TinyShell>; };
    const TJoker = ({ n }) => { const c=STCOL[(n-1)%8]; return <TinyShell><div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",background:"linear-gradient(180deg,#FBF8FE,#F8F4FB)",borderRadius:"inherit"}}><span style={{fontFamily:"'Bodoni Moda',serif",fontSize:5.5,fontWeight:700,fontStyle:"italic",letterSpacing:1.5,color:c.s}}>JOKER</span><svg viewBox="0 0 8 8" width="6" height="6"><polygon points="4,0 5,3 8,3 5.5,5 6.5,8 4,6 1.5,8 2.5,5 0,3 3,3" fill={c.t} opacity=".5"/></svg></div></TinyShell>; };
    const SL = ({ children }) => (
      <div style={{ marginBottom:4 }}>
        <div style={{ display:"flex", gap:g }}>{children}</div>
      </div>
    );
    return (
      <div style={{ padding:"6px 2px" }}>
        <SL label="Dots">{[1,2,3,4,5,6,7,8,9].map(n=> <TDot key={n} n={n}/>)}</SL>
        <SL label="Bams">{[1,2,3,4,5,6,7,8,9].map(n=> <TBam key={n} n={n}/>)}</SL>
        <SL label="Craks">{[1,2,3,4,5,6,7,8,9].map(n=> <TCrak key={n} n={n}/>)}</SL>
        <SL label="Winds & Dragons">{["N","E","W","S"].map(d=> <TWind key={d} d={d}/>)}<TDrg type="red"/><TDrg type="green"/><TDrg type="white"/></SL>
        <SL label="Flowers">{[1,2,3,4,5,6,7,8].map(n=> <TFlower key={n} n={n}/>)}</SL>
        <SL label="Jokers">{[1,2,3,4,5,6,7,8].map(n=> <TJoker key={n} n={n}/>)}</SL>
        <div style={{ fontSize:8, color:C.light, textAlign:"center", marginTop:4 }}>152 tiles · Designed by Mahji</div>
      </div>
    );
  };

  const ItemCard = ({ item, cat }) => {
    const inCart = cart.some(c => c.item === item.name);
    const isSet = item.name.includes("Mahji Set");
    return (
      <div style={{ background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 16, overflow: "hidden", marginBottom: 10, transition: "all 0.35s" }}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(142,199,226,0.18)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
        <div style={{ minHeight: isSet?"auto":80, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isSet ? <TileSetDetail/> : <div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:14, color:C.cherry, fontWeight:500, opacity:.3 }}>[ preview ]</div>}
        </div>
        <div style={{ padding:"12px 14px", display:"flex", alignItems:"center" }}>
          <div style={{ flex:1 }}><h3 style={{ fontFamily:"'Bodoni Moda',serif", fontSize:13, fontWeight:500, color:C.dark }}>{item.name}</h3></div>
          <span style={{ fontFamily:"'Bodoni Moda',serif", fontSize:13, fontWeight:500, color:C.lavDeep, textAlign:"center", flex:1 }}>${item.price}</span>
          <div style={{ flex:1, display:"flex", justifyContent:"flex-end" }}>
            <div onClick={(e) => {e.stopPropagation(); !inCart && addToCart(item.name, item.price);}}
              style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"5px 14px", borderRadius:20,
                background: inCart ? C.cherry : "transparent", color: inCart ? "#fff" : C.cherry,
                border: `1.5px solid ${C.cherry}`,
                fontSize:9, fontWeight:400, letterSpacing:.3, cursor: inCart?"default":"pointer", transition:"all 0.3s", whiteSpace:"nowrap" }}>
              {inCart ? <><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Added</> : "Add to Bag"}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showCart) {
    const total = cart.reduce((s,c) => s+c.price, 0);
    return (<>
      <div style={{ padding:"6px 22px 0", display:"flex", alignItems:"center", gap:8 }}>
        <div onClick={() => setShowCart(false)} style={{ fontSize:11, color:C.lavDeep, cursor:"pointer", fontWeight:500, display:"flex", alignItems:"center", gap:3 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Shop</div>
      </div>
      <PT>Your Bag</PT>
      <Cnt>
        {cart.length===0 ? <div style={{ textAlign:"center", padding:"40px 20px" }}>
          <div style={{ fontSize:11, color:C.light, marginBottom:8 }}>Your bag is empty</div>
          <div onClick={() => setShowCart(false)} style={{ display:"inline-block", fontSize:10, fontWeight:600, color:C.cherry, cursor:"pointer", borderBottom:`1px solid ${C.cherry}`, paddingBottom:1 }}>Continue shopping</div>
        </div> : <>
          {cart.map((c,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${C.lavBorder}` }}>
              <div style={{ fontSize:12, fontWeight:500, color:C.dark }}>{c.item}</div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontFamily:"'Bodoni Moda',serif", fontSize:13, fontWeight:600, color:C.seafoam }}>${c.price}</span>
                <div onClick={() => removeFromCart(i)} style={{ fontSize:9, color:C.cherry, cursor:"pointer", fontWeight:500 }}>Remove</div>
              </div>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"14px 0 6px", borderTop:`1.5px solid ${C.dark}`, marginTop:8 }}>
            <span style={{ fontFamily:"'Bodoni Moda',serif", fontSize:14, fontWeight:600, color:C.dark }}>Total</span>
            <span style={{ fontFamily:"'Bodoni Moda',serif", fontSize:16, fontWeight:700, color:C.seafoam }}>${total}</span>
          </div>
          <div style={{ background:C.cherry, color:"#fff", textAlign:"center", padding:"12px 20px", borderRadius:24, fontSize:12, fontWeight:600, letterSpacing:1, cursor:"pointer", marginTop:12 }}>Checkout</div>
        </>}
      </Cnt>
    </>);
  }

  if (open) {
    const cat = cats.find(c => c.id === open);
    return (<>
      <div style={{ padding:"6px 22px 0", display:"flex", alignItems:"center", gap:8 }}>
        <div onClick={() => setOpen(null)} style={{ fontSize:11, color:C.lavDeep, cursor:"pointer", fontWeight:500, display:"flex", alignItems:"center", gap:3 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Shop</div>
      </div>
      <PT>{cat.title}</PT>
      <Cnt>{cat.items.map(item => <ItemCard key={item.name} item={item} cat={cat}/>)}</Cnt>
    </>);
  }

  return (<><PT>Shop</PT><Cnt>
    <p style={{ fontSize:11.5, color:C.mid, marginBottom:14, fontStyle:"italic" }}>Curated essentials for the modern Mahj player.</p>
    {cats.map(cat => (
      <div key={cat.id} onClick={() => setOpen(cat.id)} style={{ background:C.white, border:`1px solid ${C.lavBorder}`, borderRadius:16, overflow:"hidden", marginBottom:10, cursor:"pointer", transition:"all 0.35s" }}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(142,199,226,0.18)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
        <div style={{ height:cat.id==="tiles"?"auto":120, minHeight:cat.id==="tiles"?80:120, background:cat.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
          {cat.id==="tiles" ? <TilesPreview/> : <div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:18, color:C.cherry, fontWeight:500, opacity:.35 }}>[ preview ]</div>}
        </div>
        <div style={{ padding:"12px 14px" }}>
          <h3 style={{ fontFamily:"'Bodoni Moda',serif", fontSize:15, fontWeight:500, color:C.dark, marginBottom:2 }}>{cat.title}</h3>
          <p style={{ fontSize:10, color:C.light, margin:0 }}>{cat.sub}</p></div>
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
  const [cart, setCart] = useState([]);
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
        {page!=="profile" && <Header onHome={onHome} onProfile={onProfile} isHome={page==="home"} cartCount={cart.length} onCart={() => {}} page={page}/>}
        {page==="home" && <HomePage onNav={onNav}/>}
        {page==="learn" && <LearnPage showChat={showChat} setShowChat={setShowChat}/>}
        {page==="practice" && <PracticePage showChat={showChat} setShowChat={setShowChat}/>}
        {page==="play" && <PlayPage/>}
        {page==="shop" && <ShopPage cart={cart} setCart={setCart}/>}
        {page==="bam" && <BamPage/>}
        {page==="profile" && <ProfilePage onBack={() => setPage(prevPage)} onHome={onHome} signedIn={signedIn} onSignOut={onSignOut} onSignIn={onSignIn}/>}
        <NavBar active={page==="home"||page==="profile"?null:page} onNav={onNav}/>
      </div>
    </div>
  );
}
