# Game Design Document — {{GAME_TITLE}}

> Bu doküman canlıdır. GDD bir kontrat değil, bir iletişim aracıdır.

## 1. High Concept

**Pitch (1 cümle)**: {{Tek cümlelik özet}}

**Tagline**: {{Tagline}}

**Tür**: {{Genre — örn. arcade runner, puzzle, top-down shooter}}

**Platform**: Web (Phaser 3, tarayıcı)

**Target audience**: {{Kim oynayacak — yaş, ilgi, oyun deneyimi}}

**Bartle profile**: {{Achiever / Explorer / Socializer / Killer — birincil ve ikincil}}

## 2. Pillars (3-5 madde)

Tasarım kararları bu pillar'lardan birine hizmet etmeli:

1. **{{Pillar 1}}** — {{açıklama}}
2. **{{Pillar 2}}**
3. **{{Pillar 3}}**

## 3. MDA Specification

### Aesthetics (hedef duygu)
LeBlanc 8'inden hedeflenenler: {{örn. Challenge, Sensation}}

### Dynamics (oluşması beklenen davranış)
{{Mekaniklerin ne tür oyuncu davranışına yol açmasını bekliyoruz}}

### Mechanics (kurallar / aksiyonlar)
- **Player actions**: {{move, jump, shoot, vb.}}
- **Game rules**: {{kazanma/kaybetme koşulu, zaman limiti}}
- **Systems**: {{score, lives, health, ekonomi}}

## 4. Core Loops

### Micro (saniye-saniye)
{{örn. dodge → shoot → reload}}

### Meta (dakika-dakika)
{{örn. wave clear → upgrade → next wave}}

### Macro (oturum-oturum)
{{örn. run → unlock → harder run}}

## 5. Story / Narrative (varsa)

**Setting**: {{nerede, ne zaman}}
**Protagonist**: {{karakter}}
**Antagonist / Conflict**: {{çatışma}}
**Tone**: {{dark / lighthearted / epic / cozy}}

## 6. Controls

| Aksiyon | Tuş |
|---|---|
| Hareket | {{Arrow keys / WASD}} |
| Zıpla | {{Space}} |
| Aksiyon | {{X}} |
| Pause | {{Esc}} |

## 7. Levels / Content Plan

- {{Level 1: tutorial — onboarding}}
- {{Level 2: ...}}
- {{Boss / final}}

Vertical slice: {{hangi tek level full quality}}

## 8. UI / HUD

- {{Health gösterimi}}
- {{Skor / progress}}
- {{Pause menüsü}}
- {{Game over / win screen}}

## 9. Art Direction

Detaylı: `art-bible.md`. Özet: {{stil — pixel / vector / hand-drawn / minimalist}}

## 10. Audio Direction

Detaylı: `audio.md`. Özet: {{ton — chiptune / ambient / orkestrasyonel}}

## 11. Win/Lose Conditions

- **Win**: {{tüm level'lar bitti / boss yenildi / hedef puan}}
- **Lose**: {{can sıfırlandı / zaman bitti}}
- **Restart flow**: {{game over → retry / main menu}}

## 12. Accessibility (Baseline)

- ☐ Remappable controls
- ☐ Colorblind palette
- ☐ Pause her zaman çalışır
- ☐ Difficulty options (varsa)
- ☐ Visual cue paralel audio cue
- ☐ %200'e kadar text scaling

## 13. Technical Notes

- **Engine**: Phaser 3.80+ via CDN
- **Resolution**: {{800x600 / 1280x720}}
- **Target FPS**: 60
- **Bundle budget**: < 200 KB

## 14. Risks / Open Questions

- {{Belirsizlik}}
- {{Risk}}
