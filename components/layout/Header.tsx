"use client";

import { useState } from "react";
import Link from "next/link";
import { Disc3, Menu, X } from "lucide-react";
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
      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Disc3 aria-hidden className="size-6" />
      </span>
      <span className="font-heading text-lg leading-[0.85] tracking-wide uppercase sm:text-xl">
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
          <SheetTitle className="font-heading text-2xl tracking-wide uppercase">
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
        <div className="mt-2 border-t-2 border-dashed pt-4">
          <AccountLink variant="sheet" onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Header() {
  const { plain } = useCopy();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-4">
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
