import { createBoard, pairCount, shuffle } from '@/features/game/lib/createBoard';

import { describe, expect, it } from 'vitest';

/** Deterministic PRNG for shuffle/board tests. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('shuffle', () => {
  it('returns a new array with the same members', () => {
    const input = [1, 2, 3, 4, 5];
    const output = shuffle(input, mulberry32(1));
    expect(output).not.toBe(input);
    expect([...output].sort()).toEqual([...input].sort());
  });

  it('is deterministic for a given RNG', () => {
    expect(shuffle([0, 1, 2, 3], mulberry32(42))).toEqual(shuffle([0, 1, 2, 3], mulberry32(42)));
  });
});

describe('createBoard', () => {
  it('builds 16 tiles with 8 unique values for 4x4', () => {
    const tiles = createBoard(4, mulberry32(7));
    expect(tiles).toHaveLength(16);
    expect(pairCount(4)).toBe(8);

    const counts = new Map<number, number>();
    for (const tile of tiles) {
      expect(tile.state).toBe('hidden');
      counts.set(tile.value, (counts.get(tile.value) ?? 0) + 1);
    }
    expect(counts.size).toBe(8);
    for (const count of counts.values()) {
      expect(count).toBe(2);
    }
  });

  it('builds 36 tiles with 18 unique values for 6x6', () => {
    const tiles = createBoard(6, mulberry32(9));
    expect(tiles).toHaveLength(36);
    expect(pairCount(6)).toBe(18);
  });

  it('assigns sequential ids', () => {
    const tiles = createBoard(4, mulberry32(3));
    expect(tiles.map((t) => t.id)).toEqual(Array.from({ length: 16 }, (_, i) => i));
  });
});
