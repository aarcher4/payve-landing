/**
 * Next's server-start hook. Stable and auto-detected on Next 15 — `experimental.instrumentationHook`
 * is NOT required and warns as deprecated if added.
 *
 * THE SHAPE OF THIS FILE IS LOAD-BEARING, not stylistic.
 *
 * Next compiles instrumentation for BOTH runtimes, and adding `middleware.ts` gave this app an
 * Edge runtime. The capture module reaches Postgres through `pg`, which needs `fs`, `dns` and
 * `net` — none of which exist on Edge — so the Edge build failed with
 * "Can't resolve 'fs'" walking instrumentation -> capture -> db -> pg.
 *
 * An early return (`if (RUNTIME !== "nodejs") return;`) does NOT fix it: that is a runtime
 * check, and webpack still traverses the import below it. `serverExternalPackages: ["pg"]`
 * does not fix it either, since it does not apply to the Edge compilation.
 *
 * What works is the positive-guard form. `process.env.NEXT_RUNTIME` is inlined per runtime at
 * build time, so for the Edge bundle the condition folds to `false` and the whole block —
 * dynamic import included — is dead-code eliminated before webpack ever tries to resolve it.
 * Keep the import INSIDE the if.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startRateCapture } = await import("./lib/capture");
    startRateCapture();
  }
}
