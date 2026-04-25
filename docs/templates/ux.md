# UX Spec — {{GAME_TITLE}}

> ux-designer ajanı bu template'i doldurur. Federoff/Nielsen heuristics referansıyla.

## 1. Input Scheme

| Aksiyon | Primary | Secondary | Notes |
|---|---|---|---|
| Hareket | {{}} | {{}} | continuous / discrete |
| Aksiyon | {{}} | {{}} | tap / hold |
| Pause | ESC | — | always works |
| Restart | R | — | game over'da aktif |

## 2. Screen Flow

```
[Title] → [Main] → [GameOver] → [Main]
            ↑          ↓
         [Pause]    [Restart]
```

## 3. Onboarding Strategy
- Tutorial popup'ı yok / minimal
- {{Mekanikler organic tanıtılır — ilk düşman zayıf, ilk pickup yakın}}

## 4. HUD Pattern
- Sol üst: {{Skor}}
- Sağ üst: {{Süre / Can}}
- Pause overlay: ESC ile

## 5. Federoff/Nielsen Heuristics Compliance

- ☐ HUD bilgileri her zaman görünür
- ☐ Critical action'lar görsel + işitsel feedback
- ☐ Pause her durumda çalışır
- ☐ Restart 1 tıkla erişilebilir
- ☐ Confirm dialog SADECE geri-alınamaz aksiyon için
- ☐ Tüm metin okunabilir kontrastta (WCAG AA, 4.5:1)
- ☐ Renk-bağımsız bilgi iletimi
- ☐ Tutorial yeniden görülebilir / skipable
- ☐ Predictable: aynı input → aynı sonuç

## 6. Game Feel Microdetails
- Cursor / hover state'leri
- Button click feedback (visual + audio)
- Death → respawn timing (2-3 sn soluklanma)

## 7. Accessibility Baseline
- Klavye-only oynanabilir mi: {{evet/kısmen/hayır + alternatif}}
- Colorblind-safe palet: {{evet/hayır}}
- Text scaling: {{plan}}
