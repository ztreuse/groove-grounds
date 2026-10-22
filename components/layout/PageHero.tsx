"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { KineticTitle } from "@/components/motion/KineticTitle";
import { useCopy } from "@/hooks/use-copy";

type PageHeroProps = {
  title: string;
  // Plain meaning shown under the title in Dance mode (golden rule).
  plainTitle?: string;
  eyebrow?: string;
  body?: React.ReactNode;
  // Background photo from /public/scenes; the panel is plain dark without one.
  image?: string;
  imagePosition?: string;
  size?: "md" | "lg";
  children?: React.ReactNode;
};

const ease = [0.16, 1, 0.3, 1] as const;

// Dark, inset page header: a photo drifting slower than the page (parallax),
// a stage-light glow, film grain, and the page title in poster caps.
export function PageHero({
  title,
  plainTitle,
  eyebrow,
  body,
  image,
  imagePosition = "center",
  size = "md",
  children,
}: PageHeroProps) {
  const { isPlain } = useCopy();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section
      ref={ref}
      className="theme-dark grain relative overflow-hidden bg-background"
    >
      {image && (
        <motion.div
          aria-hidden
          style={{ y }}
          className="absolute inset-x-0 -inset-y-[10%]"
        >
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
            style={{ objectPosition: imagePosition }}
          />
        </motion.div>
      )}
      {/* Readability wash, then a purple stage light from the corner. */}
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(100deg,color-mix(in_oklch,var(--color-espresso-deep)_92%,transparent)_10%,color-mix(in_oklch,var(--color-espresso-deep)_45%,transparent)_55%,transparent)]"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-espresso-deep to-transparent"
      />
      <span
        aria-hidden
        className="absolute -right-[10%] -bottom-[30%] size-[36rem] rounded-full bg-purple/35 blur-[120px]"
      />

      <div
        className={`relative mx-auto flex w-full max-w-6xl flex-col justify-end px-5 sm:px-8 ${
          size === "lg"
            ? "min-h-[min(72dvh,44rem)] pt-24 pb-12 sm:pb-16"
            : "pt-14 pb-10 sm:pt-20 sm:pb-14"
        }`}
      >
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-4 flex items-center gap-3 eyebrow text-lilac"
          >
            <span aria-hidden className="h-px w-8 bg-lilac" />
            {eyebrow}
          </motion.p>
        )}
        <KineticTitle
          text={title}
          className={
            size === "lg"
              ? "text-[clamp(3.75rem,13vw,10rem)]"
              : "text-[clamp(3.25rem,11vw,7.5rem)]"
          }
        />
        {!isPlain && plainTitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-4 eyebrow text-foreground/70"
          >
            {plainTitle}
          </motion.p>
        )}
        {body && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="mt-5 max-w-xl text-base text-foreground/80 sm:text-lg"
          >
            {body}
          </motion.div>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="mt-7"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
