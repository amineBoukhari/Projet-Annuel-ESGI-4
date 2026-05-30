// Simple configuration constants for the application
// TODO: In the future, these could be moved to a database Config table
//       so admins can change them via the UI without redeploying

const APP_CONFIG = {
  // Tax rate for invoices (20% VAT in France)
  VAT_RATE: 0.20,

  // Invoice numbering
  INVOICE_PREFIX: 'INV',
  INVOICE_START_NUMBER: 1,

  // Currency
  CURRENCY: 'EUR',
  CURRENCY_SYMBOL: '€',

  // Quick invoice defaults
  QUICK_INVOICE_CUSTOMER_NAME: 'Client comptoir',

  // Date format for display
  DATE_FORMAT: 'DD/MM/YYYY',
};

module.exports = APP_CONFIG;
