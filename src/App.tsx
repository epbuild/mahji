import { useState, useEffect } from "react";
import { DesktopHeader, MobileHeader, MobileNav, Footer } from "./components/Layout";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import PracticePage from "./pages/PracticePage";
import PlayPage from "./pages/PlayPage";
import ShopPage from "./pages/ShopPage";
import BamPage from "./pages/BamPage";
import ProfilePage from "./pages/ProfilePage";
import { C, getThemeColors } from "./constants/colors";
import { ThemeProvider, useTheme } from "./constants/ThemeContext";

function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1300);
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

function AppInner() {
  const [page, setPage] = useState("home");
  const [prevPage, setPrevPage] = useState("home");
  const [showChat, setShowChat] = useState(false);
  const [signedIn, setSignedIn] = useState(true);
  const [cart, setCart] = useState([]);
  const [showSplash, setShowSplash] = useState(true);
  const [splashDone, setSplashDone] = useState(false);
  const [entrancePlayed, setEntrancePlayed] = useState(false);
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);

  const onNav = (p) => { setPage(p); setShowChat(false); };
  const onHome = () => { setPage("home"); setShowChat(false); };
  const onProfile = () => { setPrevPage(page); setPage("profile"); };
  const onSignOut = () => { setSignedIn(false); setPage("home"); };
  const onSignIn = () => { setSignedIn(true); };
  const onCart = () => {};

  const handleSplashDone = () => {
    setSplashDone(true);
    setTimeout(() => { setShowSplash(false); setEntrancePlayed(true); }, 800);
  };

  return (
    <div className={`app-shell ${entrancePlayed ? 'entrance-done' : ''}`} style={{ background: t.appBg }}>
      <style>{`
        @keyframes bfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes zoomIn{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes tileFlipLoop{0%{transform:rotateY(0deg)}10%{transform:rotateY(180deg)}50%{transform:rotateY(180deg)}60%{transform:rotateY(360deg)}100%{transform:rotateY(360deg)}}
        @keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes entranceFade{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}
        .home-entrance-item{opacity:0;animation:entranceFade 0.5s ease-out forwards}
        .home-entrance-item:nth-child(1){animation-delay:0ms}
        .home-entrance-item:nth-child(2){animation-delay:80ms}
        .home-entrance-item:nth-child(3){animation-delay:160ms}
        .home-entrance-item:nth-child(4){animation-delay:240ms}
        .home-entrance-item:nth-child(5){animation-delay:320ms}
        .home-entrance-item:nth-child(6){animation-delay:400ms}
        .home-entrance-item:nth-child(7){animation-delay:480ms}
        .home-entrance-item:nth-child(8){animation-delay:560ms}
        .entrance-done .home-entrance-item{opacity:1;animation:none}
      `}</style>

      {showSplash && <SplashScreen onDone={handleSplashDone} />}

      <div className="app-container" style={{ opacity: splashDone ? 1 : 0, transition: "opacity 0.4s ease" }}>
        {page !== "profile" && (
          <DesktopHeader page={page} onNav={onNav} onHome={onHome} onProfile={onProfile} cartCount={cart.length} onCart={onCart} />
        )}
        {page !== "profile" && (
          <MobileHeader onHome={onHome} onProfile={onProfile} isHome={page === "home"} cartCount={cart.length} onCart={onCart} page={page} />
        )}

        {page === "home" && <HomePage onNav={onNav} signedIn={signedIn} />}
        {page === "learn" && <LearnPage showChat={showChat} setShowChat={setShowChat} />}
        {page === "practice" && <PracticePage showChat={showChat} setShowChat={setShowChat} />}
        {page === "play" && <PlayPage />}
        {page === "shop" && <ShopPage cart={cart} setCart={setCart} />}
        {page === "bam" && <BamPage />}
        {page === "profile" && <ProfilePage onBack={() => setPage(prevPage)} onHome={onHome} signedIn={signedIn} onSignOut={onSignOut} onSignIn={onSignIn} />}

        <MobileNav active={page === "home" || page === "profile" ? null : page} onNav={onNav} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
