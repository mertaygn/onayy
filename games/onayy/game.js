// =========================================================
// ONAYYY — Agreeee (Vestman, 2025) Türkçe versiyonu
// 12 tuzaklı onay ekranı + side-scroller aksiyon fazı
// 5 can, checkpoint reset
// =========================================================

const COLORS = {
  BG_DESKTOP:    0x1A2233,
  DIALOG_BG:     0xF0F0F0,
  DIALOG_HDR:    0x3B5998,
  DIALOG_BORDER: 0xCCCCCC,
  BTN_NORMAL:    0xE0E0E0,
  BTN_HOVER:     0x4A90E2,
  BTN_DANGER:    0xC70039,
  ACCENT_OK:     0x2ECC71,
  ACCENT_WARN:   0xF39C12,
  INPUT_BG:      0xFFFFFF,
  ACTION_BG:     0x16213E,
  ACTION_FG:     0x0F3460,
  PLAYER:        0xECF0F1,
  SPIKE:         0xC70039,
  FLAG:          0xFFE66D,
  PLATFORM:      0x4ECDC4
};

const HEX = {
  TEXT:       '#222222',
  TEXT_LIGHT: '#FFFFFF',
  TEXT_HINT:  '#888888',
  OK:         '#2ECC71',
  WARN:       '#F39C12',
  DANGER:     '#C70039'
};

const GAME_W = 1024;
const GAME_H = 640;
const TOTAL_TERMS = 12;
const STARTING_LIVES = 5;

// =========================================================
// SFX — Web Audio API prosedürel
// =========================================================

function sfx(opts) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  const ctx = window.__audioCtx ||= new Ctx();
  if (ctx.state === 'suspended') ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = opts.type || 'square';
  osc.frequency.setValueAtTime(opts.from, ctx.currentTime);
  if (opts.to) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(opts.to, 1),
      ctx.currentTime + opts.duration
    );
  }
  gain.gain.setValueAtTime(opts.volume || 0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + opts.duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + opts.duration);
}

function sfxNoise(duration, volume) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  const ctx = window.__audioCtx ||= new Ctx();
  if (ctx.state === 'suspended') ctx.resume();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buffer;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  src.connect(gain).connect(ctx.destination);
  src.start();
}

const SFX = {
  hover:  () => sfx({ type: 'sine', from: 660, duration: 0.04, volume: 0.05 }),
  click:  () => sfx({ type: 'square', from: 880, to: 440, duration: 0.06, volume: 0.12 }),
  accept: () => sfx({ type: 'sine', from: 523, to: 1046, duration: 0.18 }),
  reject: () => sfx({ type: 'sawtooth', from: 220, to: 110, duration: 0.25 }),
  error:  () => sfx({ type: 'sawtooth', from: 196, duration: 0.35 }),
  typing: () => sfx({ type: 'square', from: 1200, duration: 0.02, volume: 0.06 }),
  paper:  () => sfxNoise(0.05, 0.06),
  jump:   () => sfx({ type: 'square', from: 220, to: 660, duration: 0.10, volume: 0.15 }),
  death:  () => sfx({ type: 'sawtooth', from: 440, to: 80, duration: 0.5, volume: 0.20 }),
  win:    () => {
    sfx({ type: 'sine', from: 523, duration: 0.15 });
    setTimeout(() => sfx({ type: 'sine', from: 659, duration: 0.15 }), 130);
    setTimeout(() => sfx({ type: 'sine', from: 784, duration: 0.30 }), 260);
  }
};

// =========================================================
// HELPERS
// =========================================================

function makeDesktopBackground(scene) {
  scene.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, COLORS.BG_DESKTOP);
  for (let i = 0; i < 12; i++) {
    const x = 28 + (i % 4) * 64;
    const y = 28 + Math.floor(i / 4) * 70;
    scene.add.rectangle(x, y, 32, 28, 0x2C3E50, 0.6).setStrokeStyle(1, 0x556270, 0.6);
    scene.add.text(x, y + 22, ['Belge', 'Klasör', 'Dosya', 'Arşiv'][i % 4], {
      font: '9px system-ui', color: '#88a'
    }).setOrigin(0.5);
  }
  scene.add.rectangle(GAME_W / 2, GAME_H - 12, GAME_W, 24, 0x0F1622).setStrokeStyle(1, 0x2C3E50);
  scene.add.text(20, GAME_H - 12, '⚙ Sistem', { font: '11px system-ui', color: '#aac' }).setOrigin(0, 0.5);
  scene.add.text(GAME_W - 20, GAME_H - 12, '00:00', { font: '11px system-ui', color: '#aac' }).setOrigin(1, 0.5);
}

