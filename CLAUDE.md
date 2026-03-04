# CLAUDE.md - Mahji Project Rules

## Project Overview
Mahji is a modern American Mahjong learning and playing app built with React + TypeScript + Vite. It teaches tiles, rules, strategy, and includes practice drills (Charleston, Learn the Hands, Reading Exposures) and AI gameplay.

## Tech Stack
- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Inline styles (no CSS framework) with theme system (`useTheme`, `getThemeColors`)
- **Fonts:** Bodoni Moda (headings/accents), Outfit (body/UI), Noto Sans SC (Chinese characters)
- **Deployment:** Netlify (from `responsive` branch)
- **Version Control:** Git with worktrees (`claude/cranky-clarke` merges into `responsive`)

## Architecture & File Structure
```
src/
  App.tsx                  # Root router (hash-based)
  main.tsx                 # Entry point
  components/
    Layout.tsx             # App shell, nav, theme toggle
    tiles/                 # All tile rendering (MahjiTile is the universal component)
      MahjiTile.tsx        # Main tile component (supports all suits, sizes, faceDown)
      BambooTile.tsx       # Bamboo suit SVG art
      CharacterTile.tsx    # Character/Crack suit SVG art
      DotTile.tsx          # Dot suit SVG art
      DragonTile.tsx       # Dragon SVG art
      WindTile.tsx         # Wind SVG art
      FlowerTile.tsx       # Flower SVG art
      JokerTile.tsx        # Joker SVG art
      TileBack.tsx         # Face-down tile back
    ui/                    # Shared UI components (Icons, etc.)
  constants/
    colors.ts              # Color system (C object, getThemeColors)
    ThemeContext.tsx        # Light/dark theme provider
  data/
    tileData.ts            # GameTile type, getFullDeck(), shuffleDeck()
    nmjl/                  # NMJL card data, hand matching, pattern expansion
  pages/
    HomePage.tsx
    PlayPage.tsx
    PracticePage.tsx
    LearnPage.tsx
    StatsPage.tsx
    BamPage.tsx            # Bam Bird AI mentor
    practice/
      CharlestonDrill.tsx  # Charleston practice drill
      LearnHandsDrill.tsx  # Learn the Hands drill
      ReadExposuresDrill.tsx
    learn/                 # Learning content pages
```

## Design System

### Color Palette
- **Cherry Red:** `#E03050` (primary accent, CTAs, Mahji branding)
- **Lavender Deep:** `#6B3FA0` (secondary, purple buttons)
- **Seafoam:** `#6DBFA8` (tertiary, success states, Bam Bird)
- **Text Dark:** `#2D1B4E` (primary text)
- **Text Mid:** `#6B5A82` (secondary text)

### Typography
- Headings & accents: `fontFamily: "'Bodoni Moda', serif"` with `letterSpacing` and `textTransform: uppercase`
- Body & UI: `fontFamily: "'Outfit', sans-serif"`
- Chinese characters on tiles: `fontFamily: "'Noto Sans SC', sans-serif"`

### UI Conventions
- **Border radius:** 10-14px for cards, 6-8px for pills/badges
- **Shadows:** Subtle (`0 1px 4px rgba(0,0,0,0.05)` to `0 8px 32px rgba(0,0,0,0.12)`)
- **Buttons:** Solid fill for primary actions, outlined for secondary/tertiary
- **No emojis** in UI unless user explicitly requests them
- **Mobile-first:** All layouts designed for phone viewport (375px)

### Mat Colors (Charleston Drill)
Four game mat backgrounds with contrast-optimized seat labels:
- **Coffee:** Dark brown gradient, seafoam labels (`seatBg`, `readyColor: "#6DBFA8"`)
- **Seafoam:** Teal gradient, brown labels (`readyColor: "#4A3D32"`)
- **Lavender:** Purple gradient, brown labels
- **Cerulean:** Blue gradient, brown labels

## Tile System

### GameTile Type
Every tile has: `id`, `instanceId` (unique), `suit`, `value`, `name`, `displayName`. Use `getFullDeck()` for a standard 152-tile American Mahjong set.

### MahjiTile Component
- Universal renderer: `<MahjiTile tile={tile} size="sm|md|lg" faceDown={bool} />`
- Sizes: `sm` (36x50), `md` (52x72), `lg` (72x100)
- All tile art is custom SVG - NEVER duplicate tile art, always use MahjiTile
- `faceDown` prop renders the tile back (red/maroon design)

### Tile Suits
`bamboo`, `dots`, `characters`, `winds` (N/S/E/W), `dragons` (red/green/white), `flowers` (8 unique), `jokers` (8 identical)

## NMJL Card System
- Cards loaded async via `getCard(year)` from `src/data/nmjl/`
- Hands have patterns with `numberConstraint` (e.g., `any_like`, `any_consecutive`)
- `expandNumberConstraint()` generates all valid number variants
- `enumerateColorAssignments()` generates all valid color combos per pattern
- `findPartialMatches()` finds which hands a given set of tiles partially matches
- Pattern matching must try ALL expanded variants x ALL color assignments (not just first match)

## Charleston Drill Specifics

