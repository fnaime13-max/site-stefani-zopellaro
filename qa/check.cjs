const { chromium } = require('C:/Users/fnaim/.claude/skills/playwright-skill/node_modules/playwright');
const path = require('path');
const url = require('url').pathToFileURL(path.resolve(__dirname, '../index.html')).href;
(async () => {
  const b = await chromium.launch();
  for (const [w,h] of [[1440,900],[390,844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs=[]; p.on('pageerror', e => errs.push(e.message));
    await p.goto(url); await p.waitForTimeout(4600);
    const wa = await p.evaluate(() => [...document.querySelectorAll('[data-wa]')].map(a => a.href.startsWith('https://wa.me/') && a.target === '_blank'));
    const fab = await p.evaluate(() => { const r = document.querySelector('.wa-fab').getBoundingClientRect(); return r.bottom <= innerHeight && r.top > 0; });
    const [popup] = await Promise.all([p.waitForEvent('popup', { timeout: 3000 }).catch(() => null), p.click('.wa-fab')]);
    console.log(w, 'links WA:', wa.length, 'ok:', wa.every(Boolean), 'fab visível:', fab, 'abre:', popup ? popup.url().slice(0, 60) : 'não', errs.join('|') || 'sem erros');
    if (popup) await popup.close();
    await p.screenshot({ path: path.join(__dirname, `c-hero-${w}.png`) });
    await p.evaluate(() => document.querySelector('#valor-social').scrollIntoView()); await p.waitForTimeout(900);
    await p.screenshot({ path: path.join(__dirname, `c-social-${w}.png`) });
  }
  await b.close();
})();
