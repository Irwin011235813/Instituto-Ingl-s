import type { Timestamp } from 'firebase/firestore';

/** Todo documento leído de Firestore trae su id junto a los campos tipados */
export type ConId<T> = T & { id: string };

export type ConTimestamp<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends Date ? Timestamp : T[K];
};
