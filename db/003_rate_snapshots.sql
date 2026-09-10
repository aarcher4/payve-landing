-- Rates surface schema, migration 003: the rate time series behind the chart.
--
-- Bridge serves a live spot rate and nothing else - no history endpoint, no quote, no rate
-- lock. So the 1D/1W tabs are built from rates we record ourselves, and the 1M/6M/1Y/5Y tabs
-- from official daily closes (ECB via Frankfurter for MXN/EUR/GBP/BRL, Banco de la Republica's
-- TRM for COP, which ECB does not publish).
--
-- (currency_pair, bucket_at, granularity) IS the idempotency key. A re-run overwrites its own
-- bucket rather than appending, so an overlapping tick during a Render deploy, a restart, or a
-- re-run of the backfill can never double-write or leave a hole. This is the same reasoning as
-- credit_capacity_snapshot in the payments app: the natural key IS the claim, so no separate
-- claim table is needed.
--
-- Deliberately NOT append-only, unlike fx_spread_config. A spread is a decision and its
-- history is the audit trail; an observed rate is a measurement, and re-measuring the same
-- bucket should correct it, not stack a second opinion beside it.
create table if not exists fx_rate_snapshot (
  currency_pair    text not null
    check (currency_pair in
      ('usd_to_mxn', 'usd_to_eur', 'usd_to_cop', 'usd_to_brl', 'usd_to_gbp')),
  -- Floor of the capture interval, UTC. 5-minute floor for intraday, midnight for daily.
  bucket_at        timestamptz not null,
  granularity      text not null check (granularity in ('intraday', 'daily')),
  -- Mid-market. SERVER-SIDE ONLY - never published. It is the reference the published rate is
  -- derived from and sanity-checked against, and publishing it would disclose margin.
  mid_rate         numeric(20, 8) not null check (mid_rate > 0),
  -- Bridge's own two sides, when the point came from Bridge. NULL for daily points from a
  -- public source, which only publishes a mid. Also server-side only.
  bridge_sell_rate numeric(20, 8) check (bridge_sell_rate > 0),
  bridge_buy_rate  numeric(20, 8) check (bridge_buy_rate > 0),
  source           text not null check (source in ('bridge', 'ecb', 'banrep')),
  captured_at      timestamptz not null default now(),
  primary key (currency_pair, bucket_at, granularity)
);

-- Every read is "one pair, one granularity, newest N" or "... since T". This index is that.
create index if not exists fx_rate_snapshot_series_idx
  on fx_rate_snapshot (currency_pair, granularity, bucket_at desc);
