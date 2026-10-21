"use client";

import { Toaster as Sonner } from "sonner";

// Toasts for quick confirmations (added to Playlist, saved, run it back).
// Styled with the theme tokens; follows the device's light / dark setting.
export function Toaster() {
  return (
    <Sonner
      position="bottom-center"
      theme="system"
      offset={{ bottom: 96 }}
      mobileOffset={{ bottom: 96, left: 16, right: 16 }}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-2xl !border-0 !bg-espresso !text-cream !shadow-[0_20px_40px_-16px_rgb(0_0_0_/_0.5)] !font-sans",
          description: "!text-cream/80",
          actionButton:
            "!rounded-full !bg-lilac !text-espresso !font-semibold !px-3",
        },
      }}
    />
  );
}
