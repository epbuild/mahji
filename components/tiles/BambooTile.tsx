// src/components/tiles/BambooTile.tsx
import React from 'react';

const BAM_COLS = ['#7FBFB3','#89B4D4','#B8A9C9','#8B7355'];
const BAM_DARK = ['#5A9E93','#6A9AB8','#9484A8','#6B5540'];

const BirdSvg = () => (
  <svg viewBox="0 0 68 96" width="68" height="96">
    <rect x="30" y="48" width="7" height="46" rx="3.5" fill="#7FBFB3"/>
    <rect x="28" y="58" width="11" height="3" rx="1.5" fill="#5A9E93"/>
    <rect x="28" y="70" width="11" height="3" rx="1.5" fill="#5A9E93"/>
    <rect x="28" y="82" width="11" height="3" rx="1.5" fill="#5A9E93"/>
    <ellipse cx="23" cy="52" rx="9" ry="3" transform="rotate(-25 23 52)" fill="#7FBFB3" opacity="0.5"/>
    <ellipse cx="45" cy="56" rx="8" ry="2.5" transform="rotate(20 45 56)" fill="#89B4D4" opacity="0.4"/>
    <path d="M14 34 Q6 22 4 14 Q8 20 16 30" fill="#B8A9C9" opacity="0.8"/>
    <path d="M16 32 Q10 18 10 10 Q14 18 18 28" fill="#7FBFB3" opacity="0.7"/>
    <path d="M18 31 Q14 16 16 8 Q18 16 20 27" fill="#89B4D4" opacity="0.75"/>
    <path d="M20 30 Q19 14 22 8 Q22 16 22 26" fill="#D4A0B0" opacity="0.6"/>
    <ellipse cx="34" cy="32" rx="15" ry="12" fill="#89B4D4"/>
    <ellipse cx="34" cy="35" rx="12" ry="8" fill="#A8D0E4"/>
    <path d="M22 28 Q16 20 20 14 Q24 22 30 26 Z" fill="#6D9ABB"/>
    <path d="M24 30 Q20 24 22 18 Q26 24 30 28 Z" fill="#5A8FAD" opacity="0.6"/>
    <circle cx="46" cy="22" r="8.5" fill="#89B4D4"/>
    <circle cx="46" cy="22" r="7.5" fill="#78C4B0"/>
    <circle cx="49" cy="20" r="3" fill="white"/>
    <circle cx="49" cy="20" r="2" fill="#333"/>
    <circle cx="49.5" cy="19.5" r="0.7" fill="white"/>
    <path d="M53 22 L60 20.5 L53 24 Z" fill="#C4A96A"/>
    <path d="M43 14 Q45 7 47 14" fill="none" stroke="#C2413B" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="45" cy="8" r="1.2" fill="#C2413B"/>
    <path d="M30 44 L27 47 M30 44 L26 44" stroke="#8B7355" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M37 44 L40 47 M37 44 L41 44" stroke="#8B7355" strokeWidth="1.2" strokeLinecap="round"/>
    <ellipse cx="36" cy="38" rx="6" ry="3.5" fill="#B8D8EB" opacity="0.4"/>
  </svg>
);

function StalksSvg({ count }: { count: number }) {
  const w = 68, h = 96;
  const elements: React.ReactElement[] = [];

  if (count <= 4) {
    const stW = 7, stH = 65;
    const totalW = count * stW + (count - 1) * 6;
    const startX = (w - totalW) / 2;
    const startY = h - stH - 4;

    for (let i = 0; i < count; i++) {
      const x = startX + i * (stW + 6);
      const col = BAM_COLS[i % 4], dark = BAM_DARK[i % 4];
      elements.push(<rect key={`s${i}`} x={x} y={startY} width={stW} height={stH} rx={stW/2} fill={col}/>);
      [0.25, 0.5, 0.75].forEach((p, j) => {
        elements.push(<rect key={`n${i}-${j}`} x={x-2} y={startY + stH*p} width={stW+4} height={3} rx={1.5} fill={dark}/>);
      });
      elements.push(<ellipse key={`l${i}`} cx={x+stW+5} cy={startY+5} rx={6} ry={2.2} fill={col} opacity={0.5} transform={`rotate(15 ${x+stW+5} ${startY+5})`}/>);
    }
  } else {
    const botCount = Math.ceil(count / 2);
    const topCount = count - botCount;
    const stW = 6, stH = 38;

    const botTotalW = botCount * stW + (botCount - 1) * 5;
    const botStartX = (w - botTotalW) / 2;
    const botY = h - stH - 4;
    for (let i = 0; i < botCount; i++) {
      const x = botStartX + i * (stW + 5);
      const ci = (i + topCount) % 4;
      const col = BAM_COLS[ci], dark = BAM_DARK[ci];
      elements.push(<rect key={`bs${i}`} x={x} y={botY} width={stW} height={stH} rx={stW/2} fill={col}/>);
      [0.3, 0.6].forEach((p, j) => {
        elements.push(<rect key={`bn${i}-${j}`} x={x-1.5} y={botY+stH*p} width={stW+3} height={2.5} rx={1} fill={dark}/>);
      });
      elements.push(<ellipse key={`bl${i}`} cx={x+stW+4} cy={botY+3} rx={5} ry={2} fill={col} opacity={0.45} transform={`rotate(12 ${x+stW+4} ${botY+3})`}/>);
    }

    const topTotalW = topCount * stW + (topCount - 1) * 5;
    const topStartX = (w - topTotalW) / 2;
    const topY = botY - stH - 6;
    for (let i = 0; i < topCount; i++) {
      const x = topStartX + i * (stW + 5);
      const col = BAM_COLS[i % 4], dark = BAM_DARK[i % 4];
      elements.push(<rect key={`ts${i}`} x={x} y={topY} width={stW} height={stH} rx={stW/2} fill={col}/>);
      [0.3, 0.6].forEach((p, j) => {
        elements.push(<rect key={`tn${i}-${j}`} x={x-1.5} y={topY+stH*p} width={stW+3} height={2.5} rx={1} fill={dark}/>);
      });
      elements.push(<ellipse key={`tl${i}`} cx={x+stW+4} cy={topY+3} rx={5} ry={2} fill={col} opacity={0.45} transform={`rotate(12 ${x+stW+4} ${topY+3})`}/>);
    }
  }

  return <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>{elements}</svg>;
}

interface BambooTileProps { number: number; size?: string; }

export const BambooTile: React.FC<BambooTileProps> = ({ number }) => (
  <>
    <div className="absolute top-1 right-1.5 text-xs font-bold" style={{ fontFamily: "'Bodoni Moda', serif", color: '#2E8B57' }}>
      {number}
    </div>
    {number === 1 ? <BirdSvg /> : <StalksSvg count={number} />}
  </>
);
