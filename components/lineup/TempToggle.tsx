"use client";

import { DropdownMenu } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { CupIcon } from "@/components/icons/GrooveIcons";
import { IconTile } from "@/components/layout/IconTile";
import { useCopy } from "@/hooks/use-copy";
import { tempStyles } from "@/lib/temps";

export type TempFilter = "all" | "hot" | "cold";

type TempToggleProps = {
  value: TempFilter;
  onChange: (value: TempFilter) => void;
};

// Temperature filter as a compact dropdown that sits inside the search
// field: the trigger shows the current choice's tile (label from sm up);
// the menu lists Any / Warm-up / Cool-down with their plain meanings.
export function TempToggle({ value, onChange }: TempToggleProps) {
  const { t, plain, isPlain } = useCopy();

  const options = [
    {
      value: "all",
      label: t.lineup.tempAny,
      ariaLabel: plain.lineup.tempAny,
      tile: <IconTile icon={CupIcon} tone="neutral" size="sm" />,
    },
    {
      value: "hot",
      label: t.remix.warmUp,
      ariaLabel: plain.remix.warmUp,
      tile: (
        <IconTile
          icon={tempStyles.hot.icon}
          tone="custom"
          className={tempStyles.hot.accent}
          size="sm"
        />
      ),
    },
    {
      value: "cold",
      label: t.remix.coolDown,
      ariaLabel: plain.remix.coolDown,
      tile: (
        <IconTile
          icon={tempStyles.iced.icon}
          tone="custom"
          className={tempStyles.iced.accent}
          size="sm"
        />
      ),
    },
  ] as const;
  const current =
    options.find((option) => option.value === value) ?? options[0];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={`${plain.lineup.tempFilter}: ${current.ariaLabel}`}
        className="relative flex h-9 shrink-0 items-center gap-1.5 rounded-sm bg-muted py-1.5 pr-2 pl-1.5 text-sm font-semibold outline-none after:absolute after:-inset-1 after:content-[''] hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
      >
        {current.tile}
        <span className="max-sm:sr-only">{current.label}</span>
        <ChevronDown aria-hidden className="size-4 opacity-70" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-50 min-w-56 rounded-md bg-popover p-1.5 text-popover-foreground shadow-[0_0_0_1px_var(--border),0_18px_40px_-18px_rgb(43_30_23_/_0.5)] data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in"
        >
          <DropdownMenu.Label className="px-2 pt-1 pb-2 text-xs font-medium text-muted-foreground">
            {t.lineup.tempFilter}
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            value={value}
            onValueChange={(next) => onChange(next as TempFilter)}
          >
            {options.map((option) => (
              <DropdownMenu.RadioItem
                key={option.value}
                value={option.value}
                aria-label={option.ariaLabel}
                className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-sm px-2 text-sm font-semibold outline-none data-[highlighted]:bg-muted"
              >
                {option.tile}
                <span className="flex-1 leading-tight">
                  <span className="block">{option.label}</span>
                  {!isPlain && option.ariaLabel !== option.label && (
                    <span className="block text-[11px] font-medium text-muted-foreground">
                      {option.ariaLabel}
                    </span>
                  )}
                </span>
                <DropdownMenu.ItemIndicator>
                  <Check aria-hidden className="size-4 text-highlight" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
