# Erişilebilirlik Standartları

## Yasal Çerçeve (2026)

| Bölge | Standart | Geçerlilik |
|---|---|---|
| ABD | CVAA (21st Century Communications and Video Accessibility Act) | Iletişim feature'ları (chat, voice) |
| AB | European Accessibility Act | Haziran 2025'ten itibaren tüm dijital ürünler |
| Web | WCAG 2.2 AA | Best practice baseline |
| Konsol | ADA dolaylı | Public accommodation |

## Minimum Baseline (Her Oyun)

### Görsel
- ☑ **Colorblind modes**: deuteranopia, protanopia, tritanopia için en az birer palette
- ☑ **Text scaling**: %200'e kadar büyütme
- ☑ **Contrast**: WCAG AA — text/background için 4.5:1 normal, 3:1 large
- ☑ **No flashing**: 3 Hz üzeri flash yok (epileptic seizure)
- ☑ Bilgi sadece renkle iletilmez (icon + renk)

### İşitsel
- ☑ **Subtitles**: tüm dialog için, kapatılabilir/açılabilir
- ☑ **Closed captions**: speaker ID + sound effect description
- ☑ Critical audio cue'ları görselle de iletilir
- ☑ Volume sliders: master, music, SFX, voice ayrı

### Motor
- ☑ **Remappable controls**: tüm key'ler değiştirilebilir
- ☑ **Hold→toggle**: hold gerektiren her aksiyon toggle olabilir
- ☑ **Auto-aim / aim assist** opsiyonu
- ☑ Tek-elle oynanabilirlik (mümkünse)
- ☑ QTE'de sürekli mash yerine hold/single-press alternatifi

### Bilişsel
- ☑ **Difficulty presets**: story / normal / hard
- ☑ Granular sliders: combat, puzzle, time pressure ayrı
- ☑ **Pause** her zaman çalışır
- ☑ **Skip cutscene** opsiyonu
- ☑ Tutorial yeniden oynanabilir
- ☑ Objective her zaman görünür/erişilebilir

## "Curb Cut Effect"

Engelli kullanıcı için tasarlanmış feature'lar herkesin tecrübesini iyileştirir:
- Subtitle → gürültülü ortamda da işe yarar
- Colorblind palette → karmaşık sahnelerde herkesin görünürlüğünü artırır
- Remappable controls → solak / tercih sebebi olanlara da iyi gelir

## Web Game (Phaser) Spesifik

```js
// Keyboard navigation: tüm UI button'ları Tab ile gezilebilir olmalı
// Phaser default'ta canvas DOM dışı, bu yüzden:
// - HTML overlay kullan menüler için
// - Veya keyboard input handler'ları manuel kur

// Colorblind mode örneği
const palettes = {
  default:     { red: 0xff0000, green: 0x00ff00 },
  deuteranopia:{ red: 0xff8800, green: 0x0088ff },  // turuncu/mavi
  protanopia:  { red: 0xffaa00, green: 0x00aaff },
  tritanopia:  { red: 0xff00aa, green: 0x00ffaa }
};

// Subtitle örneği
function showSubtitle(text, speaker) {
  const sub = this.add.text(400, 550, `[${speaker}] ${text}`, {
    font: '20px Arial',
    fill: '#fff',
    backgroundColor: '#000a',
    padding: { x: 10, y: 5 }
  }).setOrigin(0.5);
  this.time.delayedCall(3000, () => sub.destroy());
}
```

## Game Accessibility Guidelines (gameaccessibilityguidelines.com)

3 seviye:
- **Basic**: minimum effort, max impact (subtitle, remappable, colorblind)
- **Intermediate**: orta efor (granular difficulty, screen reader compat)
- **Advanced**: yüksek efor (eye tracking, switch input)

Bu ajans **Basic + seçili Intermediate** hedefler.
