/**
 * Country flags as inline SVG circles.
 *
 * INLINE SVG, NOT EMOJI, and not static assets. This is a decision the payments app already
 * learned: emoji flags letter-box on Windows (and render as two letters on several Android
 * builds), and `<img>` assets flash empty on first paint, which poisons any pixel comparison
 * of the page. Inline SVG is correct at first paint, every platform, with no network.
 *
 * The hex values are the flags' own factual colours and are deliberately NOT design tokens —
 * a flag is not part of the palette and must not drift when the palette does. Each carries a
 * hairline ring so a white field (US stripes, the Mexican and Colombian whites) still reads as
 * a disc on a white page.
 */

export type CountryCode = "US" | "MX" | "CO" | "BR" | "GB" | "EU";

interface FlagProps {
  country: CountryCode;
  size?: number;
  className?: string;
}

export function Flag({ country, size = 20, className }: FlagProps) {
  const id = `flag-${country}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label={LABEL[country]}
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <clipPath id={id}>
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{FIELD[country]}</g>
      <circle cx="12" cy="12" r="11.5" fill="none" stroke="rgba(0,0,0,0.16)" strokeWidth="1" />
    </svg>
  );
}

const LABEL: Record<CountryCode, string> = {
  US: "United States",
  MX: "Mexico",
  CO: "Colombia",
  BR: "Brazil",
  GB: "United Kingdom",
  EU: "European Union",
};

/**
 * Simplified fields, not heraldry. At 20px the Mexican eagle, the Brazilian celestial globe
 * and the Union Jack's precise fimbriation are all sub-pixel; drawing them faithfully would
 * cost bytes to render as mud. Each flag is reduced to what identifies it at this size.
 */
const FIELD: Record<CountryCode, React.ReactNode> = {
  US: (
    <>
      <rect width="24" height="24" fill="#FFFFFF" />
      {[0, 2, 4, 6, 8, 10].map((i) => (
        <rect key={i} y={i * 2} width="24" height="2" fill="#B31942" />
      ))}
      <rect width="11" height="12" fill="#0A3161" />
    </>
  ),
  MX: (
    <>
      <rect width="8" height="24" fill="#006847" />
      <rect x="8" width="8" height="24" fill="#FFFFFF" />
      <rect x="16" width="8" height="24" fill="#CE1126" />
      <circle cx="12" cy="12" r="2.6" fill="none" stroke="#8B5E34" strokeWidth="1.2" />
    </>
  ),
  CO: (
    <>
      <rect width="24" height="12" fill="#FCD116" />
      <rect y="12" width="24" height="6" fill="#003893" />
      <rect y="18" width="24" height="6" fill="#CE1126" />
    </>
  ),
  BR: (
    <>
      <rect width="24" height="24" fill="#009B3A" />
      <path d="M12 3.2 21.5 12 12 20.8 2.5 12Z" fill="#FEDF00" />
      <circle cx="12" cy="12" r="4.1" fill="#002776" />
    </>
  ),
  GB: (
    <>
      <rect width="24" height="24" fill="#012169" />
      <path d="M0 0 24 24M24 0 0 24" stroke="#FFFFFF" strokeWidth="5" />
      <path d="M0 0 24 24M24 0 0 24" stroke="#C8102E" strokeWidth="2.5" />
      <path d="M12 0v24M0 12h24" stroke="#FFFFFF" strokeWidth="8" />
      <path d="M12 0v24M0 12h24" stroke="#C8102E" strokeWidth="4.5" />
    </>
  ),
  EU: (
    <>
      <rect width="24" height="24" fill="#003399" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return (
          <circle
            key={i}
            cx={12 + Math.cos(a) * 6.6}
            cy={12 + Math.sin(a) * 6.6}
            r="1.05"
            fill="#FFCC00"
          />
        );
      })}
    </>
  ),
};