function createDialog(scene, opts) {
  const x = opts.x !== undefined ? opts.x : GAME_W / 2;
  const y = opts.y !== undefined ? opts.y : GAME_H / 2;
  const w = opts.w || 540;
  const h = opts.h || 280;
  const title = opts.title || 'ŞARTNAME';
  const body = opts.body || '';

  const items = [];
  items.push(scene.add.rectangle(x + 4, y + 4, w, h, 0x000000, 0.35));
  items.push(scene.add.rectangle(x, y, w, h, COLORS.DIALOG_BG).setStrokeStyle(1, COLORS.DIALOG_BORDER));
  items.push(scene.add.rectangle(x, y - h / 2 + 14, w, 28, COLORS.DIALOG_HDR));
  items.push(scene.add.text(x - w / 2 + 12, y - h / 2 + 14, title, {
    font: 'bold 13px system-ui', color: HEX.TEXT_LIGHT
  }).setOrigin(0, 0.5));
  items.push(scene.add.text(x + w / 2 - 14, y - h / 2 + 14, '✕', {
    font: 'bold 12px system-ui', color: HEX.TEXT_LIGHT
  }).setOrigin(0.5));

  if (body) {
    items.push(scene.add.text(x, y - h / 2 + 70, body, {
      font: '15px system-ui', color: HEX.TEXT, align: 'center', wordWrap: { width: w - 50 }
    }).setOrigin(0.5, 0));
  }
  return items;
}

function makeButton(scene, x, y, w, h, label, onClick) {
  const bg = scene.add.rectangle(x, y, w, h, COLORS.BTN_NORMAL).setStrokeStyle(1, COLORS.DIALOG_BORDER);
  const txt = scene.add.text(x, y, label, {
    font: 'bold 13px system-ui', color: HEX.TEXT
  }).setOrigin(0.5);

  bg.setInteractive({ useHandCursor: true })
    .on('pointerover', () => { bg.setFillStyle(COLORS.BTN_HOVER); txt.setColor(HEX.TEXT_LIGHT); SFX.hover(); })
    .on('pointerout', () => { bg.setFillStyle(COLORS.BTN_NORMAL); txt.setColor(HEX.TEXT); })
    .on('pointerdown', () => { SFX.click(); onClick(bg, txt); });

  return {
    bg, txt,
    setPosition: (nx, ny) => { bg.setPosition(nx, ny); txt.setPosition(nx, ny); },
    setSize: (nw, nh) => { bg.setSize(nw, nh); }
  };
}

// =========================================================
// SCENE: BOOT
// =========================================================

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    makeDesktopBackground(this);

    createDialog(this, {
      title: 'KULLANICI SÖZLEŞMESİ',
      body: 'Bu hizmeti kullanmak için 12 maddelik kullanıcı şartnamesini\nokuyup onaylamanız gerekmektedir.\n\nSonra... gerçek oyun başlar.',
      h: 280
    });

    let starting = false;
    const start = () => {
      if (starting) return;
      starting = true;
      SFX.accept();
      this.cameras.main.fadeOut(200, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Terms'));
    };

    makeButton(this, GAME_W / 2 - 90, GAME_H / 2 + 100, 140, 38, 'BAŞLA', start);

    makeButton(this, GAME_W / 2 + 90, GAME_H / 2 + 100, 140, 38, 'VAZGEÇ', () => {
      const warn = this.add.text(GAME_W / 2, GAME_H / 2 + 160, 'Vazgeçemezsiniz. Hayatın gerçeği bu.', {
        font: 'italic 14px system-ui', color: HEX.WARN
      }).setOrigin(0.5);
      this.tweens.add({ targets: warn, alpha: 0, duration: 1800, delay: 600, onComplete: () => warn.destroy() });
    });
  }
}

// =========================================================
// SCENE: TERMS (12 madde orchestrator)
// =========================================================

class TermsScene extends Phaser.Scene {
  constructor() { super('Terms'); }

  create() {
    makeDesktopBackground(this);
    this.cameras.main.fadeIn(200, 0, 0, 0);

    this.currentTerm = 0;
    this.termSprites = [];
    this.termTimer = null;
    this.termInterval = null;

    // Progress badge
    this.add.rectangle(GAME_W - 90, 30, 150, 30, 0x0F1622, 0.85).setStrokeStyle(1, 0x4A90E2);
    this.progressText = this.add.text(GAME_W - 90, 30, '', {
      font: 'bold 13px system-ui', color: '#FFFFFF'
    }).setOrigin(0.5);

    // ESC pause — DOM-level (Phaser keyboard plugin flaky)
    this._escListener = (e) => {
      if (e.key === 'Escape' && !this.scene.isPaused()) {
        this.scene.pause();
        this.scene.launch('Pause', { from: 'Terms' });
      }
    };
    window.addEventListener('keydown', this._escListener);

    this.events.once('shutdown', this.cleanup, this);
    this.events.once('destroy', this.cleanup, this);

    this.loadTerm(0);
  }

  cleanup() {
    if (this._escListener) {
      window.removeEventListener('keydown', this._escListener);
      this._escListener = null;
    }
    this.clearTermArtifacts();
  }

  trackSprite(s) {
    this.termSprites.push(s);
    return s;
  }

