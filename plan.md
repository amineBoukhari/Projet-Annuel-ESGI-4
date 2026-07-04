# Feature Plan — WhatsApp Daily Summary

> **Branch:** `whatsapp-daily-summary`
> **Goal:** Every night, each restaurant with a WhatsApp number configured receives an AI-generated WhatsApp message summarizing the day's invoices and revenue.

---

## Context

The owner wants a daily recap sent automatically to WhatsApp instead of having to open the dashboard. Decisions locked in during planning:

| Question | Decision |
|---|---|
| WhatsApp provider | **Twilio WhatsApp API** (sandbox for dev, simplest Node SDK) |
| Trigger | **Automatic nightly cron job** (`node-cron`), not a manual button |
| Recipient | **One number per restaurant** — new `whatsappNumber` field on `Restaurant` |
| Content scope | **Revenue & invoices only** for v1 (created/paid today + total revenue) — matches existing dashboard stats, not full P&L |

This app (`backend/src/modules`) is a restaurant back-office (invoices, expenses, inventory, suppliers) — not a POS. "What happened today" is derived from the `Invoice` model, the same way `dashboard.controller.js` already computes monthly stats.

No existing WhatsApp, OpenAI, or cron infrastructure exists in the repo today — all net new.

---

## Steps

### 1. Dependencies & config
- Add `twilio`, `openai`, `node-cron` to `backend/package.json`
- Add to `backend/.env`: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, `OPENAI_API_KEY`, `DAILY_SUMMARY_CRON` (default `0 21 * * *` — 9pm)
- New `backend/src/config/twilio.js` and `backend/src/config/openai.js`, mirroring the existing `backend/src/config/stripe.js` client-export pattern

### 2. Data model — `whatsappNumber`
- Add `whatsappNumber: STRING, allowNull: true` to `backend/src/modules/restaurant/restaurant.model.js` (picked up automatically by `sequelize.sync({ alter: true })` in dev)
- Extend `updateRestaurant` in `restaurant.controller.js` to accept/persist it
- Add the field to `frontend/src/features/restaurants/components/EditRestaurantModal.jsx` (and display in `RestaurantDetailPanel.jsx`)

### 3. Daily stats service
- New `backend/src/modules/dailySummary/dailySummary.service.js`
- `getDailyStats(restaurantId)`: today's invoice count, paid count, and revenue sum — same `Op.gte`/`Op.lt` day-range + `status: { [Op.ne]: 'cancelled' }` pattern already used in `dashboard.controller.js`

### 4. OpenAI summary generation
- `generateSummaryText(stats, restaurantName)` in the same module: one Chat Completions call, prompted to produce a short, friendly **French** WhatsApp message (2-4 sentences, no markdown) from the stats object

### 5. Twilio WhatsApp sending
- `sendWhatsAppMessage(to, body)` in `backend/src/config/twilio.js` consumer — `client.messages.create({ from: 'whatsapp:' + TWILIO_WHATSAPP_FROM, to: 'whatsapp:' + to, body })`

### 6. Nightly cron job
- `backend/src/jobs/dailySummary.job.js`: `node-cron` schedule (`DAILY_SUMMARY_CRON`) that:
  1. Loads all `Restaurant` rows where `whatsappNumber IS NOT NULL` and `subscriptionStatus` is active/trialing
  2. For each: `getDailyStats` → `generateSummaryText` → `sendWhatsAppMessage`
  3. Logs failures per-restaurant without aborting the batch
- Required once from `server.js` at startup (guarded so it isn't scheduled twice / doesn't run under `NODE_ENV=test` if tests exist)

---

## Verification

- Unit-ish manual test: call `dailySummary.service.js` functions directly from a scratch script against dev DB data to confirm stats match the dashboard numbers for today
- Use Twilio's WhatsApp **sandbox** (join code) to send a real test message to a personal phone without needing a verified business number
- Temporarily set `DAILY_SUMMARY_CRON` to run a minute out, confirm the end-to-end pipeline fires and the message arrives
- Confirm a restaurant with `whatsappNumber = null` is skipped and doesn't error the batch

---

## Implementation Order

- [ ] Step 1 — deps & config
- [ ] Step 2 — `whatsappNumber` field (model + controller + frontend modal)
- [ ] Step 3 — daily stats service
- [ ] Step 4 — OpenAI summary generation
- [ ] Step 5 — Twilio sending
- [ ] Step 6 — cron wiring in `server.js`

Working step by step with a check-in after each one — waiting for "next" before advancing.
