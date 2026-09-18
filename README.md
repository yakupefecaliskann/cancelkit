# CancelKit

Embeddable cancel-flow widget for Stripe SaaS: exit survey + retention offer
(discount or pause) applied to the customer's subscription on the merchant's
own Stripe account. Live at https://cancelkit.site.

Stack: Next.js 15 (App Router) · Supabase (Postgres + RLS + auth) · Stripe ·
Sentry · Vercel. The widget (`widget/src`) is bundled by esbuild into
`public/v1.js`.

## Known limitations

CancelKit is a portfolio project, and these trade-offs are deliberate:

- **Customer identity is client-supplied.** The widget sends the Stripe
  customer id from the host page. Anyone holding a project's public `pk_` key
  and a valid `cus_…` id could trigger that project's offer for that customer.
  The damage is capped by one save per customer (enforced by a DB unique index).
  The production fix is a customer token signed with HMAC by the merchant's backend.
- **Rate limiting is per customer only.** Sessions without a customer id are
  not throttled. The production fix is IP-level limiting (e.g. Upstash).
- **Major upgrades are pending** (Next.js 16, ESLint 10, TypeScript 7).
  Security patches within the current majors are applied.

## Development

```bash
cp .env.example .env.local   # fill in Supabase keys + ENCRYPTION_KEY
npm install
npm run dev                  # http://localhost:3000
```

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run test:unit            # MRR + analytics unit tests
npm run test:e2e             # Playwright: public routes + widget flow (API mocked)
npm run build                # widget bundle + Next.js production build
```

## Docs

- `docs/PRD.md` — product requirements
- `docs/ARCHITECTURE.md` — data model, API, security model
- `docs/UI_UX_GUIDELINES.md` — design rules
- `docs/GTM_STRATEGY.md` — go-to-market log
- `supabase/migrations/` — schema and RLS policies
