/* @ds-bundle: {"format":3,"namespace":"PayveDesignSystemCopy_160e3a","components":[],"sourceHashes":{"ui_kits/buyer-admin/Chrome.jsx":"694dbaa21996","ui_kits/buyer-admin/MockData.jsx":"9846c4b4b4e1","ui_kits/buyer-admin/Primitives.jsx":"b6f0ef0763c1","ui_kits/buyer-admin/Screens.jsx":"307b1e9d2d22","ui_kits/buyer-admin/Surfaces.jsx":"4f668eb66233"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PayveDesignSystemCopy_160e3a = window.PayveDesignSystemCopy_160e3a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/buyer-admin/Chrome.jsx
try { (() => {
// Side nav + top bar for buyer admin

const Sidebar = ({
  route,
  onNav,
  counts
}) => {
  const items = [{
    group: 'Operate',
    list: [{
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'layout-grid'
    }, {
      id: 'suppliers',
      label: 'Suppliers',
      icon: 'users',
      badge: counts.suppliers
    }, {
      id: 'purchase_orders',
      label: 'Purchase orders',
      icon: 'file-text',
      badge: counts.pos
    }, {
      id: 'payments',
      label: 'Payments',
      icon: 'arrow-right-left'
    }, {
      id: 'activity',
      label: 'Activity',
      icon: 'activity'
    }]
  }, {
    group: 'Admin',
    list: [{
      id: 'onboarding',
      label: 'Onboarding',
      icon: 'check-circle'
    }, {
      id: 'settings',
      label: 'Settings',
      icon: 'settings'
    }]
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 232,
      background: 'var(--paper-2)',
      borderRight: '1px solid var(--hairline)',
      padding: '18px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 6px 14px',
      borderBottom: '1px solid var(--hairline)',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--sage-700)',
      color: 'var(--paper)',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 14,
      display: 'grid',
      placeItems: 'center'
    }
  }, "T"), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: 13.5,
      color: 'var(--ink-1)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, "Tahoma Trading Co"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--ink-3)'
    }
  }, "buyer \xB7 finance ops"))), items.map((g, gi) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: gi
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-3)',
      padding: '8px 8px 4px'
    }
  }, g.group), g.list.map(it => {
    const active = it.id === route;
    return /*#__PURE__*/React.createElement("div", {
      key: it.id,
      onClick: () => onNav(it.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 8px',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-sans)',
        fontSize: 13.5,
        color: active ? 'var(--ink-1)' : 'var(--ink-2)',
        background: active ? 'var(--paper)' : 'transparent',
        boxShadow: active ? 'inset 0 0 0 1px var(--hairline-2)' : 'none',
        fontWeight: active ? 500 : 400,
        cursor: 'pointer',
        position: 'relative'
      }
    }, active && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: -12,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 2,
        height: 16,
        background: 'var(--sage-600)',
        borderRadius: 1
      }
    }), /*#__PURE__*/React.createElement("i", {
      "data-lucide": it.icon,
      style: {
        width: 14,
        height: 14,
        opacity: 0.7
      }
    }), /*#__PURE__*/React.createElement("span", null, it.label), it.badge != null && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: 10.5,
        color: 'var(--ink-2)',
        background: 'var(--paper-3)',
        borderRadius: 999,
        padding: '1px 7px'
      }
    }, it.badge));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--hairline)',
      padding: '12px 8px 4px',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: 'var(--paper-3)',
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'var(--font-sans)',
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--ink-2)'
    }
  }, "MR"), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      color: 'var(--ink-1)'
    }
  }, "Marisol Reyes"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--ink-3)'
    }
  }, "marisol@tahoma.com"))));
};
const TopBar = ({
  title,
  subtitle,
  actions
}) => /*#__PURE__*/React.createElement("header", {
  style: {
    height: 56,
    padding: '0 28px',
    borderBottom: '1px solid var(--hairline)',
    background: 'var(--paper)',
    display: 'flex',
    alignItems: 'center',
    gap: 16
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("h1", {
  className: "t-h2-sans",
  style: {
    margin: 0,
    lineHeight: 1
  }
}, title), subtitle && /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 12,
    color: 'var(--ink-3)',
    marginTop: 2
  }
}, subtitle)), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    gap: 8
  }
}, actions));
Object.assign(window, {
  Sidebar,
  TopBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/buyer-admin/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/buyer-admin/MockData.jsx
try { (() => {
// Mock data — supplier rows, invoices, KPIs.
// Strictly uses enum values from data-model.md.

const MOCK_SUPPLIERS = [{
  id: 's_001',
  name: 'Pacific Northwest Maple Co.',
  email: 'ar@pnwmaple.com',
  country: 'US',
  onboarding_state: 'active',
  pending_fields: [],
  has_active_invite: false,
  reminder_count: 0,
  last_reminded_at: null,
  is_priority: true,
  outstanding_cents: 86_42050,
  early_pay_mode: 'auto',
  payout_method: 'astra_ach'
}, {
  id: 's_002',
  name: 'Casa de Tortillas SA de CV',
  email: 'finanzas@casadetortillas.mx',
  country: 'MX',
  onboarding_state: 'active',
  pending_fields: ['bank_account'],
  has_active_invite: false,
  reminder_count: 0,
  last_reminded_at: null,
  is_priority: false,
  outstanding_cents: 1_29_50050,
  early_pay_mode: 'manual',
  payout_method: 'usdb_wallet'
}, {
  id: 's_003',
  name: 'Tepic Logística SC',
  email: 'ops@tepiclog.mx',
  country: 'MX',
  onboarding_state: 'verifying',
  pending_fields: ['kyc_identity'],
  has_active_invite: false,
  reminder_count: 0,
  last_reminded_at: null,
  is_priority: false,
  outstanding_cents: 0,
  early_pay_mode: 'disabled',
  payout_method: null
}, {
  id: 's_004',
  name: 'Sycamore Mill & Lumber',
  email: 'kt@sycamoremill.com',
  country: 'US',
  onboarding_state: 'active',
  pending_fields: [],
  has_active_invite: false,
  reminder_count: 0,
  last_reminded_at: null,
  is_priority: true,
  outstanding_cents: 42_75018,
  early_pay_mode: 'auto',
  payout_method: 'astra_ach'
}, {
  id: 's_005',
  name: 'Café del Quindío SAS',
  email: 'pagos@cafequindio.co',
  country: 'CO',
  onboarding_state: 'pending_supplier_info',
  pending_fields: ['tax_id', 'bank_account', 'address'],
  has_active_invite: true,
  reminder_count: 2,
  last_reminded_at: '2026-05-23',
  is_priority: false,
  outstanding_cents: 0,
  early_pay_mode: 'disabled',
  payout_method: null
}, {
  id: 's_006',
  name: 'Harbor Glass & Bottle',
  email: 'ar@harborglass.com',
  country: 'US',
  onboarding_state: 'active',
  pending_fields: [],
  has_active_invite: false,
  reminder_count: 0,
  last_reminded_at: null,
  is_priority: false,
  outstanding_cents: 18_22000,
  early_pay_mode: 'disabled',
  payout_method: 'astra_ach'
}, {
  id: 's_007',
  name: 'Empaques del Bajío SA',
  email: 'cuentas@embajio.mx',
  country: 'MX',
  onboarding_state: 'blocked',
  pending_fields: [],
  has_active_invite: false,
  reminder_count: 0,
  last_reminded_at: null,
  is_priority: false,
  outstanding_cents: 0,
  early_pay_mode: 'disabled',
  payout_method: null
}, {
  id: 's_008',
  name: 'Tidewater Coffee Roasters',
  email: 'lina@tidewaterco.com',
  country: 'US',
  onboarding_state: 'pending_supplier_info',
  pending_fields: ['bank_account'],
  has_active_invite: true,
  reminder_count: 0,
  last_reminded_at: '2026-05-26',
  is_priority: false,
  outstanding_cents: 0,
  early_pay_mode: 'disabled',
  payout_method: null
}, {
  id: 's_009',
  name: 'Frutas do Cerrado Ltda',
  email: 'fin@frutasdocerrado.br',
  country: 'BR',
  onboarding_state: 'draft',
  pending_fields: [],
  has_active_invite: false,
  reminder_count: 0,
  last_reminded_at: null,
  is_priority: false,
  outstanding_cents: 0,
  early_pay_mode: 'disabled',
  payout_method: null
}];
const MOCK_INVOICES = [{
  id: 'inv_2841',
  supplier_id: 's_002',
  supplier_name: 'Casa de Tortillas SA de CV',
  external_po: 'PO-44829',
  country: 'MX',
  amount_cents: 1_29_50050,
  term_date: '2026-06-11',
  ingested_at: '2026-05-12',
  payment_status: 'unpaid',
  early_pay_status: 'eligible',
  net_to_supplier_cents: 1_26_90049,
  payve_fee_cents: 2_60001
}, {
  id: 'inv_2842',
  supplier_id: 's_004',
  supplier_name: 'Sycamore Mill & Lumber',
  external_po: 'PO-44830',
  country: 'US',
  amount_cents: 42_75018,
  term_date: '2026-06-11',
  ingested_at: '2026-05-12',
  payment_status: 'unpaid',
  early_pay_status: 'supplier_accepted',
  net_to_supplier_cents: 41_89517,
  payve_fee_cents: 85501
}, {
  id: 'inv_2843',
  supplier_id: 's_001',
  supplier_name: 'Pacific Northwest Maple Co.',
  external_po: 'PO-44835',
  country: 'US',
  amount_cents: 86_42050,
  term_date: '2026-06-18',
  ingested_at: '2026-05-19',
  payment_status: 'unpaid',
  early_pay_status: 'not_offered',
  net_to_supplier_cents: 86_42050,
  payve_fee_cents: 0
}, {
  id: 'inv_2844',
  supplier_id: 's_006',
  supplier_name: 'Harbor Glass & Bottle',
  external_po: 'PO-44841',
  country: 'US',
  amount_cents: 18_22000,
  term_date: '2026-06-22',
  ingested_at: '2026-05-23',
  payment_status: 'in_transit_to_supplier',
  early_pay_status: 'funded',
  net_to_supplier_cents: 17_85560,
  payve_fee_cents: 36440
}];

// KPI computed from mock data
const KPI = {
  outstanding_cents: MOCK_INVOICES.reduce((a, i) => a + i.amount_cents, 0),
  credit_used_cents: 137_60000,
  credit_limit_cents: 250_00000,
  needs_attention: 4,
  pending_supplier_invites: 2
};
const RECENT_ACTIVITY = [{
  id: 'a1',
  when: 'May 27 · 9:42 AM',
  kind: 'invoice.funded',
  text: 'Sycamore Mill & Lumber accepted early pay on INV-2842',
  amount: '$41,895.17',
  tone: 'positive'
}, {
  id: 'a2',
  when: 'May 26 · 4:18 PM',
  kind: 'supplier.invite.sent',
  text: 'Invite sent to Tidewater Coffee Roasters',
  amount: null,
  tone: 'info'
}, {
  id: 'a3',
  when: 'May 26 · 11:02 AM',
  kind: 'cross_border.settled',
  text: 'International payment to Empaques del Bajío settled',
  amount: '$8,251.60',
  tone: 'positive'
}, {
  id: 'a4',
  when: 'May 25 · 2:30 PM',
  kind: 'invoice.repayment_failed',
  text: 'Buyer debit failed for INV-2837 — retry scheduled May 28',
  amount: '$12,950.50',
  tone: 'critical'
}, {
  id: 'a5',
  when: 'May 23 · 8:14 AM',
  kind: 'supplier.invite.reminder',
  text: 'Reminder #2 sent to Café del Quindío SAS',
  amount: null,
  tone: 'warning'
}];
const fmt$ = cents => (cents / 100).toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
const fmtDate = iso => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = new Date(iso + 'T00:00:00Z');
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};
const daysAgo = iso => {
  const now = new Date('2026-05-27T00:00:00Z');
  return Math.floor((now - new Date(iso + 'T00:00:00Z')) / 86400000);
};
const humanField = f => ({
  tax_id: 'tax ID',
  bank_account: 'bank',
  address: 'address',
  kyc_identity: 'ID verification',
  beneficial_owner: 'beneficial owner',
  contact_email: 'email'
})[f] || f;
Object.assign(window, {
  MOCK_SUPPLIERS,
  MOCK_INVOICES,
  KPI,
  RECENT_ACTIVITY,
  fmt$,
  fmtDate,
  daysAgo,
  humanField
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/buyer-admin/MockData.jsx", error: String((e && e.message) || e) }); }

// ui_kits/buyer-admin/Primitives.jsx
try { (() => {
// Payve buyer-admin UI kit — shared primitives
// Loaded as Babel; exports to window for cross-file use.

const cx = (...xs) => xs.filter(Boolean).join(' ');

// Sage dot
const Dot = ({
  tone = 'positive',
  size = 6
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    display: 'inline-block',
    width: size,
    height: size,
    borderRadius: '50%',
    background: `var(--${tone === 'positive' ? 'positive' : tone === 'warning' ? 'warning' : tone === 'critical' ? 'critical' : tone === 'info' ? 'info' : 'ink-3'})`,
    flexShrink: 0
  }
});

// State badge — implements two-tier composition for v_supplier_onboarding_state
const StateBadge = ({
  state,
  sub
}) => {
  // state: 'active' | 'verifying' | 'pending_supplier_info' | 'blocked' | 'draft' | 'archived'
  const config = {
    active: {
      label: 'Active',
      tone: 'positive',
      bg: 'var(--positive-bg)',
      fg: 'var(--positive)'
    },
    verifying: {
      label: 'Verifying',
      tone: 'info',
      bg: 'var(--info-bg)',
      fg: 'var(--info)'
    },
    pending_supplier_info: {
      label: 'Pending supplier info',
      tone: 'warning',
      bg: 'var(--warning-bg)',
      fg: 'var(--warning)'
    },
    blocked: {
      label: 'Blocked',
      tone: 'critical',
      bg: 'var(--critical-bg)',
      fg: 'var(--critical)'
    },
    draft: {
      label: 'Draft',
      tone: 'muted',
      bg: 'var(--paper-2)',
      fg: 'var(--ink-2)'
    },
    archived: {
      label: 'Archived',
      tone: 'muted',
      bg: 'var(--paper-2)',
      fg: 'var(--ink-3)'
    }
  }[state] || {
    label: state,
    tone: 'muted',
    bg: 'var(--paper-2)',
    fg: 'var(--ink-2)'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 22,
      padding: '0 9px',
      borderRadius: 999,
      background: config.bg,
      color: config.fg,
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      fontSize: 11.5,
      border: state === 'draft' || state === 'archived' ? '1px solid var(--hairline)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Dot, {
    tone: config.tone
  }), config.label), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--ink-2)'
    }
  }, sub));
};

// Money cell — debit/credit/pending; cents are muted
const Money = ({
  value,
  tone = 'debit',
  sub,
  strike
}) => {
  const color = tone === 'credit' ? 'var(--positive)' : tone === 'pending' ? 'var(--ink-2)' : tone === 'muted' ? 'var(--ink-3)' : 'var(--ink-1)';
  const formatted = typeof value === 'number' ? value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) : value;
  const [whole, cents] = formatted.split('.');
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: 'tabular-nums',
      fontFeatureSettings: '"tnum" 1',
      fontWeight: 500,
      color
    }
  }, strike != null && /*#__PURE__*/React.createElement("span", {
    style: {
      textDecoration: 'line-through',
      color: 'var(--ink-3)',
      fontWeight: 400,
      marginRight: 6
    }
  }, "$", strike), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-3)',
      fontWeight: 400
    }
  }, "$"), whole, cents && /*#__PURE__*/React.createElement("span", null, ".", cents), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--ink-3)',
      fontWeight: 400,
      marginTop: 1
    }
  }, sub));
};

