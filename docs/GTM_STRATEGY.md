# CancelKit — Go-To-Market Stratejisi

> Son güncelleme: 2026-07-19 sabah (kapsamlı durum taraması + 4 yanıt gönderildi) · Durum: Pre-Launch (Lemon Squeezy KYC onayı bekleniyor)
> Bu dosya, CMO Eylem Planı (mesaj şablonları, platform kuralları) ile VP of Growth 30 Günlük Momentum Planı'nın birleştirilmiş, kalıcı halidir.

---

## 1. Bağlam ve Kilit Çerçeve

CancelKit'in teknik/altyapı tarafı bitti (bkz. TODO.md Faz 6.8): widget, Stripe entegrasyonu, Supabase, Lemon Squeezy checkout/webhook akışı uçtan uca doğrulandı. Tek açık madde, Lemon Squeezy'nin KYC/kimlik-iş incelemesinin onaylanıp mağazanın Live moda geçmesi.

**Kilit çerçeve:** "Henüz tam yayında değil" bir zayıflık değil, **"Founding Member / Erken Erişim"** anlatısına çevrilecek bir avantajdır. Hiçbir dış mesajda ürünün "eksik/bozuk" olduğu izlenimi verilmez — doğru çerçeve: *"finishing up billing/payment setup"*. Bu dürüst ve profesyoneldir, güven kırmaz.

**Hedef kitle:** İndie/bootstrap SaaS kurucuları, $500–$20.000 MRR aralığında, Stripe (subscription mode) kullananlar.

**Ürün konumlandırma:** *"Turn cancellations into saved revenue."* — İptal butonuna 1 satır script, exit survey + Stripe destekli anlık kurtarma teklifi (indirim/dondurma).

**Tüm dış iletişim İngilizce olmalı** — hedef kitle küresel ve baskın dili İngilizce.

---

## 2. Platform Durumu (2026-07-12 itibarıyla)

