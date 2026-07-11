# CancelKit — Sistem Mimarisi (ARCHITECTURE)

> **Versiyon:** 1.0 · **Tarih:** 2026-07-10
> İlgili doküman: [PRD.md](./PRD.md) — kapsam kararları oradan gelir.

---

## 1. Tech Stack

| Katman | Teknoloji | Neden |
|--------|-----------|-------|
| Framework | **Next.js 15** (App Router, TypeScript) | Landing + dashboard + API tek projede; Vercel'e doğal deploy. |
| UI | **Tailwind CSS v4 + shadcn/ui** | Hızlı, tutarlı, premium görünüm (bkz. UI_UX_GUIDELINES.md). |
| Veritabanı + Auth | **Supabase** (Postgres, Auth, RLS) | Ücretsiz katman MVP'ye yeter; magic link + Google OAuth hazır. |
| Hosting | **Vercel** (Hobby → Pro) | Sıfır DevOps, edge network'ten widget servisi. |
| Müşterinin ödemesi | **Stripe Node SDK** | Müşterinin kendi Stripe hesabında kupon/pause uygularız. |
| Bizim faturalamamız | **Lemon Squeezy** (Merchant of Record) | Vergi/KDV/fatura bürokrasisi sıfır (Anayasa madde 3). |
| Transactional e-posta | **Resend** (opsiyonel, Faz 5+) | Trial hatırlatma vb.; MVP'nin ilk sürümünde zorunlu değil. |
| Widget build | **esbuild** | `widget/` klasöründeki vanilla TS'i tek dosyaya (`public/v1.js`) derler. |

**Maliyet projeksiyonu (0-100 müşteri):** Vercel Hobby $0 → Pro $20/ay · Supabase Free $0 → Pro $25/ay · Lemon Squeezy %5+50¢/işlem · Domain ~$12/yıl. **Başlangıç sabit maliyet ≈ $1/ay.**

---

## 2. Sistem Genel Bakış

```
┌────────────────────────────┐          ┌─────────────────────────────────┐
│  Müşterinin SaaS'ı         │          │  CancelKit (Vercel)             │
│  ────────────────          │          │  ───────────────────            │
│  <script src=".../v1.js"   │  HTTPS   │  Next.js App                    │
│    data-key="pk_...">      │────────▶ │  ├─ / (landing)                 │
│  [İptal Et] data-cancelkit │          │  ├─ /app (dashboard, auth'lu)   │
│       │                    │          │  └─ /api/v1/* (widget API)      │
│       ▼                    │          │        │                        │
│  Widget modal (Shadow DOM) │          │        ▼                        │
│  1) Anket → 2) Teklif      │          │  Supabase (Postgres + Auth)     │
└────────────────────────────┘          │        │                        │
                                        │        ▼                        │
                    ┌───────────────────┤  Stripe API (müşterinin hesabı) │
                    │ Lemon Squeezy ────┤  kupon uygula / pause et        │
                    │ (bizim abonelik)  └─────────────────────────────────┘
```

---

## 3. Widget Akışı (Uçtan Uca)

### 3.1 Kurulum (müşterimiz yapar)
```html
<!-- 1. Snippet — </body> öncesine -->
<script src="https://cancelkit.site/v1.js" data-key="pk_live_xxx" defer></script>

<!-- 2. İptal butonunu işaretle (Yöntem A) -->
<button data-cancelkit data-ck-customer="cus_stripe_id">İptal Et</button>

<!-- veya programatik (Yöntem B) -->
<script>CancelKit.open({ customerId: "cus_stripe_id" });</script>
```

