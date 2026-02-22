import { useState } from 'react';
import { C, getThemeColors } from '../constants/colors';
import { useTheme } from '../constants/ThemeContext';
import { PT, Cnt } from '../components/Layout';
import { MiniDot, MiniBam, MiniCrak, MiniWind, MiniDragon, MiniFlower, MiniJoker, MiniTileBack, DOT_COLORS, DOT_LAYOUTS, BAM_COLS, BAM_DARK, CHINESE_N, WIND_CFG, SOAP_COLORS, F_COLS as FC, STAR_COLS as STCOL } from '../components/TileComponents';

function ShopPage({ cart, setCart }) {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const [open, setOpen] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const addToCart = (item, price) => { setCart(prev => [...prev, { item, price }]); };
  const removeFromCart = (idx) => { setCart(prev => prev.filter((_,i) => i !== idx)); };

  const cats = [
    { id: "cards", title: "Game Cards", sub: "Official NMJL playing cards", bg: isDark ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg,#FDF8F4,#F8F0E8)", darkGlow: "0 8px 28px rgba(253,248,244,0.06), 0 0 0 1px rgba(248,240,232,0.08)", items: [{name:"NMJL Card",price:15}] },
    { id: "tiles", title: "Tiles", sub: "The Mahji Set", bg: isDark ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg,#F3EFF8,#ECE7F3)", darkGlow: "0 8px 28px rgba(192,178,212,0.06), 0 0 0 1px rgba(192,178,212,0.08)", items: [{name:"The Mahji Set",price:200}] },
    { id: "table", title: "Table Accessories", sub: "Mats, racks, shufflers & more", bg: isDark ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg,#F0F8F5,#E0F0EB)", darkGlow: "0 8px 28px rgba(109,191,168,0.06), 0 0 0 1px rgba(109,191,168,0.08)", items: [{name:"Mats",price:45},{name:"Racks",price:35},{name:"Shufflers",price:60},{name:"Card Holders",price:25},{name:"Tile Bags",price:30},{name:"Totes",price:55}] },
    { id: "salon", title: "The Salon", sub: "Lifestyle treats for the modern mahj enthusiast", bg: isDark ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg,#FAF4F5,#F5ECED)", darkGlow: "0 8px 28px rgba(224,48,80,0.05), 0 0 0 1px rgba(224,48,80,0.06)", items: [{name:"Linen Napkins",price:40},{name:"Pillows",price:85},{name:"Frosted Cups",price:28},{name:"Needlepoint Pillows",price:120},{name:"Trucker Hats",price:35},{name:"Silk Scarf",price:65},{name:"Silk Pajamas",price:150},{name:"Cashmere Eye Mask",price:75},{name:"Stationery",price:30}] },
  ];

  const FlipTile = ({ front, delay, cycle }) => (
    <div style={{ perspective:600, width:48, height:65 }}>
      <div style={{ position:"relative", width:"100%", height:"100%", transformStyle:"preserve-3d", animation:`tileFlipLoop ${cycle}s ease ${delay}ms infinite` }}>
        <div style={{ position:"absolute", width:"100%", height:"100%", backfaceVisibility:"hidden" }}><MiniTileBack/></div>
        <div style={{ position:"absolute", width:"100%", height:"100%", backfaceVisibility:"hidden", transform:"rotateY(180deg)" }}>{front}</div>
      </div>
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
    const TJoker = ({ n }) => { const c=STCOL[(n-1)%8]; return <TinyShell><div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",background:"linear-gradient(180deg,#FBF8FE,#F8F4FB)",borderRadius:"inherit"}}><span style={{fontFamily:"'Bodoni Moda',serif",fontSize:5.5,fontWeight:700,fontStyle:"italic",letterSpacing:1.5,color:c.star}}>JOKER</span><svg viewBox="0 0 8 8" width="6" height="6"><polygon points="4,0 5,3 8,3 5.5,5 6.5,8 4,6 1.5,8 2.5,5 0,3 3,3" fill={c.trail} opacity=".5"/></svg></div></TinyShell>; };
    const SL = ({ children }) => (
      <div style={{ marginBottom:4 }}>
        <div style={{ display:"flex", gap:g, flexWrap:"wrap" }}>{children}</div>
      </div>
    );
    return (
      <div style={{ padding:"6px 2px" }}>
        <SL>{[1,2,3,4,5,6,7,8,9].map(n=> <TDot key={n} n={n}/>)}</SL>
        <SL>{[1,2,3,4,5,6,7,8,9].map(n=> <TBam key={n} n={n}/>)}</SL>
        <SL>{[1,2,3,4,5,6,7,8,9].map(n=> <TCrak key={n} n={n}/>)}</SL>
        <SL>{["N","E","W","S"].map(d=> <TWind key={d} d={d}/>)}<TDrg type="red"/><TDrg type="green"/><TDrg type="white"/></SL>
        <SL>{[1,2,3,4,5,6,7,8].map(n=> <TFlower key={n} n={n}/>)}</SL>
        <SL>{[1,2,3,4,5,6,7,8].map(n=> <TJoker key={n} n={n}/>)}</SL>
        <div style={{ fontSize:9, color:C.light, textAlign:"center", marginTop:4 }}>152 tiles · Designed by Mahji</div>
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
          {isSet ? <TileSetDetail/> : <div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:15, color:C.cherry, fontWeight:500, opacity:.3 }}>[ preview ]</div>}
        </div>
        <div style={{ padding:"12px 16px", display:"flex", alignItems:"center" }}>
          <div style={{ flex:1 }}><h3 style={{ fontFamily:"'Bodoni Moda',serif", fontSize:14, fontWeight:500, color:C.dark }}>{item.name}</h3></div>
          <span style={{ fontFamily:"'Bodoni Moda',serif", fontSize:14, fontWeight:500, color:C.lavDeep, textAlign:"center", flex:1 }}>${item.price}</span>
          <div style={{ flex:1, display:"flex", justifyContent:"flex-end" }}>
            <div onClick={(e) => {e.stopPropagation(); !inCart && addToCart(item.name, item.price);}}
              style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"6px 16px", borderRadius:20,
                background: inCart ? C.cherry : "transparent", color: inCart ? "#fff" : C.cherry,
                border: `1.5px solid ${C.cherry}`,
                fontSize:10, fontWeight:400, letterSpacing:.3, cursor: inCart?"default":"pointer", transition:"all 0.3s", whiteSpace:"nowrap" }}>
              {inCart ? <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Added</> : "Add to Bag"}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showCart) {
    const total = cart.reduce((s,c) => s+c.price, 0);
    return (<>
      <div style={{ padding:"8px 22px 0", display:"flex", alignItems:"center", gap:8 }}>
        <div onClick={() => setShowCart(false)} style={{ fontSize:12, color:C.lavDeep, cursor:"pointer", fontWeight:500, display:"flex", alignItems:"center", gap:3 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Shop</div>
      </div>
      <PT>Your Bag</PT>
      <Cnt>
        {cart.length===0 ? <div style={{ textAlign:"center", padding:"40px 20px" }}>
          <div style={{ fontSize:12, color:C.light, marginBottom:8 }}>Your bag is empty</div>
          <div onClick={() => setShowCart(false)} style={{ display:"inline-block", fontSize:11, fontWeight:600, color:C.cherry, cursor:"pointer", borderBottom:`1px solid ${C.cherry}`, paddingBottom:1 }}>Continue shopping</div>
        </div> : <>
          {cart.map((c,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${C.lavBorder}` }}>
              <div style={{ fontSize:13, fontWeight:500, color:C.dark }}>{c.item}</div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontFamily:"'Bodoni Moda',serif", fontSize:14, fontWeight:600, color:C.seafoam }}>${c.price}</span>
                <div onClick={() => removeFromCart(i)} style={{ fontSize:10, color:C.cherry, cursor:"pointer", fontWeight:500 }}>Remove</div>
              </div>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"14px 0 6px", borderTop:`1.5px solid ${C.dark}`, marginTop:8 }}>
            <span style={{ fontFamily:"'Bodoni Moda',serif", fontSize:15, fontWeight:600, color:C.dark }}>Total</span>
            <span style={{ fontFamily:"'Bodoni Moda',serif", fontSize:17, fontWeight:700, color:C.seafoam }}>${total}</span>
          </div>
          <div style={{ background:C.cherry, color:"#fff", textAlign:"center", padding:"13px 20px", borderRadius:24, fontSize:13, fontWeight:600, letterSpacing:1, cursor:"pointer", marginTop:12 }}>Checkout</div>
        </>}
      </Cnt>
    </>);
  }

  if (open) {
    const cat = cats.find(c => c.id === open);
    return (<>
      <div style={{ padding:"8px 22px 0", display:"flex", alignItems:"center", gap:8 }}>
        <div onClick={() => setOpen(null)} style={{ fontSize:12, color:C.lavDeep, cursor:"pointer", fontWeight:500, display:"flex", alignItems:"center", gap:3 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Shop</div>
      </div>
      <PT>{cat.title}</PT>
      <Cnt>{cat.items.map(item => <ItemCard key={item.name} item={item} cat={cat}/>)}</Cnt>
    </>);
  }

  return (<><PT>Shop</PT><Cnt>
    <p style={{ fontSize:12.5, color:t.textMid, marginBottom:14, fontStyle:"italic", background: `linear-gradient(90deg, #C0B2D4, ${C.cerulean}, #6DBFA8, ${C.cherry}, #C0B2D4)`, backgroundSize:"200% 100%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmer 3s ease-in-out infinite" }}>Curated essentials for the modern Mahj player.</p>
    {cats.map(cat => (
      <div key={cat.id} onClick={() => setOpen(cat.id)} style={{ background: isDark ? t.btnBg : C.white, border:`1px solid ${isDark ? t.btnBorder : C.lavBorder}`, borderRadius:16, overflow:"hidden", marginBottom:10, cursor:"pointer", transition:"all 0.35s" }}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=isDark ? cat.darkGlow : "0 6px 20px rgba(142,199,226,0.18)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
        <div style={{ height:cat.id==="tiles"?"auto":120, minHeight:cat.id==="tiles"?80:120, background:cat.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
          {cat.id==="tiles" ? <TilesPreview/> : <div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:18, color:isDark?"rgba(255,255,255,0.1)":C.cherry, fontWeight:500, opacity:isDark?1:.35 }}>[ preview ]</div>}
        </div>
        <div style={{ padding:"12px 16px" }}>
          <h3 style={{ fontFamily:"'Bodoni Moda',serif", fontSize:16, fontWeight:500, color:t.textMain, marginBottom:2 }}>{cat.title}</h3>
          <p style={{ fontSize:11, color:t.textDim, margin:0 }}>{cat.sub}</p></div>
      </div>
    ))}
  </Cnt></>);
}

export default ShopPage;
