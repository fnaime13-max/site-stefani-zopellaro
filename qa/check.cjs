const { chromium } = require('C:/Users/fnaim/.claude/skills/playwright-skill/node_modules/playwright');
const path = require('path');
const url = require('url').pathToFileURL(path.resolve(__dirname, '../index.html')).href;
(async () => {
  const b = await chromium.launch();
  for (const [w,h] of [[1440,900],[390,844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs=[]; p.on('pageerror', e => errs.push(e.message));
    await p.goto(url); await p.waitForTimeout(4600);
    await p.screenshot({ path: path.join(__dirname, `c-hero-${w}.png`) });
    await p.evaluate(() => document.querySelector('#consulta').scrollIntoView()); await p.waitForTimeout(400);
    await p.mouse.wheel(0, 200); await p.waitForTimeout(600);
    await p.screenshot({ path: path.join(__dirname, `c-journey-${w}.png`) });
    // botão valor social -> marca rádio
    await p.evaluate(() => document.querySelector('#valor-social').scrollIntoView());
    await p.click('[data-tipo="social"]'); await p.waitForTimeout(1200);
    const r = await p.evaluate(() => document.querySelector('input[name=tipo]:checked').value);
    if (w===390){ await p.click('#burger'); await p.waitForTimeout(800); await p.screenshot({ path: path.join(__dirname, `c-menu-${w}.png`) }); }
    console.log(w, 'tipo:', r, errs.join('|')||'ok');
  }
  await b.close();
})();
