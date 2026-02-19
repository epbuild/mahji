import { useState, useEffect } from "react";
import { DesktopHeader, MobileHeader, MobileNav, Footer } from "./components/Layout";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import PracticePage from "./pages/PracticePage";
import PlayPage from "./pages/PlayPage";
import ShopPage from "./pages/ShopPage";
import BamPage from "./pages/BamPage";
import ProfilePage from "./pages/ProfilePage";
import { C } from "./constants/colors";

function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="splash-overlay">
      <div className="splash-bg" />
      <div className="splash-tile">
        <svg width="20" height="27" viewBox="0 0 26 34" fill="none">
          <rect x="1" y="1" width="24" height="32" rx="4.5" stroke={C.lavDeep} strokeWidth="1.3"/>
          <rect x="5.5" y="6" width="15" height="22" rx="2.5" stroke={C.cherry} strokeWidth="1" opacity="0.6"/>
          <circle cx="13" cy="17" r="2.2" stroke={C.cerulean} strokeWidth="1" fill="none"/>
        </svg>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [prevPage, setPrevPage] = useState("home");
  const [showChat, setShowChat] = useState(false);
  const [signedIn, setSignedIn] = useState(true);
  const [cart, setCart] = useState([]);
  const [showSplash, setShowSplash] = useState(true);
  const [splashDone, setSplashDone] = useState(false);

  const onNav = (p) => { setPage(p); setShowChat(false); };
  const onHome = () => { setPage("home"); setShowChat(false); };
  const onProfile = () => { setPrevPage(page); setPage("profile"); };
  const onSignOut = () => { setSignedIn(false); setPage("home"); };
  const onSignIn = () => { setSignedIn(true); };
  const onCart = () => { /* future cart drawer */ };

  const handleSplashDone = () => { setSplashDone(true); setTimeout(() => setShowSplash(false), 400); };

  return (
    <div className="app-shell">
      <style>{`
        @keyframes bfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes zoomIn{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes tileFlipLoop{0%{transform:rotateY(0deg)}10%{transform:rotateY(180deg)}50%{transform:rotateY(180deg)}60%{transform:rotateY(360deg)}100%{transform:rotateY(360deg)}}
      `}</style>

      {/* Splash screen — first visit only */}
      {showSplash && <SplashScreen onDone={handleSplashDone} />}

      <div className="app-container" style={{ opacity: splashDone ? 1 : 0, transition: "opacity 0.4s ease" }}>
        {/* DESKTOP: Top nav — CSS hides this below 768px */}
        {page !== "profile" && (
          <DesktopHeader
            page={page}
            onNav={onNav}
            onHome={onHome}
            onProfile={onProfile}
            cartCount={cart.length}
            onCart={onCart}
          />
        )}

        {/* MOBILE: Header at top — CSS hides this at 768px+ */}
        {page !== "profile" && (
          <MobileHeader
            onHome={onHome}
            onProfile={onProfile}
            isHome={page === "home"}
            cartCount={cart.length}
            onCart={onCart}
            page={page}
          />
        )}

        {/* Page content */}
        {page === "home" && <HomePage onNav={onNav} signedIn={signedIn} />}
        {page === "learn" && <LearnPage showChat={showChat} setShowChat={setShowChat} />}
        {page === "practice" && <PracticePage showChat={showChat} setShowChat={setShowChat} />}
        {page === "play" && <PlayPage />}
        {page === "shop" && <ShopPage cart={cart} setCart={setCart} />}
        {page === "bam" && <BamPage />}
        {page === "profile" && <ProfilePage onBack={() => setPage(prevPage)} onHome={onHome} signedIn={signedIn} onSignOut={onSignOut} onSignIn={onSignIn} />}

        {/* MOBILE: Bottom nav — CSS hides this at 768px+ */}
        <MobileNav active={page === "home" || page === "profile" ? null : page} onNav={onNav} />
      </div>
    </div>
  );
}
