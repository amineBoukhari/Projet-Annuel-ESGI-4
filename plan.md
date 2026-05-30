# MVP Development Plan — Restaurant Management System

> **Branch:** `build-users-team-page`
> **Goal:** Reach MVP status with core restaurant management features
> **Current status:** Auth & Users ~90%, Stock ~40%, Billing ~10%, Planning ~0%, Reports ~0%

---

## Executive Summary

This plan covers all missing features needed to reach a functional MVP. It is organized in **4 phases** by business priority. Each phase builds on the previous one.

**MVP Definition:** A restaurant manager can log in, manage employees, manage stock and suppliers, create invoices for customers, view a basic dashboard with key metrics, and manage employee schedules.

---

## Phase 1: Core Business — Invoices & Payments (P0)

**Duration estimate:** 3-4 days
**Why first:** This is the biggest gap. The README explicitly lists billing as a core feature. Without invoices, the app cannot fulfill its primary purpose of helping restaurateurs manage expenses and revenue.

### 1.1 Backend — Invoice Domain

#### New Model: `Invoice`
```
- id: UUID (PK)
- invoiceNumber: STRING (unique, auto-generated, e.g. "INV-2026-0001")
- restaurantId: UUID (FK → Restaurant)
- customerName: STRING
- customerEmail: STRING (optional)
- totalAmount: DECIMAL(10,2)
- taxAmount: DECIMAL(10,2)
- status: ENUM ["draft", "validated", "paid", "cancelled"]
- createdBy: UUID (FK → User)
- createdAt: DATE
- updatedAt: DATE
- validatedAt: DATE (nullable)
- paidAt: DATE (nullable)
```

#### New Model: `InvoiceItem`
```
- id: UUID (PK)
- invoiceId: UUID (FK → Invoice, CASCADE DELETE)
- description: STRING
- quantity: INTEGER
- unitPrice: DECIMAL(10,2)
- totalPrice: DECIMAL(10,2)
- recipeId: UUID (FK → Recipe, optional)
```

#### New/Modified API Endpoints (`/api/invoices`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/create` | JWT | Admin, Owner, Manager | Create invoice (draft) |
| PUT | `/update/:id` | JWT | Admin, Owner, Manager | Edit draft invoice |
| PUT | `/validate/:id` | JWT | Admin, Owner, Manager | Validate draft → cannot edit after |
| PUT | `/cancel/:id` | JWT | Admin, Owner, Manager | Cancel invoice |
| PUT | `/pay/:id` | JWT | Admin, Owner, Manager | Mark as paid |
| GET | `/get/:id` | JWT | Admin, Owner, Manager, Employee | View single invoice |
| GET | `/getAll` | JWT | Admin, Owner, Manager | List invoices (filtered by restaurant) |
| GET | `/getUnpaid` | JWT | Admin, Owner, Manager | List unpaid invoices |
| POST | `/generateFromOrder` | JWT | Admin, Owner, Manager | Auto-generate from validated order |

#### Business Rules
- Only `draft` invoices can be edited
- `validated` invoices can be paid or cancelled
- `paid` invoices are read-only
- `cancelled` invoices are read-only
- `totalAmount` = sum of `InvoiceItem.totalPrice`
- `taxAmount` = `totalAmount` × tax rate (default 20% VAT)
- `getAll` filtered by `restaurantId` for non-Admins

### 1.2 Backend — Payment Integration

#### Extend `Payment` Model
```
- id: UUID (PK)
- invoiceId: UUID (FK → Invoice, nullable)
- amount: DECIMAL(10,2)
- method: ENUM ["cash", "card", "transfer", "check"]
- status: ENUM ["pending", "completed", "failed"]
- paidAt: DATE
- restaurantId: UUID (FK)
- createdBy: UUID (FK → User)
```

#### New API Endpoints (`/api/payments`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/create` | JWT | Admin, Owner, Manager | Record a payment |
| GET | `/getAll` | JWT | Admin, Owner, Manager | List payments |
| GET | `/getByInvoice/:invoiceId` | JWT | Admin, Owner, Manager | Payments for invoice |

