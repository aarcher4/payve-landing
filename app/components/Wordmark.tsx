/**
 * The Payve wordmark.
 *
 * Assets and their surfaces are named by the design system: `public/logo.svg` on a light
 * surface, `public/logo-light.svg` on a dark or photographic one. Both are the same artwork at
 * the same 333x112 viewBox, so swapping them cannot shift layout.
 *
 * The system's rule is that the logo MUST NOT be stretched, redrawn, recoloured, outlined,
 * shadowed, or placed in a decorative badge. Height is therefore the only prop: width follows
 * from the aspect ratio, and both dimensions are set explicitly so the header does not reflow
 * when the SVG arrives.
 *
 * Rendered as an <img> rather than inlined because these are the sanctioned asset files — the
 * point of naming them in the design system is that every surface loads the same bytes. They
 * are local and cached, so the first-paint flash that rules <img> out for flags does not apply.
 */

const RATIO = 333 / 112;

export function Wordmark({
  height = 24,
  variant = "dark-ink",
  className,
}: {
  height?: number;
  /** "dark-ink" for a light surface; "light-ink" for a dark or photographic one. */
  variant?: "dark-ink" | "light-ink";
  className?: string;
}) {
  return (
    <img
      src={variant === "light-ink" ? "/logo-light.svg" : "/logo.svg"}
      alt="Payve"
      width={Math.round(height * RATIO)}
      height={height}
      className={className}
      style={{ display: "block", height, width: "auto" }}
    />
  );
}
