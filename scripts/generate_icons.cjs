/**
 * Renders the Sahayak mark to PWA icons (any + maskable safe-zone) using a headless Chromium/Edge.
 * Usage: CHROME_PATH=/path/to/chrome node scripts/generate_icons.cjs
 */
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME =
  process.env.CHROME_PATH ||
  (process.platform === 'darwin' ? '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge' : '/usr/bin/google-chrome');

// White tile; the emblem sits inside the central 72% maskable safe zone.
const fs = require('fs');
const mark = fs.readFileSync(path.join(__dirname, '..', 'public', 'logo.svg'), 'utf8').replace('<svg ', '<svg width="72%" height="72%" ');
const svg = (size) => `<div style="width:${size}px;height:${size}px;background:#fff;display:grid;place-items:center">${mark}</div>`;

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const page = await browser.newPage();
  for (const size of [192, 512]) {
    await page.setViewport({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0">${svg(size)}</body></html>`);
    const out = path.join(__dirname, '..', 'public', `icon-${size}.png`);
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: size, height: size } });
    console.log('wrote', out);
  }
  await browser.close();
})();