// Button
const Button = ({
  variant = 'secondary',
  size = 'md',
  children,
  leading,
  trailing,
  onClick,
  disabled,
  type = 'button'
}) => {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    height: size === 'sm' ? 28 : 34,
    padding: size === 'sm' ? '0 10px' : '0 14px',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    fontSize: size === 'sm' ? 12.5 : 13.5,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1px solid transparent',
    opacity: disabled ? 0.5 : 1,
    transition: 'background 100ms, border-color 100ms'
  };
  const variants = {
    primary: {
      background: 'var(--sage-700)',
      color: 'var(--paper)',
      border: '1px solid var(--sage-700)'
    },
    secondary: {
      background: 'var(--paper)',
      color: 'var(--ink-1)',
      border: '1px solid var(--hairline-2)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ink-1)',
      border: '1px solid transparent'
    },
    danger: {
      background: 'var(--paper)',
      color: 'var(--critical)',
      border: '1px solid var(--hairline-2)'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    className: "pv-btn",
    "data-variant": variant,
    style: {
      ...base,
      ...variants[variant]
    }
  }, leading, children, trailing);
};

// Rail capability chip row
const RailChips = ({
  country,
  supplier_country_capabilities
}) => {
  // country: 'US' | 'MX' | 'CO' | 'BR'
  const chips = country === 'US' ? [{
    name: 'Bank transfer',
    status: 'on'
  }, {
    name: 'Early payment',
    status: 'on'
  }, {
    name: 'USDB wallet',
    status: 'opt'
  }] : country === 'MX' ? [{
    name: 'International payment',
    status: 'on'
  }, {
    name: 'USDB wallet',
    status: 'on'
  }] : country === 'CO' ? [{
    name: 'International payment',
    status: 'on'
  }] : [{
    name: 'Brazil rail coming soon',
    status: 'soon'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, chips.map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 9px',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      fontSize: 11.5,
      border: '1px solid ' + (c.status === 'on' ? 'var(--sage-200)' : 'var(--hairline-2)'),
      borderStyle: c.status === 'soon' ? 'dashed' : 'solid',
      background: c.status === 'on' ? 'var(--sage-50)' : 'var(--paper)',
      color: c.status === 'on' ? 'var(--sage-700)' : 'var(--ink-3)'
    }
  }, c.name, ' ', /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      color: c.status === 'on' ? 'var(--sage-600)' : 'var(--ink-3)'
    }
  }, c.status === 'on' ? '✓' : c.status === 'opt' ? '+' : ''))));
};