  clearTermArtifacts() {
    this.termSprites.forEach(s => { try { if (s && s.destroy) s.destroy(); } catch (_) {} });
    this.termSprites = [];
    this.input.keyboard.removeAllListeners('keydown-ENTER');
    this.input.keyboard.removeAllListeners('keydown-BACKSPACE');
    for (let i = 0; i <= 9; i++) this.input.keyboard.removeAllListeners(`keydown-${i}`);
    if (this.termTimer) { this.termTimer.remove(); this.termTimer = null; }
    if (this.termInterval) { this.termInterval.remove(); this.termInterval = null; }
    if (this.rightKey) { this.rightKey.destroy(); this.rightKey = null; }
    this.escapeBtn = null;
    this.term10Btn = null;
    this.input.setDefaultCursor('default');
  }

  loadTerm(index) {
    this.clearTermArtifacts();
    this.currentTerm = index;
    this.progressText.setText(`Madde ${Math.min(index + 1, TOTAL_TERMS)}/${TOTAL_TERMS}`);
    const fnName = `setupTerm${index + 1}`;
    if (typeof this[fnName] === 'function') {
      this[fnName]();
    } else {
      // Tüm 12 bitti → Action phase
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Action'));
    }
  }

  nextTerm() {
    SFX.accept();
    this.cameras.main.fadeOut(180, 240, 240, 245);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.cameras.main.fadeIn(180, 240, 240, 245);
      this.loadTerm(this.currentTerm + 1);
    });
  }

  flashError(msg) {
    SFX.reject();
    const flash = this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0xC70039, 0.25).setDepth(800);
    this.tweens.add({ targets: flash, alpha: 0, duration: 350, onComplete: () => flash.destroy() });
    if (msg) {
      const t = this.add.text(GAME_W / 2, 80, msg, {
        font: 'bold 16px system-ui', color: HEX.DANGER, backgroundColor: '#fff', padding: { x: 10, y: 6 }
      }).setOrigin(0.5).setDepth(801);
      this.tweens.add({ targets: t, alpha: 0, duration: 1400, delay: 400, onComplete: () => t.destroy() });
    }
  }

  // ============ TIER 1: EASY (1-4) ============

  // 1. STANDART
  setupTerm1() {
    createDialog(this, {
      title: 'ŞARTNAME — Madde 1/12',
      body: 'Bu hizmeti kullanmak için makul ve mantıklı şartlarımızı kabul ediyorsunuz.\n\nKolay başlıyoruz.',
      h: 260
    }).forEach(d => this.trackSprite(d));
    const btn = makeButton(this, GAME_W / 2, GAME_H / 2 + 80, 180, 42, 'ONAYLIYORUM', () => this.nextTerm());
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);
  }

  // 2. KÖŞEDE
  setupTerm2() {
    createDialog(this, {
      title: 'ŞARTNAME — Madde 2/12',
      body: 'Madde 2: Kullanıcı, gerekli düğmeyi bulma sorumluluğunu kabul eder.\n\nButon ekranın bir köşesinde, küçük.',
      h: 260
    }).forEach(d => this.trackSprite(d));

    const corners = [
      { x: 70, y: 80 }, { x: GAME_W - 70, y: 80 },
      { x: 70, y: GAME_H - 80 }, { x: GAME_W - 70, y: GAME_H - 80 }
    ];
    const pos = corners[Phaser.Math.Between(0, 3)];
    const btn = makeButton(this, pos.x, pos.y, 90, 24, 'onayla', () => this.nextTerm());
    btn.txt.setStyle({ font: '10px system-ui' });
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);
    // Hover'da büyür
    btn.bg.on('pointerover', () => {
      this.tweens.add({ targets: [btn.bg, btn.txt], scale: 1.6, duration: 150 });
    });
    btn.bg.on('pointerout', () => {
      this.tweens.add({ targets: [btn.bg, btn.txt], scale: 1, duration: 150 });
    });
  }

  // 3. SAHTE KARDEŞLER
  setupTerm3() {
    createDialog(this, {
      title: 'ŞARTNAME — Madde 3/12',
      body: 'Madde 3: Aşağıdaki dört buton aynı görünür.\nSADECE BİRİ gerçek "ONAYLIYORUM" butonudur.\nYanlış → ekran sıfırlanır.',
      h: 280
    }).forEach(d => this.trackSprite(d));

    const correct = Phaser.Math.Between(0, 3);
    [GAME_W / 2 - 270, GAME_W / 2 - 90, GAME_W / 2 + 90, GAME_W / 2 + 270].forEach((px, i) => {
      const btn = makeButton(this, px, GAME_H / 2 + 100, 140, 40, 'ONAYLIYORUM', () => {
        if (i === correct) this.nextTerm();
        else { this.flashError('Yanlış buton.'); this.time.delayedCall(400, () => this.loadTerm(2)); }
      });
      this.trackSprite(btn.bg); this.trackSprite(btn.txt);
    });
  }

  // 4. HAREKETLİ
  setupTerm4() {
    createDialog(this, {
      title: 'ŞARTNAME — Madde 4/12',
      body: 'Madde 4: Kullanıcı, hareket eden hedefleri yakalama yeteneğini kabul eder.\n\nButon soldan sağa kayıyor. Yakala.',
      h: 260
    }).forEach(d => this.trackSprite(d));

    // Buton dialog'un ALTINDA hareket etsin (z-conflict önle)
    const laneY = GAME_H - 90;
    const btn = makeButton(this, -100, laneY, 160, 40, 'ONAYLIYORUM', () => this.nextTerm());
    btn.bg.setDepth(10); btn.txt.setDepth(11);
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);

    const tween = this.tweens.add({
      targets: [btn.bg, btn.txt],
      x: GAME_W + 100,
      duration: 3500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });
    this.trackSprite(tween);
  }

  // ============ TIER 2: MEDIUM (5-8) ============

  // 5. CAPTCHA YILDIZ
  setupTerm5() {
    this.captchaCount = Phaser.Math.Between(3, 9);
    this.captchaInput = '';

    createDialog(this, {
      title: 'ŞARTNAME — Madde 5/12',
      body: 'Madde 5: İnsan olduğunuzu doğrulayın.\nAşağıdaki yıldız sayısını yazıp ENTER\'a basın.',
      h: 320
    }).forEach(d => this.trackSprite(d));

    const totalW = this.captchaCount * 32;
    const startX = GAME_W / 2 - totalW / 2 + 16;
    for (let i = 0; i < this.captchaCount; i++) {
      const star = this.add.text(startX + i * 32, GAME_H / 2 + 20, '★', {
        font: '30px system-ui', color: HEX.WARN
      }).setOrigin(0.5);
      this.trackSprite(star);
    }

    const inputBg = this.add.rectangle(GAME_W / 2, GAME_H / 2 + 80, 100, 34, COLORS.INPUT_BG)
      .setStrokeStyle(1, COLORS.DIALOG_BORDER);
    const inputText = this.add.text(GAME_W / 2, GAME_H / 2 + 80, '_', {
      font: 'bold 18px monospace', color: HEX.TEXT
    }).setOrigin(0.5);
    this.trackSprite(inputBg); this.trackSprite(inputText);

    const hint = this.add.text(GAME_W / 2, GAME_H / 2 + 112, '0–9 yaz · ENTER ile gönder · ⌫ ile sil', {
      font: '11px system-ui', color: HEX.TEXT_HINT
    }).setOrigin(0.5);
    this.trackSprite(hint);

    for (let d = 0; d <= 9; d++) {
      this.input.keyboard.on(`keydown-${d}`, () => {
        if (this.captchaInput.length < 2) {
          this.captchaInput += d.toString();
          inputText.setText(this.captchaInput);
          SFX.typing();
        }
      });
    }
    this.input.keyboard.on('keydown-BACKSPACE', () => {
      this.captchaInput = this.captchaInput.slice(0, -1);
      inputText.setText(this.captchaInput || '_');
    });
    this.input.keyboard.on('keydown-ENTER', () => {
      if (parseInt(this.captchaInput, 10) === this.captchaCount) this.nextTerm();
      else { this.flashError('Yanlış. Robot olabilir misin?'); this.time.delayedCall(400, () => this.loadTerm(4)); }
    });
  }

  // 6. SLIDER DİRENEN
  setupTerm6() {
    createDialog(this, {
      title: 'ŞARTNAME — Madde 6/12',
      body: 'Madde 6: Tolerans seviyenizi tam değere getirin.\n\nKaydırıcıyı 100\'e sürükle. (Sistem geri çekiyor.)',
      h: 280
    }).forEach(d => this.trackSprite(d));

    const sliderY = GAME_H / 2 + 70;
    const trackX = GAME_W / 2;
    const trackW = 360;
    const minX = trackX - trackW / 2;
    const maxX = trackX + trackW / 2;

    // Track
    const track = this.add.rectangle(trackX, sliderY, trackW, 6, 0xCCCCCC);
    this.trackSprite(track);

    // Knob
    let value = 0;
    const knob = this.add.circle(minX, sliderY, 14, COLORS.BTN_HOVER).setStrokeStyle(2, 0xFFFFFF);
    knob.setInteractive({ draggable: true, useHandCursor: true });
    this.input.setDraggable(knob);
    this.trackSprite(knob);

    const valueText = this.add.text(GAME_W / 2, sliderY - 30, 'Değer: 0', {
      font: 'bold 16px system-ui', color: HEX.TEXT
    }).setOrigin(0.5);
    this.trackSprite(valueText);

    // Drag affordance hint
    const hintTxt = this.add.text(GAME_W / 2, sliderY + 30, '↔ kaydırıcıyı sürükle', {
      font: 'italic 12px system-ui', color: HEX.TEXT_HINT
    }).setOrigin(0.5);
    this.trackSprite(hintTxt);

    knob.on('drag', (pointer, dragX) => {
      const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
      knob.x = clampedX;
      value = Math.round(((clampedX - minX) / trackW) * 100);
      valueText.setText(`Değer: ${value}`);
      if (value >= 100) {
        this.nextTerm();
      }
    });

    // Direnme: her 200ms'de -2
    this.termInterval = this.time.addEvent({
      delay: 200, loop: true,
      callback: () => {
        if (value > 0 && value < 100) {
          value = Math.max(0, value - 2);
          knob.x = minX + (value / 100) * trackW;
          valueText.setText(`Değer: ${value}`);
        }
      }
    });
  }

  // 7. KAÇAN BUTON
  setupTerm7() {
    createDialog(this, {
      title: 'ŞARTNAME — Madde 7/12',
      body: 'Madde 7: Kullanıcı, butonun "kayganlığını" kabul eder.\n\nButonu yakala.',
      h: 260
    }).forEach(d => this.trackSprite(d));

    const btn = makeButton(this, GAME_W / 2, GAME_H / 2 + 110, 180, 42, 'ONAYLIYORUM', () => this.nextTerm());
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);
    this.escapeBtn = btn;
  }

  updateTerm7() {
    if (!this.escapeBtn) return;
    const ptr = this.input.activePointer;
    const dx = ptr.x - this.escapeBtn.bg.x;
    const dy = ptr.y - this.escapeBtn.bg.y;
    if (Math.sqrt(dx * dx + dy * dy) < 90) {
      const nx = Phaser.Math.Between(120, GAME_W - 120);
      const ny = Phaser.Math.Between(GAME_H / 2 - 30, GAME_H - 80);
      this.escapeBtn.setPosition(nx, ny);
    }
  }

  // 8. DRAG-DROP
  setupTerm8() {
    createDialog(this, {
      title: 'ŞARTNAME — Madde 8/12',
      body: 'Madde 8: "ONAYLA" kutusunu yeşil hedefe sürükleyin.\nKırmızı engele dokunmadan.',
      h: 240
    }).forEach(d => this.trackSprite(d));

    // Layout: dialog daha yukarda, kutular dialog ALTINDA aşağı bandda
    const lane = GAME_H - 110;

    // Yeşil hedef (sağ alt)
    const target = this.add.rectangle(GAME_W - 130, lane, 100, 70, COLORS.ACCENT_OK, 0.5)
      .setStrokeStyle(2, COLORS.ACCENT_OK);
    const targetLabel = this.add.text(GAME_W - 130, lane, 'HEDEF', {
      font: 'bold 12px system-ui', color: '#fff'
    }).setOrigin(0.5);
    this.trackSprite(target); this.trackSprite(targetLabel);

    // Kırmızı engel (ortada, dikey hareket — drag bandında)
    const blocker = this.add.rectangle(GAME_W / 2, lane, 70, 70, COLORS.SPIKE)
      .setStrokeStyle(2, 0xFFFFFF, 0.4);
    this.trackSprite(blocker);
    const blockerTween = this.tweens.add({
      targets: blocker,
      y: lane - 50,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });
    this.trackSprite(blockerTween);

    // Sürüklenebilir kutu (sol alt)
    const drag = this.add.rectangle(150, lane, 110, 56, COLORS.BTN_HOVER)
      .setStrokeStyle(2, 0xFFFFFF);
    const dragText = this.add.text(150, lane, 'ONAYLA', {
      font: 'bold 13px system-ui', color: '#fff'
    }).setOrigin(0.5);
    drag.setInteractive({ draggable: true, useHandCursor: true });
    this.input.setDraggable(drag);
    this.trackSprite(drag); this.trackSprite(dragText);

    drag.on('drag', (pointer, dragX, dragY) => {
      drag.x = dragX; drag.y = dragY;
      dragText.x = dragX; dragText.y = dragY;
      // Engel çarpışma
      if (Phaser.Geom.Intersects.RectangleToRectangle(drag.getBounds(), blocker.getBounds())) {
        this.flashError('Engele çarptın.');
        this.time.delayedCall(300, () => this.loadTerm(7));
      }
      // Hedef
      else if (Phaser.Geom.Intersects.RectangleToRectangle(drag.getBounds(), target.getBounds())) {
        this.nextTerm();
      }
    });
  }

  // ============ TIER 3: HARD (9-12) ============

  // 9. 47 SAYFA
  setupTerm9() {
    this.currentPage = 1;
    this.targetPage = 47;

    createDialog(this, {
      title: 'ŞARTNAME — Madde 9/12',
      body: 'Madde 9: Tüm sayfaları okuyarak sona ulaşın.\n(İpucu: → tuşunu basılı tut.)',
      h: 280
    }).forEach(d => this.trackSprite(d));

    this.pageText = this.add.text(GAME_W / 2, GAME_H / 2 + 30, '', {
      font: 'bold 28px system-ui', color: HEX.TEXT
    }).setOrigin(0.5);
    this.trackSprite(this.pageText);
    this.pageText.setText(`Sayfa ${this.currentPage} / ${this.targetPage}`);

    const advance = (n) => {
      this.currentPage = Math.min(this.targetPage, this.currentPage + n);
      this.pageText.setText(`Sayfa ${this.currentPage} / ${this.targetPage}`);
      SFX.paper();
      if (this.currentPage >= this.targetPage) this.nextTerm();
    };

    const btn = makeButton(this, GAME_W / 2, GAME_H / 2 + 95, 180, 40, 'DEVAM ET', () => advance(1));
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);

    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.skipFrameCounter = 0;
    this._term9advance = advance;
  }

  updateTerm9() {
    if (!this.rightKey || !this._term9advance) return;
    if (this.rightKey.isDown) {
      this.skipFrameCounter++;
      if (this.skipFrameCounter >= 3) {
        this.skipFrameCounter = 0;
        this._term9advance(1);
      }
    }
  }

  // 10. HIZLI TIKLA
  setupTerm10() {
    this.attemptCount = 0;
    this.visibleDuration = 800;
    this.term10Active = true;

    createDialog(this, {
      title: 'ŞARTNAME — Madde 10/12',
      body: 'Madde 10: Buton göründüğü anda tıklayın.\nGörünmeden kaybolur.',
      h: 240
    }).forEach(d => this.trackSprite(d));

    const btn = makeButton(this, GAME_W / 2, GAME_H / 2 + 100, 180, 42, 'ONAYLIYORUM', () => {
      if (btn.bg.visible) {
        this.term10Active = false;
        this.nextTerm();
      }
    });
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);
    this.term10Btn = btn;

    btn.bg.setVisible(false); btn.txt.setVisible(false);
    this.term10Cycle();
  }

  term10Cycle() {
    if (!this.term10Active || this.currentTerm !== 9 || !this.term10Btn) return;
    this.term10Btn.bg.setVisible(true);
    this.term10Btn.txt.setVisible(true);
    this.termTimer = this.time.delayedCall(this.visibleDuration, () => {
      if (!this.term10Active || this.currentTerm !== 9 || !this.term10Btn) return;
      this.term10Btn.bg.setVisible(false);
      this.term10Btn.txt.setVisible(false);
      this.termTimer = this.time.delayedCall(500, () => {
        if (!this.term10Active || this.currentTerm !== 9) return;
        this.attemptCount++;
        if (this.attemptCount === 3) {
          this.visibleDuration = 1500;
          const hint = this.add.text(GAME_W / 2, GAME_H / 2 + 150, '(Belki çok yavaşsın. Süre uzatıldı.)', {
            font: 'italic 12px system-ui', color: HEX.TEXT_HINT
          }).setOrigin(0.5);
          this.trackSprite(hint);
        }
        this.term10Cycle();
      });
    });
  }

  // 11. EMİN MİSİN ZİNCİRİ
  setupTerm11() {
    this.confirmStep = 0;
    this.confirmMessages = [
      'Şartların tamamını onaylıyor musunuz?',
      'Emin misiniz?',
      'Kesinlikle emin misiniz?',
      'Pişman olmayacaksınız değil mi?',
      'Son şans. Cidden mi?'
    ];
    this.renderConfirmStep();
  }

  renderConfirmStep() {
    this.termSprites.forEach(s => { try { if (s && s.destroy) s.destroy(); } catch (_) {} });
    this.termSprites = [];

    if (this.confirmStep >= this.confirmMessages.length) { this.nextTerm(); return; }

    createDialog(this, {
      title: `ŞARTNAME — Madde 11/12 (Onay ${this.confirmStep + 1}/5)`,
      body: this.confirmMessages[this.confirmStep],
      h: 240
    }).forEach(d => this.trackSprite(d));

    // Son adımda butonlar yer değiştirir
    const isFinalSwap = this.confirmStep === 4;
    const yesX = isFinalSwap ? GAME_W / 2 + 80 : GAME_W / 2 - 80;
    const noX = isFinalSwap ? GAME_W / 2 - 80 : GAME_W / 2 + 80;

    const yesBtn = makeButton(this, yesX, GAME_H / 2 + 80, 130, 40, 'EVET', () => {
      this.confirmStep++;
      this.renderConfirmStep();
    });
    this.trackSprite(yesBtn.bg); this.trackSprite(yesBtn.txt);

    const noBtn = makeButton(this, noX, GAME_H / 2 + 80, 130, 40, 'HAYIR', () => {
      this.flashError('Geri dönüş yok. Sıfırlandı.');
      this.confirmStep = 0;
      this.time.delayedCall(400, () => this.renderConfirmStep());
    });
    this.trackSprite(noBtn.bg); this.trackSprite(noBtn.txt);
  }

  // 12. REVERSE MOUSE
  setupTerm12() {
    createDialog(this, {
      title: 'ŞARTNAME — Madde 12/12',
      body: 'Madde 12 (son): Cursor X ekseni TERSİNE çalışıyor.\n\nButona ulaşmak için ters yönde hareket et.',
      h: 280
    }).forEach(d => this.trackSprite(d));

    // Sahte cursor — başlangıçta ekran dışında, mouse'la senkron olunca görünsün
    const fakeCursor = this.add.circle(-100, -100, 7, 0x000000)
      .setStrokeStyle(2, 0xffffff).setDepth(900);
    this.trackSprite(fakeCursor);

    this.input.setDefaultCursor('none');

    // Buton sağ tarafta
    const btn = makeButton(this, GAME_W - 150, GAME_H / 2 + 100, 170, 40, 'ONAYLIYORUM', () => this.nextTerm());
    btn.bg.disableInteractive(); // varsayılan interaktiviteyi kapat — sahte cursor üzerinden tetikleyeceğiz
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);

    this._term12Btn = btn;
    this._term12Cursor = fakeCursor;
  }

  updateTerm12() {
    if (!this._term12Cursor || !this._term12Btn) return;
    const ptr = this.input.activePointer;
    // X ekseni ters: ekranın orta noktasına göre yansıt
    const flippedX = GAME_W - ptr.x;
    this._term12Cursor.x = flippedX;
    this._term12Cursor.y = ptr.y;

    // Sahte cursor butonun üzerindeyse ve tıklandıysa onayla
    if (ptr.isDown) {
      const b = this._term12Btn.bg.getBounds();
      if (flippedX >= b.x && flippedX <= b.x + b.width && ptr.y >= b.y && ptr.y <= b.y + b.height) {
        this._term12Btn = null;
        this._term12Cursor = null;
        this.nextTerm();
      }
    }
  }

  update() {
    if (this.currentTerm === 6) this.updateTerm7();        // term 7 = index 6
    else if (this.currentTerm === 8) this.updateTerm9();   // term 9 = index 8
    else if (this.currentTerm === 11) this.updateTerm12(); // term 12 = index 11
  }
}

