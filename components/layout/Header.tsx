"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCopy } from "@/hooks/use-copy";
import { AccountLink } from "./AccountLink";
import { LogoMark } from "./LogoMark";
import { MainNav } from "./MainNav";
import { PlainModeToggle } from "./PlainModeToggle";
import { PlaylistButton } from "./PlaylistButton";

// Placeholder wordmark until the logo is designed (see Open items in the spec).
function Logo() {
  const { t, plain } = useCopy();
  return (
    <Link
      href="/"
      aria-label={plain.header.logoHome}
      className="flex shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring"
    >
      <LogoMark className="size-9 transition-transform duration-700 hover:rotate-180 motion-reduce:transition-none" />
      <span className="font-heading text-base leading-[0.85] font-extrabold tracking-tight uppercase [font-stretch:72%] sm:text-xl">
        {t.brand.split(" ").map((word) => (
          <span key={word} className="block sm:inline sm:not-last:mr-1.5">
            {word}
          </span>
        ))}
      </span>
    </Link>
  );
}

function MobileNav() {
  const { t, plain } = useCopy();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={plain.header.openNav}
          className="rounded-full xl:hidden"
        >
          <Menu aria-hidden className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        aria-describedby={undefined}
        className="w-[85%] gap-2 p-4"
      >
        <div className="flex items-center justify-between">
          <SheetTitle className="font-heading text-2xl font-extrabold tracking-tight uppercase [font-stretch:72%]">
            {t.brand}
          </SheetTitle>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={plain.header.closeNav}
              className="rounded-full"
            >
              <X aria-hidden className="size-5" />
            </Button>
          </SheetClose>
        </div>
        <nav aria-label={plain.header.mainNav}>
          <MainNav variant="sheet" onNavigate={() => setOpen(false)} />
        </nav>
        <div className="mt-2 border-t pt-4">
          <AccountLink variant="sheet" onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Header() {
  const { plain } = useCopy();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  return (
    // Floating glass bar; it tightens and gains a shadow once the page scrolls.
    <header className="sticky top-0 z-40 h-16 px-2 pt-2 sm:px-4">
      <div
        className={`mx-auto flex h-14 w-full items-center gap-2 rounded-full border border-border/60 bg-background/75 pr-2 pl-3 backdrop-blur-xl transition-[max-width,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] supports-backdrop-filter:bg-background/60 ${
          scrolled
            ? "max-w-6xl shadow-[0_18px_40px_-20px_rgb(43_30_23_/_0.45)]"
            : "max-w-[90rem] shadow-none"
        }`}
      >
        <Logo />
        <nav aria-label={plain.header.mainNav} className="ml-4 hidden xl:block">
          <MainNav variant="bar" />
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <PlainModeToggle />
          <AccountLink variant="bar" />
          <PlaylistButton />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
