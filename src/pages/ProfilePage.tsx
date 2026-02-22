import { useState } from 'react';
import { C } from '../constants/colors';
import { I, Logo, BirdIcon } from '../components/ui/Icons';
import { Cnt, SH, PT } from '../components/Layout';

const Ring = ({ val, max, label, color, size = 64 }) => {
  const r = 22; const circ = 2*Math.PI*r; const pct = val/max; const offset = circ*(1-pct);
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox="0 0 54 54" style={{ display: "block", margin: "0 auto" }}>
        <circle cx="27" cy="27" r={r} fill="none" stroke="rgba(200,190,215,0.15)" strokeWidth="4"/>
        <circle cx="27" cy="27" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 27 27)" style={{ transition: "stroke-dashoffset 0.8s ease" }}/>
        <text x="27" y="25" textAnchor="middle" style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 14, fontWeight: 600, fill: C.dark }}>{val}</text>
        <text x="27" y="34" textAnchor="middle" style={{ fontSize: 7, fill: C.light }}>/ {max}</text>
      </svg>
      <div style={{ fontSize: 9, color: C.lavText, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 600, marginTop: 4 }}>{label}</div>
    </div>
  );
};

const Row = ({ icon, label, sub, danger, onClick }) => (
  <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 14, marginBottom: 8, cursor: "pointer", transition: "all 0.3s" }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";}}>
    <div style={{ width: 18, height: 18, stroke: danger?"#D04050":C.lavDeep, strokeWidth: 1.3, fill: "none", display: "flex", flexShrink: 0 }}>{icon}</div>
    <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500, color: danger?"#D04050":C.dark }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: C.light, marginTop: 1 }}>{sub}</div>}</div>
    <div style={{ width: 14, height: 14, stroke: C.lavText, strokeWidth: 1.3, fill: "none", display: "flex" }}>{I.chevR}</div>
  </div>
);

