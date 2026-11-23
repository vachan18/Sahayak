const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const PORT = 5174;
const DIST_DIR = path.join(__dirname, '..', 'dist');
const OUTPUT_DIR = process.argv[2] 
  ? path.resolve(process.argv[2]) 
  : path.join(__dirname, '..', 'documentation', 'phase-6.1', 'screenshots', 'before');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, reqPath === '/' ? 'index.html' : reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const viewports = [
  { name: 'mobile-360', width: 360, height: 640, isMobile: true, hasTouch: true },
  { name: 'mobile-390', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'tablet-768', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'tablet-1024', width: 1024, height: 768, isMobile: false, hasTouch: true },
  { name: 'desktop-1440', width: 1440, height: 900, isMobile: false, hasTouch: false },
  { name: 'desktop-1728', width: 1728, height: 1000, isMobile: false, hasTouch: false },
];

const routes = [
  { path: '/home', label: 'home' },
  { path: '/schemes', label: 'schemes' },
  { path: '/schemes/pm-kisan', label: 'scheme-detail' },
  { path: '/eligibility', label: 'eligibility' },
  { path: '/eligibility/results', label: 'results' },
  { path: '/documents', label: 'documents' },
  { path: '/guidance/pm-kisan', label: 'guidance' },
  { path: '/csc-slip/KA-KISAN-2026-84920', label: 'csc-slip' },
  { path: '/tracker', label: 'tracker' },
  { path: '/tracker/app-kisan-84920', label: 'tracker-detail' },
  { path: '/profile', label: 'profile' },
  { path: '/notifications', label: 'notifications' },
  { path: '/language', label: 'language' },
  { path: '/welcome', label: 'welcome' },
];

server.listen(PORT, async () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    const overflowReport = [];

    for (const vp of viewports) {
      console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        isMobile: vp.isMobile,
        hasTouch: vp.hasTouch,
        deviceScaleFactor: 1
      });

      for (const route of routes) {
        const url = `http://localhost:${PORT}${route.path}`;
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {});
        await new Promise(r => setTimeout(r, 200));

        // Detect horizontal overflow
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;
          const hasOverflow = scrollWidth > clientWidth;

          let overflowingElements = [];
          if (hasOverflow) {
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > clientWidth + 1) {
                overflowingElements.push({
                  tag: el.tagName.toLowerCase(),
                  className: (el.className || '').toString().slice(0, 100),
                  right: rect.right,
                  clientWidth: clientWidth
                });
              }
            }
          }

          return {
            hasOverflow,
            scrollWidth,
            clientWidth,
            overflowAmount: Math.max(0, scrollWidth - clientWidth),
            overflowingElements: overflowingElements.slice(0, 5)
          };
        });

        const outFileName = `${vp.name}-${route.label}.png`;
        const outFilePath = path.join(OUTPUT_DIR, outFileName);
        await page.screenshot({ path: outFilePath, fullPage: false });

        if (overflow.hasOverflow) {
          console.warn(`  ⚠️ OVERFLOW [${vp.name} ${route.path}]: scrollWidth=${overflow.scrollWidth} > clientWidth=${overflow.clientWidth} (+${overflow.overflowAmount}px)`);
          overflowReport.push({
            viewport: vp.name,
            route: route.path,
            ...overflow
          });
        } else {
          console.log(`  ✓ ${outFileName} [No overflow: ${overflow.clientWidth}px]`);
        }
      }
    }

    const reportPath = path.join(OUTPUT_DIR, 'overflow-audit.json');
    fs.writeFileSync(reportPath, JSON.stringify(overflowReport, null, 2));
    console.log(`\nOverflow audit saved to ${reportPath} (${overflowReport.length} issues found)`);

  } catch (err) {
    console.error('Capture error:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
    process.exit(0);
  }
});