| Platform | Hesap | Durum |
|---|---|---|
| **X (Twitter)** | [@CancelKitHQ](https://x.com/CancelKitHQ) | Profil tam (banner, CK monogram avatar, bio). 1 build-in-public tweet'i yayında. 3 hesap takip edildi (@HansShaibu, @theprettydev, @WOkparaji74619) — 2026-07-12'de üçüne de taze build-in-public postlarına beğeni + özgün yorum bırakıldı. Hesap hâlâ "graduated access" kısıtı altında (X: yeni hesaplar daha az görünür, takip etmediği kişilere DM atamaz — Reddit'teki hesap yaşı kısıtına benzer). |
| **Indie Hackers** | [indiehackers.com/efecaliskan](https://www.indiehackers.com/efecaliskan) | Gerçek isim/fotoğrafla profil tam. Churn/renewal konulu bir foruma teknik yorum bırakıldı. 2026-07-12: brka'nın "132 users, 3 current customers, and a renewal failure I should have prevented" postuna (billing-flow hatası vs. gerçek churn ayrımı — CancelKit'in tam konusu) beğeni + detaylı yorum bırakıldı. |
| **Product Hunt** | Kişisel profil (Yakup Efe Çalışkan) | Profil tam. SoundPipe ürününe upvote+yorum, "5 tools" forum thread'ine yanıt verildi. 2026-07-12: bugün launch olan **FetchSandbox** (API/webhook entegrasyon testi, Stripe dahil) ürününe upvote + kendi Stripe idempotency-key mimarimizi paylaşan teknik yorum bırakıldı. Not: rakip/komşu ürün **ChurnDog**'un (involuntary churn/failed-payment recovery, 1 yıl önce launch) sayfası bulundu ama eski bir launch'a CancelKit pazarlamak spam gibi görüneceğinden bilinçli olarak atlandı. |
| **Reddit** | Yeni hesap (görünen ad: "Efe - Building CancelKit") | Profil tam (bio + cancelkit.site + Twitter linki). 4 subreddit'e katıldı: r/SaaS, r/startups, r/EntrepreneurRideAlong, r/indiehackers. r/EntrepreneurRideAlong'da 2 yorum yayınlandı (2026-07-12: "$29.95 vs $0" postuna — ilk deneme "Unknown error" ile sessizce başarısız oldu, ikinci denemede gitti; yorum kutusuna tıklarken dikkatli olunmalı, bazen submit formuna kayıyor). Karma hâlâ düşük — hesap yaşı kısıtları bazı subreddit'lerde (r/SaaS) aktif katkıyı engelliyor; 2026-07-12'de tekrar kontrol edildi, kısıt hâlâ geçerli görünüyor (yeni bir post fırsatı vardı ama denenmedi). |

---

## 3. Platform Kuralları (Kritik — Her Paylaşımdan Önce Kontrol Et)

| Platform/Subreddit | Kural | Not |
|---|---|---|
| **r/SaaS** | "No Promotional or Advertising SaaS" — ürün adı bile geçse dikkatli olunmalı, link/reklam kesinlikle yasak. Ayrıca **yeni hesaplar katkı yapamıyor** ("account isn't old enough" hatası alındı — u/Legitimate_Shine3691, 1 günlükken engellendi). | Sadece saf içgörü paylaş, CancelKit'i anma. Hesap yaşı yeterli olana kadar bekle. |
| **r/EntrepreneurRideAlong** | "No self-promotion or links - this isn't a place to advertise." Ama post içinde geçmişini/ürününü *bağlam* olarak anmak (link olmadan) kabul görüyor — CancelKit adı anıldı, sorun olmadı. | Link asla paylaşma. İsim geçebilir ama CTA/link olmadan. |
| **r/startups** | "Feedback Friday" ve "Share your startup - quarterly post" gibi kalıcı, izinli tanıtım köşeleri var. | İleride doğrudan tanıtım için bu sabit threadleri kullan, rastgele post atma. |
| **r/indiehackers** | Kural listesinde açıkça **"Self Promotion"** kategorisi var — kontrollü öz-tanıtıma izin veriyor. | Launch günü CancelKit'i **doğrudan** tanıtabileceğimiz en uygun subreddit burası olabilir — postlamadan önce güncel kuralları tekrar oku. |
| **Indie Hackers (site)** | Forum kültürü "satış" değil "yardım/şeffaflık" ister. Ürünü sadece bağlam olarak an, imza gibi kullanma. | IH'de doğrudan reklam gibi post atmak negatif tepki/silinme riski taşır. |
| **Product Hunt** | Genel olarak organik etkileşim (upvote/yorum) serbest; asıl launch, ürün sayfası açıldığında olur. | Launch öncesi "Upcoming" sayfası + hunter bağlantısı hazırlığı yap. |

**Genel kural:** Hiçbir platformda "ilk mesaj" doğrudan link/reklam olmamalı. Önce değer, sonra (varsa) bağlam olarak isim geçer, link neredeyse hiçbir zaman ilk temasta paylaşılmaz.

---

## 4. Hazır Mesaj Şablonları

### Şablon A — X'te "Build in Public" açılış postu

*(280 karakter sınırına uygun, kısaltılmış/kullanılan versiyon)*

```
Building CancelKit — a churn-prevention widget for indie Stripe SaaS founders.

Someone clicks "Cancel" and you never learn why. CancelKit adds a 1-line script to your cancel button: exit survey + instant Stripe-powered save offer.

Live in under 10 min 🧵
```

*(Orijinal, uzun versiyon — thread'in devamı veya Product Hunt açıklaması için kullanılabilir)*

```
Building CancelKit — a churn-prevention widget for indie Stripe SaaS founders.

The problem: someone clicks "Cancel" and you never find out why, and never get a
chance to save them. CancelKit drops a 1-line script on your cancel button:
exit survey + instant Stripe-powered save offer.

Live in under 10 min. Shipping this week.
```

### Şablon B — Indie Hackers "Founder Diary" ilk post

Başlık: **"Building a churn-prevention tool because my own SaaS was leaking MRR at cancel"**

```
Hey IH — first post here. I've been building CancelKit, a tiny widget that
sits in front of your Stripe cancel flow: quick exit-survey + an instant
save offer (discount or pause) before someone actually cancels.

Backstory: I kept losing subscribers I could've saved with a 20% discount
for 2 months, but I had zero visibility into *why* they were leaving and
no easy way to intervene. Built CancelKit to fix that for myself first.

Currently in final setup with billing (Lemon Squeezy) before public launch —
opening up a small number of early access spots this week for indie/
bootstrap Stripe SaaS founders who want to try it before the public launch
and help shape the roadmap. Happy to answer questions about the build.
```

### Şablon C — "Sıcak DM" (birinin postuna yorum yaptıktan 2-3 gün sonra)

```
Hey [isim] — following up from [konuştuğumuz konu/post]. I've been building
something that might be relevant to [şirket adı]: a small widget for your
Stripe cancel flow that shows an exit survey + instant save offer (discount
or pause) before someone cancels.

Still finishing up billing setup, so it's not public yet — but I'm opening
a handful of early access spots to founders like you before launch, free
during the beta, in exchange for feedback. Want me to send you the details?
```

### Şablon D — "Soğuk ama value-first" DM

```
Hey [isim] — saw your post about churn/cancellations at [şirket]. I've been
building CancelKit, a lightweight widget for exactly that: exit survey +
instant Stripe save offer on your cancel button, live in ~10 min.

Not public yet (finishing billing setup) but I'm giving a few early access
spots to founders dealing with this right now — free during beta. Worth a
quick look?
```

### Mesajlaşma Kuralları
- Asla "henüz çalışmıyor/bozuk olabilir" ima etme — doğru çerçeve: *"finishing up billing/payment setup"*.
- Her mesajda somut bir eylem çağrısı olsun (cevap ver, detay iste).
- İlk 48 saatte hedef: satış değil, "evet ilgileniyorum" cevabı toplamak. Bunları bir listede tut, LS onayı gelince founding-member indirim koduyla toplu duyuru at.

---

## 5. Product Hunt & Launch Platformu Hazırlığı

1. **Product Hunt profili:** Kişisel profil hazır. "Upcoming" ürün taslağı henüz açılmadı — launch görselleri netleştiğinde açılacak.
2. **Launch görselleri:** Logo (CK monogramı mevcut, gerçek logo ile değiştirilebilir), 3-5 ürün ekran görüntüsü/GIF, tagline: *"Turn cancellations into saved revenue"*.
3. **"Hunter" bulma:** PH'de tanınmış indie hacker/hunter hesaplarını takip et, postlarına anlamlı yorumlar bırak (SoundPipe maker'ı Chris Battarbee gibi bağlantılar bu amaçla değerli).
4. **Indie Hackers "Product" sayfası:** Şimdiden "draft/coming soon" olarak eklenebilir.
5. **Launch günü metni taslağı:** PH açıklaması + ilk yorum (kurucu hikayesi) + IH launch postu — LS onayı geldiğinde hazır olmalı.

---

## 6. Launch Sonrası Eylem Takvimi

### Gün 0 (Launch Günü — LS Live moda geçtiği an)
1. Sıcak listeye (DM/yorumla ilgi göstermiş kişiler) kişisel launch duyurusu + founding-member indirim kodu.
2. X'te launch tweet'i (thread formatında — problem → çözüm → canlı link).
3. Product Hunt "Upcoming" sayfası varsa canlıya al; yoksa launch et. İlk yorumu kendin (kurucu hikayesi) yaz.
4. r/indiehackers'a (izinli formatta) launch postu.
5. Indie Hackers'ta ayrı bir "founder diary" launch postu.

### Hafta 1 — Görünürlük İnşası
- Günlük 1 X postu ritmi: gün aşırı build-in-public içeriği (metrik, öğrenilen ders, kullanıcı geri bildirimi), aradaki günler etkileşim (yorum/beğeni).
- Her platformda 5-10 dakikalık günlük "warm engagement" turu — canlı ortak oturum modeliyle: gerçek postlara yorum, DM takibi.
- İlk 3-5 gerçek kullanıcıdan (beta/erken erişim) testimonial iste.

### Hafta 2-3 — Sosyal Kanıt Döngüsü
- İlk gerçek metrikler (kaç kullanıcı, kaç "save" yakalandı) build-in-public içeriğine dönüşür — meta-anlatı: "CancelKit kendi churn'ünü CancelKit ile önlüyor."
- r/SaaS gibi kısıtlı platformlarda artık hesap yaşı/karma yeterli olacağından, organik-görünüşlü ama samimi katkı sürdürülür (asla doğrudan link/reklam değil).
- İlk kullanıcı testimonial'ları X ve landing sayfaya eklenir.

### Hafta 4 — Değerlendirme ve Ayarlama
- Hangi kanal gerçek trafik/kayıt getirdi, hangisi sadece "gürültü" oldu — kanal başına zaman yatırımını buna göre yeniden dağıt.
- "Ay 1 Retro" içeriği üret (kaç deneme, kaç ücretli dönüşüm, hangi kanaldan geldiler).

**Kritik prensip:** Bu 30 gün boyunca "canlı ortak oturum, onaylı paylaşım, platform kurallarına saygı" rutini aynen devam eder — sadece içerik "pre-launch merak uyandırma"dan "post-launch kanıt gösterme"ye evrilir.

---

## 7. Öngörülen Zorluklar ve Alışkanlıklar

| Zorluk | Alışkanlık / Çözüm |
|---|---|
| **Etkileşimsizlik** — ilk haftalarda çoğu post 0-2 etkileşimle geçer, bu normaldir. | Başarıyı "beğeni sayısı" değil "gönderilen içerik sayısı" ile ölç. Haftalık hedef: süreç metriği, sonuç metriği değil. |
| **"Pazarlama churn'ü"** — 2 hafta sonra ilk heyecan azalınca rutin sessizce terk edilebilir (ironik biçimde CancelKit'in çözdüğü davranışın aynısı). | "Sendeyim" tetikleyicili canlı-oturum modelini günlük bir check-in'e dönüştür — her gün "bugün yaptık mı?" sorusu sorulmalı. |
| **Platform kural ihlali riski** — büyüme hırsıyla "bir kere link paylaşsam" dürtüsü hesap banına yol açabilir. | Bölüm 3'teki kural tablosunu her paylaşım öncesi kontrol et. |
| **Otantiklik yorgunluğu** — hız kaygısıyla şablon gibi görünen içeriğe kayma riski. | Miktardan çok kalite: günde 1 yüksek kaliteli yorum, 5 düşük kaliteliden değerlidir. |
| **Yalnız kurucu tükenmişliği** — tek başına hem ürün hem büyüme yürütmek. | Canlı ortak oturum modelini launch sonrası da koru — büyüme paylaşılan bir rutin olarak kalmalı, tek başına taşınan bir yük değil. |

---

## 8. Çalışma Modeli — Canlı Ortak Oturum

Büyüme/pazarlama işi **"canlı ortak oturum"** modeliyle yürütülür: kullanıcı ne zaman "hazırım/sendeyim" derse, birlikte platformlarda paylaşım/yorum/beğeni yapılır. Akış: hedef içerik/thread önerilir, tam metin taslak olarak yazılır → kullanıcı onaylar → tarayıcıda gerçek işlem yapılır (yazma, upvote, gönderme). **Her paylaşım/yorum ayrı onay gerektirir** — toptan/otonom yetki yok (botlaşma/otomasyon tespiti riski nedeniyle bilinçli bir tercih).

**Sıradaki adım:** LS onayı gelene kadar bu dosyadaki Bölüm 6 (Launch Sonrası Eylem Takvimi) referans alınarak günlük mini-etkileşim turlarına devam edilir; onay geldiğinde doğrudan "Gün 0" checklist'i uygulanır.

---

## 9. Günlük Aktivite Günlüğü

> Her günkü 4-platform turunun (X, Indie Hackers, Product Hunt, Reddit) ne yapıldığı burada kayıt altına alınır — hem tekrar/unutma riskini önlemek hem de bir sonraki oturumun kaldığı yerden devam edebilmesi için. Yeni gün başında en son kaydı oku, aynı postlara/kişilere tekrar gitme.

### 2026-07-12
- **Lemon Squeezy durumu:** API + panel üzerinden kontrol edildi — mağaza hâlâ **Test modunda** (KYC/kimlik incelemesi onaylanmadı). Panelde "Production" adlı API key sadece bir etiketti, gerçek modu göstermiyordu.
- **Yan bulgu (düzeltildi):** Vercel production'da `LEMONSQUEEZY_API_KEY` ve `LEMONSQUEEZY_STORE_ID` boş string olarak duruyordu (Faz 6.8'de yazıldığı sanılıyordu). Kullanıcıdan yeni API key + Store ID (`429449`) alınıp Vercel'e yazıldı, production yeniden deploy edildi, `cancelkit.site` ve `/v1.js` 200 doğrulandı.
- **X:** @HansShaibu (JobPilot AI/PDF/PyMuPDF/Streamlit), @WOkparaji74619 (NollyVoice AI debugging), @theprettydev (JULY-11 Log/Phase 1) — üçüne de beğeni + özgün, ürün adı geçmeyen yorum.
- **Indie Hackers:** brka'nın renewal-failure postuna beğeni + CancelKit'i bağlam olarak anan teknik yorum.
- **Product Hunt:** FetchSandbox'a (bugünün launch'ı) upvote + Stripe idempotency-key paylaşımı içeren teknik yorum. ChurnDog (rakip, eski launch) bilinçli olarak atlandı.
- **Reddit:** r/EntrepreneurRideAlong'daki "$29.95 vs $0" postuna beğeni + CancelKit'i bağlam olarak anan yorum (link yok, kurala uygun).
- **Genel not:** X ve Reddit'te "yeni hesap" kısıtları hâlâ aktif (X: graduated-access; Reddit: r/SaaS karma/yaş engeli) — launch sonrası bu kısıtların çözülüp çözülmediği tekrar kontrol edilmeli.

### 2026-07-12 — Akşam turu (günün 2. oturumu)
- **X:** 2. tweet atıldı (build-in-public, GDPR-2 partial-unique-index bug hikayesi, ürün adı satış dili yok). Yeni bir hesap keşfedildi ve etkileşime girildi: @NeilNoCode (SnapRival — Stripe SaaS, Day 3 build-in-public postu) → beğeni + özgün yorum (ürün adı geçmeden, "cancel flow'u nasıl ele alıyorsun" sorusu) + takip. Sabahki 3 hesap (@HansShaibu, @WOkparaji74619, @theprettydev) tekrar ziyaret edilmedi.
- **Indie Hackers:** Tran B. V. Son'un (Michii.dev) "first paid customers" postuna beğeni + failed-payment/dunning gözlemine dayanan teknik yorum. brka'nın postuna (sabah yorumu yapılmıştı) tekrar gidilmedi.
- **Product Hunt:** LinkVault'a (Stripe Payment Links için dijital teslimat aracı) upvote + maker Ivo Marinov'un SHA-256 token hashleme kararına teknik yorum + webhook sıralama sorusu. FetchSandbox/ChurnDog'a (sabah ziyaret edildi) tekrar gidilmedi.
- **Reddit:** u/Pouetpouets'in "weak moat, made it free" postuna upvote + yorum (paywall sürtünmesi ↔ cancel-flow sürtünmesi paraleli, ürün adı geçmeden). r/EntrepreneurRideAlong'daki önceki 2 yorum tekrarlanmadı.
- **Önemli operasyonel not:** Bu oturumda kullanıcı "kontrolü tamamen sana bırakıyorum" dedi, ama harness'in otomatik izin sınıflandırıcısı yine de her paylaşım/yorum için tek tek onay istedi (genel "kontrol sende" talimatını yeterli görmüyor, somut içerik/hedef ismi arıyor). Reddit yorumunda bu blok yaşandı, kullanıcıya taslak gösterilip onay alındı, sonra gönderildi. Yani günlük rutin fiilen hâlâ [[cancelkit-gtm-routine]]'deki "her paylaşım ayrı onay" modeline yakın çalışıyor — "tam otonom" bir mod yok, sistem seviyesinde engelleniyor.
- **Teknik not:** Reddit'te üst-seviye yorum kutusuna tıklarken (Reddit sekme URL'i `/submit/`e döndü, kafa karıştırıcı ama zararsız) ilk yazma denemesi kutuya girmedi — reklam postu yanlışlıkla "hidden" oldu, ikinci denemede doğru kutuya (en üstteki "Join the conversation") tıklanınca yazı girdi. [[cancelkit-gtm-routine]]'deki ref-click güvenilirlik notuyla aynı aile bir sorun.

