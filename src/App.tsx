import { useState } from "react";
import { DesktopHeader, MobileHeader, MobileNav, Footer } from "./components/Layout";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import PracticePage from "./pages/PracticePage";
import PlayPage from "./pages/PlayPage";
import ShopPage from "./pages/ShopPage";
import BamPage from "./pages/BamPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const [page, setPage] = useState("home");
  const [prevPage, setPrevPage] = useState("home");
  const [showChat, setShowChat] = useState(false);
  const [signedIn, setSignedIn] = useState(true);
  const [cart, setCart] = useState([]);

  const onNav = (p) => { setPage(p); setShowChat(false); };
  const onHome = () => { setPage("home"); setShowChat(false); };
  const onProfile = () => { setPrevPage(page); setPage("profile"); };
  const onSignOut = () => { setSignedIn(false); setPage("home"); };
  const onSignIn = () => { setSignedIn(true); };
  const onCart = () => { /* future cart drawer */ };

  return (
    <div className="app-shell">
      <style>{`
        @keyframes bfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes zoomIn{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes tileFlipLoop{0%{transform:rotateY(0deg)}10%{transform:rotateY(180deg)}50%{transform:rotateY(180deg)}60%{transform:rotateY(360deg)}100%{transform:rotateY(360deg)}}
      `}</style>
      <div className="app-container">
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