// =========================================================
// SCENE: ACTION (side-scroller)
// =========================================================

class ActionScene extends Phaser.Scene {
  constructor() { super('Action'); }

  init(data) {
    this.lives = (data && data.lives !== undefined) ? data.lives : STARTING_LIVES;
  }

  create() {
    // Background
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, COLORS.ACTION_BG);
    // Decorative stars
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, GAME_W);
      const y = Phaser.Math.Between(0, GAME_H - 100);
      this.add.circle(x, y, Phaser.Math.FloatBetween(0.5, 1.5), 0xffffff, Phaser.Math.FloatBetween(0.2, 0.8));
    }

    this.cameras.main.fadeIn(300, 0, 0, 0);

    // Player sprite
    let g = this.add.graphics();
    g.fillStyle(COLORS.PLAYER, 1);
    g.fillRoundedRect(0, 0, 28, 36, 4);
    g.fillStyle(0x000000, 1);
    g.fillCircle(20, 12, 2); // göz
    g.generateTexture('player', 28, 36);
    g.destroy();

    // Spike
    g = this.add.graphics();
    g.fillStyle(COLORS.SPIKE, 1);
    g.fillTriangle(0, 30, 30, 30, 15, 0);
    g.generateTexture('spike', 30, 30);
    g.destroy();

    // Flag
    g = this.add.graphics();
    g.fillStyle(0x6b6b6b, 1);
    g.fillRect(0, 0, 4, 60);
    g.fillStyle(COLORS.FLAG, 1);
    g.fillTriangle(4, 5, 30, 15, 4, 25);
    g.generateTexture('flag', 30, 60);
    g.destroy();

    // Ground
    this.platforms = this.physics.add.staticGroup();
    const groundY = GAME_H - 40;
    g = this.add.graphics();
    g.fillStyle(COLORS.PLATFORM, 1);
    g.fillRect(0, 0, 100, 20);
    g.generateTexture('platBlock', 100, 20);
    g.destroy();

    // Floor
    for (let x = 50; x < GAME_W * 2; x += 100) {
      // 2 boşluk bırak (zıplama gerek)
      if (x === 550 || x === 1250) continue;
      this.platforms.create(x, groundY, 'platBlock');
    }
    // Ek platformlar
    this.platforms.create(700, groundY - 100, 'platBlock');
    this.platforms.create(1100, groundY - 130, 'platBlock');
    this.platforms.create(1500, groundY - 80, 'platBlock');

    // Player
    this.player = this.physics.add.sprite(80, groundY - 100, 'player');
    this.player.setCollideWorldBounds(false);
    this.player.setBounce(0.05);
    this.physics.add.collider(this.player, this.platforms);

    // Spikes
    this.spikes = this.physics.add.staticGroup();
    [350, 500, 850, 1300, 1650].forEach(sx => {
      const spike = this.spikes.create(sx, groundY - 15, 'spike');
      spike.body.setSize(24, 22).setOffset(3, 8);
    });
    this.physics.add.overlap(this.player, this.spikes, () => this.die(), null, this);

    // Flag (end)
    this.flag = this.physics.add.staticSprite(1850, groundY - 30, 'flag');
    this.physics.add.overlap(this.player, this.flag, () => this.win(), null, this);

    // World bounds
    this.physics.world.setBounds(0, 0, 2000, GAME_H);
    this.cameras.main.setBounds(0, 0, 2000, GAME_H);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // HUD
    this.livesText = this.add.text(20, 16, '', {
      font: 'bold 22px system-ui', color: '#fff', stroke: '#000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(100);
    this.updateHUD();

    this.add.text(GAME_W - 20, 16, 'AKSİYON FAZI', {
      font: 'bold 16px system-ui', color: '#FFE66D'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // ESC pause (DOM)
    this._escListener = (e) => {
      if (e.key === 'Escape' && !this.scene.isPaused()) {
        this.scene.pause();
        this.scene.launch('Pause', { from: 'Action' });
      }
    };
    window.addEventListener('keydown', this._escListener);

    this.events.once('shutdown', () => {
      if (this._escListener) {
        window.removeEventListener('keydown', this._escListener);
        this._escListener = null;
      }
    });

    // Falling check
    this.spawnX = 80;
    this.spawnY = groundY - 100;

    this.gameOver = false;
  }

  updateHUD() {
    this.livesText.setText('CAN: ' + '♥'.repeat(this.lives) + '♡'.repeat(STARTING_LIVES - this.lives));
  }

  die() {
    if (this.gameOver) return;
    SFX.death();
    this.lives--;
    this.updateHUD();
    if (this.lives <= 0) {
      this.gameOver = true;
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('GameOver', { won: false }));
      return;
    }
    // Respawn
    this.player.setPosition(this.spawnX, this.spawnY);
    this.player.setVelocity(0, 0);
    this.cameras.main.shake(200, 0.01);
  }

  win() {
    if (this.gameOver) return;
    this.gameOver = true;
    SFX.win();
    this.cameras.main.fadeOut(500, 255, 230, 100);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('GameOver', { won: true }));
  }

  update() {
    if (this.gameOver) return;
    const onGround = this.player.body.touching.down || this.player.body.blocked.down;

    let vx = 0;
    if (this.cursors.left.isDown) vx -= 220;
    if (this.cursors.right.isDown) vx += 220;
    this.player.setVelocityX(vx);

    if ((this.cursors.up.isDown || this.spaceKey.isDown) && onGround) {
      this.player.setVelocityY(-460);
      SFX.jump();
    }

    // Düşme kontrolü
    if (this.player.y > GAME_H + 50) this.die();
  }
}

