-- Rates surface schema, migration 004: one Payve markup, 16 bps, on every corridor.
--
-- MXN already published 16; the other four carried the historical 20 forward from
-- PAYVE_PUBLIC_SPREAD_BPS. This makes the markup uniform, so the all-in figure a customer sees
-- is the rail's own measured spread plus a flat 16 everywhere:
--
--   MXN   ~10 + 16 = ~26 bps        COP   ~50 + 16 = ~66 bps
--   EUR   ~20 + 16 = ~36 bps        BRL   ~30 + 16 = ~46 bps
--   GBP   ~19 + 16 = ~35 bps
--
-- The rail figures above are approximate on purpose: the settings screen now MEASURES them from
-- our own snapshots rather than reading a constant, because the two written sources for them
-- disagreed on BRL and had no EUR or GBP at all.
--
-- Appends, like every re-price: the table is the audit trail and nothing is updated in place.
--
-- Idempotent by guard rather than by ON CONFLICT, because an append-only table has no natural
-- key to conflict on. Re-running inserts nothing once a corridor already publishes 16, so a
-- redeploy cannot stack duplicate rows on top of a later deliberate re-price.
insert into fx_spread_config (currency_pair, payve_spread_bps, reason, actor)
select v.pair, 16,
       'Uniform 16 bps Payve markup on every corridor, replacing the 20 bps carried over from PAYVE_PUBLIC_SPREAD_BPS.',
       'migration:004_uniform_16bps'
  from (values ('usd_to_mxn'), ('usd_to_eur'), ('usd_to_cop'), ('usd_to_brl'), ('usd_to_gbp'))
       as v(pair)
 where (
   select c.payve_spread_bps
     from fx_spread_config c
    where c.currency_pair = v.pair and c.effective_from <= now()
    order by c.effective_from desc, c.id desc
    limit 1
 ) is distinct from 16;