// Country flag (text glyph approach to avoid raster files)
const CountryChip = ({
  country
}) => {
  const names = {
    US: 'United States',
    MX: 'Mexico',
    CO: 'Colombia',
    BR: 'Brazil'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '2px 8px',
      borderRadius: 999,
      background: 'var(--paper-2)',
      border: '1px solid var(--hairline)',
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--ink-2)',
      letterSpacing: '0.04em'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 4,
      height: 4,
      borderRadius: '50%',
      background: 'var(--ink-3)'
    }
  }), country, " \xB7 ", names[country]);
};
Object.assign(window, {
  cx,
  Dot,
  StateBadge,
  Money,
  Button,
  RailChips,
  CountryChip
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/buyer-admin/Primitives.jsx", error: String((e && e.message) || e) }); }

// ui_kits/buyer-admin/Screens.jsx
try { (() => {
// Dashboard, Suppliers, Pay Detail screens

const KpiTile = ({
  label,
  value,
  sub,
  accent,
  bar
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: 'var(--paper)',
    border: '1px solid var(--hairline)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    minHeight: 88
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)'
  }
}, label), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: 30,
    letterSpacing: '-0.015em',
    color: 'var(--ink-1)',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1.1
  }
}, value), sub && /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 12,
    color: 'var(--ink-2)'
  }
}, sub), bar != null && /*#__PURE__*/React.createElement("div", {
  style: {
    height: 4,
    background: 'var(--paper-3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: bar + '%',
    height: '100%',
    background: accent || 'var(--sage-500)'
  }
})));
const Dashboard = ({
  onOpenSupplier,
  onOpenInvoice
}) => {
  const needsAttention = MOCK_SUPPLIERS.filter(s => s.onboarding_state === 'pending_supplier_info' || s.onboarding_state === 'active' && s.pending_fields.length > 0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 28px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "t-eyebrow",
    style: {
      marginBottom: 4
    }
  }, "Tuesday \xB7 May 27, 2026"), /*#__PURE__*/React.createElement("h2", {
    className: "t-display",
    style: {
      margin: 0,
      fontSize: 36,
      lineHeight: 1.1
    }
  }, "Good morning, Marisol."), /*#__PURE__*/React.createElement("div", {
    className: "t-body-muted",
    style: {
      marginTop: 4
    }
  }, "3 suppliers need attention. ", /*#__PURE__*/React.createElement("span", {
    className: "t-money"
  }, "$276,891.18"), " moves out to suppliers in the next 30 days.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(KpiTile, {
    label: "Outstanding to suppliers",
    value: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--ink-3)',
        fontWeight: 400
      }
    }, "$"), fmt$(KPI.outstanding_cents).split('.')[0], /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18,
        color: 'var(--ink-3)'
      }
    }, ".", fmt$(KPI.outstanding_cents).split('.')[1])),
    sub: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--positive)'
      }
    }, "\u2197 +$48,210"), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--ink-3)'
      }
    }, "vs last 30 days"))
  }), /*#__PURE__*/React.createElement(KpiTile, {
    label: "Available credit",
    value: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--ink-3)',
        fontWeight: 400
      }
    }, "$"), fmt$(KPI.credit_limit_cents - KPI.credit_used_cents).split('.')[0]),
    sub: /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--ink-2)'
      }
    }, "$", fmt$(KPI.credit_used_cents), " of $", fmt$(KPI.credit_limit_cents), " in use"),
    bar: Math.round(KPI.credit_used_cents / KPI.credit_limit_cents * 100)
  }), /*#__PURE__*/React.createElement(KpiTile, {
    label: "Suppliers needing attention",
    value: needsAttention.length,
    sub: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--warning)'
      }
    }, "1 awaiting bank"), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--ink-3)'
      }
    }, "\xB7 2 invites pending"))
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "t-h2",
    style: {
      margin: 0
    }
  }, "Needs your attention"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "View all suppliers"))), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--hairline)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--paper)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--paper-2)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Supplier"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "State"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "Outstanding"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Last action"), /*#__PURE__*/React.createElement("th", {
    style: th
  }))), /*#__PURE__*/React.createElement("tbody", null, needsAttention.map(s => /*#__PURE__*/React.createElement("tr", {
    key: s.id,
    onClick: () => onOpenSupplier(s.id),
    style: {
      borderTop: '1px solid var(--hairline)',
      cursor: 'pointer'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--paper-2)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)'
    }
  }, /*#__PURE__*/React.createElement(CountryChip, {
    country: s.country
  }))), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(StateBadge, {
    state: s.onboarding_state,
    sub: s.pending_fields.length ? `awaiting ${humanField(s.pending_fields[0])}` : null
  }), s.has_active_invite && s.last_reminded_at && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, s.reminder_count > 0 ? `Reminded ${daysAgo(s.last_reminded_at)} days ago` : `Sent ${daysAgo(s.last_reminded_at)} days ago`)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right'
    }
  }, s.outstanding_cents > 0 ? /*#__PURE__*/React.createElement(Money, {
    value: fmt$(s.outstanding_cents)
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-3)'
    }
  }, "\u2014")), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      color: 'var(--ink-2)',
      fontSize: 12.5
    }
  }, s.has_active_invite ? 'Invite ' + (s.reminder_count > 0 ? `reminder ${s.reminder_count}` : 'sent') : s.onboarding_state === 'verifying' ? 'KYC pending review' : '—'), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    trailing: /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)'
      }
    }, "\u2192")
  }, "Resolve")))))))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h3", {
    className: "t-h2",
    style: {
      margin: 0,
      marginBottom: 8
    }
  }, "Activity"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--hairline)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--paper)'
    }
  }, RECENT_ACTIVITY.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: 12,
      padding: '12px 14px',
      borderTop: i ? '1px solid var(--hairline)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(Dot, {
    tone: a.tone,
    size: 8
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-1)'
    }
  }, a.text), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--ink-3)',
      marginTop: 2
    }
  }, a.when, " \xB7 ", a.kind), a.amount && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 13,
      fontVariantNumeric: 'tabular-nums',
      fontWeight: 500,
      color: a.tone === 'positive' ? 'var(--positive)' : 'var(--ink-1)'
    }
  }, a.amount))))))));
};

