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
| Bizim faturalamamız | **Yok — ürün ücretsiz** | Ödeme sağlayıcısı yok; ödeme almadığımız için vergi/KDV/MoR bürokrasisi de yok (2026-08-01 kararı, aşağıya bkz.). |
| Transactional e-posta | **Resend** | Magic link teslimatı (Supabase Auth custom SMTP). |
| Widget build | **esbuild** | `widget/` klasöründeki vanilla TS'i tek dosyaya (`public/v1.js`) derler. |

**Maliyet projeksiyonu (0-100 kullanıcı):** Vercel Hobby $0 → Pro $20/ay · Supabase Free $0 → Pro $25/ay · Domain ~$12/yıl. **Başlangıç sabit maliyet ≈ $1/ay.**

**Faturalama kararı (2026-08-01):** Ürün Lemon Squeezy üzerinden ücretli bir katmanla tasarlanmıştı; LS mağazası hiç Live moda geçmedi (KYC onaylanmadı) ve hiçbir hesap ücretlendirilmedi. LS entegrasyonu (checkout, webhook, trial kilidi, upgrade duvarı) tamamen kaldırıldı ve **yerine başka bir ödeme sağlayıcısı konmadı** — CancelKit şu an herkes için ücretsiz. Widget'taki "Powered by CancelKit" rozeti artık her zaman açık.

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
                                        │  Stripe API (müşterinin hesabı) │
                                        │  kupon uygula / pause et        │
                                        └─────────────────────────────────┘
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
6. **Idempotency:** Gelen webhook'lar `webhook_events` tablosuna event id ile yazılır; tekrar gelen event işlenmez. LS kaldırıldığından şu an bu tabloya yazan bir üretici yok — tablo, ileride bir sağlayıcı eklenirse hazır dursun diye korunuyor.
7. **Rate limiting:** Widget endpoint'lerinde IP + pk bazlı basit limit (Upstash gerekmez; MVP'de in-memory/Vercel KV yeterli değilse Supabase tablosu).
8. **Abonelik kapısı — KALDIRILDI (2026-08-01):** Widget giriş noktalarında (`/api/v1/config` + `POST /api/v1/sessions`) proje sahibinin faturalama durumuna bakan kapı vardı; trial dolunca 403 `subscription_inactive` dönerdi. Ürün ücretsizleştiği için bu kapı, `lib/billing.ts` ve profil sorgusu tamamen kaldırıldı — widget her zaman açılır ve config `poweredByBadge: true` döner. Erişim kontrolü artık yalnızca `pk_` anahtarı + `Origin` allowlist'idir (madde 4).

---

## 5. Veritabanı Şeması

```sql
-- Supabase auth.users'ı genişletir (trigger ile otomatik satır)
profiles (
  id            uuid PK REFERENCES auth.users,
  email         text NOT NULL,
  created_at    timestamptz DEFAULT now()
  -- Kalıntı sütunlar (kod okumuyor, ürün ücretsiz): subscription_status,
  -- trial_ends_at, past_due_since. ls_* sütunları
  -- 20260801120000_drop_lemonsqueezy_columns.sql ile düşürüldü.
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

-- Şu an yazan üretici yok (LS kaldırıldı); ileride bir sağlayıcı eklenirse diye duruyor.
webhook_events (
  id          text PK,               -- event id (idempotency anahtarı)
  source      text NOT NULL DEFAULT 'lemonsqueezy',   -- kalıntı default
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
│   └── auth/                # Supabase auth callback
├── components/              # shadcn/ui + ortak bileşenler
├── lib/                     # supabase client'ları, stripe, crypto
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
NEXT_PUBLIC_APP_URL
SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN                   # opsiyonel (DSN yoksa no-op)
SENTRY_ORG / SENTRY_PROJECT / SENTRY_AUTH_TOKEN       # opsiyonel, source map upload
```

## 8. Bilinçli Ertelemeler (teknik borç değil, karar)
- Widget versiyonlama: `v1.js` tek dosya; breaking change gerekirse `v2.js` açılır.
- Analitik: MVP'de yalnızca kendi `cancel_sessions` verimiz; ürün analitiği (PostHog vb.) lansman sonrası.
- Test stratejisi: Widget akışı için 1 adet Playwright e2e (demo sayfası üzerinde) + Stripe entegrasyonuna unit test; kapsamlı test piramidi MVP sonrası.
