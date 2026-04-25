# Akademik Oyun Tasarım Çerçeveleri (Sentez)

Tüm tasarım ajanları kararlarını bu çerçevelerden birine dayandırmalıdır.

## 1. MDA Framework (Hunicke, LeBlanc, Zubek 2004)

GDC 2001-2004'te formalize edilmiş, oyun tasarımının en yaygın referans çerçevesi.

| Katman | Tanım | Örnek (Mario) |
|---|---|---|
| **Mechanics** | Kurallar, algoritmalar, veri yapıları, oyuncunun yapabildiği temel aksiyonlar | Zıpla, koş, ateş et |
| **Dynamics** | Mekaniklerin oyuncu input'uyla ve birbiriyle etkileşiminden doğan run-time davranış | Düşmana zıplayarak basma → enemy stomp tactic |
| **Aesthetics** | Oyuncuda uyandırılan duygusal yanıt | Zafer, gerilim, keşif sevinci |

**Tasarımcı perspektifi**: M → D → A (mekanikleri yazarsın, dinamikleri ve estetiği o üretir)
**Oyuncu perspektifi**: A → D → M (önce hisseder, sonra dinamiği keşfeder, en sonda mekaniği anlar)

LeBlanc'ın 8 estetik tipi (tasarımda hedef olarak kullanılır):
1. **Sensation** — duyusal haz (görsel/sesli şölen)
2. **Fantasy** — hayal evrenine dalış
3. **Narrative** — drama, hikâye akışı
4. **Challenge** — engel aşma
5. **Fellowship** — sosyal çerçeve
6. **Discovery** — keşif sevinci
7. **Expression** — kendini ifade
8. **Submission** — pastime, rahatlatıcı uğraş

**Kullanım**: Ajansın target aesthetics'i belirlenmeden mekanik yazılmaz.

## 2. Schell's Elemental Tetrad (Jesse Schell 2008)

"The Art of Game Design: A Book of Lenses" — bir oyunun 4 eşit önemli bileşeni:

```
        STORY
          │
   AESTHETICS ── MECHANICS
          │
       TECHNOLOGY
```

