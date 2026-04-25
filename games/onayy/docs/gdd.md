# GDD — Onayyy

## High Concept
Oyunun gerçek aksiyon kısmına ulaşmak için 12 tuzaklı onay ekranını geçmen gerekiyor. Sonra "unfair Mario" tarzı bir side-scroller seviyesi. 5 can.

## 12 Madde

### TIER 1 — Easy (Madde 1-4)
1. **Standart**: ortada "Onayla" butonu
2. **Köşede**: buton ekranın rastgele bir köşesinde, küçük; hover'da büyür
3. **Sahte Kardeşler**: 4 buton aynı görünür, yalnız 1 gerçek (yanlış → reset)
4. **Hareketli**: buton soldan sağa kayıyor; uçarken yakala

### TIER 2 — Medium (Madde 5-8)
5. **CAPTCHA Yıldız**: 3-9 yıldız say, sayıyı yaz + ENTER
6. **Slider Direnen**: 0'dan 100'e çek, ama her saniye -2 düşüyor; hızlı sürükle
7. **Kaçan Buton**: mouse 80px yaklaşınca rastgele teleport
8. **Drag-Drop**: "ONAYLA" kutusunu yeşil hedefe sürükle, kırmızı engele dokunmadan

### TIER 3 — Hard (Madde 9-12)
9. **47 Sayfa Şartname**: tıkla → 1 sayfa, → tut → 1 sn'de 5 sayfa
10. **Hızlı Tıkla**: buton 0.8 sn görünür, 0.5 sn gizli; görünür anda tıkla
11. **Emin Misin Zinciri**: 5 ardışık "Evet" (Hayır → reset), son adımda butonlar yer değiştirir
12. **Reverse Mouse**: cursor X ekseni tersine; "Onayla"yı tıklamak için ters yönde hareket et

## ACTION PHASE — Side-Scroller
- Tek level, ~30 saniye
- Player: sol/sağ hareket, Space ile zıplama
- Engeller: 4-5 spike (sivri), 1-2 düşen platform
- Hedef: bayrağa ulaş
- Çarpışma → 1 can düş, başlangıçtan tekrar
- 5 can, hepsini kaybedersin → GameOver, R ile yeni oyun

## Controls
| Aksiyon | Madde fazı | Aksiyon fazı |
|---|---|---|
| Tıkla / Sürükle | mouse | — |
| 0-9 yaz | CAPTCHA | — |
| ENTER | CAPTCHA gönder | — |
| → tut | sayfa atla | sağa koş |
| ← | — | sola koş |
| SPACE | — | zıpla |
| ESC | pause | pause |
| R | (game over'da) restart | (game over'da) restart |

## Görsel
- **Madde fazı**: corporate dialog box (Win-XP estetik), gri/beyaz palet, mavi title bar
- **Aksiyon fazı**: minimal platformer, koyu lacivert sahne, beyaz player, kırmızı spike, sarı bayrak

## Bartle hedefi
**Explorer** birincil (her madde yeni mekanik), **Killer** ikincil (speedrun)
