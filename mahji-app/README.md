# Mahji

Modern American Mahjong — learn, practice, and play.

## Tech Stack
- **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **Vite** for bundling
- Deploy: Netlify / Vercel

## Project Structure
```
src/
  App.tsx                    # Interactive prototype (all pages)
  index.css                  # Global styles + Tailwind
  components/
    tiles/                   # SVG tile components (the Mahji set)
      MahjiTile.tsx          # Universal tile renderer
      DotTile.tsx            # Dots 1-9
      BambooTile.tsx         # Bamboo 1-9 (1-Bam = bird)
      CharacterTile.tsx      # Characters 1-9 (Chinese numerals)
      WindTile.tsx            # E, S, W, N
      DragonTile.tsx          # Red, Green, Soap
      FlowerTile.tsx          # 8 unique flowers
      JokerTile.tsx           # 8 jokers
      TileBack.tsx            # Cherry red tile back
      index.ts               # Barrel export
  data/
    tileData.ts              # 152-tile definitions, deck builder, shuffle
  pages/
    TileGallery.tsx          # Full tile gallery display
  wireframes/                # Original HTML wireframes (reference)
```

## Local Development
```bash
npm install
npm run dev
```

## Design System
- **Colors:** Cherry (#E03050), Lavender Deep (#7E64A4), Seafoam (#6DBFA8), Cerulean (#8EC7E2), Coffee (#4A3D32)
- **Fonts:** Bodoni Moda (display), Outfit (body), Noto Sans SC (Chinese characters)
- **Mat Colors:** Coffee, Seafoam, Lavender, Cerulean

## Tile Set
152 tiles total: 36 Dots + 36 Bamboo + 36 Characters + 16 Winds + 12 Dragons + 8 Flowers + 8 Jokers. All rendered as inline SVG React components — scalable, animatable, game-engine ready.
