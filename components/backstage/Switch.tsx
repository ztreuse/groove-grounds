"use client";

type SwitchProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  // Plain wording for screen readers.
  ariaLabel: string;
  disabled?: boolean;
};

// Labelled on/off switch for Backstage settings (Sitting out, Spotlight).
// 44px tall tap target; the track fills purple when on.
export function Switch({
  checked,
  onChange,
  label,
  ariaLabel,
  disabled = false,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="group inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:opacity-50"
    >
      <span
        aria-hidden
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted ring-1 ring-border ring-inset"
        }`}
      >
        <span
          className={`absolute top-1 left-1 size-4 rounded-full bg-background shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
