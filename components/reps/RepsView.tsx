"use client";

import Link from "next/link";
import {
  BlendedIcon,
  CookieIcon,
  CupIcon,
  LatteIcon,
  ProfileIcon,
  type GrooveIcon,
} from "@/components/icons/GrooveIcons";
import { IconTile } from "@/components/layout/IconTile";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import type { RepsEntry } from "@/lib/db/reps";
import { formatDay } from "@/lib/format";
import { LEVELS, levelFor, REWARDS } from "@/lib/reps";
import { routes } from "@/lib/routes";
import { dayKey } from "@/lib/schedule";
import { LevelProgress } from "./LevelProgress";

const rewardIcons: Record<(typeof REWARDS)[number]["copy"], GrooveIcon> = {
  accent: BlendedIcon,
  upsize: CupIcon,
  snack: CookieIcon,
  drink: LatteIcon,
};

type Member = { reps: number; history: RepsEntry[] };

// Reps & Levels: the member's balance (or a join prompt), how Reps are
// earned, the level ladder with perks, and rewards to cash in.
export function RepsView({ member }: { member: Member | null }) {
  const { t, plain } = useCopy();
  const currentLevel = member ? levelFor(member.reps) : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Balance or join prompt. */}
        <div className="surface p-6 lg:sticky lg:top-24 lg:self-start">
          {member ? (
            <>
              <p className="text-sm font-medium text-muted-foreground">
                {t.reps.balanceTitle}
              </p>
              <p className="mt-1 font-heading text-6xl leading-none font-black [font-stretch:70%] tabular-nums">
                {member.reps}
              </p>
              <div className="mt-5">
                <LevelProgress reps={member.reps} />
              </div>
              <h2 className="mt-8 border-b border-border pb-2 text-xl leading-none">
                {t.reps.historyTitle}
              </h2>
              {member.history.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  {t.reps.noHistory}
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {member.history.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-baseline justify-between gap-3 py-2.5 text-sm"
                    >
                      <span>
                        <span className="block font-semibold">
                          {entry.reason === "order"
                            ? fill(t.reps.reasons.order, {
                                code: entry.code ?? "",
                              })
                            : entry.reason === "redeem"
                              ? t.reps.reasons.redeem
                              : t.reps.reasons.join}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDay(dayKey(new Date(entry.createdAt)))}
                        </span>
                      </span>
                      <span
                        className={`font-heading text-lg font-black [font-stretch:70%] tabular-nums ${
                          entry.points > 0 ? "text-highlight" : ""
                        }`}
                      >
                        {entry.points > 0 ? "+" : ""}
                        {entry.points}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              <IconTile icon={ProfileIcon} size="lg" />
              <p className="mt-4 text-lg font-semibold">{t.reps.signedOut}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild size="lg">
                  <Link href={routes.join.href} aria-label={plain.auth.join}>
                    {t.auth.join}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link
                    href={`${routes.login.href}?next=${routes.reps.href}`}
                    aria-label={plain.auth.login}
                  >
                    {t.auth.login}
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="space-y-16">
          {/* How you earn. */}
          <section aria-labelledby="earn">
            <h2
              id="earn"
              className="border-b border-border pb-3 text-3xl leading-none"
            >
              {t.reps.earnTitle}
            </h2>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-4">
                <IconTile icon={CupIcon} />
                <p className="pt-1.5">{t.reps.earnOrder}</p>
              </li>
              <li className="flex items-start gap-4">
                <IconTile icon={ProfileIcon} />
                <p className="pt-1.5">{t.reps.earnJoin}</p>
              </li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              {t.reps.earnNote}
            </p>
          </section>

          {/* Level ladder. */}
          <section aria-labelledby="levels">
            <h2
              id="levels"
              className="border-b border-border pb-3 text-3xl leading-none"
            >
              {t.reps.levelsTitle}
            </h2>
            <ol className="mt-2 divide-y divide-border">
              {LEVELS.map((level, index) => {
                const here = level.key === currentLevel;
                return (
                  <Reveal
                    as="li"
                    key={level.key}
                    delay={index * 0.05}
                    className={`grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-4 ${
                      here ? "-mx-3 bg-accent px-3 text-accent-foreground" : ""
                    }`}
                  >
                    <p className="font-heading text-3xl leading-none font-black uppercase [font-stretch:64%] sm:text-4xl">
                      {t.levels[level.copy]}
                    </p>
                    <p className="text-right text-sm font-semibold tabular-nums">
                      {here
                        ? t.reps.current
                        : fill(t.reps.from, { count: level.min })}
                    </p>
                    <p
                      className={`col-span-2 text-sm ${here ? "" : "text-muted-foreground"}`}
                    >
                      {t.reps.perks[level.copy]}
                    </p>
                  </Reveal>
                );
              })}
            </ol>
          </section>

          {/* Rewards. */}
          <section aria-labelledby="rewards">
            <h2
              id="rewards"
              className="border-b border-border pb-3 text-3xl leading-none"
            >
              {t.reps.rewardsTitle}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {REWARDS.map((reward) => {
                const ready = member ? member.reps >= reward.cost : false;
                return (
                  <li
                    key={reward.copy}
                    className={`flex items-center gap-4 surface p-4 ${ready ? "ring-2 ring-primary" : ""}`}
                  >
                    <IconTile
                      icon={rewardIcons[reward.copy]}
                      tone={ready ? "accent" : "neutral"}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">
                        {t.reps.rewards[reward.copy]}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {fill(t.reps.cost, { count: reward.cost })}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              {t.reps.rewardsNote}
            </p>
          </section>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}
