import type { GameSettings, GameState, PlayerCount, PlayerRank } from '@/features/game/state/types';

export const DEFAULT_SETTINGS: GameSettings = {
  theme: 'numbers',
  players: 1,
  gridSize: 4,
};

export function createInitialScores(players: PlayerCount): number[] {
  return Array.from({ length: players }, () => 0);
}

export function createInitialState(settings: GameSettings = DEFAULT_SETTINGS): GameState {
  return {
    status: 'setup',
    settings,
    tiles: [],
    currentPlayer: 0,
    scores: createInitialScores(settings.players),
    moves: 0,
    elapsedMs: 0,
    timerStarted: false,
    flippedIds: [],
    isLocked: false,
  };
}

export function isSolo(settings: GameSettings): boolean {
  return settings.players === 1;
}

export function allTilesMatched(tiles: GameState['tiles']): boolean {
  return tiles.length > 0 && tiles.every((tile) => tile.state === 'matched');
}

/** Rank players by pairs desc. Highest score(s) marked winner (ties share winner). */
export function getPlayerRankings(scores: readonly number[]): PlayerRank[] {
  const maxPairs = scores.length === 0 ? 0 : Math.max(...scores);
  return scores
    .map((pairs, playerIndex) => ({
      playerIndex,
      pairs,
      isWinner: pairs === maxPairs && maxPairs > 0,
    }))
    .sort((a, b) => b.pairs - a.pairs || a.playerIndex - b.playerIndex);
}

export function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