// β density: row height ~36px (was 44px under α) via 8px vertical cell padding
const th = {
  textAlign: 'left',
  padding: '8px var(--row-pad-x, 14px)',
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 11,
  letterSpacing: '0.04em',
  color: 'var(--ink-3)',
  textTransform: 'uppercase'
};
const td = {
  textAlign: 'left',
  padding: 'var(--row-pad-y, 8px) var(--row-pad-x, 14px)',
  fontFamily: 'var(--font-sans)',
  fontSize: 13.5,
  color: 'var(--ink-1)',
  verticalAlign: 'top'
};
const SuppliersScreen = ({
  onOpenSupplier,
  onInvite
}) => {
  const [filter, setFilter] = React.useState('all');
  const list = MOCK_SUPPLIERS.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'needs') return s.onboarding_state === 'pending_supplier_info' || s.onboarding_state === 'active' && s.pending_fields.length > 0;
    return s.country === filter;
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 28px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "t-h1-sans",
    style: {
      margin: 0
    }
  }, "Suppliers"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, MOCK_SUPPLIERS.length, " total"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "md"
  }, "Export"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "md",
    onClick: onInvite
  }, "Invite supplier"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      padding: 3,
      background: 'var(--paper-2)',
      borderRadius: 'var(--radius-sm)',
      alignSelf: 'flex-start'
    }
  }, [['all', `All · ${MOCK_SUPPLIERS.length}`], ['needs', 'Needs attention · 4'], ['US', 'United States'], ['MX', 'Mexico'], ['CO', 'Colombia'], ['BR', 'Brazil']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setFilter(k),
    style: {
      border: 'none',
      cursor: 'pointer',
      padding: '5px 11px',
      borderRadius: 'var(--radius-xs)',
      background: filter === k ? 'var(--paper)' : 'transparent',
      color: filter === k ? 'var(--ink-1)' : 'var(--ink-2)',
      boxShadow: filter === k ? 'var(--shadow-1), inset 0 0 0 1px var(--hairline-2)' : 'none',
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      fontWeight: 500
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--hairline)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--paper)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--paper-2)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Supplier"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "State"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Rails available"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Early pay"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "Outstanding"), /*#__PURE__*/React.createElement("th", {
    style: th
  }))), /*#__PURE__*/React.createElement("tbody", null, list.map(s => /*#__PURE__*/React.createElement("tr", {
    key: s.id,
    onClick: () => onOpenSupplier(s.id),
    style: {
      borderTop: '1px solid var(--hairline)',
      cursor: 'pointer'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--paper-2)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500
    }
  }, s.name), s.is_priority && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9.5,
      fontWeight: 600,
      letterSpacing: '0.06em',
      color: 'var(--sage-700)',
      background: 'var(--sage-50)',
      padding: '1px 6px',
      borderRadius: 2,
      border: '1px solid var(--sage-200)'
    }
  }, "PRIORITY")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(CountryChip, {
    country: s.country
  }))), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(StateBadge, {
    state: s.onboarding_state,
    sub: s.pending_fields.length ? `awaiting ${humanField(s.pending_fields[0])}` : null
  }), s.has_active_invite && s.last_reminded_at && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--ink-3)',
      marginTop: 4
    }
  }, s.reminder_count > 0 ? `Reminded ${daysAgo(s.last_reminded_at)} days ago` : `Sent ${daysAgo(s.last_reminded_at)} days ago`)), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(RailChips, {
    country: s.country
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      color: 'var(--ink-2)',
      fontSize: 12.5
    }
  }, s.early_pay_mode === 'auto' && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--sage-700)'
    }
  }, "Auto-accept"), s.early_pay_mode === 'manual' && 'Per-invoice', s.early_pay_mode === 'disabled' && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-3)'
    }
  }, "\u2014")), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right'
    }
  }, s.outstanding_cents > 0 ? /*#__PURE__*/React.createElement(Money, {
    value: fmt$(s.outstanding_cents)
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-3)'
    }
  }, "\u2014")), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right',
      color: 'var(--ink-3)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "chevron-right",
    style: {
      width: 14,
      height: 14
    }
  }))))))));
};
Object.assign(window, {
  KpiTile,
  Dashboard,
  SuppliersScreen,
  th,
  td
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/buyer-admin/Screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/buyer-admin/Surfaces.jsx
try { (() => {
// Payments screen + Supplier detail drawer + Invite modal + Pay confirm modal

const PaymentsScreen = ({
  onPay
}) => {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 28px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "t-h1-sans",
    style: {
      margin: 0
    }
  }, "Purchase orders"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, MOCK_INVOICES.length, " this period"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "md"
  }, "Export ledger"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "md"
  }, "Ingest from ERP"))), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--hairline)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--paper)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--paper-2)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Invoice"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Supplier"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Term date"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "Gross"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "Net to supplier"), /*#__PURE__*/React.createElement("th", {
    style: th
  }))), /*#__PURE__*/React.createElement("tbody", null, MOCK_INVOICES.map(inv => {
    const earlyPay = inv.early_pay_status === 'funded' || inv.early_pay_status === 'supplier_accepted';
    return /*#__PURE__*/React.createElement("tr", {
      key: inv.id,
      style: {
        borderTop: '1px solid var(--hairline)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--ink-1)'
      }
    }, inv.id.toUpperCase().replace('INV_', 'INV-')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 10.5,
        color: 'var(--ink-3)'
      }
    }, "from ", inv.external_po)), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 500
      }
    }, inv.supplier_name), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement(CountryChip, {
      country: inv.country
    }))), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("div", null, fmtDate(inv.term_date)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: 'var(--ink-3)',
        marginTop: 2
      }
    }, "ingested ", fmtDate(inv.ingested_at))), /*#__PURE__*/React.createElement("td", {
      style: td
    }, inv.payment_status === 'in_transit_to_supplier' ? /*#__PURE__*/React.createElement(StateBadge, {
      state: "verifying",
      sub: "settling"
    }) : inv.payment_status === 'unpaid' && earlyPay ? /*#__PURE__*/React.createElement(StateBadge, {
      state: "active",
      sub: inv.early_pay_status === 'funded' ? 'funded · supplier paid' : 'early pay accepted'
    }) : inv.payment_status === 'unpaid' && inv.early_pay_status === 'eligible' ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 22,
        padding: '0 9px',
        borderRadius: 999,
        background: 'var(--sage-50)',
        color: 'var(--sage-700)',
        fontSize: 11.5,
        fontWeight: 500,
        border: '1px solid var(--sage-200)'
      }
    }, /*#__PURE__*/React.createElement(Dot, {
      tone: "positive"
    }), "Early pay eligible") : /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--ink-2)',
        fontSize: 12.5
      }
    }, "Awaiting term")), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement(Money, {
      value: fmt$(inv.amount_cents)
    })), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right'
      }
    }, inv.amount_cents !== inv.net_to_supplier_cents ? /*#__PURE__*/React.createElement(Money, {
      value: fmt$(inv.net_to_supplier_cents),
      tone: "credit",
      sub: `Payve fee $${fmt$(inv.payve_fee_cents)}`
    }) : /*#__PURE__*/React.createElement(Money, {
      value: fmt$(inv.net_to_supplier_cents),
      tone: "credit"
    })), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right'
      }
    }, inv.payment_status === 'unpaid' && inv.early_pay_status === 'eligible' ? /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      onClick: () => onPay(inv)
    }, "Review pay") : /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "View")));
  })))));
};

