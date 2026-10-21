"use client";

import { useId } from "react";
import { motion } from "motion/react";
import type { Temperature } from "@/lib/pricing";

export type CupState = {
  base: string; // base slug, e.g. "freestyle-matcha"
  size: string | null; // "count-8" | "count-16" | "count-32"
  temp: Temperature;
  milk: boolean;
  shots: number;
  flavors: number;
  toppings: string[];
  ice: string | null; // "light" | "regular" | "extra"
};

const BASE_COLORS: Record<string, string> = {
  "freestyle-espresso": "var(--color-brew-espresso)",
  "freestyle-cold-brew": "var(--color-brew-cold)",
  "freestyle-matcha": "var(--color-brew-matcha)",
  "freestyle-chocolate": "var(--color-brew-chocolate)",
  "freestyle-tea": "var(--color-brew-tea)",
};

export const baseColor = (slug: string) =>
  BASE_COLORS[slug] ?? "var(--color-brew-espresso)";

const SIZE_SCALE: Record<string, number> = {
  "count-8": 0.8,
  "count-16": 0.9,
  "count-32": 1,
};
const ICE_CUBES: Record<string, number> = { light: 2, regular: 3, extra: 5 };
const CUBE_SPOTS = [
  [70, 120],
  [112, 104],
  [92, 150],
  [124, 160],
  [62, 178],
];

// Glass outline: wide rim at the top, narrower base.
const CUP = "M30,50 L170,50 L152,248 L48,248 Z";
const LIQUID_TOP = 78;
const MILK_HEIGHT = 64;

// The Freestyle live preview. Purely decorative for screen readers: the
// wrapper carries a plain-language label instead.
export function CupPreview({
  state,
  label,
}: {
  state: CupState;
  label: string;
}) {
  const clipId = useId();
  const scale = SIZE_SCALE[state.size ?? ""] ?? 0.9;
  const cold = state.temp !== "hot";
  const color = baseColor(state.base);
  const has = (topping: string) => state.toppings.includes(topping);
  const smooth = { transition: "fill 400ms ease" };

  return (
    <div role="img" aria-label={label} className="flex h-full justify-center">
      <svg viewBox="0 0 200 270" className="h-full w-auto overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <path d={CUP} />
          </clipPath>
        </defs>

        <motion.g
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          style={{ originX: "50%", originY: "92%" }}
        >
          {/* Steam for Warm-up drinks. */}
          {!cold &&
            [70, 100, 130].map((x, index) => (
              <motion.path
                key={x}
                d={`M${x},40 q-8,-12 0,-24 q8,-12 0,-24`}
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: [0, 0.6, 0], y: [6, -6, -14] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              />
            ))}

          {/* Straw for cold drinks. */}
          {cold && (
            <rect
              x={118}
              y={2}
              width={9}
              height={150}
              rx={4}
              transform="rotate(12 122 80)"
              className="fill-primary"
            />
          )}

          <g clipPath={`url(#${clipId})`}>
            {/* Fills up from the bottom whenever the base changes. */}
            <motion.g
              key={state.base}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              style={{ originY: "100%" }}
            >
              <rect
                x={0}
                y={LIQUID_TOP}
                width={200}
                height={200}
                fill={color}
                style={smooth}
              />
              {/* Extra shots darken the drink. */}
              <rect
                x={0}
                y={LIQUID_TOP}
                width={200}
                height={200}
                fill="var(--color-brew-cold)"
                opacity={state.shots * 0.18}
              />
              {state.milk && (
                <rect
                  x={0}
                  y={LIQUID_TOP}
                  width={200}
                  height={MILK_HEIGHT}
                  fill="var(--color-milk)"
                  opacity={0.85}
                />
              )}
              {state.flavors > 0 &&
                Array.from({ length: state.flavors }, (_, index) => (
                  <path
                    key={index}
                    d={`M40,${236 - index * 12} q30,-10 60,0 t60,0`}
                    fill="none"
                    stroke="var(--color-lilac)"
                    strokeWidth={4}
                    opacity={0.8}
                  />
                ))}
              {state.temp === "blended" &&
                [50, 75, 100, 125, 150].map((x) => (
                  <circle
                    key={x}
                    cx={x}
                    cy={LIQUID_TOP + 2}
                    r={14}
                    fill="var(--color-milk)"
                  />
                ))}
              {has("sea-salt-foam") && (
                <rect
                  x={0}
                  y={LIQUID_TOP - 2}
                  width={200}
                  height={14}
                  fill="var(--color-whip)"
                />
              )}
              {cold &&
                state.ice &&
                CUBE_SPOTS.slice(0, ICE_CUBES[state.ice] ?? 3).map(([x, y]) => (
                  <rect
                    key={`${x}-${y}`}
                    x={x - 14}
                    y={y - 14}
                    width={28}
                    height={28}
                    rx={6}
                    fill="var(--color-ice)"
                    opacity={0.55}
                    transform={`rotate(${(x % 3) * 8 - 8} ${x} ${y})`}
                  />
                ))}
            </motion.g>
          </g>

          {/* Glass. */}
          <path
            d={CUP}
            fill="currentColor"
            fillOpacity={0.06}
            stroke="currentColor"
            strokeWidth={4}
            strokeLinejoin="round"
            className="text-foreground"
          />

          {has("whipped-cream") && (
            <path
              d="M38,52 q10,-26 32,-18 q14,-22 34,-8 q20,-16 34,6 q20,-2 24,20 Z"
              fill="var(--color-whip)"
              stroke="currentColor"
              strokeOpacity={0.15}
              strokeWidth={2}
            />
          )}
          {has("caramel-drizzle") && (
            <polyline
              points={`48,${has("whipped-cream") ? 38 : 70} 68,${has("whipped-cream") ? 30 : 62} 88,${has("whipped-cream") ? 40 : 72} 108,${has("whipped-cream") ? 26 : 60} 128,${has("whipped-cream") ? 38 : 70} 150,${has("whipped-cream") ? 32 : 64}`}
              fill="none"
              stroke="var(--color-caramel)"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {has("cinnamon-dust") &&
            [60, 78, 94, 112, 130, 146, 86, 120].map((x, index) => (
              <circle
                key={index}
                cx={x}
                cy={(has("whipped-cream") ? 34 : 72) + (index % 3) * 5}
                r={2.5}
                fill="var(--color-brew-chocolate)"
              />
            ))}
        </motion.g>
      </svg>
    </div>
  );
}
