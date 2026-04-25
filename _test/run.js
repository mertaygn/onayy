const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ROOT = path.resolve(__dirname, '..');

async function launchPage(slug) {
  const fileUrl = 'file://' + path.join(ROOT, 'games', slug, 'index.html');
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

  await page.goto(fileUrl, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2500));

  return { browser, page, errors, consoleLogs };
}

async function getScenes(page) {
  return await page.evaluate(() => {
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

async function getActiveSceneState(page, sceneKey) {
  return await page.evaluate((key) => {
    const s = window.__game?.scene?.getScene(key);
    if (!s) return null;
    const out = {};
    ['currentTerm', 'isPaused', 'score', 'lives', 'timeLeft', 'currentPage', 'targetPage', 'confirmStep'].forEach(k => {
      if (s[k] !== undefined) out[k] = s[k];
    });
    if (s.player) out.player = { x: Math.round(s.player.x), y: Math.round(s.player.y) };
    if (s.stars && s.stars.children) out.starCount = s.stars.children.size;
    return out;
  }, sceneKey);
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
  await page.screenshot({ path: path.join(__dirname, `screenshot-${name}.png`), fullPage: false });
}

(async () => {
  const results = [];

  // ============ TEST 1: yildiz-toplama ============
  {
    const findings = [];
    const { browser, page, errors, consoleLogs } = await launchPage('yildiz-toplama');

    findings.push({ check: 'window.__game expose edildi', pass: await page.evaluate(() => !!window.__game) });

    let scenes = await getScenes(page);
    findings.push({ check: 'Scene listesi', pass: scenes && scenes.length === 3, detail: scenes });
    findings.push({ check: 'Title aktif', pass: scenes?.find(s => s.key === 'Title')?.active === true });

    // Canvas'a GERÇEK mouse click ile focus garantisi (headless flaky fix)
    const cb = await page.evaluate(() => {
      const c = document.querySelector('canvas');
      const r = c.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(cb.x, cb.y);
    await new Promise(r => setTimeout(r, 200));

    // Title → Main (Space) — wait until transition done
    await page.keyboard.press('Space');
    try {
      await page.waitForFunction(() => {
        const g = window.__game;
        if (!g?.scene) return false;
        const main = g.scene.getScene('Main');
        const title = g.scene.getScene('Title');
        return main?.scene?.isActive() === true && title?.scene?.isActive() === false;
      }, { timeout: 3000 });
    } catch (e) { /* timeout — test will fail naturally */ }
    scenes = await getScenes(page);
    findings.push({ check: 'Title→Main (Space)', pass: scenes?.find(s => s.key === 'Main')?.active === true });

    // 2.5 saniye bekle, yıldız spawn olmasını ve düşmesini izle
    await new Promise(r => setTimeout(r, 2500));
    let mainState = await getActiveSceneState(page, 'Main');
    findings.push({ check: 'Yıldızlar spawn oldu (2.5sn sonra)', pass: (mainState?.starCount ?? 0) > 0, detail: { starCount: mainState?.starCount } });
    await snap(page, 'yildiz-gameplay');

    // Player ArrowRight
    await page.keyboard.down('ArrowRight');
    await new Promise(r => setTimeout(r, 800));
    await page.keyboard.up('ArrowRight');
    mainState = await getActiveSceneState(page, 'Main');
    findings.push({ check: 'Player sağa hareket etti', pass: (mainState?.player?.x ?? 0) > 500, detail: mainState?.player });

    // ESC ile pause
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
    mainState = await getActiveSceneState(page, 'Main');
    findings.push({ check: 'ESC ile pause aktif (yıldız oyunu in-scene pause)', pass: mainState?.isPaused === true });

    // Time decay check
    const timeBeforeDecay = mainState.timeLeft;
    await new Promise(r => setTimeout(r, 1500));
    mainState = await getActiveSceneState(page, 'Main');
    findings.push({ check: 'Pause sırasında süre azalmıyor', pass: mainState?.timeLeft === timeBeforeDecay, detail: { before: timeBeforeDecay, after: mainState?.timeLeft } });

    await browser.close();
    results.push({ slug: 'yildiz-toplama', errors, consoleLogs, findings });
  }

  // ============ TEST 2: kabul-ediyorum ============
  {
    const findings = [];
    const { browser, page, errors, consoleLogs } = await launchPage('kabul-ediyorum');

    findings.push({ check: 'window.__game expose edildi', pass: await page.evaluate(() => !!window.__game) });

    let scenes = await getScenes(page);
    findings.push({ check: 'Scene listesi (Boot, Main, Pause, End)', pass: scenes?.length === 4, detail: scenes?.map(s => s.key) });
    findings.push({ check: 'Boot aktif', pass: scenes?.find(s => s.key === 'Boot')?.active === true });

    await snap(page, 'kabul-boot');

    // BAŞLA tıkla (1024x640 game, BAŞLA: GAME_W/2-90, GAME_H/2+100)
    await clickGameCoord(page, 1024, 640, 1024 / 2 - 90, 640 / 2 + 100);
    await new Promise(r => setTimeout(r, 800));

    scenes = await getScenes(page);
    findings.push({ check: 'Boot→Main (BAŞLA tıklama)', pass: scenes?.find(s => s.key === 'Main')?.active === true, detail: scenes?.filter(s => s.active).map(s => s.key) });

    let st = await getActiveSceneState(page, 'Main');
    findings.push({ check: 'Term 1 yüklendi', pass: st?.currentTerm === 0, detail: st });
    await snap(page, 'kabul-term1');

    // Term 1 ONAYLIYORUM tıkla (GAME_W/2, GAME_H/2+80)
    await clickGameCoord(page, 1024, 640, 1024 / 2, 640 / 2 + 80);
    await new Promise(r => setTimeout(r, 1000));
    st = await getActiveSceneState(page, 'Main');
    findings.push({ check: 'Term 1 → Term 2 (klasik buton)', pass: st?.currentTerm === 1, detail: { currentTerm: st?.currentTerm } });
    await snap(page, 'kabul-term2');

    // ESC ile pause
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 500));
    scenes = await getScenes(page);
    findings.push({ check: 'ESC → Pause scene aktif', pass: scenes?.find(s => s.key === 'Pause')?.active === true });
    findings.push({ check: 'Main scene paused', pass: scenes?.find(s => s.key === 'Main')?.paused === true });

    // ESC tekrar (resume)
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 500));
    scenes = await getScenes(page);
    findings.push({ check: 'ESC tekrar → Pause kapandı, Main resumed', pass: scenes?.find(s => s.key === 'Main')?.active === true && !scenes?.find(s => s.key === 'Pause')?.active });

    await browser.close();
    results.push({ slug: 'kabul-ediyorum', errors, consoleLogs, findings });
  }

  // Print
  console.log('\n=========================================');
  console.log('FİNAL TEST RAPORU');
  console.log('=========================================\n');
  for (const r of results) {
    console.log(`▼ ${r.slug}`);
    console.log(`  Page errors: ${r.errors.length}`);
    r.errors.forEach(e => console.log(`    [${e.kind}] ${e.msg}`));
    console.log(`  Console errors/warnings: ${r.consoleLogs.length}`);
    r.consoleLogs.forEach(l => console.log(`    [${l.type}] ${l.text}`));
    let pass = 0, fail = 0;
    r.findings.forEach(f => {
      const status = f.pass === true ? '✓' : f.pass === false ? '✗' : '·';
      if (f.pass === true) pass++;
      else if (f.pass === false) fail++;
      console.log(`    ${status} ${f.check}${f.detail ? ' — ' + JSON.stringify(f.detail).slice(0, 240) : ''}`);
    });
    console.log(`  → ${pass} passed, ${fail} failed\n`);
  }

  fs.writeFileSync(path.join(__dirname, 'report.json'), JSON.stringify(results, null, 2));
})();
