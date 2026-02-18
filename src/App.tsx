import { useState } from "react";
import { C } from "./constants/colors";
import { NavBar, Header } from "./components/Layout";
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