// =========================================================
// SCENE: PAUSE
// =========================================================

class PauseScene extends Phaser.Scene {
  constructor() { super('Pause'); }
  init(data) { this.from = (data && data.from) || 'Terms'; }

  create() {
    const w = this.scale.width, h = this.scale.height;
    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7).setInteractive();
    this.add.text(w / 2, h / 2 - 30, 'DURAKLATILDI', {
      font: 'bold 36px system-ui', color: '#FFFFFF'
    }).setOrigin(0.5);
    this.add.text(w / 2, h / 2 + 20, '[ESC] Devam   ·   [R] Yeniden Başla', {
      font: '18px system-ui', color: '#aaaaaa'
    }).setOrigin(0.5);

    this._escListener = (e) => {
      if (e.key === 'Escape') {
        window.removeEventListener('keydown', this._escListener);
        this.scene.stop();
        this.scene.resume(this.from);
      } else if (e.key === 'r' || e.key === 'R') {
        window.removeEventListener('keydown', this._escListener);
        this.scene.stop(this.from);
        this.scene.stop();
        this.scene.start('Boot');
      }
    };
    window.addEventListener('keydown', this._escListener);

    this.events.once('shutdown', () => {
      if (this._escListener) {
        window.removeEventListener('keydown', this._escListener);
        this._escListener = null;
      }
    });
  }
}

