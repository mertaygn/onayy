# Art Bible — {{GAME_TITLE}}

> Görsel kararların referans dökümanı. Tüm sanatçılar buradan brief alır.

## 1. Vision Statement

**Tek cümle vizyon**: {{görsel his nasıl olmalı}}

**Three-word mood**: {{örn. moody, kinetic, retro}}

## 2. Art Style

**Stil**: {{pixel art / vector / minimalist / hand-drawn / lowpoly}}

**Reference**: {{benzer oyunlar / sanatçılar — Hyper Light Drifter, Celeste, vb.}}

**Anti-reference (yapmayacağımız)**: {{kaçınılacak stiller}}

## 3. Color Palette

```
PRIMARY:   #{{hex}}  /* {{açıklama}} */
SECONDARY: #{{hex}}
ACCENT:    #{{hex}}  /* dikkat çekme — health, danger */
NEUTRAL:   #{{hex}}  /* arka plan, UI */
DARK:      #{{hex}}
LIGHT:     #{{hex}}
```

**Mood**: {{warm / cold / saturated / muted}}

**Colorblind safe**: {{red-green dependency var mı, alternatif palet hazır mı}}

## 4. Shape Language

- **Player**: {{yumuşak yuvarlak / sert köşeli / organik}}
- **Enemies**: {{tehlike sinyali — köşeli, asimetrik}}
- **Friendly**: {{simetrik, yuvarlak}}
- **Hazards**: {{sivri, parlak, kontrast}}

## 5. Camera & Composition

- **Perspective**: {{top-down / side-scroll / isometric / fixed}}
- **Camera behavior**: {{follow / fixed / parallax}}
- **Composition rules**: {{rule of thirds, lead room}}

## 6. Animation

- **Frame rate**: 60 FPS hedef
- **Easing**: {{snappy / bouncy / smooth}}
- **Squash & stretch**: {{kullanılıyor mu}}
- **Anticipation**: {{ne kadar abartılı}}

## 7. UI Stilistik

- **Font**: {{system / pixel / sans-serif}}
- **HUD weight**: {{minimal / rich}}
- **Iconography**: {{flat / outlined / filled}}
- **Animation**: {{static / micro-animations / bold transitions}}

## 8. VFX

- **Hit feedback**: {{flash / shake / particle}}
- **Particle style**: {{realistic / stylized / geometric}}
- **Screen shake**: {{var/yok, magnitude}}
- **Time freeze on impact**: {{kullanılıyor mu — hitstop ms}}

## 9. Asset Production Notes

Her şey **prosedürel** (Phaser Graphics API ile runtime'da çizilir) çünkü harici asset yok. Üretim:

```js
// Sprite üretme örneği
const g = this.add.graphics();
g.fillStyle(PRIMARY, 1);
g.fillCircle(16, 16, 14);
g.generateTexture('player', 32, 32);
g.destroy();
```

**Asset listesi**:
- ☐ Player sprite ({{boyut}}, {{frame sayısı}})
- ☐ Enemy sprite(s)
- ☐ Background / tilemap
- ☐ HUD elements
- ☐ Particles
- ☐ Title screen
- ☐ Game over screen

## 10. Do / Don't

**DO**:
- {{örn. Saturated kontrast}}
- {{Hareket için rengin yanı sıra şekil de ipucu ver}}

**DON'T**:
- {{örn. Pure black + pure white kombosu kullanma}}
- {{Sadece renk farkıyla bilgi iletme}}
