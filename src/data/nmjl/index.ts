// ═══════════════════════════════════════════════════════════════
// NMJL Card Data — Public Exports
// ═══════════════════════════════════════════════════════════════

// Types
export type {
  CardColor,
  SuitedTileSuit,
  ColorAssignment,
  TileRef,
  GroupType,
  TileGroup,
  NumberConstraint,
  HandPattern,
  ExposureType,
  CardSection,
  JokerPolicy,
  HandDefinition,
  NMJLCard,
  MatchResult,
  PartialMatchResult,
} from './types';

// Constants
export {
  SECTION_JOKER_POLICY,
  SECTION_ORDER,
  SECTION_LABELS,
  SECTION_DESCRIPTIONS,
  DRAGON_SUIT_MAP,
  SUIT_FOR_DRAGON,
  SUIT_TO_PREFIX,
  getValidRunStarts,
} from './constants';

// Registry
export {
  getCard,
  getCardSync,
  preloadCard,
  getAvailableYears,
  getCurrentYear,
  registerCard,
} from './registry';

// Validation
export {
  enumerateColorAssignments,
  resolveTileRef,
  expandNumberConstraint,
  resolveGroupToTileIds,
  validateHand,
  findAllMatches,
  findPartialMatches,
  getHandsBySection,
  getHandsByPoints,
  getConcealedHands,
  isTileUsefulForHand,
} from './validation';
