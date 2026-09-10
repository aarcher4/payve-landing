import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_NAME, verifySession } from "@/lib/session";

/**
 * Host routing for rates.getpayve.com.
 *
 * The rate dashboard lives at `/rates` in this app, but on its own host it should be the root:
 * a visitor to rates.getpayve.com lands on the dashboard, not on a marketing page that links
 * to it. So requests on that host are rewritten (not redirected) into `/rates`, keeping the
 * clean URL in the address bar.
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

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";
  const { pathname } = request.nextUrl;

  /**
   * The settings gate, checked on EVERY host rather than only the rates host — the page is
   * reachable at getpayve.com/rates/settings too, and a guard that depends on which name you
   * used to arrive is not a guard.
   *
   * Verification uses Web Crypto (see lib/session.ts): `node:crypto` does not exist here.
   * `verifySession` returns false when no secret is configured, so a misconfigured deploy
   * locks the page rather than opening it.
   */
  if (pathname === "/rates/settings" || pathname.startsWith("/rates/settings/")) {
    const ok = await verifySession(request.cookies.get(COOKIE_NAME)?.value);
    if (!ok) {
      const url = request.nextUrl.clone();
      url.pathname = "/rates/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  if (!RATES_HOSTS.has(host)) return NextResponse.next();
  if (PASSTHROUGH.has(pathname) || PASSTHROUGH.has(pathname.replace(/\.html$/, ""))) {
    return NextResponse.next();
  }

  // Already under /rates (including /rates/settings): serve as-is.
  if (pathname === "/rates" || pathname.startsWith("/rates/")) return NextResponse.next();

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/rates";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  /**
   * Everything except API routes, Next's build output, and the static files at the root of
   * public/. Written as a negative lookahead so a new asset type is excluded by default rather
   * than by remembering to add it here.
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|xml|txt|html)$).*)"],
};
