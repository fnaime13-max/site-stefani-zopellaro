const { chromium } = require('C:/Users/fnaim/.claude/skills/playwright-skill/node_modules/playwright');
const path = require('path');
const url = require('url').pathToFileURL(path.resolve(__dirname, '../index.html')).href;
(async () => {
  const b = await chromium.launch();
  for (const [w,h] of [[1440,900],[390,844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(url);
    for (const t of [1400, 2600]) { await p.waitForTimeout(t === 1400 ? 1400 : 1200); await p.screenshot({ path: path.join(__dirname, `ld-${w}-${t}.png`), clip: { x: w/2-220, y: h/2-260, width: 440, height: 440 } }); }
  }
  await b.close();
})();