// =========================================================
// SCENE: GAME OVER
// =========================================================

class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }
  init(data) { this.won = !!(data && data.won); }

  create() {
    makeDesktopBackground(this);
    this.cameras.main.fadeIn(300, 0, 0, 0);

    const w = this.scale.width, h = this.scale.height;
    this.add.text(w / 2, h / 2 - 60, this.won ? 'TEBRİKLER — GEÇTİN' : 'OYUN BİTTİ', {
      font: 'bold 48px system-ui',
      color: this.won ? '#FFE66D' : '#FF6B6B',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(w / 2, h / 2 + 10, this.won
      ? '12 madde + aksiyon fazı tamamlandı.\nSen gerçek bir kullanıcısın.'
      : 'Tüm canlarını kaybettin.\nAma şartnameyi geçmiştin, takdir.', {
      font: '20px system-ui', color: '#ECF0F1', align: 'center'
    }).setOrigin(0.5);

    const restart = this.add.text(w / 2, h / 2 + 110, '[R] Tekrar Başla', {
      font: 'bold 22px system-ui', color: '#4ECDC4'
    }).setOrigin(0.5);
    this.tweens.add({ targets: restart, alpha: 0.4, duration: 800, yoyo: true, repeat: -1 });

    this._handler = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        window.removeEventListener('keydown', this._handler);
        this.scene.start('Boot');
      }
    };
    window.addEventListener('keydown', this._handler);

    this.events.once('shutdown', () => {
      if (this._handler) {
        window.removeEventListener('keydown', this._handler);
        this._handler = null;
      }
    });
  }
}

// =========================================================
// CONFIG
// =========================================================

const config = {
  type: Phaser.AUTO,
  width: GAME_W,
  height: GAME_H,
  parent: 'game',
  backgroundColor: '#0F1622',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 1100 }, debug: false }
  },
  scene: [BootScene, TermsScene, ActionScene, PauseScene, GameOverScene]
};

// ZORUNLU: window.__game expose — qa-functional puppeteer testleri için
window.__game = new Phaser.Game(config);
