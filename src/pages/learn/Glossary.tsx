import { C } from '../../constants/colors';
import { PT, Cnt } from '../../components/Layout';

const SECTIONS = [
  {
    title: "The Card & Hands",
    terms: [
      { term: "Hand", def: "The specific tile combination you're working to complete, selected from the options on the Game Card at the start of each game." },
      { term: "Kong", def: "A meld of exactly four identical tiles." },
      { term: "Line", def: "A single row on the NMJL Game Card, each one representing a distinct winning hand combination you can choose to play toward." },
      { term: "Meld", def: "Any set of tiles that forms a recognized grouping within your hand, such as a pair, pung, or kong." },
      { term: "Pair", def: "A meld of exactly two identical tiles." },
      { term: "Pung", def: "A meld of exactly three identical tiles." },
      { term: "Quint", def: "A meld of exactly five identical tiles, which typically requires the use of jokers or blanks to complete." },
      { term: "Run", def: "A meld made up of consecutive numbers within the same suit, like a 3, 4, and 5 of Bam played together." },
      { term: "Single", def: "A meld that calls for just one tile of a specific type, no matching required." },
      { term: "Soap", def: "The white dragon tile, which functions as a zero or takes on a special role depending on the hand you're playing." },
    ],
  },
  {
    title: "Gameplay Actions",
    terms: [
      { term: "Blind Pass", def: "A pass during the Charleston where you send tiles along without looking at them first, a little act of faith." },
      { term: "Call", def: "Claiming a tile someone else has just discarded because it completes a meld in your hand, announced aloud before the next player draws." },
      { term: "Charleston", def: "The structured passing ritual that opens every game, where players exchange unwanted tiles with their neighbors before play officially begins." },
      { term: "Courtesy Pass", def: "An optional exchange at the very end of the Charleston, where you and a willing neighbor can swap one to three tiles if you both choose to." },
      { term: "Curtsy", def: "A small optional exchange mid-Charleston where you may offer tiles to the player sitting directly across from you." },
      { term: "Dead Hand", def: "A hand that can no longer legally win, usually because of an illegal call or an accidental discard of a tile the player needed." },
      { term: "Exposure", def: "The tiles you place face-up on your rack after making a call, revealing part of your hand to the table for the remainder of the game." },
      { term: "Feed", def: "What happens when you discard a tile that another player immediately calls and uses, you fed them exactly what they needed." },
      { term: "Joker Swap", def: "The move where you replace a joker sitting in an opponent's exposed meld with the live tile it represents, freeing that joker up for your own hand." },
      { term: "Pause", def: "A moment during the Charleston where you can hold onto some or all of the tiles being passed to you before sending the remainder along." },
      { term: "Walled Game", def: "A game that ends without a winner because all the tiles have been drawn and no one declared mahjong, rare, but it happens." },
    ],
  },
  {
    title: "Table & Setup",
    terms: [
      { term: "Dice", def: "Rolled by the dealer at the start of each game to determine exactly where the wall gets broken and dealing begins." },
      { term: "East (Dealer)", def: "The player who deals to start the game; East rotates each round and receives 14 tiles to everyone else's 13." },
      { term: "Rack", def: "The holder each player uses to stand their tiles upright, keeping their hand hidden from the rest of the table." },
      { term: "Wall", def: "The full rectangle of face-down tiles built by all four players at the start of the game, from which everyone draws throughout play." },
    ],
  },
  {
    title: "Tiles",
    terms: [
      { term: "Bam Bird", def: "The charming bird illustrated on the 1-Bam tile, and one of the most recognizable images in the game. She's also the inspiration for Mahji's chatbot mascot." },
      { term: "Bams", def: "The bamboo suit, numbered 1 through 9. The 1-Bam is traditionally illustrated with a bird, which is where Mahji's beloved mascot gets her name." },
      { term: "Blanks", def: "Optional tiles included in some sets that act as a personal wildcard with a unique superpower: you can swap a blank from your hand for a dead tile that has already been discarded, effectively bringing it back into play. Unlike jokers, blanks cannot be held in your final winning hand. They must be swapped out before you declare mahjong!" },
      { term: "Craks", def: "The character suit, numbered 1 through 9, displaying Chinese numerals set against a red field." },
      { term: "Dots", def: "The circle suit, numbered 1 through 9, with the corresponding number of circles on each tile." },
      { term: "Flowers", def: "A set of decorative tiles, typically numbered 1 through 4, that appear in specific hands and add a layer of strategy to the game." },
      { term: "Green", def: "The green dragon tile, called into specific hands on the Game Card." },
      { term: "Jokers", def: "The wildcards of the game. A joker can stand in for any tile within a meld of three or more, but never in a pair, and never in a fully concealed hand." },
      { term: "Red", def: "The red dragon tile, called into specific hands on the Game Card." },
      { term: "Soap", def: "The white dragon tile, used as a zero or given a specific role depending on which hand you're playing." },
      { term: "Wind", def: "Tiles representing the four compass directions, East, West, North, and South, used in certain hands throughout the card." },
    ],
  },
  {
    title: "Game States",
    terms: [
      { term: "Concealed / Closed", def: "A hand built entirely from your own draws, with no called tiles and nothing exposed on your rack, considered the purest (and often most impressive) way to win." },
      { term: "Dead Tiles", def: "Tiles that can no longer help you, whether they've been discarded, exposed by others, or simply don't fit the hand you're building." },
      { term: "Heavenly Hand", def: "An extraordinarily rare winning hand dealt entirely to the East player before a single tile is drawn or passed. If it happens, savor it." },
      { term: "Live Tiles", def: "Any tile still in play that could legally complete your hand." },
    ],
  },
];

export default function Glossary({ onBack }: { onBack: () => void }) {
  return (
    <>
      <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center' }}>
        <div onClick={onBack} style={{ fontSize: 12, color: C.lavDeep, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Learn
        </div>
      </div>
      <PT>Game Glossary</PT>
      <Cnt>
        {SECTIONS.map((section, si) => (
          <div key={section.title} style={{ marginBottom: si < SECTIONS.length - 1 ? 28 : 10 }}>
            {/* Section header */}
            <div style={{
              fontFamily: "'Bodoni Moda', serif", fontSize: 16, fontWeight: 600,
              color: C.cherry, letterSpacing: 0.5, marginBottom: 12,
            }}>
              {section.title}
            </div>

            {/* Terms */}
            {section.terms.map((entry, ti) => (
              <div key={entry.term} style={{
                paddingBottom: ti < section.terms.length - 1 ? 12 : 0,
                marginBottom: ti < section.terms.length - 1 ? 12 : 0,
                borderBottom: ti < section.terms.length - 1 ? `1px solid ${C.lavBorder}` : 'none',
              }}>
                <span style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700,
                  color: C.dark,
                }}>
                  {entry.term}:
                </span>
                <span style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 12.5,
                  color: C.mid, lineHeight: 1.6, marginLeft: 6,
                }}>
                  {entry.def}
                </span>
              </div>
            ))}

            {/* Section divider */}
            {si < SECTIONS.length - 1 && (
              <div style={{
                height: 1,
                background: `linear-gradient(90deg, transparent, ${C.lavBorder}, transparent)`,
                marginTop: 16,
              }} />
            )}
          </div>
        ))}
      </Cnt>
    </>
  );
}
