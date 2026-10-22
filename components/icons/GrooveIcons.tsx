import type { ReactNode } from "react";

// Groove Grounds icon set: solid, logo-style glyphs on a 24px grid. Shapes
// are filled with currentColor and details are cut out (even-odd), so each
// mark reads like a small brand logo. Pair with IconTile for the tinted
// square, or use bare inside buttons.

export type GrooveIconProps = { className?: string };
export type GrooveIcon = (props: GrooveIconProps) => ReactNode;

// Circle as a path, so it can be cut out of a shape with even-odd.
const c = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;

function icon(children: ReactNode): GrooveIcon {
  function Icon({ className }: GrooveIconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        aria-hidden
        className={className}
      >
        {children}
      </svg>
    );
  }
  return Icon;
}

// Temperatures ----------------------------------------------------------

// Warm-up: a mug with two rising wisps.
export const HotIcon = icon(
  <>
    <path d="M4 9h12v5.5A5.5 5.5 0 0 1 10.5 20h-1A5.5 5.5 0 0 1 4 14.5z" />
    <path d="M16 10.5h1.5a3 3 0 0 1 0 6H16v-2h1.5a1 1 0 0 0 0-2H16z" />
    <rect x="7.1" y="2.5" width="1.8" height="4.8" rx="0.9" />
    <rect x="11.1" y="3.5" width="1.8" height="3.8" rx="0.9" />
  </>,
);

// Cool-down: a tall glass with ice cubes cut out, straw on top.
export const IcedIcon = icon(
  <>
    <path
      d={`M5.5 6.5h13l-1.6 13.7a1 1 0 0 1-1 .8H8.1a1 1 0 0 1-1-.8z
          M8.6 10.6l2.6-.6.6 2.6-2.6.6z M12.5 13.6l2.6.6-.6 2.6-2.6-.6z`}
    />
    <path d="M13 5.8 15.2 1.5h3.3v1.8h-2.2L15 5.8z" />
  </>,
);

// Mashup: a frappe cup under a whipped dome, straw up top.
export const BlendedIcon = icon(
  <>
    <path d="M5.5 10.2a6.5 4.6 0 0 1 13 0z" />
    <path d="M6.3 11.6h11.4l-1.5 8.6a1 1 0 0 1-1 .8H8.8a1 1 0 0 1-1-.8z" />
    <path d="M11.1 5.4V2.2l3.7-1.2.5 1.6-2.4.8v2z" />
  </>,
);

// Navigation -------------------------------------------------------------

// Center Stage: a spotlight beam over the stage floor.
export const StageIcon = icon(
  <>
    <rect x="8" y="1.5" width="8" height="2.2" rx="1.1" />
    <path d="M9.6 4.5h4.8l3.6 11.5H6z" />
    <ellipse cx="12" cy="19.6" rx="9.5" ry="2.4" />
  </>,
);

// The Lineup: a takeaway cup with its sleeve cut out.
export const CupIcon = icon(
  <>
    <path d="M7.4 5.2 8 2.6h8l.6 2.6z" />
    <rect x="5.2" y="5.6" width="13.6" height="2.4" rx="1" />
    <path
      d={`M6.6 9h10.8l-1.2 11.1a1 1 0 0 1-1 .9H8.8a1 1 0 0 1-1-.9z
          M7.2 12.2h9.6l-.12 1.3H7.32z M7.55 16h8.9l-.12 1.3h-8.66z`}
    />
  </>,
);

// Freestyle: a big spark and a small one, make your own move.
export const FreestyleIcon = icon(
  <>
    <path d="M9.5 2l2 6.5 6.5 2-6.5 2-2 6.5-2-6.5-6.5-2 6.5-2z" />
    <path d="M18.5 13.5l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
  </>,
);

// Crew Order: two dancers side by side.
export const CrewIcon = icon(
  <>
    <path d={c(7, 9, 3)} />
    <path d={c(17, 9, 3)} />
    <path d="M2 20.5a5 5 0 0 1 10 0z" />
    <path d="M12 20.5a5 5 0 0 1 10 0z" />
  </>,
);

// Dancer Profile: head and shoulders.
export const ProfileIcon = icon(
  <>
    <path d={c(12, 7.8, 4.2)} />
    <path d="M3.8 21a8.2 8.2 0 0 1 16.4 0z" />
  </>,
);

// Sign in: an arrow stepping into a door.
export const SignInIcon = icon(
  <>
    <path d="M13 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5z" />
    <path d="M3 10.9h7.3L8.1 8.7l1.5-1.5 4.8 4.8-4.8 4.8-1.5-1.5 2.2-2.2H3z" />
  </>,
);

// Playlist: a cassette tape, reels and window cut out.
export const PlaylistIcon = icon(
  <path
    d={`M4 4.5h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2z
        ${c(8.3, 10.5, 2)} ${c(15.7, 10.5, 2)}
        M10.6 9.6h2.8v1.8h-2.8z M7 19.5l1.4-3.2h7.2l1.4 3.2z`}
  />,
);

