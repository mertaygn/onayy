// =========================================================
// QA browser-test template — puppeteer-core
// Her oyun için kopyalanır ve senaryo-spesifik test'lerle doldurulur.
// Çalıştırma: cd _test && node run-<slug>.js
// =========================================================

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SLUG = '{{SLUG}}';  // Producer doldurur
const ROOT = path.resolve(__dirname, '..');
const FILE_URL = 'file://' + path.join(ROOT, 'games', SLUG, 'index.html');

async function launch() {
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
  page.on('error', e => errors.push({ kind: 'error', msg: e.message }));
  page.on('console', m => {
    const t = m.type();
    if (t === 'error' || t === 'warning') consoleLogs.push({ type: t, text: m.text() });
  });

  await page.goto(FILE_URL, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2500));
  return { browser, page, errors, consoleLogs };
}

// ------ Helpers ------

async function getScenes(page) {
  return page.evaluate(() => {
    const g = window.__game;
    if (!g || !g.scene) return null;
    return g.scene.scenes.map(s => ({
      key: s.scene.key,
      active: s.scene.isActive(),
      visible: s.scene.isVisible(),
      paused: s.scene.isPaused()
    }));
  });
}

async function sceneState(page, sceneKey, fields) {
  return page.evaluate((key, ks) => {
    const s = window.__game?.scene?.getScene(key);
    if (!s) return null;
    const out = {};
    ks.forEach(k => { if (s[k] !== undefined) out[k] = s[k]; });
    return out;
  }, sceneKey, fields);
}

async function clickGameCoord(page, gameW, gameH, gx, gy) {
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
  return p;
}

// ------ Senaryolar (her oyun için doldurulur) ------

async function runSmoke() {
  const findings = [];
  const { browser, page, errors, consoleLogs } = await launch();

  // 1. Bootstrap kontrolü
  findings.push({
    check: 'window.__game expose edildi',
    pass: await page.evaluate(() => !!window.__game)
  });

  const scenes = await getScenes(page);
  findings.push({
    check: 'Scene listesi alındı',
    pass: scenes && scenes.length > 0,
    detail: scenes
  });

  await snap(page, 'initial');

  // ⚠️ FOCUS GUARANTEE — keyboard input'tan ÖNCE zorunlu
  // Headless Chrome'da canvas focus'u için gerçek mouse click şart.
  // page.evaluate(() => canvas.click()) yetmez — DOM-level focus yapmaz.
  const _canvasBox = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    const r = c.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  await page.mouse.click(_canvasBox.x, _canvasBox.y);
  await new Promise(r => setTimeout(r, 200));

  // 2. {{SCENARIO_PLACEHOLDER}}
  // Producer/qa-lead burayı doldurur:
  // - Title→Main geçiş test'i (Space veya tıklama)
  // - Player input test'i (key press + state validation)
  // - Pause toggle test'i (ESC)
  // - Win/Lose path test'i

  await browser.close();
  return { slug: SLUG, errors, consoleLogs, findings };
}

(async () => {
  const result = await runSmoke();
  console.log('\n========== TEST: ' + result.slug + ' ==========');
  console.log(`Page errors: ${result.errors.length}`);
  result.errors.forEach(e => console.log(`  [${e.kind}] ${e.msg}`));
  console.log(`Console errors/warnings: ${result.consoleLogs.length}`);
  result.consoleLogs.forEach(l => console.log(`  [${l.type}] ${l.text}`));
  let pass = 0, fail = 0;
  result.findings.forEach(f => {
    const status = f.pass === true ? '✓' : f.pass === false ? '✗' : '·';
    if (f.pass === true) pass++;
    else if (f.pass === false) fail++;
    console.log(`  ${status} ${f.check}${f.detail ? ' — ' + JSON.stringify(f.detail).slice(0, 200) : ''}`);
  });
  console.log(`→ ${pass} passed, ${fail} failed`);

  fs.writeFileSync(path.join(__dirname, `report-${SLUG}.json`), JSON.stringify(result, null, 2));
  process.exit(fail > 0 || result.errors.length > 0 ? 1 : 0);
})();
