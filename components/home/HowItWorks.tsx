"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DropInIcon } from "@/components/icons/GrooveIcons";
import { motion, useScroll, useTransform } from "motion/react";
import { IconTile } from "@/components/layout/IconTile";
import { KineticTitle } from "@/components/motion/KineticTitle";
import { useCopy } from "@/hooks/use-copy";
import { setOrderIntent } from "@/lib/order-intent";
import { routes } from "@/lib/routes";

const steps = [
  { title: "step1Title", body: "step1Body" },
  { title: "step2Title", body: "step2Body" },
  { title: "step3Title", body: "step3Body" },
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

// Full-bleed photo section: a dancer under neon drifting behind the title,
// with the three counts on a lilac strip pinned to the bottom edge.
export function HowItWorks() {
  const { t, plain, isPlain } = useCopy();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={ref}
      aria-labelledby="how"
      className="theme-dark relative flex min-h-[44rem] flex-col overflow-hidden bg-background lg:min-h-[52rem]"
    >
      <motion.div
        aria-hidden
        style={{ y: photoY }}
        className="absolute inset-x-0 -inset-y-[12%]"
      >
        <Image
          src="/scenes/neon-dancer.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[65%_center]"
        />
      </motion.div>
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-espresso-deep)_10%,color-mix(in_oklch,var(--color-espresso-deep)_55%,transparent)_45%,transparent_75%)]"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-20">
        <KineticTitle
          as="h2"
          id="how"
          text={t.home.howTitle}
          trigger="view"
          className="max-w-[10ch] text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.88] font-black tracking-normal uppercase [font-stretch:64%]"
        />
        {!isPlain && (
          <p className="mt-3 text-sm font-medium text-foreground/70">
            {plain.home.howTitle}
          </p>
        )}
        {/* Starts an order now, rather than repeating the menu links above. */}
        <Link
          href={routes.lineup.href}
          onClick={() => setOrderIntent("drop_in")}
          aria-label={plain.terms.dropIn}
          className="group mt-8 inline-flex min-h-14 items-center gap-3 self-start rounded-md bg-cream py-2 pr-5 pl-2.5 text-espresso outline-none focus-visible:ring-3 focus-visible:ring-lilac active:translate-y-px"
        >
          <IconTile icon={DropInIcon} tone="inherit" />
          <span className="text-left">
            <span className="block font-heading text-lg leading-none font-extrabold whitespace-nowrap">
              {t.terms.dropIn}
            </span>
            {!isPlain && (
              <span className="block text-xs font-medium opacity-75">
                {plain.terms.dropIn}
              </span>
            )}
          </span>
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      <ol className="relative grid bg-lilac text-espresso md:grid-cols-3">
        {steps.map(({ title, body }, index) => (
          <motion.li
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: index * 0.1, ease }}
            className="flex items-start gap-5 border-espresso/20 px-6 py-7 not-last:border-b md:not-last:border-r md:not-last:border-b-0 lg:px-10 lg:py-9"
          >
            <span
              aria-hidden
              className="font-heading text-6xl leading-[0.8] font-black [font-stretch:64%]"
            >
              0{index + 1}
            </span>
            <span>
              <span className="block font-heading text-xl leading-tight font-extrabold">
                {t.home[title]}
              </span>
              <span className="mt-1 block text-sm text-espresso/75">
                {t.home[body]}
              </span>
            </span>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
