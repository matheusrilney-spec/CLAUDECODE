# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Montador Automático de Propostas Comerciais** — An internal web tool for RD Station salespeople to quickly assemble commercial proposals with standardized visual layout.

## Commands

```bash
# Development
npm run dev            # Start Next.js dev server at http://localhost:3000
npm run build          # Production build
npm run lint           # ESLint via next lint

# Database (Prisma + SQLite)
npm run prisma:generate  # Regenerate Prisma client after schema changes
npm run prisma:migrate   # Run migrations (creates dev.db if absent)
npm run prisma:studio    # Open Prisma Studio GUI

# Pricing data
npm run import:pricing   # Parse data/tabela-precos-2026.xlsx → data/pricingCatalog.json
```

No test suite is configured. There is no test runner command.

## Environment Setup

Copy `.env.example` to `.env.local` (or `.env`):

```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Run `npm run prisma:migrate` before first use to create the SQLite database. The pricing catalog `data/pricingCatalog.json` must exist before using product selection — run `npm run import:pricing` or it will fall back to a sample catalog.

## Architecture

### Data Flow

```
XLSX file → importPricing.ts → data/pricingCatalog.json (static file, served by Next.js)
                                       ↓
                              lib/pricing.ts (client-side fetch, in-memory singleton)
                                       ↓
                              components/ProductSelector.tsx

ProposalForm (multi-step wizard) → POST /api/proposals → Prisma → SQLite (dev.db)
                                        ↓
                              /api/export → lib/templateRenderer.ts → HTML output
```

### Key Layers

**`lib/proposalSchema.ts`** — Single source of truth for all data shapes. Zod schemas define the full proposal model: `clientInfoSchema`, `diagnosisSchema`, `solutionSchema`, `useCaseSchema`, `roiSchema`, `lineItemSchema`, `proposalSchema`. All TypeScript types are inferred from these (`z.infer<typeof ...>`). Validation rules (e.g., discount max 100%, at least one product) live here.

**`lib/calculations.ts`** — Pure functions for all financial math: `calculateLineItem`, `calculateMonthlyTotal`, `calculateFirstYearTotal`, `calculateAnnualDiscount`, `calculateEconomy`, `formatCommercialSummary`. A `lineItem` has both `tablePrice` (catalog price) and `promotionalPrice`/`promotionalMonths` for time-limited discounts.

**`lib/pricing.ts`** — Client-side pricing catalog loader. `pricingCatalog` is a module-level array (singleton). `loadPricingCatalog()` fetches `/data/pricingCatalog.json` once. Lookup helpers: `getPricingByProductAndPlan`, `getPlansByProductCode`, `getTiersByProductAndPlan`.

**`lib/templateRenderer.ts`** — Handlebars-based HTML export. `renderTemplate(template, context)` compiles and renders. `createDefaultTemplate()` returns the default inline HTML template with RD Station branding.

**`components/ProposalForm.tsx`** — Multi-step wizard (8 steps). Steps 2–8 are currently stubs (`"em desenvolvimento"`). Only Step 1 (ClientInfoForm) is functional. Navigation is handled locally via `currentStep` state; step data is accumulated in `formData`.

**`app/api/proposals/route.ts`** — `GET` lists recent proposals (last 100, summary fields only). `POST` creates a new proposal from `clientInfo` fields. The full proposal content (diagnosis, solution, line items) is not yet persisted to DB — only the header fields are saved.

### Database Schema

Three models in Prisma (SQLite):
- `Proposal` — header fields (company, seller, dates, status)
- `ProposalContent` — 1:1 with Proposal; text sections (objectives, problems, solution, useCases, roi, roadmap, nextSteps) stored as raw text/JSON strings
- `ProposalLineItem` — 1:many; one row per product with full pricing fields (tablePrice, discountPercent, promotionalPrice, promotionalMonths, standardPriceAfterPromo)

### Styling Conventions

Tailwind CSS with two brand colors defined in `tailwind.config.js`:
- `primary` → `#C52B47` (RD Station red)
- `secondary` → `#1a1a1a`

Global utility classes in `globals.css`: `.btn-primary`, `.btn-secondary`, `.input-base`, `.card` — use these instead of raw Tailwind classes for interactive elements.

### Product Domain

RD Station products in the catalog use codes: `RDSM` (Marketing), `RDCRM` (CRM), `RDCONV` (Conversas). Each product has plans (e.g., Entry, Pro, Standard) and tiers (e.g., 3000/5000 leads). The `billingType` enum is `monthly | yearly | one-time | consumption | addon`; `one-time` items are treated as implementation fees and excluded from recurring totals.

Proposal statuses: `Rascunho` (draft) → `Enviada` → `Aprovada` / `Recusada`.

### What's Not Yet Implemented

- `app/api/export/route.ts` — endpoint file doesn't exist
- `app/api/pricing/route.ts` — endpoint file doesn't exist  
- Steps 2–8 of ProposalForm (Diagnóstico, Solução, Casos de Uso, ROI, Proposta Comercial, Roadmap, Próximos Passos)
- PDF export (planned via Playwright/Puppeteer)
- Full proposal save (currently only persists header, not content/lineItems)
