# Teknoloji Stack Referansı

## Default: Phaser 3

**Neden Phaser**: Build adımı yok (CDN), batteries-included (physics + scenes + input + audio + tweens + particles), büyük topluluk, AI-friendly API, sektör de-facto 2D web game framework'ü.

### CDN Yükleme

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>{{Game Title}}</title>
  <style>
    body { margin: 0; background: #000; overflow: hidden; }
    canvas { display: block; margin: 0 auto; }
  </style>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
  <script src="game.js"></script>
</body>
</html>
```

### Scene Yaşam Döngüsü

```js
class MainScene extends Phaser.Scene {
  constructor() { super('MainScene'); }
  
  init(data) {
    // Bir kere çalışır, scene başlamadan
    // data: bir önceki scene'den geçen state
  }
  
  preload() {
    // Asset yükleme
    this.load.image('player', 'assets/player.png');
    this.load.audio('jump', 'assets/jump.wav');
  }
  
  create() {
    // Asset'ler yüklendikten sonra bir kere
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  
  update(time, delta) {
    // Her frame çağrılır (60 FPS)
    if (this.cursors.left.isDown) this.player.setVelocityX(-160);
    else if (this.cursors.right.isDown) this.player.setVelocityX(160);
    else this.player.setVelocityX(0);
    
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 300 }, debug: false }
  },
  scene: [MainScene]
};

new Phaser.Game(config);
```

### Sık Kullanılan API

```js
// SPRITES
this.add.sprite(x, y, key)              // statik
this.physics.add.sprite(x, y, key)      // physics body'li
sprite.setVelocity(x, y)
sprite.setBounce(0.5)
sprite.setCollideWorldBounds(true)

// COLLISION
this.physics.add.collider(a, b, callback)
this.physics.add.overlap(a, b, callback)

// GROUPS (çok sayıda obje için)
const enemies = this.physics.add.group();
enemies.create(x, y, 'enemy');

// INPUT
this.cursors = this.input.keyboard.createCursorKeys();
this.input.keyboard.on('keydown-SPACE', () => {});
this.input.on('pointerdown', (pointer) => {});

// TEXT
this.add.text(x, y, 'Skor: 0', { font: '32px Arial', fill: '#fff' });

// TWEEN (smooth animasyon)
this.tweens.add({
  targets: sprite,
  x: 500,
  duration: 1000,
  ease: 'Power2',
  yoyo: true
});

// SCENE GEÇİŞİ
this.scene.start('GameOverScene', { score: this.score });

// KAMERA
this.cameras.main.startFollow(player);
this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

// SES
this.sound.play('jump');
const music = this.sound.add('bgm', { loop: true, volume: 0.5 });
music.play();
```

## Prosedürel Asset Üretimi

Harici asset olmadığında, Phaser'da **Graphics** API ile runtime'da çizip texture'a çevirebiliriz:

```js
// Renkli kare sprite üret
const g = this.add.graphics();
g.fillStyle(0xff0000, 1);
g.fillRect(0, 0, 32, 32);
g.generateTexture('redSquare', 32, 32);
g.destroy();
// Artık 'redSquare' key'i ile sprite oluşturulabilir
```

Daire, çizgi, polygon, gradient, hepsi Graphics API'sinde mevcut.

## Web Audio API ile Prosedürel SFX

Asset olmadan ses üretmek için:

```js
function playBeep(frequency = 440, duration = 0.1, type = 'square') {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;  // 'sine' | 'square' | 'sawtooth' | 'triangle'
  osc.frequency.value = frequency;
  osc.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

// Jump sound
playBeep(880, 0.1, 'square');

// Hit sound
playBeep(110, 0.15, 'sawtooth');
```

## Klasik Mimari Pattern

```
games/<slug>/
├── index.html
├── game.js
└── assets/
    ├── sprites/   (varsa)
    └── audio/     (varsa, çoğunlukla Web Audio prosedürel)
```

**Tek dosya prensibi**: Mümkünse her şey `game.js` içinde, scene'ler ayrı class'lar. Karmaşık olursa `scenes/` klasörüne ayır.

## Alternatif Stack'ler (Edge Cases)

| Senaryo | Stack |
|---|---|
| 3D gerekli | Three.js + Cannon.js (physics) |
| Çok hafif puzzle | Pure HTML/CSS + minimal JS |
| Pixel-perfect retro | Phaser + nearest-neighbor scaling |
| Çok hızlı render (10k+ sprite) | PixiJS (raw, framework yok) |
| Müzik-yoğun | Tone.js (Web Audio üst katmanı) |

Default her zaman Phaser 3. Diğerlerine sadece açık gerekçe varsa geç.

## Performance Hedefleri

- 60 FPS (16.6 ms/frame budget)
- İlk meaningful paint < 1 sn
- Total bundle (HTML + JS + CDN sayılmaz) < 200 KB
- Memory < 200 MB (mobile için)
