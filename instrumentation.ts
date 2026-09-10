/**
 * Next's server-start hook. Stable and auto-detected on Next 15 — `experimental.instrumentationHook`
 * is NOT required here and warns as deprecated if added.
 *
 * The only thing this does is start rate capture, and only in the Node runtime: the Edge
 * runtime has no Postgres and no long-lived process to run a timer in. `startRateCapture` is
 * itself a no-op unless a database, a Bridge key, and a production environment are all present,
 * so importing it during a build or a preview deploy costs nothing.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { startRateCapture } = await import("./lib/capture");
  startRateCapture();
}