function ProfilePage({ onBack, onHome, signedIn, onSignOut, onSignIn }) {
  const [sub, setSub] = useState(null);
  const [avatar, setAvatar] = useState("🀄"); const [showAv, setShowAv] = useState(false);
  const avatars = ["🀄","🎋","🐉","🌸","🦅","🎯","🎲","✨"];
  const [goal, setGoal] = useState(3);

  const Back = ({ to, label }) => (
    <div style={{ padding: "8px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div onClick={() => to ? setSub(null) : onBack()} style={{ fontSize: 12, color: C.lavDeep, cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>{label || "Back"}</div>
      <Logo onClick={onHome}/><div style={{ width: 40 }}/></div>
  );

  if (!signedIn) return (<>
    <Back label="Back"/>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 40px", paddingBottom: 90 }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.lavSoft, border: `2px solid ${C.lavender}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <BirdIcon size={40} color={C.cherry} sw={1.4}/>
      </div>
      <h2 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 24, fontWeight: 700, color: C.cherry, textAlign: "center", marginBottom: 8, letterSpacing: 1 }}>Your tiles are waiting</h2>
      <p style={{ fontSize: 13, color: C.mid, textAlign: "center", lineHeight: 1.6, marginBottom: 24 }}>Sign in to track your stats, save your streak, and pick up right where you left off.</p>
      <button onClick={onSignIn} style={{ width: "100%", padding: 14, border: "none", borderRadius: 14, fontFamily: "'Bodoni Moda',serif", fontSize: 16, fontWeight: 600, letterSpacing: 2, color: C.white, cursor: "pointer", background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`, boxShadow: "0 4px 14px rgba(224,48,80,0.18)", marginBottom: 12 }}>Sign In</button>
      <button style={{ width: "100%", padding: 14, border: `1px solid ${C.lavBorder}`, borderRadius: 14, fontFamily: "'Bodoni Moda',serif", fontSize: 15, fontWeight: 500, letterSpacing: 1.5, color: C.lavDeep, cursor: "pointer", background: C.white }}>Create Account</button>
      <p style={{ fontSize: 11, color: C.lavText, textAlign: "center", marginTop: 16, fontStyle: "italic" }}>Your tiles are calling</p>
    </div>
  </>);

  if (sub === "edit") return (<>
    <Back to="profile" label="Profile"/>
    <PT>Edit Profile</PT>
    <Cnt>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div onClick={() => setShowAv(!showAv)} style={{ width: 74, height: 74, borderRadius: "50%", background: C.lavSoft, border: `2px solid ${C.lavender}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 34, cursor: "pointer", marginBottom: 8 }}>{avatar}</div>
        {showAv && <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 10 }}>
          {avatars.map(a => <div key={a} onClick={() => {setAvatar(a);setShowAv(false);}} style={{ width: 40, height: 40, borderRadius: "50%", background: avatar===a?C.lavSoft:C.white, border: `1px solid ${avatar===a?C.lavDeep:C.lavBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer" }}>{a}</div>)}</div>}
        <div style={{ fontSize: 10, color: C.lavText }}>Tap to change avatar</div>
      </div>
      {[["First Name","Erika"],["Last Name","Panico"],["Username","@mahji_erika"]].map(([l,v]) => (
        <div key={l} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: C.lavText, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4, fontWeight: 600 }}>{l}</div>
          <div style={{ padding: "11px 14px", background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 12, fontSize: 14, color: C.dark }}>{v}</div>
        </div>
      ))}
      <SH>Daily Goal</SH>
      <p style={{ fontSize: 12, color: C.light, marginBottom: 10 }}>How many games do you want to play per day?</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[1,2,3,5].map(g => (
          <div key={g} onClick={() => setGoal(g)} style={{ flex: 1, textAlign: "center", padding: "14px 6px", background: goal===g?C.seafoam:C.white, color: goal===g?C.white:C.dark, border: `1px solid ${goal===g?C.seafoam:"rgba(118,195,170,0.25)"}`, borderRadius: 14, cursor: "pointer", transition: "all 0.25s" }}>
            <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 20, fontWeight: 600 }}>{g}</div>
            <div style={{ fontSize: 9, marginTop: 2, opacity: .7 }}>{g===1?"Casual":g===2?"Regular":g===3?"Serious":g===5?"Intense":""}</div>
          </div>))}
      </div>
      <button style={{ display: "block", width: "100%", padding: 13, border: "none", borderRadius: 14, fontFamily: "'Bodoni Moda',serif", fontSize: 15, fontWeight: 600, letterSpacing: 2, color: C.white, cursor: "pointer", background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`, marginTop: 10 }}>Save Changes</button>
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
          <div style={{ width: 18, height: 18, stroke: C.lavDeep, strokeWidth: 1.3, fill: "none", display: "flex", flexShrink: 0 }}>{p.icon}</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500, color: C.dark }}>{p.label}</div>
            <div style={{ fontSize: 11, color: C.light, marginTop: 1 }}>{p.desc}</div></div>
          <div style={{ width: 38, height: 22, borderRadius: 11, background: p.on?C.seafoam:"rgba(200,190,215,0.25)", cursor: "pointer", position: "relative", transition: "all 0.3s" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: p.on?18:2, boxShadow: "0 1px 3px rgba(0,0,0,0.15)", transition: "left 0.3s" }}/></div>
        </div>
      ))}
      <SH>Display</SH>
      <Row icon={I.settings} label="Default Mat Color" sub="Coffee"/>
      <Row icon={I.settings} label="Default Card" sub="NMJL 2025"/>
      <Row icon={I.settings} label="Default Difficulty" sub="Intermediate"/>
    </Cnt>
  </>);

  return (<>
    <Back label="Back"/>
    <PT>Profile</PT>
    <Cnt>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ width: 74, height: 74, borderRadius: "50%", background: C.lavSoft, border: `2px solid ${C.lavender}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 34, marginBottom: 8 }}>{avatar}</div>
        <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 20, fontWeight: 600, color: C.dark, marginBottom: 2 }}>Erika Panico</div>
        <div style={{ fontSize: 12, color: C.lavText }}>@mahji_erika</div>
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
            <span style={{ fontSize: 9, color: C.lavText, fontWeight: 500 }}>{b.d}</span></div>))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[{i:"🏆",l:"Win Rate",v:"25%",s:"3 of 12 games"},{i:"📚",l:"Lessons",v:"6 / 9",s:"67% complete"},
          {i:"🎯",l:"Daily Goal",v:`${goal} games`,s:"Per day target"},{i:"⏱️",l:"Time Played",v:"4h 23m",s:"This month"}].map(s => (
          <div key={s.l} style={{ background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.i}</div>
            <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 18, fontWeight: 600, color: C.dark }}>{s.v}</div>
            <div style={{ fontSize: 10, color: C.lavText, fontWeight: 500, letterSpacing: .5, marginTop: 2 }}>{s.l}</div>
            <div style={{ fontSize: 9, color: C.light, marginTop: 1 }}>{s.s}</div></div>))}
      </div>

      <SH>Account</SH>
      <Row icon={I.edit} label="Edit Profile" sub="Name, username, avatar, goals" onClick={() => setSub("edit")}/>
      <Row icon={I.settings} label="Preferences" sub="Notifications, sounds, defaults" onClick={() => setSub("prefs")}/>
      <Row icon={I.creditCard} label="Billing" sub="Free plan — no charges"/>
      <SH>Invite Friends</SH>
      <div style={{ background: C.white, border: `1px solid ${C.lavBorder}`, borderRadius: 14, padding: "16px 16px", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: C.dark, marginBottom: 6 }}>Share Mahji with friends</div>
        <p style={{ fontSize: 12, color: C.light, lineHeight: 1.5, marginBottom: 12 }}>Give friends 4 weeks free when they sign up with your code. You'll get 2 bonus weeks too!</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, padding: "10px 14px", background: C.lavHint, border: `1px solid ${C.lavBorder}`, borderRadius: 10, fontFamily: "'Bodoni Moda',serif", fontSize: 16, fontWeight: 600, color: C.lavDeep, letterSpacing: 2, textAlign: "center" }}>MAHJI-ERIKA</div>
          <div style={{ padding: "10px 16px", background: C.seafoam, color: C.white, borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Copy</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ flex: 1, padding: "10px", border: `1px solid ${C.lavBorder}`, borderRadius: 10, fontSize: 12, fontWeight: 500, color: C.mid, background: C.white, cursor: "pointer" }}>Text a Friend</button>
          <button style={{ flex: 1, padding: "10px", border: `1px solid ${C.lavBorder}`, borderRadius: 10, fontSize: 12, fontWeight: 500, color: C.mid, background: C.white, cursor: "pointer" }}>Share Link</button>
        </div>
      </div>

      <SH>Danger Zone</SH>
      <Row icon={I.trash} label="Delete All Data" sub="Wipe stats, progress, and preferences" danger/>
      <Row icon={I.logOut} label="Sign Out" danger onClick={onSignOut}/>
      <div style={{ textAlign: "center", marginTop: 20, marginBottom: 10 }}><div style={{ fontSize: 10, color: C.lavText, letterSpacing: 1 }}>MAHJI v1.0 — Free to play</div></div>
    </Cnt>
  </>);
}

export default ProfilePage;
