import type { ReactNode } from "react";

// Groove Grounds icon set: flyer-print style. Each icon is a rounded
// outline (currentColor) over a solid shape printed slightly off-register,
// like a misaligned riso print. The offset shape takes --icon-accent
// (lilac by default; temperatures and tones set their own).

export type GrooveIconProps = { className?: string };
export type GrooveIcon = (props: GrooveIconProps) => ReactNode;

function icon(accent: ReactNode, line: ReactNode): GrooveIcon {
  function Icon({ className }: GrooveIconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        overflow="visible"
        className={className}
      >
        <g
          fill="var(--icon-accent, var(--color-lilac))"
          transform="translate(1.4 1.4)"
        >
          {accent}
        </g>
        <g
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {line}
        </g>
      </svg>
    );
  }
  return Icon;
}

// Temperatures ----------------------------------------------------------

// Warm-up: a mug with two curls of steam.
export const HotIcon = icon(
  <path d="M5 10h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" />,
  <>
    <path d="M5 10h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" />
    <path d="M16 12h1.5a2.5 2.5 0 0 1 0 5H16" />
    <path d="M8.5 3c-1 1.4 1 2.4 0 4.2M12 3c-1 1.4 1 2.4 0 4.2" />
  </>,
);

// Cool-down: a tall glass with ice cubes and a straw.
export const IcedIcon = icon(
  <path d="M7 12h10l-.9 8H7.9z" />,
  <>
    <path d="M6 6h12l-1.5 14h-9z" />
    <path d="M13 6l2-4h3" />
    <path d="M8.7 10.2l2.4-.5.5 2.4-2.4.5zM12.3 13.2l2.4.5-.5 2.4-2.4-.5z" />
  </>,
);

// Mashup: a frappe cup under a whipped dome, straw on top.
export const BlendedIcon = icon(
  <path d="M6 10a6 4.2 0 0 1 12 0z" />,
  <>
    <path d="M6.5 10h11l-1.5 10h-8z" />
    <path d="M6 10a6 4.2 0 0 1 12 0" />
    <path d="M12 5.8V2.5l3-1" />
  </>,
);

// Navigation -------------------------------------------------------------

// Center Stage: a spotlight beam landing on the stage floor.
export const StageIcon = icon(
  <path d="M10 3h4l3.6 13.5H6.4z" />,
  <>
    <path d="M9 3h6" />
    <path d="M10 3 6.5 16.5M14 3l3.5 13.5" />
    <path d="M3 19.5c0-1.4 4-2.5 9-2.5s9 1.1 9 2.5" />
  </>,
);

// The Lineup: a takeaway cup with a sleeve.
export const CupIcon = icon(
  <path d="M7.4 11h9.2l-.45 5H7.85z" />,
  <>
    <path d="M7 7h10l-1.2 13H8.2z" />
    <path d="M5.5 7h13M7.5 7 8 4.5h8l.5 2.5" />
    <path d="M7.5 11h9M7.9 16h8.2" />
  </>,
);

// Freestyle: a loose dance line ending in a spark.
export const FreestyleIcon = icon(
  <circle cx="6" cy="16.5" r="3" />,
  <>
    <path d="M3.5 18c3-6.5 5.5 3.5 8.5-2.5s4.5 2 8-4.5" />
    <path d="M18 3v4M16 5h4" />
  </>,
);

// Crew Order: two dancers side by side, one in front.
export const CrewIcon = icon(
  <path d="M7.5 19.5a4.5 4.5 0 0 1 9 0z" />,
  <>
    <circle cx="8" cy="8" r="2.6" />
    <circle cx="16" cy="8" r="2.6" />
    <path d="M3.5 19.5a4.5 4.5 0 0 1 9 0M11.5 19.5a4.5 4.5 0 0 1 9 0" />
  </>,
);

// Dancer Profile: a dancer in a cap.
export const ProfileIcon = icon(
  <path d="M5 20.5a7 7 0 0 1 14 0z" />,
  <>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M9 6.8a3.6 3.6 0 0 1 6 0M15 6.8h3.2" />
    <path d="M5 20.5a7 7 0 0 1 14 0" />
  </>,
);

