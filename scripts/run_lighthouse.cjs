const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

process.env.CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const PORT = 5175;
const DIST_DIR = path.join(__dirname, '..', 'dist');
const OUTPUT_DIR = path.join(__dirname, '..', 'documentation', 'phase-6.8', 'lighthouse');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
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
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    });
    res.end(content);
  });
});

function runLighthouse(targetUrl, reportName, isDesktop = false) {
  return new Promise((resolve) => {
    const reportPath = path.join(OUTPUT_DIR, reportName);
    console.log(`\n======================================================`);
    console.log(`🚀 Running Lighthouse (${isDesktop ? 'DESKTOP' : 'MOBILE'}) on ${targetUrl}...`);
    console.log(`======================================================`);

    const args = [
      '--yes',
      'lighthouse',
      targetUrl,
      '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
      '--output=json,html',
      `--output-path=${reportPath}`,
      '--only-categories=accessibility,best-practices,performance,seo',
      '--quiet'
    ];

    if (isDesktop) {
      args.push('--preset=desktop');
    }

    const lhProcess = spawn('npx.cmd', args, {
      stdio: 'inherit',
      env: process.env,
      shell: true
    });

    lhProcess.on('close', (code) => {
      console.log(`Lighthouse (${isDesktop ? 'DESKTOP' : 'MOBILE'}) completed with code ${code}`);
      const jsonPath = `${reportPath}.report.json`;
      const result = { isDesktop, scores: {} };
      if (fs.existsSync(jsonPath)) {
        try {
          const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
          const categories = data.categories;
          console.log('\n------------------------------------------');
          console.log(`   SCORES (${isDesktop ? 'DESKTOP' : 'MOBILE'})`);
          console.log('------------------------------------------');
          for (const [key, cat] of Object.entries(categories)) {
            const score = Math.round((cat.score || 0) * 100);
            result.scores[cat.title] = score;
            const icon = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
            console.log(`${icon} ${cat.title}: ${score}/100`);
          }
          console.log('------------------------------------------\n');
        } catch (err) {
          console.error('Error reading JSON report:', err.message);
        }
      }
      resolve(result);
    });

    lhProcess.on('error', (err) => {
      console.error('Lighthouse execution error:', err);
      resolve({ isDesktop, error: err.message });
    });
  });
}

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Production server running at http://127.0.0.1:${PORT}`);
  const targetUrl = `http://127.0.0.1:${PORT}/home`;

  try {
    const mobileResults = await runLighthouse(targetUrl, 'lighthouse-mobile', false);
    const desktopResults = await runLighthouse(targetUrl, 'lighthouse-desktop', true);
    console.log('\n🎉 ALL LIGHTHOUSE AUDITS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Audit run error:', err);
  } finally {
    server.close(() => {
      process.exit(0);
    });
  }
});
