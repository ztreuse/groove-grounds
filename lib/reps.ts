// Reps & Levels rules. Pure, shared by the server (awarding) and the UI.

export type LevelKey =
  "rookie" | "cypher_regular" | "battler" | "judge" | "legend";

// Lifetime Reps needed for each level, lowest first. `copy` is the key in
// lib/copy.ts `levels` and `reps.perks`.
export const LEVELS = [
  { key: "rookie", copy: "rookie", min: 0 },
  { key: "cypher_regular", copy: "cypherRegular", min: 200 },
  { key: "battler", copy: "battler", min: 500 },
  { key: "judge", copy: "judge", min: 1000 },
  { key: "legend", copy: "legend", min: 2000 },
] as const satisfies readonly { key: LevelKey; copy: string; min: number }[];

export const JOIN_BONUS = 50;
// One Rep for every this many pesos on a picked-up order.
export const PESOS_PER_REP = 10;

export const repsForTotal = (total: number) =>
  Math.floor(total / PESOS_PER_REP);

export function levelFor(reps: number): LevelKey {
  return [...LEVELS].reverse().find((level) => reps >= level.min)!.key;
}

// Where a balance sits on the ladder: current and next level, Reps still
// needed and progress (0–1) through the current step.
export function levelProgress(reps: number) {
  const index = LEVELS.findIndex((level) => level.key === levelFor(reps));
  const current = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  return {
    current,
    next,
    needed: next ? next.min - reps : 0,
    progress: next ? (reps - current.min) / (next.min - current.min) : 1,
  };
}

// Rewards to redeem at the counter. `copy` keys live in `reps.rewards`.
export const REWARDS = [
  { copy: "accent", cost: 100 },
  { copy: "upsize", cost: 150 },
  { copy: "snack", cost: 250 },
  { copy: "drink", cost: 400 },
] as const;
