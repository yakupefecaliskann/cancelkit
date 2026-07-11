# CancelKit — UI/UX Guidelines

> **Versiyon:** 1.0 · **Tarih:** 2026-07-10
> İlgili dokümanlar: [PRD.md](./PRD.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 1. Tasarım Felsefesi

**"Güven veren, veri odaklı, premium-minimal."**

CancelKit para ile ilgili bir üründür: müşterimiz ona kendi Stripe anahtarını emanet eder ve ondan gelir raporu okur. Tasarım dili bu güveni yansıtmalı — referans estetiği **Stripe ve Linear**: bol beyaz alan, disiplinli tipografi, tek güçlü vurgu rengi, gösterişsiz derinlik (hafif border + çok hafif gölge).

Üç ilke:
1. **Sayılar kahramandır.** Dashboard'un yıldızı "kurtarılan MRR" rakamıdır; süsleme değil veri öne çıkar.
2. **Sıfır sürtünme.** Her ekran tek bir birincil aksiyona sahiptir (onboarding'de "sonraki adım", ayarlarda "kaydet").
3. **Widget misafirdir.** Müşterinin sitesinde çalışır; nötr, hafif ve saygılı olmalıdır.

---

## 2. Renk Paleti

### 2.1 Nötrler (Slate skalası — dashboard zemini)
| Token | Hex | Kullanım |
|-------|-----|----------|
| `background` | `#F8FAFC` (slate-50) | Sayfa zemini (light) |
| `surface` | `#FFFFFF` | Kartlar, paneller |
| `border` | `#E2E8F0` (slate-200) | Kart ve input kenarlıkları |
| `muted` | `#64748B` (slate-500) | İkincil metin, etiketler |
| `foreground` | `#0F172A` (slate-900) | Ana metin, başlıklar |

### 2.2 Marka & Semantik
| Token | Hex | Kullanım |
|-------|-----|----------|
| `primary` | `#6366F1` (indigo-500) | Birincil butonlar, linkler, aktif durumlar, grafik ana serisi |
| `primary-hover` | `#4F46E5` (indigo-600) | Hover |
| `success` | `#10B981` (emerald-500) | **Kurtarılan MRR**, "saved" rozetleri, pozitif değişim |
| `danger` | `#EF4444` (red-500) | **Churn**, "churned" rozetleri, silme aksiyonları |
| `warning` | `#F59E0B` (amber-500) | "abandoned", trial uyarıları |

**Anlam sözleşmesi:** Yeşil her zaman "kurtarılan para", kırmızı her zaman "kaybedilen müşteri" demektir. Bu ikili asla başka anlamda kullanılmaz.

### 2.3 Dark Mode
Dashboard MVP'de **light-first** çıkar; token'lar CSS değişkeni olarak tanımlanır (shadcn/ui konvansiyonu) ve dark mode Faz 6 sonrasına ertelenir. Landing sayfası isterse koyu hero kullanabilir (`#0F172A` zemin + indigo vurgu).

---

## 3. Tipografi

| Rol | Font | Not |
|-----|------|-----|
| UI / metin | **Inter** (next/font, variable) | Tüm dashboard ve landing |
| Kod / snippet | **JetBrains Mono** | Snippet kutusu, API key gösterimi, kod blokları |

**Ölçek (px):**
- `12` — yardımcı etiketler, tablo meta
- `14` — gövde metni, tablo hücreleri, form (dashboard varsayılanı)
- `16` — vurgulu gövde, landing paragrafı
- `20` — kart başlıkları (semibold)
- `24` — sayfa başlıkları (semibold)
- `32+` — hero metrikler (kurtarılan MRR rakamı: 32-40, bold, tabular-nums)

Kurallar: satır yüksekliği gövdede 1.5; sayısal metriklerde `font-variant-numeric: tabular-nums`; başlıklarda `tracking-tight`.

---

## 4. Bileşen Kütüphanesi ve Kurallar

- **Temel:** shadcn/ui (Button, Card, Dialog, Input, Select, Table, Badge, Tabs, Toast/Sonner, Skeleton).
- **İkonlar:** lucide-react, 16/20px, `stroke-width: 1.5-2`.
- **Grafikler:** Recharts — bar (neden dağılımı), area/line (aylık kurtarılan MRR). Grafik renkleri §2.2 token'larından; grid çizgileri `border` renginde, kesik değil düz ve silik.

### 4.1 Layout & Spacing
- **8px grid:** Tüm spacing 4'ün katı, tercihen 8'in (Tailwind `p-2/4/6/8`).
- **Dashboard şablonu:** Sol sabit sidebar (240px: Overview, Sessions, Offers, Survey, Settings) + üst bar (proje seçici, hesap menüsü) + `max-w-6xl` içerik alanı.
- **Border radius:** `rounded-lg` (8px) kartlar ve input'lar, `rounded-md` (6px) butonlar, `rounded-full` rozetler.
- **Gölge:** Yalnızca `shadow-sm`; derinlik border ile verilir. Dialog/popover `shadow-lg` kullanabilir.

### 4.2 Zorunlu Durum Tasarımları
Her veri ekranı üç durumu da tasarlanmış olmalı — boş bırakılamaz:
1. **Empty state:** İkon + tek cümle açıklama + birincil CTA (ör. Sessions boşsa: "Henüz cancel session yok. Widget'ı test etmek için demo sayfasını aç →").
2. **Loading:** Skeleton (spinner değil) — metrik kartlarında ve tablolarda.
3. **Error:** Sonner toast + yeniden dene aksiyonu; asla sessiz başarısızlık.

### 4.3 Ton ve Metin (Microcopy)
- Dil: **İngilizce** (global pazar), kısa ve doğrudan: "Save customer", "Copy snippet".
- Para her zaman sembol + tutar: `$1,240 saved this month`.
- Boş övgü yok; her metin bir aksiyonu veya veriyi tarif eder.

---

## 5. Widget UI Kuralları (müşteri sitesinde çalışan modal)

Widget, CancelKit'in değil **müşterimizin** deneyimidir; ayrı ve daha katı kurallara tabidir:

1. **Boyut:** Modal `max-width: 420px`, dikey ortalanmış, `border-radius: 12px`, arkada `rgba(15,23,42,0.5)` overlay.
2. **Nötrlük:** Beyaz zemin, slate metin; tek özelleştirme projenin `accent_color`'ı (birincil buton + seçili durumlar). Marka logosu, süsleme, illüstrasyon yok.
3. **Hafiflik:** `v1.js` bundle hedefi **< 30KB gzip**; font yüklemez (sistem font stack: `-apple-system, Segoe UI, Roboto, ...`), harici CSS çekmez (stiller Shadow DOM içinde inline).
4. **Akış:** Maksimum 2 adım (anket → teklif) + sonuç ekranı. İlerleme hissi için üstte 2 nokta göstergesi.
5. **Dürüstlük:** "İptale devam et" seçeneği her adımda görünür ve tıklanabilir kalır — karanlık desen (dark pattern) kullanmak yasak; ürünün itibarı buna bağlı.
6. **Erişilebilirlik:** Focus trap, `Esc` ile kapanma, `aria-modal="true"`, `role="dialog"`, tüm etkileşimler klavyeyle yapılabilir, kontrast ≥ WCAG AA.
7. **Trial rozeti:** Ücretsiz denemede modal altında silik "Powered by CancelKit" (12px, muted) — ücretli planda kalkar.

---

## 6. Landing Sayfası Yönergesi (Faz 6)

- Tek sayfa: Hero (değer önerisi + kurtarılan MRR mock dashboard görseli) → nasıl çalışır (3 adım) → canlı widget demosu ("Try the cancel flow" butonu gerçek widget'ı açar — ürünün kendisi demo) → fiyat (tek kart, $29) → SSS → CTA.
- Hero mesajı ROI odaklı: *"Turn cancellations into saved revenue."*
- Sosyal kanıt alanı lansmanda boş kalmaz: build-in-public metriği gösterilir ("$X MRR saved across all customers").
