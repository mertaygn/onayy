# MANIFEST — {{Game Title}}

> Pipeline'ın canlı durum tablosu. Her ajan kendi adımını tamamlayınca buradaki satırı günceller.
> Producer her dispatch'ten sonra okur, eksik bağımlılığı tespit eder.

## Pipeline State

**Aşama**: ☐ INTAKE · ☐ CONCEPT · ☐ IMPLEMENTATION · ☐ QA · ☐ POLISH · ☐ SHIP

## Brief
- **Slug**: `{{slug}}`
- **Brief**: {{tek-cümle}}
- **Genre**: {{game-director belirler}}
- **Bartle target**: {{design-lead belirler}}

## Deliverables — kim ne yazdı?

| Dosya | Sahip | Durum | Bağımlı olduğu |
|---|---|---|---|
| `docs/brief.md` | prod-producer | ☐ | — |
| `docs/scope.md` | prod-game-director | ☐ | brief |
| `docs/vision.md` | exec-creative-director | ☐ | brief |
| `docs/legal-note.md` (varsa) | ops-legal | ☐ | brief |
| `docs/gdd.md` | design-lead | ☐ | brief, scope, vision |
| `docs/narrative.md` (varsa) | design-narrative | ☐ | gdd |
| `docs/level-design.md` (varsa) | design-level | ☐ | gdd |
| `docs/copy.md` (varsa) | design-writer | ☐ | gdd, narrative |
| `docs/art-bible.md` | art-director | ☐ | gdd, vision |
| `docs/concept.md` (varsa) | art-concept | ☐ | art-bible |
| `docs/sprites.md` | art-2d-sprite | ☐ | concept, art-bible |
| `docs/animations.md` (varsa) | art-animator | ☐ | sprites |
| `docs/vfx.md` (varsa) | art-vfx | ☐ | art-bible |
| `docs/audio.md` | audio-director | ☐ | gdd, vision |
| `docs/sfx.md` | audio-sound-designer | ☐ | audio.md |
| `docs/music.md` (varsa) | audio-composer | ☐ | audio.md |
| `docs/ux.md` | ux-designer | ☐ | gdd |
| `docs/ui-spec.md` (varsa) | ui-designer | ☐ | ux |
| `docs/ui-art.md` (varsa) | ui-artist | ☐ | ui-spec, art-bible |
| `index.html` | eng-lead | ☐ | gdd |
| `game.js` (iskelet) | eng-lead | ☐ | gdd |
| `game.js` (gameplay) | eng-gameplay | ☐ | iskelet, sprites, sfx |
| `game.js` (UI) | eng-ui | ☐ | iskelet, ui-spec, copy |
| `game.js` (AI) (varsa) | eng-ai | ☐ | iskelet, gdd |
| `game.js` (physics tuning) (varsa) | eng-physics | ☐ | iskelet |
| `_test/run-{{slug}}.js` | qa-functional | ☐ | game.js complete |
| `docs/qa/functional.md` | qa-functional | ☐ | test çıktısı |
| `docs/qa/playtest.md` | qa-playtester | ☐ | game.js complete |
| `docs/qa/accessibility.md` | qa-accessibility | ☐ | game.js complete |
| `docs/qa/performance.md` | qa-performance | ☐ | game.js complete |
| `docs/qa-report.md` | qa-lead | ☐ | yukarıdaki 4 |
| `docs/store.md` | marketing-store | ☐ | gdd, qa-report |
| `docs/cayci-note.md` (opsiyonel) | ops-cayci | ☐ | brief |

## Quality Gates

- ☐ **Concept Gate**: gdd.md, art-bible.md, audio.md, ux.md ALL hazır → Implementation başlayabilir
- ☐ **Implementation Gate**: game.js syntax temiz + sprites/sfx entegre → QA başlayabilir
- ☐ **QA Gate**: 0 page error + 0 console error + screenshot review pass → Ship hazır

## Issues / Blockers

(Tıkanıklık varsa producer buraya yazar.)

## Update Log

(Her ajan kendi step'inden sonra timestamp + özet ekler.)
- {{ts}} prod-producer: brief alındı, klasör açıldı
- {{ts}} ...
