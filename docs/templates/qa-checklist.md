# QA Checklist — {{GAME_TITLE}}

## 1. Functional

- ☐ index.html tarayıcıda hatasız açılıyor
- ☐ Console'da error YOK
- ☐ Tüm scene'ler arası geçiş çalışıyor
- ☐ Player movement responsive
- ☐ Collision detection doğru
- ☐ Score / state doğru güncelleniyor
- ☐ Pause çalışıyor (oyun gerçekten duruyor)
- ☐ Restart / replay çalışıyor
- ☐ Win condition tetiklenebilir
- ☐ Lose condition tetiklenebilir

## 2. Performance

- ☐ 60 FPS (devtools performance tab)
- ☐ Memory leak yok (10 dk oyna, memory artmamalı)
- ☐ İlk yükleme < 3 sn
- ☐ Bundle < 200 KB

## 3. Compliance / Browser

- ☐ Chrome'da çalışıyor
- ☐ Firefox'ta çalışıyor
- ☐ Safari'de çalışıyor
- ☐ Mobile responsive (en az portrait/landscape detect)

## 4. Accessibility (Baseline)

- ☐ Klavye-only oynanabilir
- ☐ Renk-bağımsız bilgi iletimi (icon + renk)
- ☐ Subtitle (varsa dialog)
- ☐ Pause kesintisiz çalışır
- ☐ Text okunabilir contrast (WCAG AA)
- ☐ 3 Hz üzeri flash YOK

## 5. Playtesting (Bartle Profilleri)

### Achiever testi
- ☐ Skor sistemi açık ve motive edici
- ☐ Progress görünür (level, %)
- ☐ Replayable (yüksek skor avı)

### Explorer testi
- ☐ Edge case'ler stabil (sınırlardan dışarı çıkma vb.)
- ☐ Tüm state geçişleri exception-free
- ☐ Map/world boundaries doğru

### Socializer testi (varsa NPC/dialog)
- ☐ Dialog geri-okunabilir
- ☐ Karakter sesi tutarlı

### Killer testi
- ☐ Optimal strategy bulunabilir
- ☐ Speedrun friendly (skip, fast restart)

## 6. UX (Federoff/Nielsen)

- ☐ Tutorial/onboarding var
- ☐ HUD bilgileri her zaman görünür ama dikkat dağıtmıyor
- ☐ Feedback (görsel + işitsel) tüm aksiyonlar için
- ☐ Confirm dialog sadece geri-alınamaz aksiyonlar için
- ☐ Undo / pause / quit kolayca erişilebilir

## 7. Bug List

| # | Severity | Description | Steps to repro | Status |
|---|---|---|---|---|
| 1 | | | | |

Severity: **Critical** (oynanamaz) / **Major** (önemli feature kırık) / **Minor** (kozmetik)

## 8. Verdict

- ☐ Ship-ready
- ☐ Polish gerekli (liste yukarıda)
- ☐ Re-implementation gerekli (critical bug)