### 1.3 Frontend — Invoice Pages

#### New Page: `Invoices.jsx` (`/invoices`)
- Table listing all invoices: number, customer, amount, status, date
- Filters: All / Draft / Validated / Paid / Cancelled / Unpaid
- Actions per row: View, Edit (if draft), Validate, Pay, Cancel
- Button: "+ Nouvelle facture"

#### New Page: `InvoiceForm.jsx` (`/invoices/new` and `/invoices/edit/:id`)
- Customer name + email inputs
- Dynamic line items (description, qty, unit price, auto-calculated total)
- Add/remove line items
- Display: subtotal, tax, total
- Save as draft OR validate immediately

#### New Page: `InvoiceDetail.jsx` (`/invoices/:id`)
- Read-only view of validated/paid/cancelled invoice
- Print-friendly layout
- Button: "Télécharger PDF" (placeholder for Phase 4)
- Button: "Marquer comme payée" (if validated)

#### New Page: `Payments.jsx` (`/payments`)
- List of payments received
- Filter by date range
- Link each payment to its invoice
- Display total collected in period

### 1.4 Frontend — Sidebar & Routing

- Add "Factures" link to Aside (conditional: Admin/Owner/Manager)
- Add "Paiements" link to Aside (conditional: Admin/Owner/Manager)
- Add routes in `AppRoutes.jsx` with `RoleGuard`

---

## Phase 2: Operations — Stock, Suppliers, Dashboard (P1)

**Duration estimate:** 2-3 days
**Why second:** These support the core business. Managers need to see stock levels and supplier info to run the restaurant.

### 2.1 Backend — Stock Enhancements

#### Extend `Ingredient` Model
```
- expiryDate: DATE (nullable)         ← ADD
- category: STRING (nullable)          ← ADD
- supplierId: UUID (FK → Supplier)   ← ADD
```

#### Extend `StockMovement` Model
```
- type: ENUM ["in", "out", "adjustment", "expired"]  ← ADD
- reason: STRING
- previousQuantity: INTEGER                          ← ADD
- newQuantity: INTEGER                               ← ADD
```

#### New API Endpoints (`/api/stock`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/alerts` | JWT | Admin, Owner, Manager | Low stock + expiry alerts |
| POST | `/addExpiry/:id` | JWT | Admin, Owner, Manager, Employee | Set expiry date |
| GET | `/waste` | JWT | Admin, Owner, Manager | Expired/wasted products |
| POST | `/consume` | JWT | Admin, Owner, Manager, Employee | Record consumption (out) |

#### Alert Logic (backend service)
- **Low stock alert:** `stockQuantity <= minStockLevel`
- **Expiry alert:** `expiryDate <= today + 7 days`
- **Critical expiry:** `expiryDate <= today`

### 2.2 Backend — Supplier Enhancements

#### Extend `Supplier` Model
```
- email: STRING
- phone: STRING
- address: STRING
- contactName: STRING
```

#### New API: Price Comparison
- `GET /api/suppliers/comparePrices?ingredientId=xxx`
- Returns: supplier name, last price, price history

### 2.3 Frontend — Stock Page (Complete Rewrite)

Current `/stocks` is a placeholder. Replace with:

#### New `StockPage.jsx`
- **Tab 1: Inventaire**
  - Table: ingredient name, category, stock qty, min level, status (🟢 OK / 🟡 Low / 🔴 Critical)
  - Actions: + Ajouter, Modifier quantité, Renseigner péremption
- **Tab 2: Alertes**
  - Low stock items (red)
  - Near expiry (orange, ≤7 days)
  - Expired (black/grey)
- **Tab 3: Historique**
  - All stock movements with date, type, reason
- **Tab 4: Gaspillage**
  - Expired products, quantity lost, cost calculation

### 2.4 Frontend — Supplier Page

#### New `Suppliers.jsx` (`/suppliers`)
- Table: supplier name, contact, email, phone
- Actions: + Ajouter, Modifier, Voir produits associés
- Button: "Comparer prix" → opens comparison modal

