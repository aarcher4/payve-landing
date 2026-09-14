"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "../components/Wordmark";
import { SURFACE_HOSTS } from "@/lib/site";

/**
 * The chrome for the liquidity host: wordmark and a two-item nav.
 *
 * Minimal on purpose, not the marketing nav. On this host these pages ARE the site, so the
 * header carries a wordmark and the section links and nothing else.
 *
 * A shared COMPONENT rather than a route layout, because `/rates/login` deliberately has no
 * chrome at all: a layout applies to every child, so it would need a pathname conditional to
 * hide itself, and that shows a flash of header before hydration.
 *
 * HOW IT PICKS HREFS, AND WHY IT IS NOT `pathname`.
 *
 * The middleware REWRITES on the liquidity host, so the browser URL stays short (`/`,
 * `/settings`) while the app serves `/rates/*`. The nav has to match or every link would leave
 * the host it was clicked on.
 *
 * Inferring that from `usePathname()` used to work and stopped the moment `/` became Working
 * Capital: the rate board's short URL is now `/rates`, which is ALSO its app path, so a visitor
 * on the liquidity host at `/rates` is indistinguishable from one on www at `/rates`. The
 * hostname is the only unambiguous signal.
 *
 * Read after mount, never during render. `window` does not exist on the server, so branching on
 * it in the render body would make the server and the client disagree and produce a hydration
 * mismatch. Both start from the canonical hrefs, which are valid on every host, and the effect
 * shortens them once it knows where it is.
 */

interface NavItem {
  label: string;
  /** Path on the liquidity host, where the middleware aliases short URLs. */
  short: string;
  /** Canonical path, valid on every host. */
  canonical: string;
}

/**
 * Working capital leads, because on the liquidity host it IS the landing page. The rate board
 * keeps its own short URL at `/rates`, which happens to equal its app path.
 */
const NAV: NavItem[] = [
  { label: "Working capital", short: "/", canonical: "/rates/working-capital" },
  { label: "The Payve Rate", short: "/rates", canonical: "/rates" },
];

export function RatesChrome() {
  const pathname = usePathname() ?? "/rates";
  const [onSurfaceHost, setOnSurfaceHost] = useState(false);

  useEffect(() => {
    setOnSurfaceHost(SURFACE_HOSTS.has(window.location.hostname));
  }, []);

  return (
    <header className="border-b border-r-border bg-r-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:px-6 sm:py-4">
        <a
          href={onSurfaceHost ? "/" : "/rates/working-capital"}
          aria-label="Payve home"
          className="shrink-0"
        >
          <Wordmark height={20} className="sm:h-[22px]" />
        </a>

        {/* Scrolls rather than wraps on a narrow phone, so the header stays one line tall. */}
        <nav
          aria-label="Sections"
          className="-mx-1 flex min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto px-1"
        >
          {NAV.map((item) => {
            const href = onSurfaceHost ? item.short : item.canonical;
            const active = pathname === item.short || pathname === item.canonical;
            return (
              <a
                key={item.canonical}
                href={href}
                data-nav={item.canonical}
                // aria-current, not colour alone: the active section must be announced, and a
                // colour-only signal fails for a screen reader and in print.
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-control shrink-0 items-center whitespace-nowrap rounded-full px-3 text-[11px] font-semibold uppercase tracking-[0.04em] transition-colors sm:px-3.5 sm:text-xs ${
                  active
                    ? "bg-r-primary text-r-primary-fg"
                    : "text-r-muted-fg hover:bg-r-muted hover:text-r-fg"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
