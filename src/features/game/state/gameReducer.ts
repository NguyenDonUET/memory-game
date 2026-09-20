import { createBoard } from '@/features/game/lib/createBoard';
import {
  allTilesMatched,
  createInitialScores,
  createInitialState,
  DEFAULT_SETTINGS,
  isSolo,
} from '@/features/game/state/selectors';

import type { GameAction, GameSettings, GameState, Tile } from '@/features/game/state/types';

function startRun(settings: GameSettings): GameState {
  return {
    status: 'playing',
    settings,
    tiles: createBoard(settings.gridSize),
    currentPlayer: 0,
    scores: createInitialScores(settings.players),
    moves: 0,
    elapsedMs: 0,
    timerStarted: false,
    flippedIds: [],
    isLocked: false,
  };
}

function setTileState(tiles: Tile[], ids: readonly number[], state: Tile['state']): Tile[] {
  const idSet = new Set(ids);
  return tiles.map((tile) => (idSet.has(tile.id) ? { ...tile, state } : tile));
}

function nextPlayer(current: number, players: number): number {
  return (current + 1) % players;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'UPDATE_SETTINGS': {
      if (state.status !== 'setup') {
        return state;
      }
      const settings = { ...state.settings, ...action.patch };
      return {
        ...state,
        settings,
        scores: createInitialScores(settings.players),
      };
    }

    case 'START': {
      if (state.status !== 'setup') {
        return state;
      }
      return startRun(state.settings);
    }

    case 'RESTART': {
      if (state.status !== 'playing' && state.status !== 'finished') {
        return state;
      }
      return startRun(state.settings);
    }

    case 'NEW_GAME': {
      return createInitialState(state.settings);
    }

    case 'TICK': {
      if (state.status !== 'playing' || !state.timerStarted || !isSolo(state.settings)) {
        return state;
      }
      if (action.deltaMs <= 0) {
        return state;
      }
      return { ...state, elapsedMs: state.elapsedMs + action.deltaMs };
    }

    case 'RESOLVE_MISMATCH': {
      if (state.status !== 'playing' || !state.isLocked || state.flippedIds.length !== 2) {
        return state;
      }

      const hidden = setTileState(state.tiles, state.flippedIds, 'hidden');
      const advanceTurn = !isSolo(state.settings);

      return {
        ...state,
        tiles: hidden,
        flippedIds: [],
        isLocked: false,
        currentPlayer: advanceTurn
          ? nextPlayer(state.currentPlayer, state.settings.players)
          : state.currentPlayer,
      };
    }

    case 'FLIP': {
      if (state.status !== 'playing' || state.isLocked) {
        return state;
      }

      const tile = state.tiles.find((t) => t.id === action.tileId);
      if (!tile || tile.state !== 'hidden') {
        return state;
      }
      if (state.flippedIds.length >= 2) {
        return state;
      }

      const flippedIds = [...state.flippedIds, tile.id];
      let tiles = setTileState(state.tiles, [tile.id], 'flipped');
      const timerStarted = state.timerStarted || isSolo(state.settings);

      if (flippedIds.length < 2) {
        return {
          ...state,
          tiles,
          flippedIds,
          timerStarted,
        };
      }

      const [firstId, secondId] = flippedIds as [number, number];
      const first = tiles.find((t) => t.id === firstId);
      const second = tiles.find((t) => t.id === secondId);
      if (!first || !second) {
        return state;
      }

      const moves = state.moves + 1;

      if (first.value === second.value) {
        tiles = setTileState(tiles, flippedIds, 'matched');
        const scores = [...state.scores];
        scores[state.currentPlayer] = (scores[state.currentPlayer] ?? 0) + 1;

        const next: GameState = {
          ...state,
          tiles,
          flippedIds: [],
          isLocked: false,
          moves,
          scores,
          timerStarted,
        };

        if (allTilesMatched(tiles)) {
          return { ...next, status: 'finished' };
        }
        return next;
      }

      return {
        ...state,
        tiles,
        flippedIds,
        isLocked: true,
        moves,
        timerStarted,
      };
    }

    default: {
      return state;
    }
  }
}

export { createInitialState, DEFAULT_SETTINGS };
