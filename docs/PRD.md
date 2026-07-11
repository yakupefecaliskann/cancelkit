# CancelKit — Product Requirements Document (PRD)

> **Versiyon:** 1.0 · **Tarih:** 2026-07-10 · **Durum:** Onay bekliyor
> **Sahip:** Kurucu ekip (Efe + AI Co-Founder)

---

## 1. Ürün Vizyonu

**CancelKit, indie SaaS'ların kaybettiği MRR'ı geri kazandıran, 5 dakikada kurulan churn önleme katmanıdır.**

Her SaaS'ta müşteriler sessizce iptal eder: "İptal et" butonuna basar, gider ve kurucu *neden* gittiğini asla öğrenemez. Kurumsal çözümler (Churnkey, ProsperStack) bu iptallerin %20-30'unu kurtarabildiğini kanıtladı — ama $250+/ay fiyat ve kurumsal satış süreciyle indie segmentini dışarıda bıraktılar.

CancelKit bu kanıtlanmış mekanizmayı (çıkış anketi + anlık kurtarma teklifi) tek satır script ile, $29/ay'a, self-servis olarak indie kuruculara getirir.

**Kuzey Yıldızı Metriği:** Müşterilerimiz adına kurtarılan toplam MRR ($).

---

## 2. Hedef Kitle

