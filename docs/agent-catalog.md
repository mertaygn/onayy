# Agent Catalog — Genre-Aware Dispatch

> Producer hangi brief türü için hangi ajanları çağırmalı.
> Adaptive dispatch — "core 16" yerine genre'a uygun subset.

## CORE (her brief'te)
Hangi tür olursa olsun mutlaka çağrılır:

- `prod-producer` (orkestratör)
- `prod-game-director` (scope)
- `exec-creative-director` (vision)
- `design-lead` (GDD)
- `art-director` (art bible)
- `audio-director` (audio brief)
- `ux-designer` (input + flow)
- `eng-lead` (iskelet)
- `eng-gameplay` (mekanikler)
- `art-2d-sprite` (sprite kodu)
- `audio-sound-designer` (SFX kodu)
- `eng-ui` (HUD, menüler)
- `qa-lead` → `qa-functional` (browser test) → paralel `qa-playtester`, `qa-accessibility`, `qa-performance`
- `marketing-store` (store metni)
- `ops-cayci` (atmosfer notu — opsiyonel)

## GENRE EKLENTİLERİ

### Story-driven / Narrative (RPG, adventure, visual novel, walking sim)
- `+ design-narrative` (story bible)
- `+ design-writer` (copy, dialog)
- `+ audio-composer` (BGM önemli)
- `+ art-character` (karakter art)

### Action / Combat (shooter, beat-em-up, brawler, action-RPG)
- `+ design-combat` (hit-feel, telegraphing, counter-play)
- `+ art-vfx` (hit particle, screen shake)
- `+ eng-ai` (düşman behavior)
- `+ art-animator` (combat anim)

### Puzzle / Mind games
- `+ design-systems` (puzzle logic, formal model)
- `+ design-progression` (zorluk curve)

### Multi-level / Progression-heavy (platformer, metroidvania, RPG)
- `+ design-progression` (level curve)
- `+ design-level` (level-by-level beats)
- `+ art-environment` (zengin background varyasyonu)

### Economy / F2P / Live-ops
- `+ design-economy` (source/sink, drop rate)
- `+ liveops-manager` (post-launch plan)
- `+ liveops-analyst` (KPI dashboard)

### 3D
- `+ art-3d-modeler` (Three.js primitives)
- `+ art-texture` (material maps)
- `+ eng-engine` (Three.js setup)
- `+ eng-graphics` (shader, lighting)

### Karmaşık fizik (vehicle sim, rope-physics, soft-body)
- `+ eng-physics` (Matter.js geçişi, joint setup)

### Multiplayer / Network
- `+ eng-network` (sync, latency)

### IP riskli brief (referans/parodi/omaj)
- `+ ops-legal` (telif risk taraması, omaj kararı)

### Çoklu dil
- `+ ops-localization` (i18n tablosu, EN baseline)

### Ses-yoğun (rhythm game, music game)
- `+ audio-composer` (orijinal müzik)
- `+ audio-foley` (ambient ses)

## Brief Tipi → Genre Detection

Producer brief'i alır almaz şu sınıflandırmayı yapar:

| Brief'teki kelime | Genre |
|---|---|
| zombi, savaş, döv, vur, shooter, FPS | Action |
| platform, zıpla, koş, runner | Action + Multi-level |
| bulmaca, puzzle, eşleştir | Puzzle |
| hikâye, anlat, macera, yolculuk | Narrative |
| RPG, level up, karakter geliştir | Narrative + Multi-level + Progression |
| 3D, küp, voxel | 3D |
| online, çok oyunculu, multiplayer | Network |
| benzeri / gibi / [game URL] | IP riskli — ops-legal'i ekle |
| satranç, strateji | Puzzle + Systems |
| ritm, müzik, dans | Audio-yoğun |

Birden fazla eşleşme → birleşik subset.

## On-Demand (sadece blocker durumunda)

- `exec-ceo`, `exec-cto`, `exec-coo` — stratejik karar gerekirse
- `prod-executive-producer` — multi-proje veya scope krizi
- `prod-project-manager` — pipeline tıkanırsa
- `marketing-director`, `marketing-pr`, `marketing-trailer` — büyük launch hazırlığı
- `marketing-community` — release notes gerekirse
- `ops-hr`, `ops-finance`, `ops-office` — meta sorular
- `ui-designer`, `ui-artist` — özel UI gerekirse (default eng-ui yeter)
- `eng-tools`, `eng-build` — özel tooling/optimizasyon
- `liveops-support` — destek SSS gerekirse
- `qa-compliance`, `qa-localization` — özel uyum kontrolü

## Disipline Kuralları

1. **Producer her brief için minimum ~16 ajan, maksimum ~24 ajan** dispatch eder. Aşırı dispatch performans sorunu.
2. **Eklenti ajanları sadece genre eşleşmesinde** çağrılır. "Belki lazım olur" diye ekleme.
3. **On-demand ajanlar default'ta sessizdir**. Sadece blocker varsa çağrılır.
4. **Paralel dispatch tercihen tek mesajda** (concept wave 6-8 ajan), serial sadece file-conflict riskinde (eng-lead → diğer eng'ler).
