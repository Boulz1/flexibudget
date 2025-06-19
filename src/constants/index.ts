// src/constants/index.ts
import type { Pillar } from '../types';

// Use 'as const' to allow Zod to infer the literal types for z.enum
export const PILLARS = ['Besoins', 'Envies', 'Épargne'] as const;

// If you still need the Pillar type explicitly for other uses, ensure it aligns or is derived
// For example, if Pillar type is defined as: export type Pillar = typeof PILLARS[number];
// This makes PILLARS the source of truth for the Pillar type.
// Ensure src/types/index.ts Pillar type is compatible or derived like this.
// For now, assuming Pillar in src/types is `string` or `'Besoins' | 'Envies' | 'Épargne'`.
