// QA: abertura, hero após a entrada, página inteira, overflow horizontal e erros de console
const { chromium } = require('C:/Users/fnaim/.claude/skills/playwright-skill/node_modules/playwright');
const path = require('path');
const url = require('url').pathToFileURL(path.resolve(__dirname, '../index.html')).href;
const sizes = (process.argv[2] || '1440x900,1024x768,768x1024,390x844,360x740').split(',').map(s => s.split('x').map(Number));
(async () => {
  const b = await chromium.launch();
  for (const [w, h] of sizes) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    await p.goto(url);
    if (w === 1440) { await p.waitForTimeout(1300); await p.screenshot({ path: path.join(__dirname, `loader-${w}.png`) }); }
    await p.waitForTimeout(4500);
    if (w >= 1024) { await p.mouse.move(w * 0.3, h * 0.55); await p.waitForTimeout(80); await p.mouse.move(w * 0.42, h * 0.6, { steps: 8 }); await p.waitForTimeout(250); }
    await p.screenshot({ path: path.join(__dirname, `hero-${w}.png`) });
    for (let y = 0; y < 14000; y += 400) { await p.mouse.wheel(0, 400); await p.waitForTimeout(90); }
    await p.waitForTimeout(1500);
    const info = await p.evaluate(() => {
      const over = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.preloader,.hero,.nav'); }).slice(0, 6).map(e => e.className || e.tagName);
      const imgs = [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src);
      return { sw: document.documentElement.scrollWidth, iw: innerWidth, over, broken: imgs, h1: document.querySelectorAll('h1').length };
    });
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(__dirname, `full-${w}.png`), fullPage: true });
    console.log(w, JSON.stringify(info), errs.join(' | ') || 'sem erros');
    await p.close();
  }
  await b.close();
})();