### Pass Sequence
First Charleston: Right -> Over -> Left(blind) -> [Continue/Stop prompt]
Second Charleston: Left -> Over -> Right(blind) -> [Courtesy prompt]
Courtesy Pass: 0-3 tiles across

### Blind Pass UX
- Shows "B" buttons in pass box (user presses B to fill with tile back, clicks back to remove)
- Hand shows dashed outline placeholders for selected tiles (NOT face-down tile backs)
- `blindSlotCount` state tracks filled B slots
- `executePass` auto-selects random non-joker tiles for remaining blind slots

### Pass Animation
Directional "soft red zoom" keyframes with blur effect:
- Scale up to 1.18 at 30%, then shrink to 0.7 with directional drift (100px)
- Uses `filter: blur()` for abstract feel
- Red glow via `box-shadow: rgba(224,48,80,...)`

### Completion Popup
Three buttons in order:
1. "Continue this match ->" (red)
2. "Practice new tiles" (purple, deals fresh hand)
3. "Practice these tiles again" (outlined, restarts same initial hand)

## Critical Rules

### DO NOT
- Never duplicate tile SVG art - always use `MahjiTile` component
- Never use CSS frameworks (Tailwind, etc.) - use inline styles only
- Never add emojis to UI text unless explicitly asked
- Never use `flex-wrap: wrap` on pass box slot containers (causes vertical stacking)
- Never show face-down tile backs as hand placeholders during blind passes
- Never skip testing ALL expanded number variants in pattern matching (causes wrong match counts)

### ALWAYS
- Use `instanceId` (not `id`) when tracking individual tiles (multiple tiles share the same `id`)
- Filter out jokers from pass selection (`isJoker(tile)` check)
- Reset `blindSlotCount` to 0 after each pass resolves
- Save initial hands in `initialHandsRef` when dealing for "practice same tiles" replay
- Use `'Bodoni Moda'` for headings/labels and `'Outfit'` for body text
- Match seat label colors to mat for contrast (seafoam on coffee, brown on lighter mats)
- Keep "Ready" text as plain colored text (no background badge)
- Ensure responsive tile scaling via `transform: scale()` with measured natural width

### Sorting Conventions
- **Sort by Rank:** Winds (N->E->W->S) -> Dragons (R->G->W) -> Bamboo -> Dots -> Characters -> Flowers -> Jokers
- **Sort by Suit:** Group by suit, then by value within suit

### Received Tile "NEW" Badge
- Tiles received from a pass get a seafoam `#6DBFA8` "NEW" badge (top-right corner)
- Badge disappears when the tile is tapped, dragged, or otherwise interacted with
- Tracked via `receivedTileIds` (tiles that arrived from a pass) and `touchedTileIds` (tiles the user has touched)
- A tile is "new" when `receivedTileIds.has(instanceId) && !touchedTileIds.has(instanceId)`

### Drag-and-Drop System
- Hand supports both **tap-to-select** (add to pass box) AND **drag-to-reorder** (rearrange hand) / **drag-to-pass-box**
- State: `dragIdx` (index being dragged), `dragOverIdx` (index being hovered over)
- `e.dataTransfer.setData("source", "hand" | "passbox")` distinguishes drag origin
- Drop on pass box: adds tile to selection. Drop from passbox back to hand: deselects tile
- Drag within hand: reorders tiles in `players[0].hand` array

### Pattern Matching (Critical)
- **WARNING:** Always iterate ALL `expandNumberConstraint()` variants x ALL `enumerateColorAssignments()` and take the **MAX** count
- Do NOT break out of the outer loop when a match is found - this causes the algorithm to always land on the last variant (e.g., n=9) instead of the correct one
- The same bug existed in both `computeRealMatchCount` and `activateHintHand` and was fixed twice
- Color assignments are identical across all number variants (group colors don't change with number substitution), which is why breaking early always overwrites to the last variant

### Light/Dark Theme
- App supports light and dark themes via `ThemeContext` (`useTheme()` hook)
- Charleston drill uses `uiThemes` object mapping `light`/`dark` to bg, chrome, text, cherry, lavDeep, seafoam colors
- Always use theme variables (`U.cherry`, `U.text`, `U.textMid`, `U.bg`, etc.) rather than hardcoded colors for theme-aware UI elements
- Mat colors (`MATS` array) are separate from the app theme - they style the game board area only

### Git Workflow
1. Work on `claude/cranky-clarke` worktree
2. Commit and push to `origin claude/cranky-clarke`
3. Switch to main repo: `cd /Users/erikapanico/Documents/GitHub/mahji`
4. `git checkout responsive && git merge claude/cranky-clarke --no-edit && git push origin responsive`
5. Netlify auto-deploys from `responsive` branch

## Testing & Verification
- Always take screenshots after UI changes to verify visual correctness
- Test on Coffee mat (dark) AND a lighter mat (seafoam/lavender) for contrast
- Verify hand matching counts against known patterns (e.g., "FF 3333 D 3333 D 33" should match 8 tiles)
- Test blind pass B-button interaction: press B -> tile back appears, click back -> removes
- Verify courtesy pass slot count matches selected tile count (1, 2, or 3)
