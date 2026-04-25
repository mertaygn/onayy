# AI Oyun Geliştirme Ajansı

Çok-ajanlı oyun stüdyosu. Kullanıcı **bir cümlelik brief** verir, ajans çalışan + browser-test edilmiş bir oyunu üretir.

## ⚡ Brief Alma Protokolü

Kullanıcı bir oyun brief'i verdiğinde (örn. "zombi koşu oyunu", "düşen meyveler", "uzay satrancı"):

1. **HEMEN** `Agent` aracıyla `prod-producer` subagent'ını çağır (`subagent_type: "prod-producer"`).
2. Brief'i kelimesi kelimesine ilet.
3. Producer pipeline'ı yönetir → manifest tutar → genre'a göre adaptive dispatch yapar → browser test'leri çalıştırır → teslim eder.
4. Producer'ın final mesajını kullanıcıya ilet.

**Sen oyunu yapmazsın. Producer'a delege ediyorsun.**

## Pipeline (özet)

`prod-producer` 8 adımlı pipeline yönetir:
1. Intake (manifest oluştur, slug'a göre klasör aç)
2. Genre detection + adaptive dispatch planı (`docs/agent-catalog.md`)
3. Concept wave (paralel ajan dispatch)
4. Concept review (tutarlılık check, manifest gate)
5. Implementation (eng-lead serial → diğer eng/art/audio paralel → eng-ui serial)
6. QA wave (puppeteer-zorunlu — `qa-lead` orkestre eder)
7. Ship (marketing-store, final syntax check)
8. Teslim raporu

## Referanslar

| Doküman | İçerik |
|---|---|
| `docs/research/frameworks.md` | MDA · Schell · Bartle · Flow · Federoff |
| `docs/research/pipelines.md` | Production milestones, ajansa-özel pipeline |
| `docs/research/tech-stack.md` | Phaser 3 API + prosedürel asset üretim |
| `docs/research/accessibility.md` | WCAG/CVAA baseline |
| `docs/templates/gdd.md` | Game Design Document iskeleti |
| `docs/templates/art-bible.md` | Görsel stil rehberi |
| `docs/templates/audio.md` | Web Audio SFX brief |
| `docs/templates/ux.md` | UX spec |
| `docs/templates/manifest.md` | Pipeline state tracking |
| `docs/templates/browser-test.js` | Puppeteer test scaffold |
| `docs/agent-catalog.md` | **Genre → ajan dispatch tablosu** |

## Tech Stack

- **Phaser 3** via CDN (`https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js`)
- Build adımı YOK · tek `index.html` + `game.js`
- Web Audio API ile prosedürel SFX
- Phaser Graphics API ile prosedürel sprite
- `eng-lead` her oyunda `window.__game = new Phaser.Game(config);` yazar (test için zorunlu)

3D gerekirse Three.js. Default Phaser.

## Çıktı

```
games/<slug>/
├── MANIFEST.md       # Pipeline state
├── index.html        # Tarayıcıda aç → oyun çalışır
├── game.js           # Tek dosya
└── docs/
    ├── brief.md, scope.md, vision.md, gdd.md
    ├── art-bible.md, audio.md, ux.md
    ├── sprites.md, sfx.md (production assets)
    ├── qa-report.md + qa/{functional,playtest,accessibility,performance}.md
    └── store.md
```

Test scriptleri `_test/run-<slug>.js`, screenshot'lar `_test/screenshot-<slug>-*.png`.

## Ajansın Yapısı (64 ajan)

Adaptive dispatch — her brief'te aktif olan **16-24 ajan**, geri kalan on-demand.

| Katman | Ön ek | Roller |
|---|---|---|
| Yürütme | `exec-` | CEO · CTO · COO · Creative Director |
| Prodüksiyon | `prod-` | Game Director · Producer · Exec Producer · PM |
| Tasarım | `design-` | Lead · Systems · Combat · Economy · Progression · Level · Narrative · Writer |
| UX/UI | `ux-`, `ui-` | UX · UI Designer · UI Artist |
| Sanat | `art-` | Director · Concept · Character · Environment · 2D · 3D · Texture · Animator · VFX · Technical |
| Ses | `audio-` | Director · Composer · Sound Designer · Foley |
| Mühendislik | `eng-` | Lead · Gameplay · Engine · Graphics · AI · Physics · Network · UI · Tools · Build |
| QA | `qa-` | Lead · Functional · Performance · Compliance · Localization · Playtester · Accessibility |
| Pazarlama | `marketing-` | Director · Community · PR · Trailer · Store |
| Operasyon | `ops-` | HR · Finance · Legal · Office · Localization · Çaycı |
| Live Ops | `liveops-` | Manager · Analyst · Support |

Hangi brief hangi ajanları çağırır → `docs/agent-catalog.md`.

## Felsefe

- Vertical slice mentalitesi — 1 mekanik, polished, oynanır
- Brief 1 cümle, oyun 1 oturumda
- Browser-tabanlı test zorunlu (statik analiz tek başına yeterli değil)
- Akademik temel (MDA / Schell / Bartle / Flow / Federoff)
- Türkçe-öncelik, EN baseline opsiyonel
