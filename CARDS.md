# CARDS.md - NMJL Card Data Reference

## Overview

Each year, the National Mah Jongg League (NMJL) publishes a new card with ~50-70 winning hands. Mahji encodes these hands as structured data so the app can validate wins, show partial matches, render hand displays, and power practice drills.

This document explains how card data flows through the app and how to add a new card year.

---

## Architecture: How Card Data Works

```
card-audit/nmjl-YYYY-audit.csv    <-- Human-readable source of truth (you edit this)
        |
        v
src/data/nmjl/nmjlYYYY.ts         <-- TypeScript hand definitions (Claude generates from CSV)
        |
        v
src/data/nmjl/registry.ts         <-- Lazy-loads card by year (add 1 line for new year)
        |
        v
getCard(year) / getCardSync(year)  <-- App uses these to access card data
        |
        v
validation.ts                      <-- Pattern matching, partial matches, hand hints
```

### Key Files

| File | Purpose |
|------|---------|
| `card-audit/nmjl-YYYY-audit.csv` | Audited color assignments per hand (human-editable) |
| `src/data/nmjl/nmjlYYYY.ts` | TypeScript hand definitions with helper factories |
| `src/data/nmjl/registry.ts` | Registers available card years, lazy-loads on demand |
| `src/data/nmjl/types.ts` | All type definitions (`HandDefinition`, `TileGroup`, etc.) |
| `src/data/nmjl/constants.ts` | Section order, labels, joker policies, dragon/suit maps |
| `src/data/nmjl/validation.ts` | Matching engine (color assignments, number expansion, partial match) |
| `src/data/nmjl/index.ts` | Public re-exports for the rest of the app |

---

## The Color System

The NMJL card prints hands in **3 colors**: green, red, and blue. These are abstract suit markers:

| Rule | Meaning |
|------|---------|
| **Same color = same suit** | All green groups in a hand use the same numbered suit (bamboo, dots, or characters) |
| **Different colors = different suits** | Green, red, and blue each map to a different numbered suit |
| **Blue = neutral** | Winds (N/E/W/S), flowers (F), and unmatched dragons always use blue |
| **Any 1 Suit** | All groups are blue (since there's only one suit, it's always blue) |
| **Matching dragon** | A dragon that corresponds to the suit (red dragon=characters, green dragon=bamboo, white dragon=dots) |
| **Opposite dragon** | A dragon that does NOT correspond to the suit |

### Critical Rule: "Any 1 Suit" = All Blue

When a hand is "Any 1 Suit," every group uses `blue`. This was the most common transcription error found during the 2024/2025 audit. The reasoning: since there's only one suit in the hand, there's no need to distinguish between suits with different colors.

### Color Mapping at Validation Time

At validation time, the engine tries all permutations of suit assignments:
- green -> bamboo, red -> dots, blue -> characters
- green -> bamboo, red -> characters, blue -> dots
- green -> dots, red -> bamboo, blue -> characters
- ... (all 6 permutations for 3-suit hands, 6 for 2-suit, 3 for 1-suit)

This is handled by `enumerateColorAssignments()` in `validation.ts`.

---

## CSV Audit Format

Each card has a corresponding audit CSV in `card-audit/`. This is the human-readable reference you edit when verifying colors against the physical card.

### Columns

```
Section, Hand #, Display Pattern, Points, Exposure, Description, Group 1, Group 2, ..., Group 8
```

### Group Format

Each group uses the format `tiles:color` where:
- **tiles** = the tile abbreviation (e.g., `222`, `FFFF`, `NEWS`, `DDDD`, `000`)
- **color** = `red`, `green`, or `blue`

### Tile Abbreviations

| Abbreviation | Meaning |
|--------------|---------|
| `1`-`9` | Suited number tiles (1 digit = single, 11 = pair, 111 = pung, 1111 = kong, 11111 = quint) |
| `0` or `00` or `000` etc. | Zero (Soap/White Dragon used as digit 0) |
| `F` or `FF` etc. | Flowers |
| `N`, `E`, `W`, `S` | Individual wind tiles |
| `NEWS` | One of each wind (mixed group) |
| `NN`, `EEE`, etc. | Wind pairs/pungs/kongs |
| `D`, `DD`, `DDD`, `DDDD` | Dragon (matching or as specified by description) |
| `2025`, `2024` | Year digits as a mixed group |