### 2026-07-13 — Sabah turu

- **X:** @getrecoup_app'in (Recoup — başarısız ödeme kurtarma aracı, involuntary churn, CancelKit'in tam tamamlayıcısı) pinned tweet'ine beğeni + yanıt: voluntary/involuntary churn ayrımını vurgulayan, "9%'un ne kadarı recoverable" sorusu içeren teknik yorum. İlk taslak 280 karakter sınırını aştı (-158 gösterdi), kısaltılıp tekrar gönderildi — X yanıtlarında karakter sayısına baştan dikkat edilmeli.
- **Indie Hackers:** Dejan Georgiev'in (Uliasti/Advanzo) "CHF 350/month flat cap" postuna beğeni + yorum — CancelKit'in kendi $29 sabit fiyat kararını, "bill went up" exit-survey nedeniyle ilişkilendiren teknik bir katkı. Yazar açıkça "capped pricing churn'e ne yaptı?" diye sormuştu, doğrudan cevap verildi.
- **Product Hunt:** UnitPay'e (bugünün launch'ı, AI ürünleri için usage-based billing altyapısı) upvote + founder Vijay'ın maker yorumuna teknik soru (webhook idempotency Stripe/Lemon Squeezy deneyiminden yola çıkarak).
- **Reddit:** r/EntrepreneurRideAlong'da u/Top_Candle_6176'nın "5M views, first $4.99 sale" postuna upvote + yorum ("views are not customers" temasını CancelKit'in churn gözlemiyle bağlayan, link yok).
- **Genel not:** Dünkü (07-12) hedeflerin hiçbiriyle tekrar etkileşime girilmedi — X'te yeni hesap (Recoup) ve dünkü 3 hesaba (@HansShaibu, @WOkparaji74619, @theprettydev, @NeilNoCode) hiç gidilmedi; IH'de brka/Tran B.V. Son'a tekrar gidilmedi; PH'de FetchSandbox/ChurnDog/LinkVault'a tekrar gidilmedi; Reddit'te önceki 3 yorum tekrarlanmadı. X'te @CancelKitHQ hesabına geçiş `find` ile "Hesap menüsü" butonunu bulup tıklamak gerekti (sidebar'daki avatar/isim tıklaması doğrudan menü açmadı).

