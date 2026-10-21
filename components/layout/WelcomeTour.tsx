"use client";

import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import { Coffee, Footprints, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCopy } from "@/hooks/use-copy";
import { usePreferencesHydrated } from "@/hooks/use-preferences-hydrated";
import { fill } from "@/lib/copy";
import { usePreferences } from "@/stores/preferences";

const steps = [
  { title: "step1Title", body: "step1Body", icon: Coffee },
  { title: "step2Title", body: "step2Body", icon: ShoppingCart },
  { title: "step3Title", body: "step3Body", icon: Footprints },
] as const;

// Order links and Backstage open straight to a task, so skip the tour there.
const SKIP_PATHS = ["/track", "/backstage"];

function Tour() {
  const { t, plain, isPlain } = useCopy();
  const pathname = usePathname();
  const hydrated = usePreferencesHydrated();
  const seenWelcome = usePreferences((state) => state.seenWelcome);
  const markWelcomeSeen = usePreferences((state) => state.markWelcomeSeen);
  const togglePlainMode = usePreferences((state) => state.togglePlainMode);
  const [step, setStep] = useState(0);

  const open =
    hydrated &&
    !seenWelcome &&
    !SKIP_PATHS.some((path) => pathname.startsWith(path));
  const { title, body, icon: Icon } = steps[step];
  const last = step === steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && markWelcomeSeen()}>
      <DialogContent showCloseButton={false} className="gap-0 p-0 sm:max-w-md">
        <div className="relative overflow-hidden rounded-t-xl bg-espresso px-6 pt-6 pb-8 text-cream">
          <span
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,var(--color-purple)_0%,transparent_60%)] opacity-70"
          />
          <button
            type="button"
            onClick={markWelcomeSeen}
            aria-label={plain.welcome.close}
            className="absolute top-2 right-2 flex size-11 items-center justify-center rounded-full text-cream outline-none hover:bg-cream/10 focus-visible:ring-3 focus-visible:ring-lilac"
          >
            <X aria-hidden className="size-5" />
          </button>
          <p className="relative text-xs font-semibold tracking-widest text-lilac uppercase">
            {t.welcome.title} ·{" "}
            {fill(t.welcome.stepOf, { step: step + 1, total: steps.length })}
          </p>
          <span className="relative mt-4 flex size-14 items-center justify-center rounded-2xl bg-primary">
            {step === 2 && isPlain ? (
              <Coffee aria-hidden className="size-7" />
            ) : (
              <Icon aria-hidden className="size-7" />
            )}
          </span>
        </div>

        <div className="p-6">
          <DialogTitle className="font-heading text-3xl leading-none tracking-tight">
            {t.welcome[title]}
          </DialogTitle>
          <DialogDescription className="mt-3 text-base text-muted-foreground">
            {t.welcome[body]}
          </DialogDescription>
          {last && (
            <Button
              type="button"
              variant="outline"
              onClick={togglePlainMode}
              className="mt-4"
            >
              {isPlain ? t.welcome.switchBack : t.welcome.switchNow}
            </Button>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            <div aria-hidden className="flex gap-1.5">
              {steps.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-6 rounded-full ${index === step ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {!last && (
                <Button type="button" variant="ghost" onClick={markWelcomeSeen}>
                  {t.welcome.skip}
                </Button>
              )}
              <Button
                type="button"
                onClick={() => (last ? markWelcomeSeen() : setStep(step + 1))}
              >
                {last ? t.welcome.done : t.welcome.next}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// usePathname suspends on dynamic routes under Cache Components.
export function WelcomeTour() {
  return (
    <Suspense fallback={null}>
      <Tour />
    </Suspense>
  );
}
