// src/components/tiles/DragonTile.tsx
import React from 'react';

const SOAP_COLORS = ['#B8A9C9','#89B4D4','#7FBFB3','#D4A0B0','#C2413B'];

function RedSnake() {
  const dots = [[42,16],[50,24],[46,32],[36,38],[26,44],[20,52],[18,60],[22,68],[30,74],[34,80]];
  return (
    <svg viewBox="0 0 70 100" width="70" height="100">
      <path d="M35 12 C50 12 55 22 50 32 C45 42 25 42 20 52 C15 62 20 72 30 76 C35 78 38 80 35 88" fill="none" stroke="#C2413B" strokeWidth="7" strokeLinecap="round"/>
      <path d="M35 12 C50 12 55 22 50 32 C45 42 25 42 20 52 C15 62 20 72 30 76 C35 78 38 80 35 88" fill="none" stroke="#D87070" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
      {dots.map(([cx,cy], i) => <circle key={i} cx={cx} cy={cy} r="1.2" fill="white" opacity="0.6"/>)}
      <ellipse cx="35" cy="10" rx="6" ry="5" fill="#C2413B"/>
      <circle cx="33" cy="8.5" r="1.4" fill="white"/><circle cx="33" cy="8.5" r="0.7" fill="#333"/>
      <line x1="35" y1="5" x2="33" y2="1" stroke="#C2413B" strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="35" y1="5" x2="37" y2="1" stroke="#C2413B" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M35 88 Q32 94 30 96" fill="none" stroke="#C2413B" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function GreenSnake() {
  const dots = [[28,16],[20,24],[22,32],[32,38],[42,44],[50,52],[52,60],[48,68],[40,74],[36,80]];
  return (
    <svg viewBox="0 0 70 100" width="70" height="100">
      <path d="M35 12 C20 12 15 22 20 32 C25 42 45 42 50 52 C55 62 50 72 40 76 C35 78 32 80 35 88" fill="none" stroke="#2E8B57" strokeWidth="7" strokeLinecap="round"/>
      <path d="M35 12 C20 12 15 22 20 32 C25 42 45 42 50 52 C55 62 50 72 40 76 C35 78 32 80 35 88" fill="none" stroke="#5ABF7F" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
      {dots.map(([cx,cy], i) => <circle key={i} cx={cx} cy={cy} r="1.2" fill="white" opacity="0.6"/>)}
      <ellipse cx="35" cy="10" rx="6" ry="5" fill="#2E8B57"/>
      <circle cx="37" cy="8.5" r="1.4" fill="white"/><circle cx="37" cy="8.5" r="0.7" fill="#333"/>
      <line x1="35" y1="5" x2="33" y2="1" stroke="#2E8B57" strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="35" y1="5" x2="37" y2="1" stroke="#2E8B57" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M35 88 Q38 94 40 96" fill="none" stroke="#2E8B57" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function SoapDragon() {
  const els: React.ReactElement[] = [];
  // Top row
  for (let i = 0; i < 6; i++) { const x = 10+i*10, c = SOAP_COLORS[i%5]; els.push(<g key={`t${i}`}><circle cx={x} cy="8" r="3.2" fill={`${c}22`} stroke={c} strokeWidth="1"/><circle cx={x} cy="8" r="1.5" fill={c} opacity="0.6"/><circle cx={x} cy="8" r="4.5" fill="none" stroke={c} strokeWidth="0.4" strokeDasharray="1.5 1.5" opacity="0.5"/></g>); }
  // Bottom row
  for (let i = 0; i < 6; i++) { const x = 10+i*10, c = SOAP_COLORS[(i+2)%5]; els.push(<g key={`b${i}`}><circle cx={x} cy="92" r="3.2" fill={`${c}22`} stroke={c} strokeWidth="1"/><circle cx={x} cy="92" r="1.5" fill={c} opacity="0.6"/><circle cx={x} cy="92" r="4.5" fill="none" stroke={c} strokeWidth="0.4" strokeDasharray="1.5 1.5" opacity="0.5"/></g>); }
  // Left column
  for (let i = 0; i < 6; i++) { const y = 18+i*13, c = SOAP_COLORS[(i+1)%5]; els.push(<g key={`l${i}`}><circle cx="8" cy={y} r="3.2" fill={`${c}22`} stroke={c} strokeWidth="1"/><circle cx="8" cy={y} r="1.5" fill={c} opacity="0.6"/><circle cx="8" cy={y} r="4.5" fill="none" stroke={c} strokeWidth="0.4" strokeDasharray="1.5 1.5" opacity="0.5"/></g>); }
  // Right column
  for (let i = 0; i < 6; i++) { const y = 18+i*13, c = SOAP_COLORS[(i+3)%5]; els.push(<g key={`r${i}`}><circle cx="62" cy={y} r="3.2" fill={`${c}22`} stroke={c} strokeWidth="1"/><circle cx="62" cy={y} r="1.5" fill={c} opacity="0.6"/><circle cx="62" cy={y} r="4.5" fill="none" stroke={c} strokeWidth="0.4" strokeDasharray="1.5 1.5" opacity="0.5"/></g>); }
  return <svg viewBox="0 0 70 100" width="70" height="100">{els}</svg>;
}

interface DragonTileProps { type: 'red'|'green'|'white'; size?: string; }

export const DragonTile: React.FC<DragonTileProps> = ({ type }) => {
  if (type === 'red') return <RedSnake />;
  if (type === 'green') return <GreenSnake />;
  return <SoapDragon />;
};
