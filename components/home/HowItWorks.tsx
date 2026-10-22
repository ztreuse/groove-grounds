"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { useCopy } from "@/hooks/use-copy";

const steps = [
  { title: "step1Title", body: "step1Body" },
  { title: "step2Title", body: "step2Body" },
  { title: "step3Title", body: "step3Body" },
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

// Dark stage panel: a sneaker shot drifting on the left, and three counts
// whose outlined numbers fill with light as each step scrolls into view.
export function HowItWorks() {
  const { t, plain } = useCopy();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={ref}
      aria-labelledby="how"
      className="theme-dark grain relative mx-2 overflow-hidden rounded-[2rem] bg-background sm:mx-4 sm:rounded-[2.5rem]"
    >
      <span
        aria-hidden
        className="absolute -top-40 -left-40 size-[34rem] rounded-full bg-purple/30 blur-[120px]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          id="how"
          index="03"
          title={t.home.howTitle}
          plainTitle={plain.home.howTitle}
        />
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative hidden aspect-[4/5] overflow-hidden rounded-[1.75rem] lg:block">
            <motion.div
              style={{ y: photoY }}
              className="absolute inset-x-0 -inset-y-[10%]"
            >
              <Image
                src="/scenes/sneakers.webp"
                alt=""
                fill
                sizes="40vw"
                className="object-cover"
              />
            </motion.div>
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-espresso-deep/70 to-transparent"
            />
          </div>

          <ol className="divide-y divide-border">
            {steps.map(({ title, body }, index) => (
              <li
                key={title}
                className="grid grid-cols-[auto_1fr] items-center gap-6 py-8 first:pt-0 last:pb-0 sm:gap-10"
              >
                <span
                  aria-hidden
                  className="relative font-heading text-[6.5rem] leading-[0.8] font-black [font-stretch:64%] sm:text-[9rem]"
                >
                  <span className="text-foreground/30 text-outline">
                    0{index + 1}
                  </span>
                  <motion.span
                    initial={{ clipPath: "inset(100% 0 0 0)" }}
                    whileInView={{ clipPath: "inset(0% 0 0 0)" }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 1.1, ease }}
                    className="absolute inset-0 text-lilac"
                  >
                    0{index + 1}
                  </motion.span>
                </span>
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.8, delay: 0.1, ease }}
                >
                  <h3 className="text-2xl leading-tight sm:text-3xl">
                    {t.home[title]}
                  </h3>
                  <p className="mt-2 max-w-sm text-muted-foreground">
                    {t.home[body]}
                  </p>
                </motion.div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