// ---------- Supplier detail drawer ----------
const Drawer = ({
  open,
  onClose,
  children,
  title,
  subtitle
}) => {
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(24,24,26,0.32)',
      zIndex: 40,
      animation: 'fadeIn 160ms ease-out'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: 520,
      background: 'var(--paper)',
      borderLeft: '1px solid var(--hairline)',
      boxShadow: 'var(--shadow-modal)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideIn 200ms ease-out'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 24px',
      borderBottom: '1px solid var(--hairline)',
      display: 'flex',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "t-eyebrow"
  }, subtitle), /*#__PURE__*/React.createElement("h3", {
    className: "t-h2",
    style: {
      margin: 0,
      marginTop: 4
    }
  }, title)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--ink-3)',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    style: {
      width: 18,
      height: 18
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children)));
};
const SupplierDrawer = ({
  supplier,
  onClose,
  onSendReminder
}) => {
  if (!supplier) return null;
  return /*#__PURE__*/React.createElement(Drawer, {
    open: !!supplier,
    onClose: onClose,
    subtitle: `Supplier · ${supplier.id}`,
    title: supplier.name
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StateBadge, {
    state: supplier.onboarding_state,
    sub: supplier.pending_fields.length ? `awaiting ${humanField(supplier.pending_fields[0])}` : null
  }), /*#__PURE__*/React.createElement(CountryChip, {
    country: supplier.country
  }), supplier.is_priority && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9.5,
      fontWeight: 600,
      letterSpacing: '0.06em',
      color: 'var(--sage-700)',
      background: 'var(--sage-50)',
      padding: '1px 6px',
      borderRadius: 2,
      border: '1px solid var(--sage-200)'
    }
  }, "PRIORITY")), supplier.has_active_invite && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--warning-bg)',
      border: '1px solid #E8D9B0',
      borderRadius: 'var(--radius-md)',
      padding: '12px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500,
      fontSize: 13.5,
      color: 'var(--ink-1)'
    }
  }, supplier.reminder_count > 0 ? `Reminded ${daysAgo(supplier.last_reminded_at)} days ago` : `Invite sent ${daysAgo(supplier.last_reminded_at)} days ago`), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--ink-2)',
      marginTop: 2
    }
  }, supplier.reminder_count, "/3 reminders \xB7 expires May 30, 2026. The supplier still needs to submit ", supplier.pending_fields.map(humanField).join(', '), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: onSendReminder
  }, "Send reminder now"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Copy magic link"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Revoke invite"))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    className: "t-eyebrow",
    style: {
      marginBottom: 6
    }
  }, "Rail capability"), /*#__PURE__*/React.createElement(RailChips, {
    country: supplier.country
  })), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    className: "t-eyebrow",
    style: {
      marginBottom: 6
    }
  }, "Contact"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      rowGap: 6,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--ink-3)'
    }
  }, "Email"), /*#__PURE__*/React.createElement("div", null, supplier.email), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--ink-3)'
    }
  }, "Country"), /*#__PURE__*/React.createElement("div", null, supplier.country), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--ink-3)'
    }
  }, "Payout method"), /*#__PURE__*/React.createElement("div", null, supplier.payout_method ? supplier.payout_method.replace('_', ' ') : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-3)'
    }
  }, "not set")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--ink-3)'
    }
  }, "Early pay mode"), /*#__PURE__*/React.createElement("div", null, supplier.early_pay_mode))), supplier.pending_fields.length > 0 && /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    className: "t-eyebrow",
    style: {
      marginBottom: 6
    }
  }, "Outstanding fields"), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, supplier.pending_fields.map(f => /*#__PURE__*/React.createElement("li", {
    key: f,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 10px',
      background: 'var(--paper-2)',
      borderRadius: 'var(--radius-sm)'
    }
  }, /*#__PURE__*/React.createElement(Dot, {
    tone: "warning"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, humanField(f)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--ink-3)'
    }
  }, f))))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    className: "t-eyebrow",
    style: {
      marginBottom: 6
    }
  }, "Outstanding to this supplier"), supplier.outstanding_cents > 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 30,
      letterSpacing: '-0.015em',
      color: 'var(--ink-1)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-3)',
      fontWeight: 400
    }
  }, "$"), fmt$(supplier.outstanding_cents).split('.')[0], /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      color: 'var(--ink-3)'
    }
  }, ".", fmt$(supplier.outstanding_cents).split('.')[1])) : /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--ink-3)'
    }
  }, "No open invoices."))));
};

