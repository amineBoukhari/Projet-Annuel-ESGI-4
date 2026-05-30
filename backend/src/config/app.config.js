// Application configuration constants
// 
// IMPORTANT: Values marked [USER CONFIG] below SHOULD be configurable
// per restaurant (tenant). For MVP they are hardcoded here.
// Post-MVP: Move these to a database `Config` table with an admin UI.

const APP_CONFIG = {
  // [USER CONFIG] Tax rate for invoices
  // France = 0.20 (20%), Germany = 0.19, USA varies by state, etc.
  VAT_RATE: 0.20,

  // [USER CONFIG] Invoice number prefix
  // Restaurant might want "RESTO-2026-0001" or "R-2026-0001"
  INVOICE_PREFIX: 'INV',

  // System default: starting number (rarely changes)
  INVOICE_START_NUMBER: 1,

  // [USER CONFIG] Currency
  // EUR, USD, GBP, CHF, CAD, etc.
  CURRENCY: 'EUR',
  CURRENCY_SYMBOL: '€',

  // [USER CONFIG] Default customer name for quick checkout
  // Could be "Walk-in", "Comptoir", "Guest", etc.
  QUICK_INVOICE_CUSTOMER_NAME: 'Client comptoir',

  // [USER CONFIG] Date format for display
  // "DD/MM/YYYY" (France), "MM/DD/YYYY" (USA), "YYYY-MM-DD" (ISO)
  DATE_FORMAT: 'DD/MM/YYYY',
};

module.exports = APP_CONFIG;
