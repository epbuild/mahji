// ═══════════════════════════════════════════════════════════════
// NMJL Card Registry
// ═══════════════════════════════════════════════════════════════

import type { NMJLCard } from './types';

/** Lazy loaders for each year */
const cardModules: Record<number, () => Promise<{ NMJL_2024?: NMJLCard; NMJL_2025?: NMJLCard; [key: string]: NMJLCard | undefined }>> = {
  2024: () => import('./nmjl2024'),
  2025: () => import('./nmjl2025'),
};

/** Cache of loaded cards */
const loadedCards = new Map<number, NMJLCard>();

/** Get a card by year (async, lazy-loaded). Retries once on chunk load failure. */
export async function getCard(year: number): Promise<NMJLCard | null> {
  if (loadedCards.has(year)) return loadedCards.get(year)!;
  const loader = cardModules[year];
  if (!loader) return null;
  try {
    const mod = await loader();
    const key = `NMJL_${year}`;
    const card = (mod as Record<string, NMJLCard>)[key];
    if (!card) return null;
    loadedCards.set(year, card);
    return card;
  } catch (err) {
    // Dynamic import failed — likely stale cached chunks after a deploy.
    // Force a page reload to pick up the new assets.
    console.error(`[Mahji] Failed to load card data for ${year}. Reloading...`, err);
    window.location.reload();
    return null;
  }
}

/** Get card synchronously (must be pre-loaded via getCard or registerCard) */
export function getCardSync(year: number): NMJLCard | null {
  return loadedCards.get(year) ?? null;
}

/** Pre-load a card into the cache */
export async function preloadCard(year: number): Promise<void> {
  await getCard(year);
}

/** Get all available card years */
export function getAvailableYears(): number[] {
  return Object.keys(cardModules).map(Number).sort();
}

/** Get the most recent card year */
export function getCurrentYear(): number {
  const years = getAvailableYears();
  return years[years.length - 1];
}

/** Register a card at runtime (for testing or dynamic loading) */
export function registerCard(card: NMJLCard): void {
  loadedCards.set(card.year, card);
}