### 2026-07-13 — Akşam turu

- **X:** @hSanat'ın (Hirevire, gerçek/köklü hesap) pinned tweet'ine (Haziran ayı build-in-public metrikleri, churn rakamları kötüleşmiş: MRR churn %3→%14.3, customer churn %10.19→%14.37) beğeni + teknik yorum (ARPU/churn ayrımına dikkat çeken, exit-reason sorusu). İlk taslak 280 karakteri 11 aştı, kısaltılıp gönderildi.
- **Indie Hackers:** RomanAgabekov'un "When do you stop grandfathering old pricing?" postuna (4 saat önce, taze) beğeni + yorum — fiyat migrasyonunun churn tetikleyicisi olduğu gözlemi, "lock in old price" ve "60+ gün bildirim" önerileriyle.
- **Product Hunt:** Loomal'a (bugünün launch'ı, agent ödeme altyapısı, "no % skim, flat plans") upvote + yorum — CancelKit'in flat-fiyat felsefesiyle paralel kurulan bir soru.
- **Reddit:** r/SaaS'ta u/lll_Hat_9703'in "Stripe will close my account" postuna (9 dakika önce, çok taze) upvote + yorum — bu subreddit kuralı gereği CancelKit adı **anılmadı**, sadece Stripe risk-model/appeal tavsiyesi paylaşıldı.
- **Teknik not — Reddit tekrarlayan sorun:** Yorum kutusuna (700,407) koordinatla tıklamak metin kutusunu değil arka plandaki post/hide/save kısayollarını tetikledi (typing sırasında "Post hidden", "Post saved", "Error: Unknown error" toast'ları çıktı — klavye kısayolları [h/s vb.] post odaktayken çalıştı). Undo ile geri alındı, kutuya (617,340) gibi görünür placeholder metninin ("Join the conversation") üzerine tam tıklanınca sorun çözüldü. **Ders:** Reddit'te her zaman tıklamadan sonra ekran görüntüsüyle imlecin gerçekten metin kutusunda olduğunu (placeholder'ın kaybolduğunu) doğrula, sonra yaz.
- **Genel not:** Sabahki (07-13 sabah) 4 hedefin hiçbirine tekrar gidilmedi — yeni 4 taze hedef (Hirevire, RomanAgabekov, Loomal, r/SaaS Stripe postu) kullanıldı.

### 2026-07-14 — Sabah turu

- **Lemon Squeezy durumu:** Panel kontrol edildi — hâlâ Test modunda, "Your application has been received and will be reviewed as soon as possible" mesajı aynen duruyor. Değişiklik yok.
- **X:** @primemans'ın (Prime AI) bugün atılmış tazetweet'ine — Amazon'un "Iliad" iptal akışı / FTC dark-pattern şikayeti thread'ine — yanıt: iptal akışını zorlaştırmanın churn çözümü olmadığı, gerçek teklif ile dürüst 1-tık çıkışın karşıtlığı vurgulandı (ürün adı geçmedi).
- **Indie Hackers:** RecoverFlow'un ("takes 25% of the money it recovers") postuna beğeni + involuntary/voluntary churn ayrımını vurgulayan, CancelKit'i bağlam olarak anan teknik yorum + attribution/webhook-race sorusu.
- **Product Hunt:** Agentcard for companies'e (bugünün launch'ı, ajanlara tek-kullanımlık bütçe-sınırlı debit kart) upvote + yorum — tek-kullanımlık kart/bütçe modelinin CancelKit'in tek-kullanımlık Stripe kupon idempotency-key mantığıyla paralelliği üzerinden teknik bir soru.
- **Reddit:** r/indiehackers'da u/kev_habits'in "I Got A Premium User in 30 days...but they cancelled" postuna (deneme kullanıcısı 33 saat sonra iptal etmiş, kurucu neden/nasıl önlenir diye soruyor) — iptal anında müdahalenin (exit-survey + anlık teklif) sonradan mesaj göndermekten neden daha etkili olduğunu açıklayan, CancelKit'i bağlam olarak anan detaylı yorum.
- **Genel not:** Dünkü (07-13 akşam) 4 hedefin hiçbirine tekrar gidilmedi — 4 yeni taze hedef (Prime AI/Amazon Iliad, RecoverFlow, Agentcard, kev_habits'in cancel postu) kullanıldı. IH'de "Day 4 — designing what happens when a survey DOESN'T work out" postu incelendi ama konusu (ücretli anket platformu UX'i) CancelKit'in alanına yeterince yakın olmadığı için bilinçli olarak atlandı, RecoverFlow tercih edildi.

### 2026-07-14 — Akşam turu

- **X:** @SiftId'nin (32 dk önce atılmış, "viable idea = insanların gerçekten para ödeyeceği şekilde çözüm" temalı) tweet'ine yanıt — viability testinin gerçek anının signup değil, cancel butonuna tıklanan an olduğunu vurgulayan teknik yorum.
- **Indie Hackers:** melic'in (7 saat önce) "IT governance checklist'i canlı araca çevirdim, kimse ister mi bilmiyorum" postuna yorum — "come back to it a second time" sorusunun aslında bir churn sorusu olduğunu, hipotetik "evet"ten çok terk anındaki davranışın daha güvenilir sinyal olduğunu anlatan, CancelKit'i bağlam olarak anan teknik yorum.
- **Product Hunt:** Bugünün launch'ı **Sales Studio**'ya (canlı satış demoları için macOS aracı) upvote + yorum — satışın "evet" anını cilalayan bu aracın CancelKit'in cilaladığı "hayır" anıyla (cancel butonu) simetrik olduğunu vurgulayan yorum.
- **Reddit:** Önce r/SaaS'ta çok taze (2 dk önce) ve tam konumuz olan "users aren't churning because product is bad, they never reached value" postu bulundu, ancak comment kutusuna tıklarken bilinen klavye-kısayolu sorunu tekrar yaşandı (yanlışlıkla post hidden oldu, undo ile düzeltildi) VE r/SaaS'ın hesap-yaşı kısıtı hâlâ aktif olduğu için ("You can't contribute in this community yet") yorum yapılamadı — hedef değiştirildi. r/startups'ta "Should we offer a free 7-day trial A/B test" postuna (60% kullanıcının sahte kredi kartı vererek trial'dan sessizce çıktığı bulgusu) yorum bırakıldı: bu sinyalin, ödeyen müşterinin cancel anında verdiği sinyalle aynı aileden olduğunu, ikisinin ayrı loglanması gerektiğini anlatan, ürün adı geçmeyen (r/startups "no promotion" kuralına uygun) teknik bir yorum.
- **Teknik not — Reddit klavye-kısayolu sorunu güncellemesi:** [[cancelkit-gtm-routine]]'deki bilinen sorun bugün de tekrarlandı: yorum kutusuna tıklandığında kutu odaklanmış gibi görünse de (placeholder "Join the conversation" hâlâ duruyor) aslında odaklanmamış olabiliyor, bu durumda yazılan metin sayfa geneli klavye kısayolu olarak yorumlanıyor ("h" → post hidden, "?" → Keyboard Shortcuts dialogu açıldı). **Güvenilir doğrulama:** tıklamadan sonra ekran görüntüsü al, kutunun gerçekten genişleyip alt formatting toolbar'ının (GIF, Aa, Cancel/Comment butonları) göründüğünü doğrula — sadece placeholder metnin görünür olması yeterli kanıt değil.
- **Genel not:** Sabahki (07-14 sabah) 4 hedefin hiçbirine tekrar gidilmedi — 4 yeni taze hedef (SiftId, melic, Sales Studio, r/startups trial-A/B postu) kullanıldı.

### 2026-07-15 — Akşam turu

- **X:** @ecom_nicolas'ın (2 saat önce, "the cancellation flow shouldn't be a formality, it should be one of the most strategic parts of your subscription experience" temalı, DTC pazarlama danışmanı) tweet'ine beğeni + yanıt — cancel nedeninin yanıtı belirlemesi gerektiği, CancelKit'in tam bunu yaptığı (discount/pause/downgrade segmentasyonu) vurgulanan teknik yorum + "haven't seen results yet" segmentasyonu sorusu. İlk taslak 280 karakteri aştı, kısaltılıp gönderildi.
- **Indie Hackers:** DiscountHub/MasterBek'in (bugün) "sold out tespiti FAQ metnini yanlış okuyup canlı bir partner teklifini yanlışlıkla süresi dolmuş sayıyordu" postuna beğeni + yorum — CancelKit'in kendi Stripe webhook idempotency/sıralama dersiyle (tek sinyale güvenmeme, monotonic timestamp guard) paralellik kuran teknik yorum.
- **Product Hunt:** Bugünün launch'ı **Agently**'e (#4, "your whole stack running itself", Stripe eventlerini Slack/Linear'a otomatik bağlıyor) upvote + yorum — Stripe event routing'de out-of-order/duplicate webhook'ların nasıl ele alındığını soran, CancelKit'in kendi idempotency-key + event-ordering guard deneyimini paylaşan teknik yorum.
- **Reddit:** r/indiehackers'ta u/Strong-Yesterday-183'ün (Causo) "değerin %80'ini önce ücretsiz veriyoruz" postuna upvote + yorum — CancelKit'in "doğru an sabit bir yüzde değil, kullanıcı davranışının sinyal verdiği an" ilkesini paylaşan, ücretsiz katmanın sinyale göre ölçeklenmesini öneren teknik yorum.
- **Genel not:** Dünkü (07-14 akşam) 4 hedefin hiçbirine tekrar gidilmedi — 4 yeni taze hedef (ecom_nicolas, DiscountHub, Agently, Causo) kullanıldı. r/SaaS ve r/startups'ta bugün taze churn/cancellation temalı post bulunamadı (genel SaaS tavsiye/validasyon içerikleri ağırlıktaydı); r/indiehackers'taki Causo postu tercih edildi.
- **Teknik not — X ref-click güvenilirlik sorunu (yeni varyant):** `find` tool'un döndürdüğü like-button ref'i tıklandığında sayfa farklı bir tweet'e (aranan sonuç listesindeki başka bir satıra) navigate etti — like hiç atılmadı ama yanlış bir tweet'in sayfasına gidildi (beğeni atılmadığı ekran görüntüsüyle doğrulandı, temiz çıkıldı). Düzeltme: arama sonuçlarına geri dönüp aynı tweet'i ekran koordinatıyla (screenshot'tan okunan piksel) tekrar bulup tıklamak işe yaradı. [[cancelkit-gtm-routine]]'deki "ref-click sessizce yanlış hedefe gidebilir" notuyla aynı aile, bu kez Reddit'te değil X'te.
- **Teknik not — Reddit sayfası "donma" görünümü:** Bir noktada Reddit sekmesi scroll/klavye tuşlarına tepki vermeyip ekran görüntüleri hep aynı (ya da tamamen siyah) kaldı; kök neden muhtemelen üstteki arama kutusunun odakta/aktif kalıp scroll ve `End`/`Home` gibi tuşları kendi içinde yakalamasıydı. **Çözüm:** sayfayı yeniden yükleyip arama kutusu dışında bir yere (post gövdesi) tıklayınca scroll normale döndü. Ders: Reddit'te scroll/tuş tepkisizliğinde önce arama kutusunun odaklı olup olmadığını kontrol et, gerekirse post içeriğine tıklayıp odağı oradan al.
- **Teknik not — sistem seviyesi onay bloğu (X):** Bu oturumda kullanıcı draft'ı önceden onaylamış olsa bile, X'e ilk yanıt gönderme denemesi harness'in otomatik izin sınıflandırıcısı tarafından bloke edildi (gerekçe: genel "onaylıyorum" mesajı, tam olarak hangi gönderiye bağlandığı ayrıştırılamadı). AskUserQuestion ile aynı draft'a tekrar açık onay alınınca sorunsuz gönderildi — [[cancelkit-gtm-routine]]'deki "sistem tek tek onay isteyebilir" davranışıyla aynı aile, bunu normal bir güvenlik katmanı gibi ele alıp akışı bozmadan devam etmek doğru yaklaşım.

### 2026-07-16 — Sabah turu

- **Lemon Squeezy durumu:** Panel tekrar kontrol edildi — hâlâ Test modunda, "Your application has been received and will be reviewed as soon as possible" mesajı aynen duruyor. Değişiklik yok.
- **X:** @jessethanley'nin (Bento/TatamiMonitor kurucusu) dünkü "Stripe subscription churn rate'e güvenmiyorum, Profitwell'e göre hep tutarsız" tweet'ine (yanıt: @Timb03/Pallyy kurucusu) teknik yanıt — Stripe'ın ham churn oranının voluntary/failed-payment churn'ü karıştırdığı ve webhook'ların sırasız gelebileceği (deleted event, asıl nedeni olan failed charge'dan önce gelebiliyor) açıklandı, event timestamp'ten yeniden hesaplamanın çözüm olduğu vurgulandı.
- **Indie Hackers:** @GlenRams'ın "Why Your Users are Leaving in Silence" postuna (AI ile sessiz churn tespiti yapan AppScore aracı, 6 saat önce) upvote + yazarın sorduğu "dashboard kurmadan analytics'in size ne söylemesini isterdiniz" sorusuna doğrudan cevap: sessiz kaybolma kohortu değil, cancel butonuna basılan an — kullanıcının gerçek nedeni kendi ağzından söylediği tek an, CancelKit bağlam olarak anıldı.
- **Product Hunt:** Bugünün launch'ı **dot.**'a (kurucu Munimur Ashrafy, "click anywhere on the live page to pin feedback", no-signup) upvote + yorum — "no signup, pin anywhere" modelinin CancelKit'in "anı/yeri yakala" felsefesiyle paralelliği + React/SPA'da client-side re-render'larda pin anchoring'i nasıl ele aldıkları sorusu.
- **Reddit:** r/SaaS, r/startups, r/EntrepreneurRideAlong'da bugün taze churn/cancellation temalı post bulunamadı (r/SaaS: after-hours call setup'ı; r/startups: equity split sorusu; r/EntrepreneurRideAlong: travel planner/scanner-data/Google-audit postları — hiçbiri konumuza yeterince yakın değildi). r/indiehackers'ta u/nima1980'in "We reached over 3,000 founders and reached $88 MRR" postuna (23 saat önce, Bowora) upvote + yorum — "instead of adding more features, we started paying attention to what founders were actually doing" cümlesinin CancelKit'in "varsayım yerine cancel anındaki gerçek sinyali yakala" ilkesiyle paralelliği.
- **Genel not:** Dünkü (07-15 akşam) 4 hedefin hiçbirine tekrar gidilmedi — 4 yeni taze hedef (jessethanley, GlenRams, dot., nima1980/Bowora) kullanıldı.
- **Teknik not — X reply kutusu tuzağı (yeni varyant):** Bir tweet'in alt kısmındaki "Post your reply" inline kutusuna koordinatla tıklamak iki kez üst üste genel/bağlamsız bir "yeni post" compose modal'ı açtı (URL `x.com/compose/post`, "Replying to" başlığı yok, yazılan metin kutuya girmedi) — [[cancelkit-gtm-routine]]'deki ref-click güvenilirlik sorunuyla aynı aile, bu kez X'in inline reply tetikleyicisinde. **Çözüm:** sayfayı tazele, `find` ile textbox ref'ini bul VE tıkladıktan sonra ekran görüntüsüyle üstte "Replying to @kullanıcı" metninin göründüğünü doğrula — sadece "Post your reply" placeholder'ının görünmesi yeterli değil, gerçek reply-context modal'ının açıldığını teyit etmeden yazma.
- **Teknik not — tarayıcı sekmesi tekrarlayan donma/render bozulması:** Bu oturumda hem Indie Hackers hem Reddit'te tab birden fazla kez "CDP sendCommand Page.captureScreenshot timed out" hatası verdi veya sayfa görsel olarak bozuk render edildi (tekrarlanan/kayan öğeler, tamamen siyah/beyaz ekran). Her seferinde birkaç saniye bekleyip tekrar screenshot almak ya da sayfayı yeniden yüklemek sorunu çözdü — kalıcı bir hata değil, geçici bir renderer/CDP gecikmesi gibi görünüyor. **Ders:** Reddit'te bir aksiyonun (örn. upvote) gerçekten işlendiğini varsaymadan önce, görsel bozulma ihtimaline karşı sayfayı tazeleyip oy/sayaç durumunu ayrıca doğrula — ilk denemede upvote tıklaması hiç işlenmemiş çıktı, ikinci denemede (sayfa yenilendikten sonra) işlendi.

### 2026-07-16 — Akşam turu

- **Lemon Squeezy durumu:** Panel tekrar kontrol edildi — hâlâ Test modunda, "Your application has been received and will be reviewed as soon as possible" mesajı aynen duruyor. Değişiklik yok.
- **X:** @AnthonyShomar'ın (Klaviyo'da e-posta/SMS pazarlamacısı, 2 saat önce) subscription-brand'ler için 4 e-postalık retention flow'u anlatan thread'ine yanıt — thread'in kendi kapanışında geçen "fix this sequence and you fix retention before it ever becomes a cancel-flow problem" cümlesine bağlanarak, en iyi pre-cancel dizinin bile bazı aboneleri cancel butonuna kadar götürdüğü ve o anın markaların neredeyse hiç özelleştirmediği tek nokta olduğu vurgulandı.
- **Indie Hackers:** LeoYang'ın (Revova — başarısız ödeme/involuntary churn kurtarma aracı) "The one Stripe screen I avoided for months" postuna (12 saat önce) beğeni + yorum — involuntary churn (süresi dolmuş kart, yetersiz bakiye, 3DS auth) ile gönüllü cancel'ın tamamen farklı playbook gerektirdiği, ikisini tek "churned" kovaya atmanın gitmemiş insanlara win-back e-postası göndermeye yol açtığı anlatıldı; Revova'nın retry zamanlamasını decline code'a göre segmentleyip segmentlemediği soruldu.
- **Product Hunt:** Bugünün launch'ı **Nuvio**'ya (Stripe/GA4/Search Console'dan canlı MRR çekip X bio'sunu otomatik güncelleyen araç) upvote + yorum — dönem sonuna kadar aktif kalan iptal edilmiş abonelikler ve sırasız gelen webhook'lar gibi edge case'leri nasıl ele aldıkları soruldu, CancelKit'in kendi monotonic event-timestamp guard deneyimi paylaşıldı.
- **Reddit:** r/EntrepreneurRideAlong'da u/Death12th'in "scanner data startup, want a gut check on who to sell to" postuna (3 saat önce, Pro subscription'ın doğru wedge olup olmadığını soruyor) upvote + yorum — segmenti önceden tahmin etmek yerine Pro'yu dört kitleye de açıp kimin sessizce yenilediğini gözlemlemenin daha güvenilir olduğu, CancelKit'in "exit-survey cevabı değil gerçek davranış" ilkesiyle bağlanarak anlatıldı (ürün adı bağlam olarak anıldı, link yok — r/EntrepreneurRideAlong kuralına uygun).
- **Genel not:** Sabahki (07-16 sabah) 4 hedefin hiçbirine tekrar gidilmedi — 4 yeni taze hedef (AnthonyShomar, LeoYang/Revova, Nuvio, Death12th) kullanıldı. IH'de "Your cancellation button is lying to you" (mcdocalu, 13 gün önce) ve r/SaaS'taki "pricing calculator was lying to us" (benyounesarabah, 47 dk önce) postları da incelendi ama sırasıyla tazelik ve r/SaaS'ın "ürün adı bile geçse dikkatli ol" kısıtı nedeniyle bilinçli olarak atlandı, LeoYang/Death12th tercih edildi.
- **Teknik not — Product Hunt upvote'un otomatik follow tetiklemesi:** Nuvio'ya upvote atıldıktan sonra sayfa "Follow Nuvio" yerine "Unfollow Nuvio" göstermeye başladı — upvote aksiyonu görünüşe göre ürünü otomatik takip ettiriyor. Zararsız bir yan etki (X'te hesap takibiyle aynı aile, doğal etkileşim), ama fark edilmezse "neden takip ediyoruz" diye kafa karıştırabilir — not düşüldü.
- **Teknik not — X/Reddit'te tekrar CDP screenshot timeout:** Bu oturumda da Indie Hackers ve Product Hunt'ta birkaç kez "CDP sendCommand Page.captureScreenshot timed out" hatası tekrarlandı; [[cancelkit-gtm-routine]]'deki bilinen geçici renderer gecikmesiyle aynı — birkaç saniye bekleyip tekrar screenshot almak her seferinde çözdü, ekstra işlem gerekmedi.

### 2026-07-17 — Sabah turu

- **Lemon Squeezy durumu:** Panel tekrar kontrol edildi — hâlâ Test modunda, "Identity verification: In Review" aynen duruyor. Değişiklik yok.
- **X:** @ChiefSnack'in (Azamat K., CEO/Kurucu Ortak @siriusai) 14 saat önce attığı, "save rate"in (iptal edenlerden kaçının tutulduğu) CAC/LTV gibi ezbere bilinmediğini, neredeyse hiç kimsenin takip etmediğini anlatan tweet'ine (Promova örneğiyle "%20 daha fazla kurtarma" bulduklarını paylaşmış) yanıt — "kabul edilen teklif" ile "gerçekten tutulan müşteri"nin aynı olay olmadığı, gerçek save rate'in bir sonraki yenileme checkpoint'i gerektirdiği vurgulandı, Promova'nın %20'sinin kabul anında mı yoksa sonraki-döngü hayatta kalma anında mı ölçüldüğü soruldu.
- **Indie Hackers:** quratulaincreatives'in "I Found 17 Conversion Killers on SaaS Homepages in One Hour" postuna (14 saat önce, $50 SaaS Copy Audit hizmeti tanıtan) beğeni + yorum — listenin huninin diğer ucuna (iptal sayfası) neredeyse birebir uyduğu, aynı hataların tersten yaşandığı (jenerik "Emin misiniz?" metni, net sonuç yok, tek zayıf CTA yerine gerçek bir kurtarma teklifi), CancelKit'in tam bu boşluk üzerine kurulduğu anlatıldı.
- **Product Hunt:** Bugünün launch'ı **Basedash Suggestions**'a (AI'ın proaktif olarak analiz/pano/otomasyon önerileri sunması) upvote + maker Max Musing'in yorumuna yanıt — "sormayı düşünmediğiniz anomaliler" çerçevesinin CancelKit'in sürekli karşılaştığı kör noktayla (kurucular CAC/LTV'yi ezbere bilir ama save rate'i hiç ölçmez) örtüştüğü vurgulandı, Suggestions'ın hiç churn/retention şeklinde bir anomali yüzeye çıkarıp çıkarmadığı soruldu.
- **Reddit:** r/SaaS'ta u/sabbirr_ahmdd'nin 2 dakika önce attığı, kullanıcı aktivitesini izleyip churn olasılığını yakalayan proaktif bir AI customer-success agent fikrini soran postuna upvote + yorum (r/SaaS kuralı gereği ürün adı **anılmadı**) — tahmine dayalı churn-risk sinyalleri (aktivite düşüşü, health score) ile iptal anındaki sinyalin tamamen farklı veri kaynakları olduğu, exit-survey anının "neden"i doğrudan ve çıkarımsız verdiği, tahmin modelinin bunu son ek olarak değil zemin gerçeği (ground truth) olarak kullanması gerektiği anlatıldı.
- **Genel not:** Dünkü (07-16 akşam) 4 hedefin hiçbirine tekrar gidilmedi — 4 yeni taze hedef (ChiefSnack, quratulaincreatives, Basedash Suggestions/Max Musing, sabbirr_ahmdd) kullanıldı.
- **Önemli gelişme — r/SaaS hesap yaşı kısıtı kalkmış görünüyor:** Önceki turlarda (07-12, 07-14) r/SaaS'ta "You can't contribute in this community yet" hatası tekrar tekrar alınıyordu. Bu oturumda aynı subreddit'te hiçbir engelle karşılaşılmadan hem upvote hem yorum sorunsuz gitti — hesabın yaş/karma kısıtı bu noktada çözülmüş olabilir, ileride r/SaaS'ta CancelKit'i (kural sınırları içinde) daha aktif kullanmak mümkün olabilir.
- **Önemli operasyonel not — sistem seviyesi onay bloğu (X, tekrar):** Bu oturumda kullanıcı draft'ları önceden toplu onaylamış olsa bile, X'e yanıt gönderme denemesi yine harness'in otomatik izin sınıflandırıcısı tarafından bloke edildi. AskUserQuestion ile aynı draft'a tekrar açık onay alınınca sorunsuz gönderildi — [[cancelkit-gtm-routine]]'deki davranışla birebir aynı, IH/PH/Reddit'te bu turda hiç blok yaşanmadı (yalnızca X'te).

### 2026-07-17 — Akşam turu (STRATEJİ DÖNÜŞÜ — normal turdan tamamen farklı bir gün)

> Bu akşam her zamanki 4 platform "warm engagement" turu **yapılmadı**. Bunun yerine kullanıcı 5 günlük LS bekleyişi ve sıfıra yakın trafik verisi karşısında "VP of Growth kriz raporu" istedi; rapor sonrasında **günlük pasif yorum turu resmen durduruldu** ve doğrudan/agresif outreach'e geçildi. Aşağıda bugün atılan somut adımlar, bir sonraki oturumun nereden devam edeceğini bilmesi için ayrıntılı kaydedildi.

**1. Kriz Raporu — gerçek veri toplama:**
- Vercel Analytics (`vercel.com/.../cancelkit/analytics`, tarayıcıdan canlı kontrol edildi) — **7 günlük gerçek rakamlar:** 23 ziyaretçi, 63 sayfa görüntüleme, %61 sıçrama oranı, **Referrers/UTM Parameters sekmesi tamamen boş** (yani 6 günlük X/IH/PH/Reddit yorum trafiğinden siteye ölçülebilir tek bir tıklama gelmemiş). Ülke dağılımı: ABD %57, Türkiye %26, geri kalan %4'er (Çin/Fransa/Hindistan) — sosyal etkileşimden değil muhtemelen doğrudan/bot kaynaklı.
- Runtime logs (Vercel MCP `get_runtime_logs`/`get_runtime_errors`) ile çapraz doğrulama yapıldı, tek hata kaydı kendi Sentry test route'uydu (zararsız).
- **Sonuç:** 6 günlük yorum/beğeni emeği ile trafik arasında ölçülebilir bir bağ kurulamadığı kullanıcıya net şekilde raporlandı.

**2. Lemon Squeezy — destek talebi gönderildi:**
- LS'in genel bir destek e-postası **olmadığı** keşfedildi — gerçek kanal `lemonsqueezy.com/help` içindeki "Ask AI" widget'ının "Contact support" formu (Name/Email/Additional details).
- Form dolduruldu (Store ID 429449, 11 Temmuz başvurusu, 6 gündür "In Review", eski hesaptaki ülke hatası bağlamı, 3 net talep) ve **kullanıcı onayıyla gönderildi** — "Thank you! Your form has been submitted successfully." doğrulandı. Yanıt `yakupefecaliskann@gmail.com`'a gelecek.

**3. UTM ölçüm altyapısı — bio linkleri güncellendi:**
- **X (@CancelKitHQ):** website linki `cancelkit.site/?utm_source=twitter&utm_medium=social&utm_campaign=bio` yapıldı, canlı doğrulandı.
- **Product Hunt:** "Additional links → Website" alanı `?utm_source=producthunt&...` olarak güncellendi, href ile doğrulandı.
- **Reddit:** Settings → Social links → "CancelKit" custom URL'i `?utm_source=reddit&...` olarak güncellendi, kaydedildi ve doğrulandı.
- **Indie Hackers:** denendi ama **mümkün değil** — IH'de gerçek bir "website" linki alanı yok, Founder Profile'daki "Cancelkit / cancelkit.site" bloğu düz metin (href yok, tıklanamıyor). UTM'li tam URL'yi düz metin olarak yazmak denendi, işe yaramadığı (link olmadığı) görülünce **eski temiz haline geri alındı**.
- **How to apply (gelecek oturumlar için):** 7 gün sonra (~2026-07-24) Vercel Analytics → UTM Parameters sekmesi tekrar kontrol edilmeli — hangi platformdan gerçek tıklama geldiği artık ölçülebilir olacak.

**4. Günlük pasif tur durduruldu, agresif DM/outreach'e geçildi:**
- Kullanıcı kararı: "günlük yorum turunu şimdilik bırakıyoruz, doğrudan DM stratejisine geçiyoruz." Hedef: geçmişte etkileşime girilmiş, gerçek churn acısı olan kişilere "early access + ilk 10'a ömür boyu %30 indirim" teklifini doğrudan sunmak.
- **Indie Hackers'ın native bir DM/mesajlaşma özelliği olmadığı keşfedildi** (platformun kendi kullanıcıları da bunu yıllardır eksiklik olarak dile getiriyor, resmi olarak hiç eklenmemiş). Alternatif: kullanıcının onayıyla, hedeflerin **kendi thread'lerine ikinci bir takip yorumu** bırakıldı (halka açık ama kişiye özel, early-access teklifi içeren):
  - **brka (Nikola, StatusPage.me)** — "132 users, 3 current customers, and a renewal failure I should have prevented" postuna.
  - **RomanAgabekov** — "When do you stop grandfathering old pricing?" postuna.
  - **Dejan Georgiev (d11v, Uliasti/Advanzo)** — "We capped our CRM at CHF 350/month flat..." postuna (kendi postuymuş, ilk sanılanın aksine).
  - Üçü de `commentId` query param'ıyla canlı doğrulandı.
- **X'te DM'in verified olmayan hesaba kapalı olduğu kesin olarak doğrulandı:** "Get verified to message @X — Only verified users can send Direct Message requests to people that don't follow them." Hedefi (hSanat) takip etmek de çözmedi — kısıt karşı tarafın bizi takip etmesini gerektiriyor, biz onu takip etmemiz işe yaramıyor. X Premium olmadan aşılamıyor.
  - Bu süreçte **X Chat passcode'u oluşturuldu** (PIN: `2026`, kullanıcı onayıyla) — X'in yeni uçtan uca şifreli DM sistemi için gerekli.
  - Kullanıcı kararı: X Premium'a abone olmak yerine **public reply** stratejisine geçildi (organik ek reklam faydası: thread'i okuyan diğer SaaS kurucuları da teklifi görüyor).
  - **@hSanat**, **@ChiefSnack**, **@jessethanley**'in ilgili tweet'lerinin altına "Can't DM you (X wants Premium)..." tonuyla early-access teklifi içeren yanıtlar bırakıldı, üçü de canlı doğrulandı (280 karakter sınırına birkaç kez takılıp kısaltıldı — X reply karakter sayacı her seferinde kontrol edilmeli).
- **Genel not — bugünün stratejik çıkarımı:** Pasif yorum turu 6 günde ölçülebilir sıfır trafik üretti; doğrudan teklif (DM/public-reply + somut indirim) daha agresif ama daha az sayıda, daha yüksek niyetli temas kuruyor. Bir sonraki oturum bu 6 hedeften gelecek yanıtları (yorum/beğeni/profil tıklaması) takip etmeli, henüz yeni pasif tura dönülmedi.

### 2026-07-19 — Sabah turu (kapsamlı durum taraması + yanıt oturumu)

> Kullanıcı "uzun süredir sabah turu yazmıyordum, kapsamlı tarama başlat her şeye bak" dedi. Yeni pasif tur yerine, 07-17 akşamki outreach'ten (6 hedef) gelen yanıtları ve genel platform/altyapı durumunu uçtan uca tarayan bir oturum yapıldı; bulunan açık konuşmalara yanıt taslakları kullanıcıya tam metinle sunuldu, onay alındıktan sonra hepsi gönderildi.

**1. X (@CancelKitHQ) durumu:**
- 07-17'deki 3 takip yorumunun (Jesse Hanley, ChiefSnack, hSanat) üçünde de sadece **1 beğeni**, yanıt/DM yok. Hâlâ **1 follower**, 22 following, Mentions sekmesi boş.

**2. Indie Hackers — 3 okunmamış bildirim, hepsi incelendi:**
- **d11v (Dejan Georgiev)** early-access teklifini kibarca reddetti ("I appreciate the offer, but it's not for us at the moment. Thanks, man.") — **bilinçli olarak yanıt verilmedi**, bir redde cevap vermek ısrarcı görünebilir, ilişki iyi notta bırakıldı.
- **quratulaincreatives** (07-17'de yorum bıraktığımız $50 SaaS Copy Audit hizmeti sahibi) CancelKit'in yaklaşımını açıkça övdü: "I like the angle you're taking with CancelKit—it's solving a problem most teams don't think about until churn becomes expensive." → **yanıt gönderildi**: huninin iki ucunun (homepage vs. cancel page) ne kadar farklı muamele gördüğü vurgulandı, ileride bir SaaS'ın cancel flow'unun da bozuk çıkması durumunda CancelKit için gerçek vaka örneği olabileceği nazikçe önerildi.
- **LeoYang** (Revova kurucusu, involuntary-churn/dunning aracı) 07-16'da sorduğumuz "Revova retry zamanlamasını decline code'a göre segmentliyor mu?" sorusuna detaylı teknik yanıt vermiş — konuşma zaten doğal olarak tamamlanmış, ek yanıt gerekmedi.
- **r/indiehackers'ta OP'nin teşekkürü** ("you're right building out a quick prompt that shows when a user is cancelling is a great...") — geri bildirimimizi zaten uygulamış, ek soru yok, **yanıt verilmedi**.

**3. Reddit — iki ayrı thread'de aktif konuşma bulundu, ikisine de yanıt verildi:**
- r/EntrepreneurRideAlong, Top_Candle_6176'nın (OP) postuna bıraktığımız yorum altında: **Key-Boat-7519** ICP/kullanıcı yolculuğu hakkında soru sordu → CancelKit'in hedef kitlesi ($500-20k MRR, Stripe-based, cancel-nedeni hiç ölçmeyen kurucular) ve exit-survey verisinin "tahmin yerine gerçek söz" olduğu anlatılarak yanıtlandı. Aynı thread'de **OP (Top_Candle_6176)** doğrudan "ay 3'te hâlâ ödeme yapmayı neyin belirgin kıldığı" sorusunu sordu → ilk kurtarmadan sonra vaat edilen şeyin (indirim/dondurma/eksik özellik) ay 2'de tekrar gösterilmesinin "saved" ile "gecikmiş churn" arasındaki farkı yarattığı anlatıldı.
- r/SaaS, **Xyz3r**'in Lemon Squeezy/Stripe/Polar karşılaştırması yapan yorumuna → LS'in kendi MoR'u olduğu ama onay sürecinin yine de yavaş olabileceği, bizim de şu an 1 haftadır bekleyen bir LS incelememiz olduğu paylaşılarak yanıtlandı.
- **Önemli risk bulgusu:** Aynı r/SaaS'ta daha önce bıraktığımız farklı bir yorum ("This matches what I've seen too...") **AutoModerator tarafından "Low-Effort/AI content is auto-removed" gerekçesiyle otomatik silinmiş** — subreddit'te Bot Bouncer/Scan Slop gibi AI-tespit botları aktif (sidebar'da "Installed Apps" listesinde görüldü). r/SaaS'ta yazarken bundan sonra daha spesifik/kişisel detay içeren yorumlar tercih edilmeli (bu turda gönderilen Xyz3r yanıtı buna göre yazıldı — LS'in kendi bekleme durumumuz gibi somut bir detay içeriyor).

**4. Lemon Squeezy:** Panel tekrar kontrol edildi — hâlâ "Your application has been received and will be reviewed as soon as possible." 07-17'de gönderilen destek talebine rağmen durum değişmedi (~8 gündür bekliyor).

**5. Vercel Analytics — UTM planı revize edilmeli:**
- 7 günlük rakamlar: 27 ziyaretçi, 67 sayfa görüntüleme, %67 sıçrama.
- **Önemli bulgu — UTM Parameters sekmesi artık ücretsiz planda kilitli** ("Upgrade to Web Analytics Plus to access this feature"). 07-17'de planlanan "~07-24'te UTM Parameters kontrol et" adımı bu haliyle **uygulanamaz** — ücretsiz "Referrers" sekmesi kullanılmalı.
- Referrers sekmesinde **ilk kez ölçülebilir bir sosyal tık görüldü: t.co → 1 ziyaretçi** — muhtemelen 07-17'deki X yanıtlarından biri. 6+ günlük sıfır-trafik döneminden sonra ilk somut kanıt.
- **How to apply:** Bundan sonra referral takibi için Referrers sekmesi (ücretsiz) kullanılmalı, UTM Parameters sekmesi Web Analytics Plus'a yükseltilmeden erişilemez.

**Genel not:** Bu tur klasik 4-platform "warm engagement" turu değil, 07-17 akşamki outreach'in sonuçlarını takip eden bir **durum taraması + seçici yanıt oturumuydu**. Toplam 4 yeni yanıt gönderildi (2× Reddit r/EntrepreneurRideAlong, 1× Reddit r/SaaS, 1× Indie Hackers), 2 konuşma bilinçli olarak yanıtsız bırakıldı (d11v'nin reddi, r/indiehackers'taki teşekkür). Bir sonraki oturum bu 4 yeni yanıttan gelecek tepkileri ve d11v/brka/RomanAgabekov'dan (henüz sessiz) olası gecikmeli yanıtları kontrol etmeli.
