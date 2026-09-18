# CancelKit

Embeddable cancel-flow widget for Stripe SaaS: exit survey + retention offer
(discount or pause) applied to the customer's subscription on the merchant's
own Stripe account. Live at https://cancelkit.site.

Stack: Next.js 15 (App Router) · Supabase (Postgres + RLS + auth) · Stripe ·
Sentry · Vercel. The widget (`widget/src`) is bundled by esbuild into
`public/v1.js`.

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
