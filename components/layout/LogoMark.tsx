// Groove Grounds mark: a vinyl record whose centre label is a coffee bean
// (the record / bean idea from the spec's open items). Decorative; the link
// around it carries the accessible name.
// `light` is for dark surfaces (cream record); the default follows the theme.
export function LogoMark({
  className = "size-10",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  const disc = light ? "fill-cream" : "fill-espresso dark:fill-cream";
  const grooves = light
    ? "stroke-espresso/35"
    : "stroke-cream/35 dark:stroke-espresso/35";
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <circle cx="24" cy="24" r="23" className={disc} />
      {[19, 15.5, 12].map((r) => (
        <circle
          key={r}
          cx="24"
          cy="24"
          r={r}
          fill="none"
          strokeWidth="0.9"
          className={grooves}
        />
      ))}
      <ellipse
        cx="24"
        cy="24"
        rx="7.5"
        ry="9.5"
        transform="rotate(28 24 24)"
        className="fill-primary"
      />
      <path
        d="M20.4 16.6c3.4 2.6 3.6 5.6 1.8 7.6s-1.6 5 1.8 7.4"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        transform="rotate(28 24 24)"
        className="stroke-cream"
      />
    </svg>
  );
}