### 2.5 Frontend — Dashboard (Complete Rewrite)

Current `/` (Dashboard) is a placeholder. Replace with:

#### New `Dashboard.jsx`

**Cards row (KPIs):**
- 💰 Chiffre d'affaires aujourd'hui
- 📄 Factures en attente (unpaid count)
- 📦 Alertes stock (low + expiry count)
- 👥 Employés actifs

**Charts row:**
- Revenue last 7 days (bar chart)
- Stock status pie chart (OK / Low / Critical)
- Top 5 sold products (if order data exists, else placeholder)

**Alerts panel:**
- Unpaid invoices list (with customer name, amount, days overdue)
- Stock alerts list (click → go to stock page)

---

## Phase 3: Personnel — Planning & Scheduling (P1)

**Duration estimate:** 3-4 days
**Why third:** Essential for operations but depends on stable user management (already done).

### 3.1 Backend — Planning Domain

#### New Model: `Schedule` (or `Planning`)
```
- id: UUID (PK)
- employeeId: UUID (FK → User)
- restaurantId: UUID (FK → Restaurant)
- date: DATE
- startTime: TIME
- endTime: TIME
- role: STRING (e.g. "Cuisine", "Service", "Livraison")
- status: ENUM ["scheduled", "completed", "absent", "changed"]
- createdBy: UUID (FK → User, manager)
- createdAt: DATE
- updatedAt: DATE
```

#### New Model: `ScheduleChangeRequest`
```
- id: UUID (PK)
- scheduleId: UUID (FK → Schedule)
- employeeId: UUID (FK → User)
- requestedDate: DATE (new date they want)
- requestedStartTime: TIME
- requestedEndTime: TIME
- reason: STRING
- status: ENUM ["pending", "approved", "rejected"]
- managerResponse: STRING (nullable)
- requestedAt: DATE
- respondedAt: DATE (nullable)
```

#### New API Endpoints (`/api/schedules`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/create` | JWT | Admin, Owner, Manager | Create a shift |
| PUT | `/update/:id` | JWT | Admin, Owner, Manager | Modify shift |
| DELETE | `/delete/:id` | JWT | Admin, Owner, Manager | Delete shift |
| GET | `/getAll` | JWT | Admin, Owner, Manager | All shifts (filterable by week/date) |
| GET | `/getMine` | JWT | Any authenticated | My own shifts |
| POST | `/requestChange` | JWT | Employee | Request schedule modification |
| PUT | `/respondToRequest/:id` | JWT | Admin, Owner, Manager | Approve/reject request |
| GET | `/pendingRequests` | JWT | Admin, Owner, Manager | List pending requests |

#### Business Rules
- Managers see all shifts for their restaurant
- Employees see only their own shifts
- Change requests must be submitted ≥2 weeks in advance (configurable)
- Overlapping shifts not allowed for same employee

### 3.2 Frontend — Planning Pages

#### New `Planning.jsx` (`/planning`) — Manager View
- **Calendar view** (week/month toggle)
- Each day shows assigned employees with time slots
- Drag-and-drop to reschedule (optional, complex)
- Click empty slot → create shift modal
- Click existing shift → edit/delete
- Badge: 🔴 pending change requests count

#### New `MyPlanning.jsx` (`/my-planning`) — Employee View
- Calendar showing only MY shifts
- Color-coded by role/status
- Button: "Demander un changement" → opens request modal
- Request modal: select shift, propose new date/time, enter reason

#### New `PlanningRequests.jsx` (`/planning/requests`) — Manager View
- Table of pending requests
- Columns: employee, original shift, requested change, reason, date submitted
- Actions: Approuver / Refuser (with optional comment)

---

## Phase 4: Polish — Reports, PDF, Email, Advanced Features (P2-P3)

**Duration estimate:** 2-3 days (can be deferred post-MVP)
**Why last:** These are enhancements that make the app professional but aren't required for basic operation.

### 4.1 Reports & Analytics

