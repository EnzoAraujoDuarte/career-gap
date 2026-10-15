const puppeteer = require('puppeteer');
const BASE = 'http://localhost:3000';
const DIR = 'figuras';
const PERFIL = 'fixture-self-taught-frontend';

/** Mesmo estado do fixture, para as telas que leem do navegador. */
const RASCUNHO = {
  trackId: 'first-web-role',
  emphasisId: 'frontend',
  levels: {
    'programming-fundamentals': 'L2', 'html-semantics': 'L2', 'css-layout': 'L2',
    'javascript-essentials': 'L2', 'dom-and-browser': 'L2', 'problem-decomposition': 'L1',
    'reading-documentation': 'L1', 'version-control-git': 'L1', 'command-line-basics': 'L1',
  },
};

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });

  async function capturar(url, arquivo, { width, height }, semear = false) {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
    if (semear) {
      await page.goto(BASE, { waitUntil: 'domcontentloaded' });
      await page.evaluate((d) => localStorage.setItem('career-gap:profile:v1', JSON.stringify(d)), RASCUNHO);
    }
    await page.goto(BASE + url, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: `${DIR}/${arquivo}` });
    await page.close();
    console.log(`  ${arquivo}  ${width}x${height}`);
  }

  await capturar('/', 'fig1-mapa-aberto.png', { width: 700, height: 660 });
  await capturar('/avaliacao', 'fig2-avaliacao.png', { width: 700, height: 440 });
  await capturar('/perfil', 'fig3-perfil.png', { width: 700, height: 560 }, true);
  await capturar(`/mapa?perfil=${PERFIL}`, 'fig4-roadmap.png', { width: 700, height: 760 });

  await browser.close();
})();
