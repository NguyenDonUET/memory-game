export type Theme = 'numbers' | 'icons';
export type PlayerCount = 1 | 2 | 3 | 4;
export type GridSize = 4 | 6;
export type TileState = 'hidden' | 'flipped' | 'matched';
export type GameStatus = 'setup' | 'playing' | 'finished';

export interface GameSettings {
  theme: Theme;
  players: PlayerCount;
  gridSize: GridSize;
}

export interface Tile {
  id: number;
  value: number;
  state: TileState;
}

export interface GameState {
  status: GameStatus;
  settings: GameSettings;
  tiles: Tile[];
  /** 0-based index into scores */
  currentPlayer: number;
  /** Pair counts per player */
  scores: number[];
  /** Completed pair-attempts (two tiles selected) */
  moves: number;
  /** Solo elapsed time in milliseconds */
  elapsedMs: number;
  /** Solo timer starts on first flip */
  timerStarted: boolean;
  /** Ids of currently flipped unmatched tiles (0–2) */
  flippedIds: number[];
  /** True while waiting for RESOLVE_MISMATCH (UI owns the delay) */
  isLocked: boolean;
}

export type GameAction =
  | { type: 'UPDATE_SETTINGS'; patch: Partial<GameSettings> }
  | { type: 'START' }
  | { type: 'FLIP'; tileId: number }
  | { type: 'RESOLVE_MISMATCH' }
  | { type: 'RESTART' }
  | { type: 'NEW_GAME' }
  | { type: 'TICK'; deltaMs: number };

export interface PlayerRank {
  playerIndex: number;
  pairs: number;
  isWinner: boolean;
}