#### New `Reports.jsx` (`/reports`)
- **Revenue Report:** Date range picker → bar chart (daily/weekly/monthly)
- **Product Sales:** Table + chart of best-selling items
- **Tax Report:** Total tax collected in period
- **Payment Delays:** List of overdue invoices with days late
- **Waste Report:** Quantity and cost of expired products by period
- **Export:** Download as CSV

#### Backend APIs for Reports
- `GET /api/reports/revenue?from=&to=`
- `GET /api/reports/salesByProduct?from=&to=`
- `GET /api/reports/taxes?from=&to=`
- `GET /api/reports/paymentDelays`
- `GET /api/reports/waste?from=&to=`

### 4.2 PDF Export

#### Backend
- Install `pdfkit` or `puppeteer`
- `GET /api/invoices/:id/pdf` → returns PDF stream
- Styled invoice template with restaurant logo placeholder

#### Frontend
- "Télécharger PDF" button on invoice detail page
- Opens PDF in new tab or triggers download

### 4.3 Email Service (Optional)

#### Backend
- Install `nodemailer`
- Configuration in `.env` (SMTP host, port, user, pass)
- Send emails for:
  - Password reset (token-based)
  - New user welcome (credentials)
  - Invoice to customer
  - Daily summary to manager

### 4.4 Mobile Responsiveness

Current frontend is desktop-only. Ensure all pages work on mobile:
- Tables become cards or horizontal scroll
- Modals fit screen
- Sidebar becomes hamburger menu (already partially done)

---

## Database Schema Changes Summary

### New Tables
1. `Invoices` — Core billing
2. `InvoiceItems` — Line items
3. `Schedules` — Employee shifts
4. `ScheduleChangeRequests` — Shift modification requests

### Modified Tables
1. `Ingredients` — Add `expiryDate`, `category`, `supplierId`
2. `StockMovements` — Add `type`, `previousQuantity`, `newQuantity`
3. `Suppliers` — Add `email`, `phone`, `address`, `contactName`
4. `Payments` — Add `invoiceId` (FK), `status`

---

## File Structure Plan

### Backend (new files)
```
backend/src/modules/
├── invoice/
│   ├── invoice.model.js
│   ├── invoiceItem.model.js
│   ├── invoice.controller.js
│   ├── invoice.routes.js
│   └── invoice.service.js (optional: business logic)
├── schedule/
│   ├── schedule.model.js
│   ├── scheduleChangeRequest.model.js
│   ├── schedule.controller.js
│   └── schedule.routes.js
├── reports/
│   ├── reports.controller.js
│   └── reports.routes.js
└── stock/
    ├── stock.controller.js (enhanced)
    └── stock.routes.js
```

### Frontend (new files)
```
frontend/src/
├── pages/
│   ├── Invoices.jsx
│   ├── InvoiceForm.jsx
│   ├── InvoiceDetail.jsx
│   ├── Payments.jsx
│   ├── StockPage.jsx          (replaces placeholder Stocks.jsx)
│   ├── Suppliers.jsx
│   ├── Planning.jsx
│   ├── MyPlanning.jsx
│   ├── PlanningRequests.jsx
│   └── Reports.jsx
├── features/
│   ├── invoices/
│   │   ├── components/
│   │   │   ├── InvoiceTable.jsx
│   │   │   ├── InvoiceLineItems.jsx
│   │   │   └── InvoiceStatusBadge.jsx
│   │   └── services/
│   │       └── invoiceService.js
│   ├── stock/
│   │   ├── components/
│   │   │   ├── StockTable.jsx
│   │   │   ├── StockAlerts.jsx
│   │   │   └── StockMovementHistory.jsx
│   │   └── services/
│   │       └── stockService.js
│   ├── suppliers/
│   │   ├── components/
│   │   │   ├── SupplierTable.jsx
│   │   │   └── PriceComparisonModal.jsx
│   │   └── services/
│   │       └── supplierService.js
│   ├── planning/
│   │   ├── components/
│   │   │   ├── CalendarView.jsx
│   │   │   ├── ShiftCard.jsx
│   │   │   └── ChangeRequestModal.jsx
│   │   └── services/
│   │       └── scheduleService.js
│   └── reports/
│       ├── components/
│       │   ├── RevenueChart.jsx
│       │   └── DateRangePicker.jsx
│       └── services/
│           └── reportService.js
└── services/
    ├── invoiceService.js
    ├── paymentService.js
    ├── stockService.js
    ├── supplierService.js
    ├── scheduleService.js
    └── reportService.js
```