// ---------- Invite modal ----------
const Modal = ({
  open,
  onClose,
  children,
  title,
  subtitle,
  footer,
  width = 480
}) => {
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(24,24,26,0.40)',
      zIndex: 60,
      animation: 'fadeIn 160ms ease-out'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      width,
      background: 'var(--paper)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-modal)',
      zIndex: 70,
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '88vh',
      animation: 'popIn 180ms ease-out'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px 12px'
    }
  }, subtitle && /*#__PURE__*/React.createElement("div", {
    className: "t-eyebrow"
  }, subtitle), /*#__PURE__*/React.createElement("h3", {
    className: "t-h2",
    style: {
      margin: 0,
      marginTop: 4
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 24px 20px',
      overflow: 'auto'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 24px',
      borderTop: '1px solid var(--hairline)',
      display: 'flex',
      gap: 8,
      justifyContent: 'flex-end'
    }
  }, footer)));
};
const InviteSupplierModal = ({
  open,
  onClose,
  onSent
}) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [country, setCountry] = React.useState('US');
  const valid = name.trim() && email.includes('@');
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    subtitle: "Suppliers \xB7 onboarding",
    title: "Invite a new supplier",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      disabled: !valid,
      onClick: () => {
        onSent({
          name,
          email,
          country
        });
      },
      trailing: /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-mono)'
        }
      }, "\u2192")
    }, "Send magic link"))
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      marginBottom: 16,
      fontSize: 13.5,
      color: 'var(--ink-2)'
    }
  }, "We'll send a one-time magic link with a 30-day window. They finish bank/CLABE on their phone in under 5 minutes."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 2'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Legal entity name"), /*#__PURE__*/React.createElement("input", {
    style: inp,
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Casa de Tortillas SA de CV"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Email"), /*#__PURE__*/React.createElement("input", {
    style: inp,
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "finanzas@\u2026"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Country"), /*#__PURE__*/React.createElement("select", {
    style: inp,
    value: country,
    onChange: e => setCountry(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "US"
  }, "United States (US)"), /*#__PURE__*/React.createElement("option", {
    value: "MX"
  }, "Mexico (MX)"), /*#__PURE__*/React.createElement("option", {
    value: "CO"
  }, "Colombia (CO)"), /*#__PURE__*/React.createElement("option", {
    value: "BR"
  }, "Brazil \u2014 coming soon")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: 12,
      background: 'var(--paper-2)',
      borderRadius: 'var(--radius-sm)',
      fontSize: 12.5,
      color: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink-1)'
    }
  }, "Rails for ", country, ":"), ' ', country === 'US' ? 'Bank transfer (Astra ACH) + optional USDB wallet.' : country === 'MX' ? 'International payment (CLABE) and/or USDB wallet.' : country === 'CO' ? 'International payment (Colombian account).' : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--warning)'
    }
  }, "Brazil rail is not yet enabled. We'll save the supplier and notify you when it ships.")));
};

