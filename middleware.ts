import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_NAME, verifySession } from "@/lib/session";

/**
 * Host routing for rates.getpayve.com, and the gate on the settings page.
 *
 * The rate surface lives under `/rates` in this app, but on its own host it should be the root:
 * a visitor to rates.getpayve.com lands on the dashboard, and its settings live at `/settings`,
 * not `/rates/settings`. Requests on that host are therefore REWRITTEN (not redirected), so the
 * clean URL stays in the address bar.
 *
 * MATCHER SCOPE IS LOAD-BEARING. Middleware runs BEFORE the rewrites in `next.config.ts`, so a
 * blanket rewrite here would capture things it must not:
 *
 *   /api/*    the dashboard polls its own /api/rates and /api/rates/history. Swallowing these
 *             would break the page in a way that looks like a data outage.
 *   /_next/*  build assets. Rewriting these breaks every script and stylesheet on the page.
 *   the two hidden slugs already rewritten in next.config.ts, which must keep resolving to
 *   their static HTML on any host.
 *
 * The matcher below excludes all of them by pattern rather than by listing paths inside the
 * handler, so a new asset route cannot silently fall into the rewrite.
 */

const RATES_HOSTS = new Set(["rates.getpayve.com"]);

/** Hidden, unguessable slugs served as static HTML via next.config.ts rewrites. */
const PASSTHROUGH = new Set(["/value-model-9f3ac21b", "/roger-value-prop-bbc01d16"]);

/** Short paths that exist on the rates host, mapped to where they really live. */
const RATES_HOST_ALIASES: Record<string, string> = {
  "/": "/rates",
  "/settings": "/rates/settings",
  "/login": "/rates/login",
};

function isSettings(pathname: string): boolean {
  return pathname === "/rates/settings" || pathname.startsWith("/rates/settings/");
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";
  const onRatesHost = RATES_HOSTS.has(host);
  const { pathname } = request.nextUrl;

  if (PASSTHROUGH.has(pathname) || PASSTHROUGH.has(pathname.replace(/\.html$/, ""))) {
    return NextResponse.next();
  }

  // Resolve the short alias FIRST, so the gate below sees the real destination. Guarding the
  // pre-alias path instead would leave /settings on the rates host ungated.
  const target = (onRatesHost && RATES_HOST_ALIASES[pathname]) || pathname;

  /**
   * The settings gate, checked on EVERY host — the page is reachable at
   * getpayve.com/rates/settings too, and a guard that depends on which name you used to arrive
   * is not a guard.
   *
   * Verification uses Web Crypto (see lib/session.ts): `node:crypto` does not exist here.
   * `verifySession` returns false when no secret is configured, so a misconfigured deploy locks
   * the page rather than opening it.
   */
  if (isSettings(target)) {
    const ok = await verifySession(request.cookies.get(COOKIE_NAME)?.value);
    if (!ok) {
      const url = request.nextUrl.clone();
      // Send people to the login URL that belongs to the host they are actually on.
      url.pathname = onRatesHost ? "/login" : "/rates/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    const res = target === pathname ? NextResponse.next() : rewriteTo(request, target);
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  if (target !== pathname) return rewriteTo(request, target);
  return NextResponse.next();
}

function rewriteTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.rewrite(url);
}

export const config = {
  /**
   * Everything except API routes, Next's build output, and the static files at the root of
   * public/. Written as a negative lookahead so a new asset type is excluded by default rather
   * than by remembering to add it here.
   */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|xml|txt|html)$).*)",
  ],
};