// Sign in: an arrow stepping through a door.
export const SignInIcon = icon(
  <path d="M14 4h5v16h-5z" />,
  <>
    <path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" />
    <path d="M4 12h10M10.5 8.5 14 12l-3.5 3.5" />
  </>,
);

// Playlist: a cassette tape.
export const PlaylistIcon = icon(
  <rect x="4.5" y="7.5" width="15" height="6.5" rx="1" />,
  <>
    <rect x="3" y="6" width="18" height="12.5" rx="1.5" />
    <circle cx="8.5" cy="11" r="1.6" />
    <circle cx="15.5" cy="11" r="1.6" />
    <path d="M10.1 11h3.8M7 18.5l1.5-3h7l1.5 3" />
  </>,
);

// Menu: three bars cut like an equaliser.
export const MenuIcon = icon(
  <circle cx="17.5" cy="12" r="1.8" />,
  <path d="M4 7h16M4 12h10M4 17h13" />,
);

export const CloseIcon = icon(
  <circle cx="12" cy="12" r="2" />,
  <path d="M6 6l12 12M18 6 6 18" />,
);

// Plain Mode switch ---------------------------------------------------------

// Dance terms: a sneaker.
export const SneakerIcon = icon(
  <path d="M3 15.5h18v1.8a1.2 1.2 0 0 1-1.2 1.2H4.2A1.2 1.2 0 0 1 3 17.3z" />,
  <>
    <path d="M3 15.5h18v1.8a1.2 1.2 0 0 1-1.2 1.2H4.2A1.2 1.2 0 0 1 3 17.3z" />
    <path d="M3 15.5V8.5l4 1 2 2 3 1.5 6 1a3 3 0 0 1 3 1.5" />
    <path d="M9.4 11.5l1.4-1.4M12 13l1.4-1.4" />
  </>,
);

// Plain words: a cup on a saucer.
export const MugIcon = icon(
  <path d="M5 8h11v4.5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" />,
  <>
    <path d="M5 8h11v4.5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" />
    <path d="M16 9.5h1.3a2.2 2.2 0 0 1 0 4.4H16" />
    <path d="M3 20h15" />
  </>,
);

// Ordering ------------------------------------------------------------------

// Drop-in: a bolt, order now.
export const DropInIcon = icon(
  <path d="M13 2 5 13h6l-1 9 8-12h-6z" />,
  <path d="M13 2 5 13h6l-1 9 8-12h-6z" />,
);

// Book a Class: a calendar page with a clock.
export const BookIcon = icon(
  <rect x="3.5" y="5" width="17" height="5" rx="1" />,
  <>
    <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
    <path d="M8 3v4M16 3v4M3.5 10h17" />
    <circle cx="12" cy="15" r="2.6" />
    <path d="M12 13.9V15l1 .7" />
  </>,
);

// GCash (demo): a wallet.
export const WalletIcon = icon(
  <path d="M16 12h5v3.5h-5a1.75 1.75 0 0 1 0-3.5z" />,
  <>
    <rect x="3" y="6.5" width="18" height="12.5" rx="2" />
    <path d="M16 11.5h5v4h-5a2 2 0 0 1 0-4zM5 6.5l10-3 1.4 3" />
  </>,
);

// Card (demo).
export const CardIcon = icon(
  <rect x="3" y="8.5" width="18" height="3" />,
  <>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="M3 10h18M6.5 14.5h4" />
  </>,
);

// Pay at pickup: the shop front under its awning.
export const ShopIcon = icon(
  <path d="M4 9l1.5-5h13L20 9z" />,
  <>
    <path d="M4 9l1.5-5h13L20 9" />
    <path d="M4 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
    <path d="M5.5 11.5V20h13v-8.5M10 20v-4.5h4V20" />
  </>,
);

// States ------------------------------------------------------------------

// Empty Playlist: a vinyl record.
export const RecordIcon = icon(
  <circle cx="12" cy="12" r="3.2" />,
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3.2" />
    <path d="M7 8.5A6 6 0 0 1 11 6.1M17 15.5a6 6 0 0 1-4 2.4" />
  </>,
);

// Check your email.
export const MailIcon = icon(
  <path d="M3 18.5V7l9 6.5L21 7v11.5z" />,
  <>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="M3.5 6.5 12 13l8.5-6.5" />
  </>,
);
