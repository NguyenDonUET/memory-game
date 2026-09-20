import { gameReducer } from '@/features/game/state/gameReducer';
import {
  createInitialState,
  DEFAULT_SETTINGS,
  formatElapsed,
  getPlayerRankings,
} from '@/features/game/state/selectors';

import { describe, expect, it } from 'vitest';

import type { GameSettings, GameState, Tile } from '@/features/game/state/types';

function playingState(overrides: Partial<GameState> = {}): GameState {
  const settings: GameSettings = overrides.settings ?? {
    theme: 'numbers',
    players: 2,
    gridSize: 4,
  };
  const tiles: Tile[] =
    overrides.tiles ??
    ([
      { id: 0, value: 0, state: 'hidden' },
      { id: 1, value: 0, state: 'hidden' },
      { id: 2, value: 1, state: 'hidden' },
      { id: 3, value: 1, state: 'hidden' },
    ] satisfies Tile[]);

  return {
    status: 'playing',
    settings,
    tiles,
    currentPlayer: 0,
    scores: Array.from({ length: settings.players }, () => 0),
    moves: 0,
    elapsedMs: 0,
    timerStarted: false,
    flippedIds: [],
    isLocked: false,
    ...overrides,
  };
}

describe('gameReducer — setup', () => {
  it('starts from defaults on the setup screen', () => {
    const state = createInitialState();
    expect(state.status).toBe('setup');
    expect(state.settings).toEqual(DEFAULT_SETTINGS);
    expect(state.tiles).toEqual([]);
  });

  it('updates settings only while on setup', () => {
    let state = createInitialState();
    state = gameReducer(state, {
      type: 'UPDATE_SETTINGS',
      patch: { players: 4, gridSize: 6, theme: 'icons' },
    });
    expect(state.settings).toEqual({ theme: 'icons', players: 4, gridSize: 6 });
    expect(state.scores).toHaveLength(4);

    state = gameReducer(state, { type: 'START' });
    const blocked = gameReducer(state, { type: 'UPDATE_SETTINGS', patch: { players: 1 } });
    expect(blocked.settings.players).toBe(4);
  });

  it('START builds a board for the chosen grid', () => {
    let state = createInitialState({ theme: 'numbers', players: 1, gridSize: 4 });
    state = gameReducer(state, { type: 'START' });
    expect(state.status).toBe('playing');
    expect(state.tiles).toHaveLength(16);
  });
});

describe('gameReducer — flip / match / mismatch', () => {
  it('flips a hidden tile and starts the solo timer on first flip', () => {
    let state = playingState({
      settings: { theme: 'numbers', players: 1, gridSize: 4 },
      scores: [0],
    });
    state = gameReducer(state, { type: 'FLIP', tileId: 0 });
    expect(state.tiles[0]?.state).toBe('flipped');
    expect(state.flippedIds).toEqual([0]);
    expect(state.timerStarted).toBe(true);
  });

  it('matches a pair, increments score, and keeps the multiplayer turn', () => {
    let state = playingState();
    state = gameReducer(state, { type: 'FLIP', tileId: 0 });
    state = gameReducer(state, { type: 'FLIP', tileId: 1 });

    expect(state.tiles[0]?.state).toBe('matched');
    expect(state.tiles[1]?.state).toBe('matched');
    expect(state.flippedIds).toEqual([]);
    expect(state.isLocked).toBe(false);
    expect(state.moves).toBe(1);
    expect(state.scores[0]).toBe(1);
    expect(state.currentPlayer).toBe(0);
  });

  it('locks on mismatch and advances turn after RESOLVE_MISMATCH in multiplayer', () => {
    let state = playingState();
    state = gameReducer(state, { type: 'FLIP', tileId: 0 });
    state = gameReducer(state, { type: 'FLIP', tileId: 2 });

    expect(state.isLocked).toBe(true);
    expect(state.moves).toBe(1);
    expect(state.flippedIds).toEqual([0, 2]);
    expect(state.currentPlayer).toBe(0);

    state = gameReducer(state, { type: 'RESOLVE_MISMATCH' });
    expect(state.tiles[0]?.state).toBe('hidden');
    expect(state.tiles[2]?.state).toBe('hidden');
    expect(state.isLocked).toBe(false);
    expect(state.flippedIds).toEqual([]);
    expect(state.currentPlayer).toBe(1);
  });

  it('ignores flips while locked', () => {
    const state = playingState({ isLocked: true, flippedIds: [0, 2] });
    const next = gameReducer(state, { type: 'FLIP', tileId: 3 });
    expect(next).toBe(state);
  });

  it('finishes when the last pair is matched', () => {
    let state = playingState({
      settings: { theme: 'numbers', players: 1, gridSize: 4 },
      scores: [0],
      tiles: [
        { id: 0, value: 0, state: 'matched' },
        { id: 1, value: 0, state: 'matched' },
        { id: 2, value: 1, state: 'hidden' },
        { id: 3, value: 1, state: 'hidden' },
      ],
    });
    state = gameReducer(state, { type: 'FLIP', tileId: 2 });
    state = gameReducer(state, { type: 'FLIP', tileId: 3 });
    expect(state.status).toBe('finished');
    expect(state.scores[0]).toBe(1);
  });
});

describe('gameReducer — restart / new game / tick', () => {
  it('RESTART keeps settings and resets run state', () => {
    let state = playingState({
      settings: { theme: 'icons', players: 3, gridSize: 6 },
      scores: [2, 1, 0],
      moves: 9,
      status: 'finished',
    });
    state = gameReducer(state, { type: 'RESTART' });
    expect(state.status).toBe('playing');
    expect(state.settings).toEqual({ theme: 'icons', players: 3, gridSize: 6 });
    expect(state.tiles).toHaveLength(36);
    expect(state.scores).toEqual([0, 0, 0]);
    expect(state.moves).toBe(0);
  });

  it('NEW_GAME returns to setup with last settings', () => {
    let state = playingState({
      settings: { theme: 'icons', players: 2, gridSize: 6 },
    });
    state = gameReducer(state, { type: 'NEW_GAME' });
    expect(state.status).toBe('setup');
    expect(state.settings.theme).toBe('icons');
    expect(state.tiles).toEqual([]);
  });

  it('TICK only advances solo elapsed time after the timer started', () => {
    let state = playingState({
      settings: { theme: 'numbers', players: 1, gridSize: 4 },
      scores: [0],
      timerStarted: true,
    });
    state = gameReducer(state, { type: 'TICK', deltaMs: 1000 });
    expect(state.elapsedMs).toBe(1000);

    const multi = playingState({ timerStarted: true });
    expect(gameReducer(multi, { type: 'TICK', deltaMs: 1000 }).elapsedMs).toBe(0);
  });
});

describe('selectors', () => {
  it('ranks players by pairs and marks winners (including ties)', () => {
    const ranks = getPlayerRankings([3, 5, 5, 1]);
    expect(ranks.map((r) => r.playerIndex)).toEqual([1, 2, 0, 3]);
    expect(ranks.filter((r) => r.isWinner).map((r) => r.playerIndex)).toEqual([1, 2]);
  });

  it('formats elapsed time as M:SS', () => {
    expect(formatElapsed(0)).toBe('0:00');
    expect(formatElapsed(113_000)).toBe('1:53');
  });
});
