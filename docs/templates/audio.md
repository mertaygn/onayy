# Audio Brief — {{GAME_TITLE}}

> Tüm ses kararlarının referans dökümanı.

## 1. Audio Vision

**Tek cümle ton**: {{örn. nostaljik 8-bit / sinemasal orkestral / ambient minimalist}}

**Reference tracks**: {{benzer oyunların müzikleri}}

## 2. Music

### Style
{{Chiptune / orchestral / ambient / electronic / acoustic}}

### Adaptive layering (varsa)
- **Vertical layering**: aynı parça, farklı yoğunlukta katmanlar (combat'ta perküsyon ekle)
- **Horizontal re-sequencing**: state'e göre farklı parçalar arasında geçiş

### Tracklist
- ☐ Title / menu theme ({{30-60 sn loop}})
- ☐ Main gameplay BGM
- ☐ Boss / climax theme (varsa)
- ☐ Win / lose stinger
- ☐ Ambient layer

### Tech
**Web Audio API** ile prosedürel veya `<audio>` ile sample. Phaser sound manager kullan:

```js
const music = this.sound.add('bgm', { loop: true, volume: 0.5 });
music.play();
```

## 3. SFX

| Event | Tonu | Üretim |
|---|---|---|
| Jump | {{kısa, yukarı slide}} | Web Audio osc, 200→600 Hz, 100 ms |
| Hit | {{patlayıcı, kısa}} | Square wave, low freq + noise |
| Pickup | {{neşeli, yukarı arpeggio}} | Sine, C-E-G hızlı |
| Game over | {{descending}} | Sawtooth, 400→100 Hz, 1 sn |
| UI click | {{hafif}} | Square, 800 Hz, 30 ms |
| Win | {{fanfare}} | Multi-osc chord progression |

### Web Audio Snippet (template)

```js
function playSfx(opts) {
  const ctx = window.__audioCtx ||= new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = opts.type || 'square';
  osc.frequency.setValueAtTime(opts.from, ctx.currentTime);
  if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, ctx.currentTime + opts.duration);
  gain.gain.setValueAtTime(opts.volume || 0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + opts.duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + opts.duration);
}

// Jump
playSfx({ type: 'square', from: 220, to: 660, duration: 0.12 });

// Hit
playSfx({ type: 'sawtooth', from: 110, duration: 0.15, volume: 0.3 });
```

## 4. Voice (varsa)

- ☐ Voice over var/yok
- ☐ Subtitle desteği zorunlu
- ☐ Speaker ID gösterimi

## 5. Audio Mixing

- **Master**: 1.0
- **Music**: 0.5 (background)
- **SFX**: 0.7 (foreground)
- **Voice**: 0.9 (en önde)

Volume slider'lar UI'da bulunur (accessibility).

## 6. Accessibility

- ☑ Subtitle var
- ☑ Critical audio'nun görsel paraleli var (örn. yaklaşan tehlike — sadece ses değil titreyen kenarlık)
- ☑ Volume slider'lar ayrı kategoriler için
