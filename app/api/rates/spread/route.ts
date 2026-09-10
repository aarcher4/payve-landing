/**
 * Read and re-price the published spread.
 *
 * GET  -> current bps per corridor, plus the change log.
 * POST -> append a new version. Never an UPDATE: the table is the audit trail, so a re-price
 *         that overwrote its predecessor would destroy the record it is supposed to leave.
 *
 * Both are session-gated. GET too, not just POST: the per-corridor markup is commercial
 * information, and the public board already publishes everything a customer needs.
 */
import { getPool, hasDatabase } from "@/lib/db";
import { CURRENCY_PAIRS, BRIDGE_CONTRACT_SPREAD_BPS, type CurrencyPair } from "@/lib/rates-math";
import { COOKIE_NAME, verifySession } from "@/lib/session";
import { __resetSpreadCache } from "@/lib/spread";

function cookieFrom(request: Request): string | undefined {
  const raw = request.headers.get("cookie") ?? "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === COOKIE_NAME) return v.join("=");
  }
  return undefined;
}

async function guard(request: Request): Promise<Response | null> {
  const ok = await verifySession(cookieFrom(request));
  if (!ok) return Response.json({ error: "unauthorized" }, { status: 401 });
  return null;
}

export async function GET(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;

  const pool = getPool();
  if (!pool) {
    return Response.json(
      { error: "no_database", detail: "Spreads are read from PAYVE_PUBLIC_SPREAD_BPS until a database is configured." },
      { status: 503 },
    );
  }

  try {
    const current = await pool.query<{ currency_pair: CurrencyPair; payve_spread_bps: number }>(
      `select distinct on (currency_pair) currency_pair, payve_spread_bps
         from fx_spread_config
        where effective_from <= now()
        order by currency_pair, effective_from desc, id desc`,
    );
    const history = await pool.query(
      `select id, currency_pair, payve_spread_bps, effective_from, reason, actor
         from fx_spread_config
        order by effective_from desc, id desc
        limit 100`,
    );

    const byPair = new Map(current.rows.map((r) => [r.currency_pair, Number(r.payve_spread_bps)]));
    return Response.json(
      {
        corridors: CURRENCY_PAIRS.map((pair) => ({
          pair,
          payveSpreadBps: byPair.get(pair) ?? null,
          // Shown beside the editable number so the operator can see what their markup sits on
          // top of, and what the all-in figure comes to. Reference only, never a pricing input.
          bridgeContractBps: BRIDGE_CONTRACT_SPREAD_BPS[pair],
        })),
        history: history.rows,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[spread] read failed:", err instanceof Error ? err.message : String(err));
    return Response.json({ error: "read_failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;

  if (!hasDatabase()) return Response.json({ error: "no_database" }, { status: 503 });

  let pair: unknown;
  let bps: unknown;
  let reason: unknown;
  try {
    ({ pair, bps, reason } = (await request.json()) as Record<string, unknown>);
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }

  if (typeof pair !== "string" || !(CURRENCY_PAIRS as readonly string[]).includes(pair)) {
    return Response.json({ error: "unknown_pair", allowed: CURRENCY_PAIRS }, { status: 400 });
  }
  // Integer bps only. A fractional spread cannot be stored and would silently round.
  if (typeof bps !== "number" || !Number.isInteger(bps) || bps < 0 || bps > 10_000) {
    return Response.json({ error: "bad_bps", detail: "integer basis points, 0-10000" }, { status: 400 });
  }
  // The same minimum the CHECK constraint enforces, so a bad request fails as a 400 here
  // rather than as a 500 from Postgres.
  if (typeof reason !== "string" || reason.trim().length < 10) {
    return Response.json({ error: "reason_required", detail: "at least 10 characters" }, { status: 400 });
  }

  const pool = getPool()!;
  try {
    const { rows } = await pool.query(
      `insert into fx_spread_config (currency_pair, payve_spread_bps, reason, actor)
       values ($1, $2, $3, $4)
       returning id, currency_pair, payve_spread_bps, effective_from, reason, actor`,
      [pair, bps, reason.trim(), "operator"],
    );
    // The resolver caches for 30s; drop it so the board reflects the new price immediately
    // rather than appearing not to have saved.
    __resetSpreadCache();
    return Response.json({ ok: true, applied: rows[0] }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[spread] write failed:", err instanceof Error ? err.message : String(err));
    return Response.json({ error: "write_failed" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
