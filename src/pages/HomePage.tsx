import { C } from '../constants/colors';
import { BirdIcon, I, DecoLine } from '../components/ui/Icons';
import { Cnt, Footer } from '../components/Layout';

const cardAccents = {
  learn: C.seafoam,
  practice: C.positano,
  shop: C.purple,
  bam: C.skyBlue,
};

function HomePage({ onNav, signedIn = true }) {
  return (
    <>
      {/* Hero */}
      <div className="hero-section">
        <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 400, letterSpacing: 5, color: C.cherry, textTransform: "uppercase", marginBottom: 5 }}>Let's Play</div>
        <h1 className="hero-title">MAHJI</h1>
        <DecoLine />
        {signedIn && (
          <p style={{ fontSize: 12, color: C.lavText, fontStyle: "italic", marginTop: 2 }}>Your tiles are calling</p>
        )}
      </div>

      <Cnt>
        {/* Signed in: stats */}
        {signedIn ? (
          <div className="stats-row">
            {[["12", "Games"], ["3", "Wins"], ["7d", "Streak"]].map(([n, l]) => (
              <div key={l} style={{ flex: 1, background: C.lavCard, border: `1px solid ${C.lavBorder}`, borderRadius: 14, padding: "14px 10px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 24, fontWeight: 600, color: C.lavDeep, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 10, color: C.lavText, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 4, fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        ) : (
          /* New visitor: sign in / create account */
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ display: "inline-flex", gap: 8 }}>
              <button style={{ padding: "10px 28px", borderRadius: 12, border: "none", fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, color: C.white, background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`, cursor: "pointer", boxShadow: "0 3px 10px rgba(224,48,80,0.18)" }}>
                Sign In
              </button>
              <button style={{ padding: "10px 28px", borderRadius: 12, border: `1.5px solid ${C.lavender}`, fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 600, letterSpacing: 1, color: C.lavDeep, background: C.white, cursor: "pointer", boxShadow: "0 2px 8px rgba(126,100,164,0.08)" }}>
                Create Account
              </button>
            </div>
            <p style={{ fontSize: 11, color: C.lavText, marginTop: 8, fontStyle: "italic" }}>Your tiles are calling</p>
          </div>
        )}

        {/* Play Now — slim banner */}
        <div onClick={() => onNav("play")} style={{
          background: `linear-gradient(135deg,${C.paleBlueLt},${C.paleBlue} 40%,#C6E1F0 80%,${C.paleBlueLt})`,
          border: "1px solid rgba(173,212,236,0.3)", borderRadius: 14,
          padding: "12px 18px", marginBottom: 14,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", transition: "all 0.3s"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(224,48,80,0.2)", flexShrink: 0 }}>
              <div style={{ width: 12, height: 12, stroke: "white", strokeWidth: 2, fill: "none", marginLeft: 1, display: "flex" }}>{I.play}</div>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 16, fontWeight: 700, color: C.cherry, marginBottom: 0 }}>Play Now</h3>
              <p style={{ fontSize: 11, color: C.mid, opacity: 0.6, margin: 0 }}>Challenge AI or invite friends</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.5)", padding: "3px 10px", borderRadius: 12, fontSize: 10, color: C.mid, border: "1px solid rgba(173,212,236,0.25)" }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4ADE80", display: "inline-block" }} />
            <span>2,341 online</span>
          </div>
        </div>

        {/* Feature cards with accent colors */}
        <div className="home-grid">
          {[
            { id: "learn", title: "Learn", desc: "Tiles, rules & strategy", icon: I.book },
            { id: "practice", title: "Practice", desc: "Drills & exercises", icon: I.clock },
            { id: "shop", title: "Shop", desc: "Tiles, sets & accessories", icon: I.bag },
            { id: "bam", title: "Ask Bam Bird", desc: "Your AI Mahj mentor", isBird: true },
          ].map(c => {
            const accent = cardAccents[c.id];
            return (
              <div key={c.id} onClick={() => onNav(c.id)} style={{
                background: C.white, border: `1px solid ${C.lavBorder}`,
                borderRadius: 16, padding: "18px 14px", cursor: "pointer",
                overflow: "hidden", borderTop: `2.5px solid ${accent}`,
                transition: "all 0.35s"
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${accent}0A`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  {c.isBird
                    ? <BirdIcon size={16} color={accent} sw={1.8} />
                    : <div style={{ width: 16, height: 16, stroke: accent, strokeWidth: 1.3, fill: "none", display: "flex" }}>{c.icon}</div>
                  }
                </div>
                <h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 15, fontWeight: 600, color: C.dark, marginBottom: 2 }}>{c.title}</h3>
                <p style={{ fontSize: 11, color: C.light, margin: 0, lineHeight: 1.4 }}>{c.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <Footer />
      </Cnt>
    </>
  );
}

export default HomePage;
