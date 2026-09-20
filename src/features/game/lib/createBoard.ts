import type { GridSize, Tile } from '@/features/game/state/types';

export type RandomFn = () => number;

/** Fisher–Yates shuffle (returns a new array). */
export function shuffle<T>(items: readonly T[], random: RandomFn = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const tmp = result[i]!;
    result[i] = result[j]!;
    result[j] = tmp;
  }
  return result;
}

export function pairCount(gridSize: GridSize): number {
  return (gridSize * gridSize) / 2;
}

/**
 * Build a board of `gridSize²` tiles: values `0..pairCount-1`, each twice, shuffled.
 * Pass `random` for deterministic tests.
 */
export function createBoard(gridSize: GridSize, random: RandomFn = Math.random): Tile[] {
  const pairs = pairCount(gridSize);
  const values = Array.from({ length: pairs }, (_, value) => value);
  const deck = shuffle([...values, ...values], random);

  return deck.map((value, id) => ({
    id,
    value,
    state: 'hidden' as const,
  }));
}
