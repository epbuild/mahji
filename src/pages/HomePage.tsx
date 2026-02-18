import { C } from '../constants/colors';
import { BirdIcon, I, DecoLine } from '../components/ui/Icons';
import { Cnt } from '../components/Layout';

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

export default HomePage;