// ---------- Pay confirm modal ----------
const PayConfirmModal = ({
  invoice,
  onClose,
  onConfirm
}) => {
  if (!invoice) return null;
  const isIntl = invoice.country !== 'US';
  const fxRate = isIntl ? 17.8240 : null;
  return /*#__PURE__*/React.createElement(Modal, {
    open: !!invoice,
    onClose: onClose,
    subtitle: `Invoice ${invoice.id.toUpperCase().replace('INV_', 'INV-')} · ${invoice.supplier_name}`,
    title: "Review payment",
    width: 520,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: onConfirm
    }, "Authorize ", `$${fmt$(invoice.amount_cents)}`, " at term"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(CountryChip, {
    country: invoice.country
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--ink-3)'
    }
  }, "term ", fmtDate(invoice.term_date))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper-2)',
      border: '1px solid var(--hairline)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Row, {
    label: "Gross invoice amount",
    value: `$${fmt$(invoice.amount_cents)}`
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Timing",
    value: "Standard \xB7 debit buyer at term",
    helper: "The supplier may elect early pay before term date."
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Rail",
    value: invoice.country === 'US' ? 'Bank transfer (ACH)' : 'International payment'
  }), isIntl && /*#__PURE__*/React.createElement(Row, {
    label: "FX rate",
    value: "\u2248 17.8240 MXN / USD",
    helper: "Locked at execution; quoted now for reference.",
    mono: true
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Payve fee",
    value: invoice.payve_fee_cents ? `$${fmt$(invoice.payve_fee_cents)}` : '—'
  }), /*#__PURE__*/React.createElement(Row, {
    last: true,
    label: "Net to supplier",
    value: `$${fmt$(invoice.net_to_supplier_cents)}`,
    valueColor: "var(--positive)",
    bold: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--ink-2)'
    }
  }, "You'll be debited ", /*#__PURE__*/React.createElement(Money, {
    value: fmt$(invoice.amount_cents)
  }), " on ", /*#__PURE__*/React.createElement("strong", null, fmtDate(invoice.term_date)), ". The supplier receives funds via ", invoice.country === 'US' ? 'ACH within 1 business day' : 'Bridge — settles same-day to CLABE', ".")));
};
const Row = ({
  label,
  value,
  helper,
  mono,
  bold,
  valueColor,
  last
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: '180px 1fr',
    alignItems: 'baseline',
    padding: '11px 14px',
    borderBottom: last ? 'none' : '1px solid var(--hairline)',
    background: 'var(--paper)'
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 12.5,
    color: 'var(--ink-3)'
  }
}, label), /*#__PURE__*/React.createElement("div", {
  style: {
    textAlign: 'right'
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
    fontWeight: bold ? 600 : 500,
    color: valueColor || 'var(--ink-1)',
    fontVariantNumeric: 'tabular-nums'
  }
}, value), helper && /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 11.5,
    color: 'var(--ink-3)',
    marginTop: 2
  }
}, helper)));
const lbl = {
  display: 'block',
  fontFamily: 'var(--font-sans)',
  fontWeight: 500,
  fontSize: 12,
  color: 'var(--ink-2)',
  marginBottom: 4
};
const inp = {
  width: '100%',
  height: 36,
  padding: '0 11px',
  border: '1px solid var(--hairline-2)',
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'var(--font-sans)',
  fontSize: 13.5,
  color: 'var(--ink-1)',
  background: 'var(--paper)',
  boxSizing: 'border-box'
};
Object.assign(window, {
  PaymentsScreen,
  Drawer,
  SupplierDrawer,
  Modal,
  InviteSupplierModal,
  PayConfirmModal,
  lbl,
  inp
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/buyer-admin/Surfaces.jsx", error: String((e && e.message) || e) }); }

})();
