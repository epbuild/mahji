// src/pages/TileGallery.tsx
import React, { useEffect } from 'react';
import { MahjiTile, TileBack } from '../components/tiles';
import { getTilesBySuit, SUIT_INFO, TileSuit } from '../data/tileData';

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap';

function useFontLoader() {
  useEffect(() => {
    const existing = document.querySelector(`link[href="${FONT_URL}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = FONT_URL;
      document.head.appendChild(link);
    }
  }, []);
}

const SUIT_ORDER: TileSuit[] = ['dots', 'bamboo', 'characters', 'winds', 'dragons', 'flowers', 'jokers'];

function SuitSection({ suit }: { suit: TileSuit }) {
  const tiles = getTilesBySuit(suit);
  const info = SUIT_INFO[suit];

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold font-display text-lavender-deep">
          {info.label}
        </h2>
        <span className="text-xs font-semibold bg-lavender-deep text-white px-2.5 py-0.5 rounded-full">
          ×{info.count}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-lavender to-transparent" />
      </div>
      <div className="flex flex-wrap gap-3">
        {tiles.map((tile) => (
          <MahjiTile key={tile.id} tile={tile} size="lg" />
        ))}
      </div>
      <p className="text-xs text-gray-400 italic mt-2 pl-1">{info.note}</p>
    </section>
  );
}

export default function TileGallery() {
  useFontLoader();
  return (
    <div className="min-h-screen py-8 px-6" style={{ background: 'linear-gradient(135deg, #F5F0F8 0%, #EEF2F7 40%, #F0F6F4 100%)' }}>
      <h1 className="text-4xl font-bold text-center mb-1 tracking-widest font-display text-cherry">
        MAHJI
      </h1>
      <p className="text-center text-xs tracking-[4px] uppercase mb-10 font-medium text-lavender">
        Complete Tile Gallery — 152 Tiles
      </p>
      {SUIT_ORDER.map(suit => (
        <SuitSection key={suit} suit={suit} />
      ))}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold font-display text-lavender-deep">Tile Back</h2>
          <span className="text-xs font-semibold bg-lavender-deep text-white px-2.5 py-0.5 rounded-full">×152</span>
          <div className="flex-1 h-px bg-gradient-to-r from-lavender to-transparent" />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="w-[84px] h-[114px] rounded-[10px] shadow-md flex items-center justify-center transition-transform hover:-translate-y-0.5"
            style={{ background: '#C2413B', border: '1.5px solid #D4534D' }}>
            <TileBack />
          </div>
        </div>
        <p className="text-xs text-gray-400 italic mt-2 pl-1">Cherry red back with the Mahji symbol.</p>
      </section>
    </div>
  );
}
