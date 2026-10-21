// Simple stand-ins for the Intermission snacks until their photos exist.
// Colours are theme tokens.

const crumb = "var(--color-brew-chocolate)";
const bake = "var(--color-caramel)";
const dough = "var(--color-genre-intermission)";
const glaze = "var(--color-whip)";

export function SnackArt({ slug }: { slug: string }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-auto overflow-visible">
      <ellipse
        cx="100"
        cy="176"
        rx="70"
        ry="10"
        fill="currentColor"
        opacity="0.12"
      />
      {slug === "8-count-cookie" && (
        <g>
          <circle cx="100" cy="100" r="66" fill={bake} />
          <circle cx="100" cy="100" r="58" fill={dough} />
          {[
            [78, 76],
            [120, 70],
            [96, 108],
            [134, 112],
            [70, 122],
            [108, 140],
            [86, 92],
          ].map(([x, y], i) => (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="8"
              ry="6"
              fill={crumb}
              transform={`rotate(${i * 25} ${x} ${y})`}
            />
          ))}
        </g>
      )}
      {slug === "toprock-croissant" && (
        <g>
          <path
            d="M28 130 C 40 70, 160 70, 172 130 C 150 112, 130 108, 100 108 C 70 108, 50 112, 28 130 Z"
            fill={bake}
          />
          {[52, 76, 100, 124, 148].map((x) => (
            <path
              key={x}
              d={`M${x} 86 q 6 14 0 26`}
              stroke={dough}
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </g>
      )}
      {slug === "pirouette-cinnamon-roll" && (
        <g>
          <circle cx="100" cy="104" r="64" fill={bake} />
          <path
            d="M100 104 m0 -6 a6 6 0 1 1 -1 12 a14 14 0 1 1 2 -28 a24 24 0 1 1 -3 48 a34 34 0 1 1 4 -68 a44 44 0 1 1 -5 88"
            stroke={dough}
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M60 70 q 40 -30 80 0 q -6 18 -14 10 q -10 16 -22 4 q -14 14 -24 -2 q -12 8 -20 -12 Z"
            fill={glaze}
            opacity="0.9"
          />
        </g>
      )}
      {slug === "battle-banana-bread" && (
        <g>
          <path d="M36 150 L36 86 Q 100 40 164 86 L164 150 Z" fill={bake} />
          <path d="M46 150 L46 92 Q 100 56 154 92 L154 150 Z" fill={dough} />
          {[
            [78, 112],
            [118, 104],
            [100, 132],
          ].map(([x, y], i) => (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="12"
              ry="7"
              fill={glaze}
              stroke={bake}
              strokeWidth="3"
            />
          ))}
        </g>
      )}
    </svg>
  );
}
