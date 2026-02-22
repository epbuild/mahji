import { C } from '../constants/colors';


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


export { TileShell, MiniDot, MiniBam, MiniCrak, MiniWind, MiniDragon, MiniFlower, MiniJoker, MiniTileBack, DOT_COLORS, DOT_LAYOUTS, BAM_COLS, BAM_DARK, CHINESE_N, WIND_CFG, SOAP_COLORS, F_COLS, STAR_COLS };
