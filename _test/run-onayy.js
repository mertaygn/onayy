const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SLUG = 'onayy';
const ROOT = path.resolve(__dirname, '..');
const FILE_URL = 'file://' + path.join(ROOT, 'games', SLUG, 'index.html');

async function getScenes(page) {
  return page.evaluate(() => {
    const g = window.__game;
    if (!g || !g.scene) return null;
    return g.scene.scenes.map(s => ({
      key: s.scene.key,
      active: s.scene.isActive(),
      paused: s.scene.isPaused()
    }));
  });
}

async function clickGameCoord(page, gx, gy) {
  const box = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    const r = c.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, gw: c.width, gh: c.height };
  });
  const sx = box.x + (gx / box.gw) * box.w;
  const sy = box.y + (gy / box.gh) * box.h;
  await page.mouse.click(sx, sy);
}

async function snap(page, name) {
  const p = path.join(__dirname, `screenshot-${SLUG}-${name}.png`);
  await page.screenshot({ path: p, fullPage: false });
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--allow-file-access-from-files']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const errors = [];
  const consoleLogs = [];
  page.on('pageerror', e => errors.push({ kind: 'pageerror', msg: e.message }));
  page.on('console', m => {
    const t = m.type();
    if (t === 'error' || t === 'warning') consoleLogs.push({ type: t, text: m.text() });
  });

  await page.goto(FILE_URL, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2500));

  const findings = [];

  // 1. Bootstrap
  findings.push({ check: 'window.__game expose', pass: await page.evaluate(() => !!window.__game) });
  let scenes = await getScenes(page);
  findings.push({ check: '5 scene (Boot/Terms/Action/Pause/GameOver)', pass: scenes?.length === 5, detail: scenes?.map(s => s.key) });
  findings.push({ check: 'Boot aktif', pass: scenes?.find(s => s.key === 'Boot')?.active === true });

  await snap(page, 'boot');

  // 2. Boot → Terms (BAŞLA tıkla, GAME_W/2 - 90, GAME_H/2 + 100 = 422, 420)
  await clickGameCoord(page, 1024 / 2 - 90, 640 / 2 + 100);
  await new Promise(r => setTimeout(r, 1000));
  scenes = await getScenes(page);
  findings.push({ check: 'Boot → Terms (BAŞLA)', pass: scenes?.find(s => s.key === 'Terms')?.active === true });

  await snap(page, 'term1');

  // 3. Term 1 yüklendi mi
  let st = await page.evaluate(() => {
    const t = window.__game.scene.getScene('Terms');
    return t ? { currentTerm: t.currentTerm } : null;
  });
  findings.push({ check: 'Term 1 yüklü (currentTerm=0)', pass: st?.currentTerm === 0, detail: st });

  // 4. Term 1 ONAYLIYORUM tıkla (GAME_W/2, GAME_H/2 + 80 = 512, 400)
  await clickGameCoord(page, 1024 / 2, 640 / 2 + 80);
  await new Promise(r => setTimeout(r, 1000));
  st = await page.evaluate(() => {
    const t = window.__game.scene.getScene('Terms');
    return t ? { currentTerm: t.currentTerm } : null;
  });
  findings.push({ check: 'Term 1 → Term 2', pass: st?.currentTerm === 1, detail: st });

  await snap(page, 'term2');

  // 5. ESC ile pause
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));
  scenes = await getScenes(page);
  findings.push({ check: 'ESC → Pause aktif', pass: scenes?.find(s => s.key === 'Pause')?.active === true });
  findings.push({ check: 'Terms paused', pass: scenes?.find(s => s.key === 'Terms')?.paused === true });

  // 6. ESC tekrar resume
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));
  scenes = await getScenes(page);
  findings.push({ check: 'ESC tekrar → Terms resume', pass: scenes?.find(s => s.key === 'Terms')?.active === true && !scenes?.find(s => s.key === 'Pause')?.active });

  // 7. Action phase'i kanıtlamak için: tüm 12 madde'yi atla (programatik)
  await page.evaluate(() => {
    const g = window.__game;
    g.scene.stop('Terms');
    g.scene.start('Action', { lives: 5 });
  });
  await new Promise(r => setTimeout(r, 1500));
  scenes = await getScenes(page);
  findings.push({ check: 'Action scene başlatılabilir', pass: scenes?.find(s => s.key === 'Action')?.active === true });

  // 8. Action: player ve platform var mı
  const actionState = await page.evaluate(() => {
    const a = window.__game.scene.getScene('Action');
    return {
      hasPlayer: !!a?.player,
      playerX: a?.player?.x,
      playerY: a?.player?.y,
      lives: a?.lives,
      platformCount: a?.platforms?.children?.size,
      spikeCount: a?.spikes?.children?.size,
      hasFlag: !!a?.flag
    };
  });
  findings.push({ check: 'Action — player + platform + spike + flag oluştu', pass: actionState.hasPlayer && actionState.platformCount > 0 && actionState.spikeCount > 0 && actionState.hasFlag, detail: actionState });

  await snap(page, 'action');

  // 9. Action: ArrowRight + Space → player hareket
  await page.keyboard.down('ArrowRight');
  await new Promise(r => setTimeout(r, 500));
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 800));
  await page.keyboard.up('ArrowRight');
  const moved = await page.evaluate(() => {
    const a = window.__game.scene.getScene('Action');
    return { x: Math.round(a.player.x), y: Math.round(a.player.y) };
  });
  findings.push({ check: 'Action — player sağa hareket etti', pass: moved.x > 100, detail: moved });

  await snap(page, 'action-running');

  await browser.close();

  // Print
  console.log('\n========== TEST: onayy ==========');
  console.log(`Page errors: ${errors.length}`);
  errors.forEach(e => console.log(`  [${e.kind}] ${e.msg}`));
  console.log(`Console errors/warnings: ${consoleLogs.length}`);
  consoleLogs.forEach(l => console.log(`  [${l.type}] ${l.text}`));
  let pass = 0, fail = 0;
  findings.forEach(f => {
    const status = f.pass === true ? '✓' : f.pass === false ? '✗' : '·';
    if (f.pass === true) pass++;
    else if (f.pass === false) fail++;
    console.log(`  ${status} ${f.check}${f.detail ? ' — ' + JSON.stringify(f.detail).slice(0, 200) : ''}`);
  });
  console.log(`→ ${pass} passed, ${fail} failed`);
  fs.writeFileSync(path.join(__dirname, 'report-onayy.json'), JSON.stringify({ errors, consoleLogs, findings }, null, 2));
  process.exit(fail > 0 || errors.length > 0 ? 1 : 0);
})();