// Playlist (cart): a shopping cart, basket slats cut out, two wheels.
export const CartIcon = icon(
  <>
    <path
      d={`M1.5 3.2h2.9a1.2 1.2 0 0 1 1.17.93L6 6h14.6a1 1 0 0 1 .97 1.24l-1.6 6.6A1.6 1.6 0 0 1 18.4 15H8.1l.35 1.6h10.3v2H7.6a1.2 1.2 0 0 1-1.17-.94L3.6 5.2H1.5z
        M8.7 8.2h1.6l.5 4.6H9.6z M12.3 8.2h1.6l-.1 4.6h-1.5z M15.9 8.2h1.6l-.8 4.6h-1.3z`}
    />
    <path d={c(8.6, 21, 1.6)} />
    <path d={c(17.2, 21, 1.6)} />
  </>,
);

// Menu: three bars, cut like an equaliser.
export const MenuIcon = icon(
  <>
    <rect x="3" y="5.4" width="18" height="2.4" rx="1.2" />
    <rect x="3" y="10.8" width="12" height="2.4" rx="1.2" />
    <rect x="3" y="16.2" width="15" height="2.4" rx="1.2" />
  </>,
);

export const CloseIcon = icon(
  <path d="M6.3 4.6 12 10.3l5.7-5.7 1.7 1.7-5.7 5.7 5.7 5.7-1.7 1.7-5.7-5.7-5.7 5.7-1.7-1.7 5.7-5.7-5.7-5.7z" />,
);

// Plain Mode switch ---------------------------------------------------------

// Dance terms: a sneaker with its sole line and laces cut out.
export const SneakerIcon = icon(
  <path
    d={`M2 17.2V9.6c0-.7.7-1.2 1.4-.9l3.2 1.2 2.4 2.2 3.4 1.5 6.2 1.1A3.6 3.6 0 0 1 22 18.2v1.3H4.3A2.3 2.3 0 0 1 2 17.2z
        M2 16.1h20v1.2H2z M8.7 11.9l1.4-1.4.8.8-1.4 1.4z M11.4 13.3l1.4-1.4.8.8-1.4 1.4z`}
  />,
);

// Plain words: a cup on a saucer.
export const MugIcon = icon(
  <>
    <path d="M4.5 6.5h11v5.2a4.8 4.8 0 0 1-4.8 4.8H9.3a4.8 4.8 0 0 1-4.8-4.8z" />
    <path d="M15.5 7.8h1.2a3 3 0 0 1 0 6h-1.6v-1.9h1.6a1.1 1.1 0 0 0 0-2.2h-1.2z" />
    <rect x="2.5" y="18.3" width="16.5" height="2.2" rx="1.1" />
  </>,
);

// Ordering ------------------------------------------------------------------

// Drop-in: a bolt, order now.
export const DropInIcon = icon(
  <path d="M13.8 1.8 4.4 13.6h6.6L9.6 22.2l9.4-11.8h-6.6z" />,
);

// Book a Class: a calendar page with a clock cut out.
export const BookIcon = icon(
  <>
    <rect x="6.6" y="2" width="2" height="4.6" rx="1" />
    <rect x="15.4" y="2" width="2" height="4.6" rx="1" />
    <path
      d={`M5 4.5h14a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2z
          M3 9h18v1.4H3z ${c(12, 15.3, 3.6)}`}
    />
    <path d="M11.4 13.3h1.3v2h1.6v1.3h-2.9z" />
  </>,
);

// GCash (demo): a wallet with its clasp.
export const WalletIcon = icon(
  <>
    <path d="M5 5.4 15 2.6l1.1 2.8z" />
    <path d="M4 6h14a2 2 0 0 1 2 2v1.3h-4.5a3.7 3.7 0 0 0 0 7.4H20V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d={`M15.5 10.8H22v4.4h-6.5a2.2 2.2 0 0 1 0-4.4z ${c(15.8, 13, 1)}`} />
  </>,
);

// Card (demo): stripe and chip cut out.
export const CardIcon = icon(
  <path
    d={`M4 4.5h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2z
        M2 8.4h20v2.6H2z M5 14.4h5.5v1.8H5z`}
  />,
);

// Pay at pickup: the shop front under a scalloped awning.
export const ShopIcon = icon(
  <>
    <path d="M4.6 2.5h14.8l2.1 6.2a2.5 2.5 0 0 1-4.7 1.5 2.5 2.5 0 0 1-4.8 0 2.5 2.5 0 0 1-4.8 0A2.5 2.5 0 0 1 2.5 8.7z" />
    <path
      d={`M4.3 12.3a3.8 3.8 0 0 0 2.6-.6 3.9 3.9 0 0 0 5.1 0 3.9 3.9 0 0 0 5.1 0 3.8 3.8 0 0 0 2.6.6V21H4.3z
          M10 21v-4.8h4V21z`}
    />
  </>,
);

// States ------------------------------------------------------------------

// Empty Playlist: a vinyl record with grooves and a label.
export const RecordIcon = icon(
  <path
    d={`${c(12, 12, 10)} ${c(12, 12, 7.4)} ${c(12, 12, 6.5)} ${c(12, 12, 3.8)} ${c(12, 12, 3)} ${c(12, 12, 1)}`}
  />,
);

// Check your email: an envelope with its flap cut out.
export const MailIcon = icon(
  <path
    d={`M4 4.5h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2z
        M3.6 6.6 12 12.9l8.4-6.3v1.8L12 14.7 3.6 8.4z`}
  />,
);
