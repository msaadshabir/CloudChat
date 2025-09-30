'use client';

import React from 'react';

function mulberry32(a: number) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function RandomIcon({ seed, size = 20, color = '#9CA3AF' }: { seed: string; size?: number; color?: string }) {
  // Deterministic PRNG based on seed string
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const rand = mulberry32(hash >>> 0);

  // Generate 3-4 simple shapes with slight randomness
  const shapes = Array.from({ length: 3 + Math.floor(rand() * 2) }).map((_, i) => {
    const cx = Math.floor(rand() * 16) + 2;
    const cy = Math.floor(rand() * 16) + 2;
    const r = 2 + Math.floor(rand() * 4);
    const opacity = 0.6 + rand() * 0.4;
    return <circle key={i} cx={cx} cy={cy} r={r} fill={color} opacity={opacity} />;
  });

  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      {shapes}
    </svg>
  );
}

export default RandomIcon;
