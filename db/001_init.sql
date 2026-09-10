-- Rates surface schema, migration 001.
--
-- Idempotent by construction: every statement is if-not-exists or on-conflict, so re-running
-- a migration is a no-op rather than an error. The runner ledgers applied files, but a
-- migration that is only safe once is a migration that will eventually fail a redeploy.

create table if not exists schema_migrations (
  name       text primary key,
  applied_at timestamptz not null default now()
);

-- The published Payve markup per corridor, in basis points.
--
-- APPEND-ONLY AND VERSIONED. A re-price INSERTs a new row; nothing is ever UPDATEd. The live
-- value is the newest row with effective_from <= now(). This is what makes the settings
-- change log trustworthy - the history IS the data, not a log written alongside it and hoped
-- to agree. Same doctrine as bridge_fee_config in the payments app.
create table if not exists fx_spread_config (
  id               bigserial primary key,
  currency_pair    text not null
    check (currency_pair in
      ('usd_to_mxn', 'usd_to_eur', 'usd_to_cop', 'usd_to_brl', 'usd_to_gbp')),
  -- 0 is a legitimate value (zero markup). 10000 bps = 100%, the absolute ceiling.
  payve_spread_bps integer not null check (payve_spread_bps between 0 and 10000),
  effective_from   timestamptz not null default now(),
  -- Every consequential write records why. Minimum length is enforced here as well as in the
  -- API so a direct psql edit cannot skip it.
  reason           text not null check (length(btrim(reason)) >= 10),
  actor            text not null check (length(btrim(actor)) > 0),
  created_at       timestamptz not null default now()
);

-- The resolver reads "newest already-effective row per pair", which is exactly this index.
create index if not exists fx_spread_config_pair_effective_idx
  on fx_spread_config (currency_pair, effective_from desc, id desc);
