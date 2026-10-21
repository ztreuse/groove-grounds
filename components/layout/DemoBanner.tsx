import { dance } from "@/lib/copy";

// Step 2 switches this to useCopy(); the text is the same in both modes.
export function DemoBanner() {
  return (
    <div
      role="note"
      className="bg-espresso-deep px-4 py-1.5 text-center text-xs font-medium text-cream"
    >
      {dance.demoBanner}
    </div>
  );
}