### 3.2 Çalışma zinciri
1. **Init:** `v1.js` yüklenir → `GET /api/v1/config?key=pk_...` ile projenin anket nedenleri, aktif teklifleri ve vurgu rengi çekilir (edge-cache'li, ~5 dk TTL).
2. **Tetikleme:** İptal butonuna tıklama → widget **Shadow DOM** içinde modal açar (müşteri sitesinin CSS'i sızamaz, bizimki taşamaz).
3. **Adım 1 — Anket:** Neden seçimi + serbest metin → `POST /api/v1/sessions` (session `open` durumunda yaratılır).
4. **Adım 2 — Teklif:** Nedene eşlenmiş teklif gösterilir (yoksa varsayılan teklif).
   - **Kabul:** `POST /api/v1/sessions/:id/accept` → sunucu, projenin şifreli Stripe key'ini çözer → kupon oluşturup aboneliğe uygular **veya** `pause_collection` ayarlar → session `saved`, kurtarılan MRR kaydedilir → başarı ekranı.
   - **Ret:** session `churned` işaretlenir → widget kapanır ve `onContinueCancel` callback'i tetiklenir; **asıl iptali müşterinin kendi akışı yapar** (biz asla aboneliği iptal etmeyiz).
   - **Terk:** Modal kapatılırsa session `abandoned`.

### 3.3 API Yüzeyi (widget-facing, public)
| Endpoint | Metot | Auth | İş |
|----------|-------|------|-----|
| `/api/v1/config` | GET | `pk_` key + Origin kontrolü | Anket/teklif/tema konfigürasyonu |
| `/api/v1/sessions` | POST | `pk_` key + Origin kontrolü | Cancel session başlat (anket cevabı) |
| `/api/v1/sessions/:id/accept` | POST | `pk_` key + session token | Teklifi Stripe'da uygula |
| `/api/v1/sessions/:id/close` | POST | `pk_` key + session token | churned / abandoned işaretle |

Dashboard, Next.js server actions + Supabase client (RLS) ile çalışır; ayrı REST katmanı gerekmez.

---

## 4. Güvenlik Modeli

1. **Key ayrımı:** `pk_` (publishable) yalnızca config okuma + session yaratma yetkisine sahiptir; Stripe'a dokunan her işlem server-side'dır.
2. **Stripe restricted key:** Müşteriden *restricted* key isteriz (yalnızca `Customers: Read`, `Subscriptions: Write`, `Coupons: Write`). Full secret key kabul edilirse onboarding'de uyarı gösterilir.
3. **Şifreleme:** Stripe key'leri AES-256-GCM ile, Vercel env'deki `ENCRYPTION_KEY` kullanılarak şifrelenip saklanır. Düz metin key asla loglanmaz, client'a asla dönmez.
4. **Origin allowlist:** Her projede `allowed_origins` listesi; `pk_` ile gelen istekler `Origin` header'ına karşı doğrulanır.
5. **Tenant izolasyonu:** Tüm tablolarda Supabase **RLS**: `user_id = auth.uid()` zinciri. Widget API'leri service-role ile çalışır ama her sorgu `pk_` → `project_id` çözümünden geçer.
6. **Idempotency:** Lemon Squeezy webhook'ları `webhook_events` tablosuna event id ile yazılır; tekrar gelen event işlenmez. İmza (`X-Signature`) doğrulanır.
7. **Rate limiting:** Widget endpoint'lerinde IP + pk bazlı basit limit (Upstash gerekmez; MVP'de in-memory/Vercel KV yeterli değilse Supabase tablosu).
8. **Abonelik kapısı (Faz 5):** Widget'ın giriş noktaları (`/api/v1/config` + `POST /api/v1/sessions`) proje sahibinin faturalama durumuna bağlıdır (`lib/billing.ts`): trial süresi dolmuş veya abonelik `cancelled` ise 403 `subscription_inactive` döner ve widget müşteri sitesinde açılmaz (widget bu durumda `onContinueCancel` ile kontrolü müşterinin kendi iptal akışına bırakır — buton asla ölmez). LS status eşlemesi: `on_trial/active/cancelled(dönem sonuna dek)` → active, `expired` → cancelled, `past_due/unpaid/paused/bilinmeyen` → past_due (fail-soft; dunning sırasında widget çalışmaya devam eder). "Powered by CancelKit" rozeti config'teki `poweredByBadge` ile ücretsiz/trial hesaplarda gösterilir, `active`'te kaldırılır. Checkout LS API'siyle server-side oluşturulur: e-posta prefill body'de taşınır (URL'de değil) ve `custom.user_id` webhook'un aboneliği profile eşlemesini sağlar.

---

## 5. Veritabanı Şeması