### Example Row

```
2468,1a,222 4444 666 8888 (1 suit),25,X,Any 1 suit,222:blue,4444:blue,666:blue,8888:blue
```

---

## TypeScript Data Format

Each hand in the `.ts` file uses helper factories:

### Tile References

```typescript
s(n)     // Suited number tile (1-9)
zero     // White dragon used as digit 0
fl       // Flower
wN/wE/wW/wS  // Wind tiles
dR/dG/dW     // Specific dragon (red/green/white)
dMatch   // Dragon matching the group's suit
dOpp     // Dragon opposite to the group's suit
```

### Group Factories

```typescript
single(tile, color)  // 1 tile  - no jokers allowed
pair(tile, color)    // 2 tiles - no jokers allowed
pung(tile, color)    // 3 tiles - jokers OK
kong(tile, color)    // 4 tiles - jokers OK
quint(tile, color)   // 5 tiles - jokers REQUIRED (only 4 natural copies exist)
mixed(tiles[], color) // heterogeneous group (NEWS, year digits, etc.)
```

### Number Constraints

```typescript
{ type: 'fixed' }              // Exact numbers as written
{ type: 'any_run', length: N } // Any N consecutive numbers (e.g., 1-2-3 or 5-6-7)
{ type: 'any_like', positions: [0,2] } // Groups at those indices use any same number
{ type: 'any_even' }           // Any even number (2,4,6,8)
{ type: 'any_odd' }            // Any odd number (1,3,5,7,9)
{ type: 'any_369' }            // Any 3, 6, or 9
{ type: 'any_number' }         // Any number 1-9
```

### Example Hand

```typescript
{
  id: '2025-2468-1',
  section: '2468',
  displayPattern: '222 4444 666 8888 -or- 222 4444 666 8888',
  patterns: check14([
    { groups: [pung(s(2), 'blue'), kong(s(4), 'blue'), pung(s(6), 'blue'), kong(s(8), 'blue')] },
    { groups: [pung(s(2), 'green'), kong(s(4), 'green'), pung(s(6), 'red'), kong(s(8), 'red')] },
  ]),
  points: 25, exposure: 'X', jokerPolicy: 'standard',
  description: 'Any 1 or 2 Suits',
},
```

---

## How to Add a New Card Year (e.g., 2026)

### Step 1: Create the Audit CSV

Copy the previous year's CSV as a template:

```
cp card-audit/nmjl-2025-audit.csv card-audit/nmjl-2026-audit.csv
```

Edit the CSV with the new card's hands. For each hand, fill in:
- Section name
- Hand number
- Display pattern (as printed on card)
- Points and exposure (X or C)
- Description
- Each tile group with its color (e.g., `222:green`, `DDDD:blue`)

**Pro tips:**
- "Any 1 Suit" hands: ALL groups should be `blue`
- Flowers and winds are always `blue`
- When in doubt, note it in the description and flag for review

### Step 2: Generate the TypeScript File

Ask Claude to generate `src/data/nmjl/nmjl2026.ts` from the audit CSV. Claude will:
1. Read the CSV
2. Map each row to a `HandDefinition` using the helper factories
3. Apply `check14()` validation (ensures every hand totals 14 tiles)
4. Flag any hands that need review

### Step 3: Register the New Year

Add one line to `src/data/nmjl/registry.ts`:

```typescript
const cardModules: Record<number, () => Promise<...>> = {
  2024: () => import('./nmjl2024'),
  2025: () => import('./nmjl2025'),
  2026: () => import('./nmjl2026'),  // <-- Add this line
};
```

### Step 4: Update Constants (if needed)

Check `src/data/nmjl/constants.ts`:
- If the new card has a new section (unlikely), add it to `CardSection` type and `SECTION_ORDER`
- If joker policy changed for a section, update `SECTION_JOKER_POLICY`