### 2.1 Niş Tanımı
- **Kim:** Solo veya 2-3 kişilik ekiplerle çalışan indie/bootstrap SaaS kurucuları.
- **Ölçek:** $500 – $20.000 MRR arası. (Daha küçüğü ödeme yapamaz, daha büyüğü kurumsal araçlara geçer.)
- **Teknik zorunluluk:** Abonelik tahsilatını **Stripe** (subscription mode) ile yapıyor olmak. (MVP'de tek desteklenen sağlayıcı.)
- **Nerede yaşarlar:** X (build in public), Indie Hackers, r/SaaS, Hacker News, MicroConf toplulukları.

### 2.2 Persona: "Indie Founder Deniz"
- 28-40 yaş, teknik kurucu; ürünü tek başına yazdı, pazarlamayı X'te yapıyor.
- MRR: ~$3.000. Her ay 4-6 iptal görüyor; Stripe e-postasından öğreniyor, nedenini bilmiyor.
- Acısı: Her iptal doğrudan cebinden çıkan para. Churnkey'e baktı, fiyatı görünce kapattı.
- Beklentisi: Kurulumu bir akşamda bitsin, dokümantasyon net olsun, dashboard'da "bu ay şu kadar $ kurtardın" yazsın.

### 2.3 Değer Önerisi
> "$29/ay öde, ayda yüzlerce dolarlık iptali otomatik kurtar. ROI'yi dashboard'da gör."

---

## 3. Problem Tanımı

1. **Görünmez churn:** Kurucu, müşterinin neden iptal ettiğini bilmiyor → ürün kararlarını körlemesine alıyor.
2. **Kurtarma fırsatının kaçması:** İptal anı, müşteriyi tutmak için son ve en güçlü andır; indie SaaS'larda bu an tamamen boş geçiyor.
3. **Mevcut çözümlerin erişilmezliği:** Kurumsal araçlar pahalı, demo-call zorunlu, kurulumu ağır.

---

## 4. MVP Kapsamı — CORE (Kesinlikle YAPILACAK)

| # | Özellik | Açıklama | Kabul Kriteri |
|---|---------|----------|---------------|
| C1 | **Embed Widget** | Tek satır `<script>` snippet'i. İptal butonuna `data-cancelkit` attribute'u veya `CancelKit.open()` çağrısı ile modal açılır. Shadow DOM ile stil izolasyonu. | Boş bir HTML sayfasına snippet eklendiğinde akış uçtan uca çalışır; müşteri sitesinin CSS'i widget'ı bozamaz. |
| C2 | **Çıkış Anketi** | Modal 1. adım: hazır iptal nedenleri (varsayılan set: "Çok pahalı", "Kullanmıyorum", "Eksik özellik", "Rakibe geçiyorum", "Teknik sorunlar", "Diğer") + serbest metin alanı. Nedenler dashboard'dan düzenlenebilir. | Seçilen neden + metin `cancel_sessions` tablosuna kaydedilir. |
| C3 | **Kurtarma Teklifleri** | Modal 2. adım: seçilen nedene göre teklif gösterimi. MVP'de 2 teklif tipi: **% indirim (X ay)** ve **abonelik dondurma (X ay)**. Kabul edilirse Stripe API ile anında uygulanır. | Kabul sonrası Stripe'da kupon/pause'un gerçekten uygulandığı doğrulanır; müşteriye başarı ekranı gösterilir. |
| C4 | **Dashboard** | Metrikler: kurtarılan MRR (toplam + aylık), kurtarma oranı, iptal nedenleri dağılım grafiği, oturum listesi (kim, ne zaman, sonuç: saved/churned/abandoned). | Bir cancel session gerçekleştiğinde 1 dk içinde dashboard'a yansır. |
| C5 | **Auth & Onboarding** | Supabase Auth (e-posta magic link + Google). Onboarding sihirbazı: (1) proje oluştur → (2) Stripe restricted API key yapıştır → (3) snippet'i kopyala → (4) test et. | Yeni kullanıcı, kayıttan çalışan widget'a <10 dakikada ulaşır. |
| C6 | **Faturalama (bizim)** | Lemon Squeezy checkout (MoR — vergi/KDV bizde sıfır bürokrasi). 14 gün ücretsiz deneme, kredi kartı istemeden. Webhook ile abonelik durumu senkronu; süresi dolan hesapta widget pasifleşir. | Trial → paid → cancelled yaşam döngüsü uçtan uca çalışır. |

### MVP Kullanıcı Akışı (özet)
```
Kayıt → Proje oluştur → Stripe key bağla → Snippet'i sitene ekle
→ Son müşterin "İptal et"e basar → Anket → Teklif → (Kabul: Stripe'da uygulanır ✓ | Ret: iptale devam)
→ Dashboard'da kurtarılan MRR birikir → 14. gün: Lemon Squeezy ile ödemeye geç
```

---

## 5. Out of Scope — MVP'de KESİNLİKLE OLMAYACAK

Feature creep'e karşı sözleşmemiz. Bunlar **v2+ aday listesi**dir, MVP'ye giremez:

- ❌ Stripe dışı sağlayıcı entegrasyonları (Paddle, Lemon Squeezy, Braintree, Chargebee)
- ❌ Teklif A/B testleri ve akıllı teklif optimizasyonu
- ❌ AI destekli iptal nedeni özetleri / haftalık AI raporu
- ❌ E-posta win-back kampanyaları (iptal sonrası otomasyon)
- ❌ Takım üyeleri, roller ve izinler (tek kullanıcı = tek hesap)
- ❌ Widget'ta beyaz etiket / tam tema özelleştirme (sadece vurgu rengi ayarı var)
- ❌ Çoklu dil desteği (widget ve dashboard yalnızca İngilizce — global pazar hedefi)
- ❌ Mobil SDK (iOS/Android)
- ❌ Zapier, Slack, webhook-out entegrasyonları
- ❌ Detaylı cohort/retention analitiği

---

## 6. Başarı Metrikleri

| Metrik | Hedef (lansman + 90 gün) |
|--------|--------------------------|
| Kurulum süresi (kayıt → çalışan widget) | < 10 dakika (medyan) |
| Müşteri başına kurtarma oranı | ≥ %15 (saved / tüm oturumlar) |
| Ödeme yapan müşteri | 20 (= $580 MRR) |
| Trial → paid dönüşüm | ≥ %25 |
| Aylık churn (bizim) | < %8 |

---

## 7. Gelir Modeli

- **Tek plan:** $29/ay veya $290/yıl (2 ay hediye).
- **Deneme:** 14 gün ücretsiz, kredi kartsız.
- **MoR:** Lemon Squeezy — global vergi/KDV/fatura yükü sıfır.
- Gelecek fiyat kademesi kararları (oturum hacmine göre plan vb.) MVP verisiyle alınacak.

## 8. Pazarlama Stratejisi (Build in Public)

- Ürünün gelişimi X'te günlük/haftalık paylaşılır; "CancelKit kendi cancel flow'unda CancelKit kullanıyor" hikayesi.
- Lansman: Product Hunt + Indie Hackers + r/SaaS.
- SEO temeli: "churn deflection", "cancel flow", "reduce SaaS churn" odaklı landing + blog (MVP sonrası).
- Widget'ın ücretsiz trial'daki "Powered by CancelKit" rozeti viral kanal olarak test edilecek.