---

## Implementation Order (Sprints)

### Sprint 1: Invoices Core (Days 1-2)
- [ ] Create `Invoice` and `InvoiceItem` models
- [ ] Create invoice controller with CRUD + validate + cancel + pay
- [ ] Create invoice routes
- [ ] Register routes in `server.js`
- [ ] Test with Postman/curl
- [ ] Create `invoiceService.js` frontend
- [ ] Create `Invoices.jsx` page (list)
- [ ] Create `InvoiceForm.jsx` page (create/edit)
- [ ] Add to sidebar and routes

### Sprint 2: Payments & Stock (Days 3-4)
- [ ] Extend `Payment` model with `invoiceId`
- [ ] Create payment controller + routes
- [ ] Test invoice → payment flow
- [ ] Create `Payments.jsx` page
- [ ] Extend `Ingredient` model (expiryDate, category, supplierId)
- [ ] Add stock alert API endpoint
- [ ] Create `StockPage.jsx` (full replacement)
- [ ] Create `Suppliers.jsx` page

### Sprint 3: Dashboard (Day 5)
- [ ] Create dashboard data aggregation API
- [ ] Rewrite `Dashboard.jsx` with real KPIs
- [ ] Add charts (recharts or chart.js)
- [ ] Connect stock alerts to dashboard
- [ ] Connect unpaid invoices to dashboard

### Sprint 4: Planning (Days 6-7)
- [ ] Create `Schedule` and `ScheduleChangeRequest` models
- [ ] Create schedule controller + routes
- [ ] Create `Planning.jsx` (manager calendar)
- [ ] Create `MyPlanning.jsx` (employee view)
- [ ] Create `PlanningRequests.jsx`
- [ ] Add to sidebar and routes

### Sprint 5: Reports & Polish (Days 8-9)
- [ ] Create reports controller with aggregations
- [ ] Create `Reports.jsx` page
- [ ] Add CSV export
- [ ] Mobile responsiveness pass
- [ ] Bug fixes and testing

### Sprint 6: PDF & Email (Optional, Days 10-12)
- [ ] PDF generation for invoices
- [ ] Email service setup
- [ ] Welcome email for new users
- [ ] Invoice email to customers

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Invoice model too simple for real use | Medium | Start basic (customer name + line items). Add customer model later. |
| Planning calendar complex to build | Medium | Use a simple table/grid for MVP, not full drag-and-drop calendar. |
| Charts library choice | Low | Use `recharts` — simple, React-friendly, well-documented. |
| Database migrations with existing data | Low | Use Sequelize `sync({ alter: true })` in dev. Create proper migrations for production later. |
| Feature creep | High | Strictly follow this plan. No additional features until MVP is done. |

---

## Success Criteria for MVP

A manager can complete this workflow without errors:

1. ✅ Log in as Owner/Manager
2. ✅ View Dashboard with today's revenue, stock alerts, unpaid invoices
3. ✅ Create a new employee via Team page
4. ✅ Create an invoice with line items, validate it
5. ✅ Record a payment for that invoice
6. ✅ View stock levels and see low-stock alerts
7. ✅ Add a supplier and view supplier list
8. ✅ Create an employee schedule for next week
9. ✅ Employee logs in and views their own schedule
10. ✅ Generate a basic revenue report for last 7 days

---

## Next Action

**Ready to start Sprint 1?**

The first task is: **Create the Invoice model + InvoiceItem model + controller + routes.**

Say "start sprint 1" and I will begin implementing.
