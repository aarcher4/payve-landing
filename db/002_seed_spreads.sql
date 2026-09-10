-- Rates surface schema, migration 002: seed the published spreads.
--
-- MXN seeds at 16 bps, the number this site publishes. Bridge's own MXN contract spread is a
-- further 10 bps underneath it, so the all-in cost against mid-market is ~26 bps. The
-- settings screen states that arithmetic on screen while an operator types, so the figure
-- they enter is never ambiguous.
--
-- The other four seed at 20 bps: the value PAYVE_PUBLIC_SPREAD_BPS has been serving in
-- production, carried over unchanged so this migration does not silently re-price four
-- corridors as a side effect of introducing a table.
--
-- Guarded on emptiness rather than on-conflict: the table is append-only and has no natural
-- unique key to conflict on, so re-running must not stack duplicate seed rows on top of a
-- real re-price made later through the settings screen.
insert into fx_spread_config (currency_pair, payve_spread_bps, reason, actor)
select v.pair, v.bps,
       'Initial seed: MXN published at 16 bps, other corridors carried over from PAYVE_PUBLIC_SPREAD_BPS unchanged.',
       'migration:002_seed_spreads'
  from (values
    ('usd_to_mxn', 16),
    ('usd_to_eur', 20),
    ('usd_to_cop', 20),
    ('usd_to_brl', 20),
    ('usd_to_gbp', 20)
  ) as v(pair, bps)
 where not exists (select 1 from fx_spread_config);
