// src/components/tiles/FlowerTile.tsx
import React from 'react';

const F_COLS = [
  { p:'#B8A9C9', s:'#D4A0B0', c:'#C4A96A' },
  { p:'#89B4D4', s:'#A8D0E4', c:'#C2413B' },
  { p:'#7FBFB3', s:'#A8D9CF', c:'#B8A9C9' },
  { p:'#D4A0B0', s:'#E8C0CC', c:'#7FBFB3' },
  { p:'#C2413B', s:'#D87070', c:'#C4A96A' },
  { p:'#8B7355', s:'#A89070', c:'#C2413B' },
  { p:'#89B4D4', s:'#B8A9C9', c:'#7FBFB3' },
  { p:'#7FBFB3', s:'#C2413B', c:'#B8A9C9' },
];

function FlowerSvg({ p, s, c, variant }: { p: string; s: string; c: string; variant: number }) {
  const anglesFor = (n: number) => Array.from({ length: n }, (_, i) => Math.round(i * (360 / n)));
  
  switch (variant) {
    case 1: return ( // Peony
      <svg viewBox="0 0 70 80" width="70" height="80">
        {anglesFor(8).map(a => <ellipse key={`o${a}`} cx="35" cy="28" rx="8" ry="14" fill={p} opacity="0.8" transform={`rotate(${a} 35 40)`}/>)}
        {anglesFor(8).map((_, i) => <ellipse key={`i${i}`} cx="35" cy="30" rx="6" ry="10" fill={s} opacity="0.65" transform={`rotate(${22+i*45} 35 40)`}/>)}
        <circle cx="35" cy="40" r="8" fill={c}/><circle cx="35" cy="40" r="4" fill="white" opacity="0.25"/>
      </svg>
    );
    case 2: return ( // Tropical teardrop
      <svg viewBox="0 0 70 80" width="70" height="80">
        {anglesFor(5).map(a => <path key={`o${a}`} d={`M35 40 Q28 20 35 12 Q42 20 35 40`} fill={p} opacity="0.85" transform={`rotate(${a} 35 40)`}/>)}
        {anglesFor(5).map(a => <path key={`i${a}`} d={`M35 40 Q31 26 35 20 Q39 26 35 40`} fill={s} opacity="0.5" transform={`rotate(${a} 35 40)`}/>)}
        <circle cx="35" cy="40" r="7" fill={c}/><circle cx="35" cy="40" r="3.5" fill={s} opacity="0.45"/>
      </svg>
    );
    case 3: return ( // Hibiscus
      <svg viewBox="0 0 70 80" width="70" height="80">
        {anglesFor(5).map(a => <circle key={`p${a}`} cx="35" cy="26" r="12" fill={p} opacity="0.7" transform={`rotate(${a} 35 40)`}/>)}
        <circle cx="35" cy="40" r="8" fill={c}/><circle cx="35" cy="40" r="4" fill={s} opacity="0.5"/>
        {anglesFor(6).map(a => <circle key={`s${a}`} cx="35" cy="35" r="1.2" fill="white" opacity="0.5" transform={`rotate(${a} 35 40)`}/>)}
      </svg>
    );
    case 4: return ( // Lotus
      <svg viewBox="0 0 70 80" width="70" height="80">
        {Array.from({length:9},(_,i)=>i*40).map(a => <ellipse key={`o${a}`} cx="35" cy="26" rx="6.5" ry="15" fill={p} opacity="0.75" transform={`rotate(${a} 35 40)`}/>)}
        {Array.from({length:9},(_,i)=>20+i*40).map(a => <ellipse key={`i${a}`} cx="35" cy="30" rx="4.5" ry="10" fill={s} opacity="0.55" transform={`rotate(${a} 35 40)`}/>)}
        <circle cx="35" cy="40" r="6.5" fill={c}/>
      </svg>
    );
    case 5: return ( // Zinnia
      <svg viewBox="0 0 70 80" width="70" height="80">
        {anglesFor(12).map(a => <ellipse key={`o${a}`} cx="35" cy="27" rx="4" ry="13" fill={p} opacity="0.7" transform={`rotate(${a} 35 40)`}/>)}
        {Array.from({length:12},(_,i)=>15+i*30).map(a => <ellipse key={`i${a}`} cx="35" cy="30" rx="3" ry="10" fill={s} opacity="0.5" transform={`rotate(${a} 35 40)`}/>)}
        <circle cx="35" cy="40" r="7.5" fill={c}/><circle cx="35" cy="40" r="3.5" fill="white" opacity="0.2"/>
      </svg>
    );
    case 6: return ( // Camellia
      <svg viewBox="0 0 70 80" width="70" height="80">
        {anglesFor(6).map(a => <ellipse key={a} cx="35" cy="24" rx="10" ry="16" fill={p} opacity="0.8" transform={`rotate(${a} 35 40)`}/>)}
        <circle cx="35" cy="40" r="9" fill={c}/><circle cx="35" cy="40" r="5" fill={s} opacity="0.4"/>
      </svg>
    );
    case 7: return ( // Cosmos hearts
      <svg viewBox="0 0 70 80" width="70" height="80">
        {anglesFor(8).map(a => <path key={a} d={`M35 40 Q28 30 26 22 Q30 18 35 24 Q40 18 44 22 Q42 30 35 40`} fill={p} opacity="0.75" transform={`rotate(${a} 35 40)`}/>)}
        <circle cx="35" cy="40" r="7" fill={c}/><circle cx="35" cy="40" r="3.5" fill="white" opacity="0.3"/>
      </svg>
    );
    case 8: default: return ( // Sunflower
      <svg viewBox="0 0 70 80" width="70" height="80">
        {Array.from({length:14},(_,i)=>Math.round(i*25.7)).map(a => <ellipse key={a} cx="35" cy="28" rx="4.5" ry="11" fill={p} opacity="0.75" transform={`rotate(${a} 35 40)`}/>)}
        <circle cx="35" cy="40" r="10" fill={c}/><circle cx="35" cy="40" r="7" fill={s} opacity="0.35"/><circle cx="35" cy="40" r="4" fill={c} opacity="0.6"/>
      </svg>
    );
  }
}

interface FlowerTileProps { index: number; size?: string; }

export const FlowerTile: React.FC<FlowerTileProps> = ({ index }) => {
  const fc = F_COLS[(index - 1) % 8];
  return <FlowerSvg p={fc.p} s={fc.s} c={fc.c} variant={index} />;
};
