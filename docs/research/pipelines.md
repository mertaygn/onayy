# Üretim Pipeline'ı ve Milestone'lar

## Aşamalar (Sektör Standardı)

```
PRE-PRODUCTION → PRODUCTION → POST-PRODUCTION → LIVE OPS
   ↓                ↓               ↓              ↓
 Concept       Vertical Slice    Polish       Updates
 GDD           Alpha            Beta         Patches
 Prototypes    Feature complete Bug-fix      DLC
                                Gold master
```

## Milestone Tanımları

### Pre-Production
- **Concept doc**: 1-2 sayfa pitch
- **GDD**: 5-30 sayfa detaylı tasarım dokümanı
- **Prototype**: oynatılabilir ama çirkin core mechanic kanıtı
- **Art Bible**: görsel stil rehberi
- **Tech spike**: en riskli teknik problemi çözen küçük demo

**Çıkış kriteri**: Core loop kanıtlanmış, scope yazılı, herkes "ne yapıyoruz" sorusunu aynı cevaplıyor.

### Vertical Slice
> "A small playable section developed to near-final quality, containing the game's core gameplay loop with polished art, sound, and mechanics."

Tüm sistemlerin (gameplay + sanat + ses + UI) bir levelda full-quality çalıştığı dilim. Publisher pitch'i için altın standart.

**Çıkış kriteri**: Bir level / arena / chapter, final-quality görünüyor ve oynanıyor.

### Alpha — "Feature Complete"
- Tüm major feature'lar yerinde
- Game baştan sona oynanabilir
- Asset'ler placeholder olabilir, FX eksik olabilir
- **Bug var, denge yok, ama sistem komple**

**Çıkış kriteri**: "Şu feature'ı eklemiyoruz" listesi finalize, geri kalan her şey çalışır halde.

### Beta — "Content Complete"
- Tüm asset'ler final
- Tüm content (level, story, ses) yerinde
- Bug-fix, performans optimizasyonu, polish modu
- **Yeni feature/content YOK**

**Çıkış kriteri**: Critical/major bug listesi 0'a yakın, performans hedefte.

### Gold Master
- Ship'lenebilir build
- Compliance certification (PS/Xbox/Nintendo) geçmiş
- Marketing asset'leri hazır

## Iteration Yapısı (Agile)

Tipik sprint: 1-2 hafta. Her sprint sonunda:
- Demo (playable build)
- Retrospective (ne iyiydi, ne kötüydü)
- Next sprint planning (backlog grooming)

## Ajans-İçi Pipeline (Brief → Game)

Bizim ajansımız 1-cümlelik brief'i tek session'da game'e çevirir. Aşamalar koşullu olarak paralel:

```
1. INTAKE (Producer)
   ↓ brief alınır, slug üretilir, klasör açılır
   
2. CONCEPT WAVE (paralel — 6 ajan)
   - Game Director: scope karar
   - Creative Director: tema, vizyon
   - Lead Designer: GDD yaz, core loop tanımla (MDA)
   - Narrative Designer: story bible
   - Art Director: art bible
   - Audio Director: audio brief
   - UX Designer: input scheme, screen flow
   ↓ docs/gdd.md, docs/art-bible.md, docs/audio.md HAZIR

3. PRE-IMPLEMENTATION REVIEW (Producer + Game Director)
   ↓ tutarlılık check, gerekirse re-brief

4. IMPLEMENTATION WAVE (paralel — 5+ ajan)
   - Lead Engineer: dosya iskeleti, scene structure
   - Gameplay Programmer: core mechanics
   - 2D Artist: prosedürel/SVG sprites → assets/
   - Sound Designer: Web Audio SFX
   - UI Programmer: HUD, menüler
   ↓ index.html + game.js çalışır

5. QA WAVE (paralel — 3 ajan)
   - QA Functional: oyunu aç, oyna, bug raporu
   - Playtester: Bartle profiline göre 4 farklı oyna
   - Accessibility: keyboard-only, colorblind check
   ↓ docs/qa-report.md

6. POLISH (Producer + relevant fixers)
   ↓ critical bug'lar fix
   
7. SHIP
   - Marketing: docs/store.md
   - Producer: kullanıcıya teslim
```

## Playtesting Protokolü

QA Playtester ajanı oyunu 4 Bartle profiline göre simüle eder:

- **Achiever**: skoru maksimize etmeye çalış, başarımları kovala
- **Explorer**: tüm köşeleri dene, edge case'leri tetikle
- **Socializer**: NPC'lerle konuş (varsa), karakter detayını ara
- **Killer**: optimal speedrun yolu bul, dominans hisset

Her profil ayrı bir bug/feedback raporu üretir.
