export { createBoard, pairCount, shuffle } from '@/features/game/lib/createBoard';
export { gameReducer } from '@/features/game/state/gameReducer';
export {
  allTilesMatched,
  createInitialScores,
  createInitialState,
  DEFAULT_SETTINGS,
  formatElapsed,
  getPlayerRankings,
  isSolo,
} from '@/features/game/state/selectors';

export type {
  GameAction,
  GameSettings,
  GameState,
  GameStatus,
  GridSize,
  PlayerCount,
  PlayerRank,
  Theme,
  Tile,
  TileState,
} from '@/features/game/state/types';
