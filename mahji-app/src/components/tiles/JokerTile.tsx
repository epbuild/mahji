// src/components/tiles/JokerTile.tsx
import React from 'react';

const STAR_COLS = [
  { star:'#B8A9C9', trail:'#D4A0B0' },
  { star:'#89B4D4', trail:'#7FBFB3' },
  { star:'#C2413B', trail:'#C4A96A' },
  { star:'#7FBFB3', trail:'#89B4D4' },
  { star:'#D4A0B0', trail:'#B8A9C9' },
  { star:'#C4A96A', trail:'#C2413B' },
  { star:'#89B4D4', trail:'#B8A9C9' },
  { star:'#C2413B', trail:'#D4A0B0' },
];

interface JokerTileProps { index: number; size?: string; }

export const JokerTile: React.FC<JokerTileProps> = ({ index }) => {
  const c = STAR_COLS[(index - 1) % 8];
  return (
    <div className="flex flex-col items-center justify-center" style={{ background: 'linear-gradient(180deg, #FBF8FE 0%, #F8F4FB 100%)', borderRadius: 'inherit', width: '100%', height: '100%' }}>
      <span style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 13, fontWeight: 700, fontStyle: 'italic', letterSpacing: 3, color: c.star }}>
        JOKER
      </span>
      <svg viewBox="0 0 12 12" width="12" height="12" className="my-0.5">
        <polygon points="6,0 7.5,4 12,4 8.5,7 9.5,12 6,9 2.5,12 3.5,7 0,4 4.5,4" fill={c.trail} opacity="0.5"/>
      </svg>
      <svg viewBox="0 0 66 50" width="66" height="50">
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
  );
};
