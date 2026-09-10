"use client";

import { usePathname } from "next/navigation";
import { Wordmark } from "../components/Wordmark";

/**
 * The chrome for the rates host: wordmark and a two-item nav.
 *
 * Minimal on purpose, not the marketing nav. At rates.getpayve.com these pages ARE the site, so
 * the header carries a wordmark and the section links and nothing else. A tall marketing hero
 * would push the quote and the chart below the fold, which is the one thing a rate page must
 * never do.
 *
 * A shared COMPONENT rather than a route layout, because `/rates/login` deliberately has no
 * chrome at all: a layout applies to every child, so it would need a pathname conditional to
 * hide itself, and that shows a flash of header before hydration. Three explicit imports beat
 * conditional chrome.
 *
 * HOST-AWARE LINKS. The middleware REWRITES on the rates host, so the browser URL stays short
 * (`/`, `/working-capital`) while the app serves `/rates/*`. `usePathname()` therefore returns
 * the short form there and the canonical form on www, and the nav has to match or every link
 * would leave the host it was clicked on. Same technique as the login redirects.
 */

interface NavItem {
  label: string;
  /** Path on the rates host, where the middleware aliases short URLs. */
  short: string;
  /** Canonical path, valid on every host. */
  canonical: string;
}

const NAV: NavItem[] = [
  { label: "The Payve Rate", short: "/", canonical: "/rates" },
  { label: "Working capital", short: "/working-capital", canonical: "/rates/working-capital" },
];

export function RatesChrome() {
  const pathname = usePathname() ?? "/rates";
  // A short path can only have come from the rates host, because nothing else serves it.
  const onRatesHost = !pathname.startsWith("/rates");

  return (
    <header className="border-b border-r-border bg-r-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 sm:px-6">
        <a href={onRatesHost ? "/" : "/rates"} aria-label="Payve home" className="shrink-0">
          <Wordmark height={22} />
        </a>

        <nav aria-label="Sections" className="flex items-center gap-1">
          {NAV.map((item) => {
            const href = onRatesHost ? item.short : item.canonical;
            const active = pathname === item.short || pathname === item.canonical;
            return (
              <a
                key={item.canonical}
                href={href}
                data-nav={item.canonical}
                // aria-current, not colour alone: the active section must be announced, and a
                // colour-only signal fails for a screen reader and in print.
                aria-current={active ? "page" : undefined}
                className={`min-h-control rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.04em] transition-colors ${
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