```sql
-- Supabase auth.users'ı genişletir (trigger ile otomatik satır)
profiles (
  id            uuid PK REFERENCES auth.users,
  email         text NOT NULL,
  ls_customer_id      text,             -- Lemon Squeezy customer
  ls_subscription_id  text,
  subscription_status text NOT NULL DEFAULT 'trialing',  -- trialing|active|past_due|cancelled
  trial_ends_at timestamptz NOT NULL DEFAULT now() + interval '14 days',
  created_at    timestamptz DEFAULT now()
)

projects (
  id              uuid PK DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id),
  name            text NOT NULL,
  publishable_key text UNIQUE NOT NULL,       -- 'pk_live_' + nanoid
  allowed_origins text[] NOT NULL DEFAULT '{}',
  encrypted_stripe_key text,                  -- AES-256-GCM
  accent_color    text DEFAULT '#6366F1',
  created_at      timestamptz DEFAULT now()
)

offers (
  id          uuid PK DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type        text NOT NULL CHECK (type IN ('discount','pause')),
  -- discount: percent_off + duration_months · pause: pause_months
  percent_off      int,
  duration_months  int,
  pause_months     int,
  headline    text NOT NULL,        -- widget'ta gösterilen başlık
  is_active   boolean DEFAULT true,
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
)

survey_reasons (
  id          uuid PK DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  label       text NOT NULL,
  sort_order  int DEFAULT 0
)
-- Proje oluşturulunca varsayılan 6 neden otomatik eklenir (seed trigger/action).

cancel_sessions (
  id            uuid PK DEFAULT gen_random_uuid(),
  project_id    uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,          -- widget'ın devam yetkisi
  customer_id   text,                          -- Stripe customer id (müşterinin müşterisi)
  customer_email text,
  reason_id     uuid REFERENCES survey_reasons(id),
  reason_text   text,                          -- serbest metin
  offer_id      uuid REFERENCES offers(id),    -- gösterilen teklif
  outcome       text NOT NULL DEFAULT 'open'
                CHECK (outcome IN ('open','saved','churned','abandoned')),
  saved_mrr_cents bigint,                      -- kurtarılan aylık tutar (Stripe'dan)
  currency      text DEFAULT 'usd',
  created_at    timestamptz DEFAULT now(),
  resolved_at   timestamptz
)

webhook_events (
  id          text PK,               -- LS event id (idempotency anahtarı)
  source      text NOT NULL DEFAULT 'lemonsqueezy',
  type        text NOT NULL,
  payload     jsonb NOT NULL,
  processed_at timestamptz DEFAULT now()
)
```

**İlişkiler:** `profiles 1—N projects 1—N offers / survey_reasons / cancel_sessions`. Dashboard metrikleri `cancel_sessions` üzerinden aggregate edilir (MVP'de view yeterli: `saved_mrr_by_month`).

---

## 6. Dizin Yapısı

```
Saas/
├── docs/                    # PRD, ARCHITECTURE, UI_UX_GUIDELINES
├── TODO.md
├── app/
│   ├── (marketing)/         # landing, pricing — public
│   ├── (dashboard)/app/     # auth'lu panel: overview, sessions, offers, settings
│   ├── api/v1/              # widget API (config, sessions)
│   ├── api/webhooks/lemonsqueezy/
│   └── auth/                # Supabase auth callback
├── components/              # shadcn/ui + ortak bileşenler
├── lib/                     # supabase client'ları, stripe, crypto, ls
├── widget/                  # vanilla TS widget kaynağı (ayrı tsconfig)
│   └── src/index.ts         # esbuild → public/v1.js
├── supabase/migrations/     # SQL migration'ları (şema yukarıda)
└── public/v1.js             # build çıktısı (CDN: Vercel edge)
```

**Not:** MVP'de widget ayrı paket/monorepo yapılmaz (Anayasa madde 2 — basitlik). `npm run build:widget` script'i esbuild ile derler; Vercel build'ine hook'lanır.

---

## 7. Ortam Değişkenleri

```
NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY          # yalnızca server
ENCRYPTION_KEY                     # 32 byte, Stripe key şifreleme
LEMONSQUEEZY_API_KEY / LEMONSQUEEZY_WEBHOOK_SECRET / LEMONSQUEEZY_STORE_ID / LEMONSQUEEZY_VARIANT_ID
NEXT_PUBLIC_APP_URL
```

## 8. Bilinçli Ertelemeler (teknik borç değil, karar)
- Widget versiyonlama: `v1.js` tek dosya; breaking change gerekirse `v2.js` açılır.
- Analitik: MVP'de yalnızca kendi `cancel_sessions` verimiz; ürün analitiği (PostHog vb.) lansman sonrası.
- Test stratejisi: Widget akışı için 1 adet Playwright e2e (demo sayfası üzerinde) + Stripe entegrasyonuna unit test; kapsamlı test piramidi MVP sonrası.