### Step 5: Verify

1. Run `npm run build` to check for TypeScript errors
2. Preview the app and navigate to the new card year
3. Spot-check a few hands against the physical card
4. Run the Learn the Hands drill with the new year to verify matching works

### That's it!

The rest of the app automatically picks up the new card:
- `getAvailableYears()` returns `[2024, 2025, 2026]`
- `getCurrentYear()` returns `2026`
- All drills, matching, and hand display use the card data through `getCard(year)`
- No other files need to change

---

## Section Reference

The NMJL card is divided into these sections (in order):

| Section | Key | Joker Policy | Notes |
|---------|-----|-------------|-------|
| Year | `year` | Standard | Hands featuring the current year digits |
| 2468 | `2468` | Standard | Even number patterns |
| Any Like Numbers | `any_like_numbers` | Standard | Repeated same-number groups |
| Addition | `addition` | Standard | A + B = C equation hands |
| Quints | `quints` | Quints Required | Groups of 5 (need jokers since only 4 natural copies exist) |
| Consecutive Run | `consecutive_run` | Standard | Sequential number patterns |
| 13579 | `13579` | Standard | Odd number patterns |
| Winds & Dragons | `winds_dragons` | Standard | Honor tile patterns |
| 369 | `369` | Standard | Multiples of 3 patterns |
| Singles & Pairs | `singles_pairs` | No Jokers | All singles and pairs (no jokers allowed) |

### Exposure Types

- **X** = Exposed: can call tiles from other players to complete groups
- **C** = Concealed: must draw all tiles yourself (worth more points)

### Point Values

- **25** = Standard exposed hand
- **30** = Harder exposed or easier concealed
- **35-40** = Difficult hands
- **45-50** = Very difficult (quints, singles & pairs)
- **75** = Rare concealed hands

---

## Current Cards

### 2025 Card
- **Total hands:** 71
- **Audit file:** `card-audit/nmjl-2025-audit.csv`
- **Data file:** `src/data/nmjl/nmjl2025.ts`
- **Sections:** Year (4), 2468 (8), Any Like Numbers (3), Quints (3), Consecutive Run (8), 13579 (9a/b pairs + singles), Winds & Dragons (8), 369 (6), Singles & Pairs (6)

### 2024 Card
- **Total hands:** 73
- **Audit file:** `card-audit/nmjl-2024-audit.csv`
- **Data file:** `src/data/nmjl/nmjl2024.ts`
- **Sections:** Year (4), 2468 (6), Any Like Numbers (3), Addition/Lucky 7s (3), Quints (4), Consecutive Run (8), 13579 (7a/b pairs + singles), Winds & Dragons (7), 369 (7), Singles & Pairs (6)

---

## Common Pitfalls

1. **"Any 1 Suit" must be all blue** - The most common error. If only one suit is used, all groups are blue.

2. **check14() matters** - Every hand must total exactly 14 tiles. The `check14()` wrapper will warn in the console if any pattern is wrong.

3. **Zero = White Dragon (Soap)** - The digit 0 in year hands (2024, 2025) is represented by the white dragon tile. Use `zero` TileRef, not `s(0)`.

4. **Mixed groups for year digits** - `2025` is a mixed group: `mixed([s(2), zero, s(2), s(5)], color)`. Each digit is a separate tile ref within one group.

5. **Dragons: matching vs. specific** - Use `dMatch` when the card says "matching dragons" (dragon matches the suit). Use `dR`/`dG`/`dW` when a specific dragon is shown. Use `dOpp` for "opposite dragons."

6. **-or- variants** - When the card shows two versions of a hand (e.g., 1 suit / 2 suits), encode both as separate entries in the `patterns` array, NOT as separate `HandDefinition` objects.

7. **Number constraints** - Don't hardcode "Any 3 Consec. Nos." hands to specific numbers. Use `numberConstraint: { type: 'any_run', length: 3 }` so the engine expands all valid starting points.

8. **Test ALL variants x ALL color assignments** - The matching engine must try every expanded number variant crossed with every color permutation. Breaking early causes bugs (always lands on last variant).
