import { C } from '../constants/colors';
import { BirdIcon, I, DecoLine } from '../components/ui/Icons';
import { Cnt } from '../components/Layout';

function HomePage({ onNav }) {
  return (
    <>
      <div style={{ textAlign: "center", padding: "20px 24px 4px" }}>
        <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 11, fontWeight: 400, letterSpacing: 5, color: C.cherry, textTransform: "uppercase", marginBottom: 5 }}>Let's Play</div>
        <h1 className="hero-title">MAHJI</h1>
        <DecoLine/>
      </div>
      <Cnt>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[["12","Games"],["3","Wins"],["7d","Streak"]].map(([n,l]) => (
            <div key={l} style={{ flex: 1, background: C.lavCard, border: `1px solid ${C.lavBorder}`, borderRadius: 14, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 22, fontWeight: 600, color: C.lavDeep, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 9, color: C.lavText, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 4, fontWeight: 500 }}>{l}</div></div>))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[{id:"learn",title:"Learn",desc:"Tiles, rules & strategy",icon:I.book},{id:"practice",title:"Practice",desc:"Drills & exercises",icon:I.clock}].map(c => (
            <div key={c.id} onClick={() => onNav(c.id)} style={{ background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 18, padding: "22px 18px", cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.35s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";}}>
              <div style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 1, background: C.cherry, borderRadius: "0 1px 1px 0" }}/>
              <div style={{ width: 26, height: 26, stroke: C.cherry, strokeWidth: 1.2, fill: "none", marginBottom: 12, display: "flex" }}>{c.icon}</div>
              <h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 17, fontWeight: 700, color: C.cherry, marginBottom: 3 }}>{c.title}</h3>
              <p style={{ fontSize: 12, color: C.lavText, margin: 0 }}>{c.desc}</p></div>))}
          <div onClick={() => onNav("play")} style={{ gridColumn: "1/-1", background: `linear-gradient(135deg,${C.paleBlueLt},${C.paleBlue} 50%,#C6E1F0 85%,${C.paleBlueLt})`, border: "1px solid rgba(173,212,236,0.35)", borderRadius: 18, padding: "24px 22px", cursor: "pointer", transition: "all 0.35s" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";}}>
            <div style={{ width: 26, height: 26, stroke: C.cherry, strokeWidth: 1.3, fill: "none", marginBottom: 12, display: "flex" }}>{I.play}</div>
            <h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 19, fontWeight: 700, color: C.cherry, marginBottom: 3 }}>Play Now</h3>
            <p style={{ fontSize: 12, color: C.mid, opacity: .75, margin: 0 }}>Challenge AI or invite friends</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.5)", padding: "5px 14px", borderRadius: 16, fontSize: 11, color: C.mid, marginTop: 10, border: "1px solid rgba(173,212,236,0.35)" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ADE80", display: "inline-block" }}/><span>2,341 playing now</span></div>
          </div>
          {[{id:"shop",title:"Shop",desc:"Tiles, sets & accessories",icon:I.bag},{id:"bam",title:"Ask Bam Bird",desc:"Your AI Mahj mentor",isBird:true}].map(c => (
            <div key={c.id} onClick={() => onNav(c.id)} style={{ background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 18, padding: "22px 18px", cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.35s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";}}>
              <div style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 1, background: C.cherry, borderRadius: "0 1px 1px 0" }}/>
              <div style={{ marginBottom: 12 }}>{c.isBird?<BirdIcon size={26} color={C.cherry} sw={1.4}/>:<div style={{ width: 26, height: 26, stroke: C.cherry, strokeWidth: 1.2, fill: "none", display: "flex" }}>{c.icon}</div>}</div>
              <h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 17, fontWeight: 700, color: C.cherry, marginBottom: 3 }}>{c.title}</h3>
              <p style={{ fontSize: 12, color: C.lavText, margin: 0 }}>{c.desc}</p></div>))}
        </div>
      </Cnt>
    </>
  );
}

export default HomePage;