- **Mechanics**: kurallar (MDA'daki ile aynı)
- **Story**: anlatı, karakter, evren
- **Aesthetics**: görsel/işitsel sunum (oyuncunun gözünden ilk algılanan)
- **Technology**: oyunu mümkün kılan teknik substrat (motor, donanım, platform)

**Tema kuralı**: Tüm dört element ortak bir temayı desteklemeli. Tema = oyunun "why"si.

**Schell'in 100 lens'i**: Her lens, tasarımı sorgulamak için bir mercek (örn. "Lens of Fun", "Lens of Curiosity", "Lens of Surprise"). En çok kullanılan 5'i:
- Lens of Essential Experience
- Lens of Surprise  
- Lens of Fun
- Lens of Curiosity
- Lens of Endogenous Value

## 3. Bartle Taxonomy (Richard Bartle 1996)

Multiplayer oyunlar için ortaya çıkmış ama tüm oyunlar için yararlı. İki eksen:

```
              ACTING
                │
   KILLERS ─────┼───── ACHIEVERS
   ♣            │            ♦
   ─────────────┼─────────────  
   PLAYERS      │       WORLD
   ♥            │            ♠
   SOCIALIZERS ─┼───── EXPLORERS
                │
            INTERACTING
```

| Tip | Sembol | Motivasyon | Tasarım hooku |
|---|---|---|---|
| **Achievers** | ♦ Diamond | Puan, level, başarım | Leaderboards, achievements, completion % |
| **Explorers** | ♠ Spade | Mekanikleri/dünyayı keşfetme | Lore, gizli alanlar, sandbox |
| **Socializers** | ♥ Heart | Diğerleriyle etkileşim | Chat, co-op, NPC ilişkileri |
| **Killers** | ♣ Club | Üstünlük, dominans | PvP, ranked, speedrun |

**Kullanım**: Hedef oyuncu profili belirlenir, tasarım o profile göre ağırlandırılır. Hedef Achiever ise leaderboard ekle. Hedef Explorer ise gizli area ekle.

## 4. Flow Theory (Csikszentmihalyi 1975)

"Optimal experience" — challenge ile skill dengelendiğinde girilen tam-konsantrasyon hali.

```
       ↑ ANXIETY
       │  (challenge > skill)
  ┌────┼────────┐
  │    │ FLOW   │
  │    │CHANNEL │
  │    │   /    │
  │    │  /     │
  │    │ /      │
  │    │/       │
  │ BOREDOM    │
  │ (skill > challenge)
  └────┴────────┘
        SKILL →
```

**Flow için 4 koşul**:
1. **Clear goals** — oyuncu ne yapması gerektiğini biliyor
2. **Immediate feedback** — her aksiyon anında geri bildirim
3. **Challenge-skill balance** — zorluk, beceriye göre ayarlı (adaptive difficulty)
4. **Concentration** — dış dünya unutuluyor

**Stair-step difficulty curve**: Yeni görev başında zorluk, önceki görevin sonundan biraz aşağıda başlar. Ardından yumuşakça yükselir. Frustration'ı önler.

**Kullanım**: Tasarımcı her seviyenin difficulty profilini flow channel'a oturtmaya çalışır.

## 5. Federoff Game Heuristics (Nielsen + Game-spesifik)

Nielsen'in 10 web heuristic'i + Federoff'un 40 oyun-spesifik heuristic'i. Üç kategori:

### Game Interface (14)
- Health/ammo/cooldown her zaman görünür (visibility of system status)
- Progressive disclosure: combat'ta minimal HUD, pause'da zengin
- Peripheral vision'a uygun yerleşim
- Critical feedback'ler hem görsel hem işitsel hem haptik
- Confirm dialog'u sadece geri alınamaz aksiyonlar için
- Subtitle + speaker ID + sound effect description

### Game Mechanics
- Predictable & consistent rules
- Fail state'i öğretici (öldükten sonra ne yapacağını anlatır)
- Multiple solutions to same problem (player agency)

### Gameplay
- Tutorial integrated, optional, skipable
- Difficulty options (story / normal / hard)
- Save anywhere ya da regular checkpoint

## 6. Gameplay Loop Hierarchy

| Tip | Süre | Örnek (FPS) |
|---|---|---|
| **Micro / Second-to-second** | 1-10 sn | aim → shoot → cover |
| **Meta / Minute-to-minute** | 1-10 dk | enter room → fight → loot → exit |
| **Macro / Hour-to-hour** | 30 dk-saatler | mission → reward → upgrade → next mission |

**Minecraft örneği**: explore → mine → craft. Her üç katmanda da çalışıyor.

**Kullanım**: Lead Designer önce micro-loop'u dondurur (en kritik), sonra meta'yı, sonra macro'yu. Macro olmadan oyun bitmiş hissetmez; micro olmadan moment-to-moment haz yok.

## 7. Player Experience Goals (PXG)

Modern UX framework. Her tasarım kararı şuna hizmet eder:
- **Engagement** — oyuncu ne kadar süreyle dalmış kalıyor (immersion)
- **Mastery** — oyuncu becerisini geliştirebiliyor mu
- **Identification** — karakterle ilişki kuruyor mu
- **Social** — paylaşma/iletişim ihtiyacı karşılanıyor mu
- **Autonomy** — oyuncu seçim hissediyor mu

## Kaynaklar (özet)

- Hunicke, LeBlanc, Zubek (2004) — MDA: A Formal Approach
- Schell, Jesse (2008/2014/2019) — The Art of Game Design: A Book of Lenses
- Bartle, Richard (1996) — Hearts, Clubs, Diamonds, Spades
- Csikszentmihalyi (1990) — Flow: The Psychology of Optimal Experience
- Federoff, Melissa (2002) — Heuristics for Computer Game Design
- Salen & Zimmerman (2003) — Rules of Play
