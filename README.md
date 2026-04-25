# 🎮 AI Oyun Geliştirme Ajansı

Bir cümlelik brief'i **çalışan + browser-test edilmiş** bir oyuna dönüştüren çok-ajanlı AI oyun stüdyosu. Ajans başkanından çaycısına 64 uzman ajan, gerçek bir stüdyo gibi koordineli çalışır.

## 🚀 Nasıl Kullanılır

Bu klasörü Claude Code ile aç ve tek cümle brief ver:

```
Bana zombi temalı bir koşu oyunu yap
Düşen meyveleri yakalayan panda
Uzayda satranç oynayan robotlar
```

Producer ajanı brief'i alır:
1. **Genre detect** eder, ona göre `docs/agent-catalog.md`'den ajan setini seçer
2. IP riski varsa **ops-legal otomatik dispatch**
3. **Concept wave** paralel (gdd, vision, art-bible, audio, ux + genre eklentileri)
4. **Implementation** (eng-lead serial → sprite/sfx/gameplay paralel → eng-ui)
5. **Browser test** (puppeteer-core ile gerçek headless Chrome — `qa-functional` zorunlu)
6. **Ship** (store metni + final teslim)

```
✅ games/<slug>/index.html → tarayıcıda aç
QA: 17/17 senaryo passed · 0 console error · screenshot review temiz
```

## 🏢 Ajansın Yapısı

64 ajan, **adaptive dispatch** ile çağrılır. Her brief'te 16-24 ajan aktif (geri kalan on-demand).

| Departman | Ajanlar |
|---|---|
| **Yürütme** | CEO · CTO · COO · Creative Director |
| **Prodüksiyon** | Game Director · Producer · Exec Producer · PM |
| **Tasarım** | Lead · Systems · Combat · Economy · Progression · Level · Narrative · Writer |
| **UX/UI** | UX · UI Designer · UI Artist |
| **Sanat** | Director · Concept · Character · Environment · 2D · 3D · Texture · Animator · VFX · Technical |
| **Ses** | Director · Composer · Sound Designer · Foley |
| **Mühendislik** | Lead · Gameplay · Engine · Graphics · AI · Physics · Network · UI · Tools · Build |
| **QA** | Lead · Functional · Performance · Compliance · Localization · Playtester · Accessibility |
| **Pazarlama** | Director · Community · PR · Trailer · Store |
| **Operasyon** | HR · Finance · Legal · Office · Localization · **Çaycı** ☕ |
| **Live Ops** | Manager · Analyst · Support |

Her ajan akademik çerçevelere (**MDA · Schell Tetrad · Bartle Taxonomy · Flow Theory · Federoff/Nielsen Heuristics**) dayanarak karar alır.

## ⚙️ Teknoloji

- **Phaser 3** via CDN — build adımı YOK
- Web Audio API ile prosedürel ses
- Canvas Graphics API ile prosedürel görseller
- **Puppeteer-core** ile zorunlu browser test (`_test/` klasörü)

## 📁 Klasör

```
.
├── CLAUDE.md                     # Ajans işletim manuali
├── .claude/agents/               # 64 ajan dosyası
├── docs/
│   ├── research/                 # MDA, pipelines, tech-stack, accessibility
│   ├── templates/
│   │   ├── gdd · art-bible · audio · ux · qa-checklist
│   │   ├── manifest.md           # Pipeline state tracker
│   │   └── browser-test.js       # Puppeteer scaffold
│   └── agent-catalog.md          # Genre → ajan dispatch tablosu
├── _test/                        # Test harness (puppeteer-core)
└── games/                        # Üretilen oyunlar
```

## 🎯 Felsefe

- **Vertical slice mentalitesi** — 1 mekanik, polished, oynanır
- **Browser-test zorunlu** — statik analiz tek başına yeterli değil
- **Adaptive dispatch** — herkesi çağırma, doğru kişileri çağır
- **Akademik temel** — kararlar gerekçeli, "his" değil
- **Telif disiplini** — referans brief'lerde otomatik IP risk taraması

## 📊 Mevcut Test Oyunları

`games/yildiz-toplama/` — 8/8 puppeteer test pass · arcade catcher
`games/kabul-ediyorum/` — 9/9 puppeteer test pass · point-and-click parody (Agreeee omajı)
